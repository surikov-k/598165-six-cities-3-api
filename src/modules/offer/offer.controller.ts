import { inject } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import { OfferServiceInterface } from './offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import OfferResponse from './response/offer.response.js';
import { fillDTO } from '../../utils/common.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import HttpError from '../../common/errors/http-error.js';

export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

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
      path: '/',
      method: HttpMethod.Post,
      handler: this.create
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.get
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Put,
      handler: this.update
    });

    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const offersResponse = fillDTO(OfferResponse, offers);
    this.send(res, StatusCodes.OK, offersResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferResponse, result)
    );
  }

  public async get(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    console.log(req.params);
    const offer = await this.offerService.findById(id);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.send(res, StatusCodes.OK, offerResponse);
  }

  public async update(
    req: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const {body} = req;
    const {id} = req.params;

    const result = await this.offerService.updateById(id, body);
    const resultResponse = fillDTO(OfferResponse, result);

    this.send(res, StatusCodes.OK, resultResponse);
  }

  public async delete(
    req: Request,
    res: Response
  ): Promise<void> {
    const {id} = req.params;
    await this.offerService.deleteById(id);
    this.send(res, StatusCodes.OK, 'Deleted');
  }


  public async premium(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium();
    const offersResponse = fillDTO(OfferResponse, offers);
    this.send(res, StatusCodes.OK, offersResponse);
  }

  public async favorites(_req: Request, _res: Response): Promise<void> {

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

}
