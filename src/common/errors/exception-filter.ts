import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import HttpError from './http-error.js';
import ValidationError from './validation-error.js';
import { Component } from '../../types/component.types.js';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { createErrorObject } from '../../utils/common.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface
  ) {
    this.logger.info('Registering ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.details}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode)
      .json(createErrorObject(
        ServiceError.CommonError,
        error.message
      ));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }

  private handleValidationError(error: ValidationError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    } else if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }
    this.handleOtherError(error, req, res, next);
  }
}
