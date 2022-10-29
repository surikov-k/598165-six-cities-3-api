export class OfferListDto {
  public id!: string;
  public city!: string;
  public previewImage!: string;
  public published!: string;
  public title!: string;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public commentCount!: number;
  public housingType!: string[];
  public price!: number;
  public location!: {
    latitude: number;
    longitude: number
  };
}
