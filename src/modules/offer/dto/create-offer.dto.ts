import { City } from '../../../types/city.enum.js';
import { Housing } from '../../../types/housing.enum.js';
import { Location } from '../../../types/location.type.js';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
import { Goods } from '../../../types/goods.enum.js';
import {
  ADULTS_MAX,
  ADULTS_MIN,
  BEDROOMS_MAX,
  BEDROOMS_MIN,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  OFFER_TITLE_MAX,
  OFFER_TITLE_MIN,
  PRICE_MAX,
  PRICE_MIN,
  RATING_MAX,
  RATING_MIN
} from '../../../constants.js';

export default class CreateOfferDto {
  @IsEnum(City, {message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf'})
  public city!: City;

  @IsString()
  public previewImage!: string;

  @IsArray()
  @IsString({each: true,})
  public images!: string[];

  @IsDateString()
  public published!: Date;

  @MinLength(
    OFFER_TITLE_MIN,
    {message: `Minimum title length must be ${OFFER_TITLE_MIN}`})
  @MaxLength(
    OFFER_TITLE_MAX,
    {message: `Maximum title length must be ${OFFER_TITLE_MAX}`})
  public title!: string;

  @IsArray()
  @IsMongoId({
    each: true,
    message: 'Favorites field must be an array of valid ids'
  }
  )
  public favorites!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsNumber({}, {message: 'Rating must be a number'})
  @Min(RATING_MIN, {message: `Minimum rating is ${RATING_MIN}`})
  @Max(RATING_MAX, {message: `Maximum rating is ${RATING_MAX}`})
  public rating!: number;

  @IsEnum(Housing, {message: 'Housing type must be apartment, house, room, hotel'})
  public housingType!: Housing;

  @IsInt({message: 'Bedrooms number must be an integer'})
  @Min(BEDROOMS_MIN, {message: `Minimum bedrooms number is ${BEDROOMS_MIN}`})
  @Max(BEDROOMS_MAX, {message: `Maximum bedrooms number is ${BEDROOMS_MAX}`})
  public bedrooms!: number;

  @IsInt({message: 'Guests number must be an integer'})
  @Min(ADULTS_MIN, {message: `Minimum guests number is ${ADULTS_MIN}`})
  @Max(ADULTS_MAX, {message: `Maximum guests number is ${ADULTS_MAX}`})
  public maxAdults!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(PRICE_MIN, {message: `Minimum price is ${PRICE_MIN}`})
  @Max(PRICE_MAX, {message: `Maximum price is ${PRICE_MAX}`})
  public price!: number;

  @IsArray()
  public goods!: Goods[];

  @MinLength(
    DESCRIPTION_MIN,
    {message: `Minimum description length must be ${DESCRIPTION_MIN}`}
  )
  @MaxLength(DESCRIPTION_MAX,
    {message: `Maximum description length must be ${DESCRIPTION_MAX}`})
  public description!: string;

  @IsObject()
  public location!: Location;

  public host!: string;
}
