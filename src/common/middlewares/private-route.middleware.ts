import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import HttpError from '../errors/http-error.js';
import { MiddlewareInterface } from '../../types/middleware.interface.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }
    return next();
  }
}
