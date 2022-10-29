export default class OfferDto {
  public id!: string;
  public city!: string;
  public images!: string[];
  public previewImage!: string;
  public published!: string;
  public title!: string;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public housingType!: string;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public description!: string;
  public location!: {
    latitude: number;
    longitude: number;
  };
  public host!: {
    name: string;
    email: string;
    isPro: boolean;
    avatarUrl: string;
  };
}
