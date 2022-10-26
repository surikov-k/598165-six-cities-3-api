import { Expose } from 'class-transformer';

export class OfferListResponse {

  @Expose()
  public city!: string;

  @Expose()
  public previewImage!: string;

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
  public commentCount!: number;

  @Expose()
  public housingType!: string[];

  @Expose()
  public price!: number;
}
