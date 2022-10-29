export class CreateOfferDto {
  public city!: string;
  public previewImage!: string;
  public title!: string;
  public isPremium!: boolean;
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
  published!: string;
  rating!: number;
}
