import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import * as core from 'express-serve-static-core';
import CreateOfferDto from './dto/create-offer.dto.js';
import OfferResponse from './response/offer.response.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { Component } from '../../types/component.types.js';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { OfferListResponse } from './response/offer-list.response.js';
import { AuthorizeMiddleware } from '../../common/middlewares/authorize-middleware.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import UploadImageResponse from './response/upload-image.response.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger
      .info('Registering the routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.premium
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.favorites
    });

    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.setFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
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
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService, 'Offer', 'offerId'
        )
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(
          this.offerService, 'Offer', 'offerId'
        ),
        new AuthorizeMiddleware(this.offerService, 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService, 'Offer', 'offerId'
        ),
        new AuthorizeMiddleware(this.offerService, 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(
          this.offerService, 'Offer', 'offerId'
        )
      ]
    });

    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
  }

  public async index({user}: Request, res: Response): Promise<void> {

    const offers = await this.offerService.find(user?.id);
    this.ok(res, fillDTO(OfferListResponse, offers));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const result = await this.offerService.create({...body, host: user.id});
    const offer = await this.offerService.findById(result.id);
    this.created(
      res,
      fillDTO(OfferResponse, offer)
    );
  }

  public async show(
    {params, user}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.findById(offerId, user.id);
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;

    const updateOffer = await this.offerService
      .updateById(offerId, body);
    this.ok(res, fillDTO(OfferResponse, updateOffer));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async premium(req: Request, res: Response): Promise<void> {
    const location = req.headers?.location as string;

    if (!location) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Location must be specified',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremium(location);
    this.ok(res, fillDTO(OfferListResponse, offers));
  }

  public async favorites({user}: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites(user.id);
    this.ok(res, fillDTO(OfferListResponse, offers));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService
      .findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async setFavorite(
    {params, user}: Request,
    res: Response): Promise<void> {
    const offerId = params.offerId;
    const status = parseInt(params.status, 10) ;
    if (status !== 1 && status !== 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid parameter',
        'OfferController'
      );
    }
    const offer = await this.offerService.setFavorite(offerId, user.id, status);
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async uploadImage(req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, {updateDto}));
  }
}
