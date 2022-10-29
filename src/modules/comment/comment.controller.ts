import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { inject, injectable } from 'inversify';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface)
      logger: LoggerInterface,
    @inject(Component.ConfigInterface)
    configService: ConfigInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Registering the routes for CommentController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService, 'Offer', 'offerId'
        )
      ]
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
  }

  public async index (
    {params}: Request,
    res: Response,
  ): Promise<void> {
    const {offerId} = params;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async create(
    req: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {

    const {body} = req;
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `The offer with id ${body.offerId} not found`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({...body, userId: req.user.id});
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentResponse, comment));

  }
}
