import { Expose, Type } from 'class-transformer';
import { User } from '../../../types/user.type.js';
import { Location } from '../../../types/location.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferResponse {

  @Expose()
  public id!: string;

  @Expose()
  public city!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public published!: string;

  @Expose()
  public title!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public housingType!: string[];

  @Expose()
  public bedrooms!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: string[];

  @Expose()
  @Type(() => UserResponse)
  public host!: User;

  @Expose()
  public description!: string;

  @Expose()
  public location!: Location;

  @Expose()
  public commentCount!: number;

}
