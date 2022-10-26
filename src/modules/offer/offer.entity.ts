import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import typegoose, { getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.enum.js';
import { Housing } from '../../types/housing.enum.js';
import { Location } from '../../types/location.type.js';
import { UserEntity } from '../user/user.entity.js';
import mongoose from 'mongoose';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends Base {}

@modelOptions({
  schemaOptions: {
  collection: 'offers'
  }
  })
export class OfferEntity extends TimeStamps {

  @prop({
    type: () => String,
    enum: City,
    required: true
    })
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({
    required: true,
    type: String,
    })
  public images!: mongoose.Types.Array<string>;

  @prop({required: true})
  public published!: Date;

  @prop({
    trim: true,
    required: true
    })
  public title!: string;

  @prop({
    ref: UserEntity,
    required: true,
    default: [],
    })
  public favorites!: Ref<UserEntity>[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({default: 0})
  public ratingCount!: number;

  @prop({default: 0})
  public totalRating!: number;

  @prop({required: true})
  public rating!: number;

  @prop(
    {
    required: true,
    type: () => String,
    enum: Housing
    }
  )
  public housingType!: Housing;

  @prop({required: true})
  public bedrooms!: number;

  @prop({required: true})
  public maxAdults!: number;

  @prop({required: true})
  public price!: number;

  @prop({required: true, default: 0})
  public commentCount!: number;

  @prop({
    type: String,
    required: true
    })
  public goods!: string[];

  @prop({
    required: true,
    ref: UserEntity
    })
  public host!: Ref<UserEntity>;

  @prop({
    required: true,
    trim: true,
    })
  public description!: string;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
    })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
