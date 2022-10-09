import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import typegoose, { getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City } from '../../types/city.enum.js';
import { Housing } from '../../types/housing.enum.js';
import { Location } from '../../types/location.type.js';
import {
  ADULTS_MAX,
  ADULTS_MIN,
  BEDROOMS_MAX,
  BEDROOMS_MIN,
  IMAGES_NUMBER,
  OFFER_TITLE_MAX,
  OFFER_TITLE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  RATING_MAX,
  RATING_MIN
} from '../../common/offer-generator/offer-generator.js';
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
    validate: [
      (val: string[]) => val.length === IMAGES_NUMBER,
      `An offer has to have ${IMAGES_NUMBER} images`
    ]
  })
  public images!: mongoose.Types.Array<string>;

  @prop({required: true})
  public published!: Date;

  @prop({
    trim: true,
    required: true,
    minlength: [
      OFFER_TITLE_MIN,
      `Min length for an offer title is ${OFFER_TITLE_MIN} character`
    ],
    maxlength: [
      OFFER_TITLE_MAX,
      `Max length for an offer title is ${OFFER_TITLE_MAX} character`
    ],
  })
  public title!: string;

  @prop({
    ref: UserEntity,
    required: true,
    default: [],
  })
  public favorites!: Ref<UserEntity>[];

  @prop({default: 0})
  public commentCount!: number;

  @prop({required: true})
  public isPremium!: boolean;

  @prop({
    required: true,
    min: [RATING_MIN, `Minimal rating is ${RATING_MIN}`],
    max: [RATING_MAX, `Maximum rating is ${RATING_MAX}`],
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public housingType!: Housing;

  @prop({
    required: true,
    min: [BEDROOMS_MIN, `Minimal rating is ${BEDROOMS_MIN}`],
    max: [BEDROOMS_MAX, `Maximum rating is ${BEDROOMS_MAX}`],
  })
  public bedrooms!: number;

  @prop({
    required: true,
    min: [ADULTS_MIN, `Minimal rating is ${ADULTS_MIN}`],
    max: [ADULTS_MAX, `Maximum rating is ${ADULTS_MAX}`],
  })
  public maxAdults!: number;

  @prop({
    required: true,
    min: [PRICE_MIN, `Minimal rating is ${PRICE_MIN}`],
    max: [PRICE_MAX, `Maximum rating is ${PRICE_MAX}`],
  })
  public price!: number;

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

  @prop()
  public description!: string;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
  })
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
