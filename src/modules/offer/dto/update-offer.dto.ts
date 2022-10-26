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
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';
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
} from '../offer.constants.js';

import { Goods } from '../../../types/goods.enum.js';

export default class UpdateOfferDto {
  @IsOptional()
  @IsEnum(City, {message: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf'})
  public city?: City;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({each: true,})
  public images?: string[];

  @IsOptional()
  @IsDateString()
  public published?: Date;

  @IsOptional()
  @MinLength(
    OFFER_TITLE_MIN,
    {message: `Minimum title length must be ${OFFER_TITLE_MIN}`})
  @MaxLength(
    OFFER_TITLE_MAX,
    {message: `Maximum title length must be ${OFFER_TITLE_MAX}`})
  public title?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({each: true,message: 'Favorites field must be an array of valid ids'}
  )
  public favorites?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(Housing, {message: 'Housing type must be apartment, house, room, hotel'})
  public housingType?: Housing;

  @IsOptional()
  @IsInt({message: 'Bedrooms number must be an integer'})
  @Min(BEDROOMS_MIN, {message: `Minimum bedrooms number is ${BEDROOMS_MIN}`})
  @Max(BEDROOMS_MAX, {message: `Maximum bedrooms number is ${BEDROOMS_MAX}`})
  public bedrooms?: number;

  @IsOptional()
  @IsInt({message: 'Guests number must be an integer'})
  @Min(ADULTS_MIN, {message: `Minimum guests number is ${ADULTS_MIN}`})
  @Max(ADULTS_MAX, {message: `Maximum guests number is ${ADULTS_MAX}`})
  public maxAdults?: number;

  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(PRICE_MIN, {message: `Minimum price is ${PRICE_MIN}`})
  @Max(PRICE_MAX, {message: `Maximum price is ${PRICE_MAX}`})
  public price?: number;

  @IsOptional()
  @IsArray()
  public goods?: Goods[];

  @IsOptional()
  @MinLength(
    DESCRIPTION_MIN,
    {message: `Minimum description length must be ${DESCRIPTION_MIN}`}
  )
  @MaxLength(DESCRIPTION_MAX,
    {message: `Maximum description length must be ${DESCRIPTION_MAX}`})
  public description?: string;

  @IsOptional()
  @IsObject()
  public location?: Location;
}
