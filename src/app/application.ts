import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../common/logger/logger.interface';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import { Favorite } from '../types/favorite.enum.js';

@injectable()
export default class Application {

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.OfferServiceInterface) private offerService: OfferServiceInterface
  ) {}

  public async init() {
    this.logger.info('Application is initializing');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    await this.databaseClient.connect(uri);

    const offerId = '6342c15cfc93218563d1dc37';
    const userId = '63380a6ebd17707c321d527a';

    await this.offerService
      .setFavorite(offerId, userId, Favorite.Add);

    const offers = await this.offerService.findFavorites(userId);
    console.log(offers);
  }
}

