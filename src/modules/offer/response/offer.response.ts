import { Expose, Transform } from 'class-transformer';
import { User } from '../../../types/user.type.js';
import { Location } from '../../../types/location.type.js';

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
  @Transform(({obj}) => {
    const {name, email, isPro, avatarUrl, createdAt, updatedAt} = obj.host;
    return {name, email, isPro, avatarUrl, createdAt, updatedAt};
  })
  public host!: User;

  @Expose()
  public description!: string;

  @Expose()
  public location!: Location;

  @Expose()
  public createdAt!: string;

  @Expose()
  public updatedAt!: string;

}
