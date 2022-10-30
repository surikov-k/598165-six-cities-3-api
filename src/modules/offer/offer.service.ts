import { OfferServiceInterface } from './offer-service.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_COUNT } from './offer.constants.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { SortType } from '../../types/sort-type.enum.js';
import { Favorite } from '../../types/favorite.enum.js';
import { UserEntity } from '../user/user.entity.js';
import mongoose from 'mongoose';


@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface)
    private readonly logger: LoggerInterface,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer was created ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, currentUserId?: string): Promise<DocumentType<OfferEntity> | null> {

    const [offer] = await this.offerModel
      .aggregate<DocumentType<OfferEntity>>([
        {$match: {_id: new mongoose.Types.ObjectId(offerId)}},
        {$set: {isFavorite: {$in: [new mongoose.Types.ObjectId(currentUserId), '$favorites']}}},
        {$addFields: {id: {$toString: '$_id'}}}
      ]).exec();
    await this.userModel.populate(offer, {path: 'host'});
    return offer;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(currentUserId?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count || DEFAULT_OFFER_COUNT;

    const offers = await this.offerModel
      .aggregate([
        {$sort: {'createdAt': SortType.Desc}},
        {$limit: limit},
        {$set: {isFavorite: {$in: [new mongoose.Types.ObjectId(currentUserId), '$favorites']}}},
        {$addFields: {id: {$toString: '$_id'}}}
      ])
      .exec();

    await this.userModel.populate(offers, {path: 'host'});
    return offers;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {

    return this.offerModel
      .aggregate([
        {$match: {$expr: {$in: [new mongoose.Types.ObjectId(userId), '$favorites']}}},
        {$set: {isFavorite: {$in: [new mongoose.Types.ObjectId(userId), '$favorites']}}},
        {$addFields: {id: {$toString: '$_id'}}}
      ]);


  }

  public async findPremium(location: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isPremium: true, city: location}, null, {limit: DEFAULT_PREMIUM_COUNT})
      .sort({'createdAt': SortType.Desc})
      .exec();
  }

  public async incCommentCount(offerId: string):
    Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        }
      }, {new: true}).exec();
  }

  public async updateRating(offerId: string, value: number):
    Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          ratingCount: 1,
          totalRating: value
        },
      }, {new: true}).exec();

    if (!offer) {
      return null;
    }
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        rating: (offer.totalRating / offer.ratingCount).toFixed(1)
      }, {new: true}).exec();
  }

  public async setFavorite(offerId: string, userId: string, status: Favorite): Promise<DocumentType<OfferEntity> | null> {

    if (status === Favorite.Add) {
      await this.offerModel
        .findByIdAndUpdate(offerId, {
          $push: {
            favorites: userId
          }
        }, {new: true})
        .populate(['host'])
        .exec();

      return this.findById(offerId, userId);
    }

    if (status === Favorite.Remove) {
      await this.offerModel
        .findByIdAndUpdate(offerId, {
          $pull: {
            favorites: userId
          }
        }, {new: true})
        .populate(['host'])
        .exec();

      return this.findById(offerId, userId);
    }
    return null;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto):
    Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['host'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }

  public async isOwner(currentUserId: string, offerId: string): Promise<boolean> {
    const offer = await this.findById(offerId);
    return offer?.host?.id === currentUserId;
  }
}
