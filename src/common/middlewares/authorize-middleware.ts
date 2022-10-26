import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { AuthorizeOwnerInterface } from '../../types/authorize-owner.interface.js';
import HttpError from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class AuthorizeMiddleware implements MiddlewareInterface {
  constructor(
    private service: AuthorizeOwnerInterface,
    private param: string
  ) {}

  public async execute({params, user}: Request, _res: Response, next: NextFunction): Promise<void> {
    const objectId = params[this.param];

    if (!await this.service.isOwner(user?.id, objectId)) {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthorizeMiddleware'
      ));
    }
    return next();
  }
}
