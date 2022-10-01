import { City } from '../../../types/city.enum.js';
import { Housing } from '../../../types/housing.enum.js';
import { Location } from '../../../types/location.type.js';

export default class CreateOfferDto {
  public city!: City;
  public previewImage!: string;
  public images!: string[];
  public published!: Date;
  public title!: string;
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public rating!: number;
  public housingType!: Housing;
  public bedrooms!: number;
  public maxAdults!: number;
  public price!: number;
  public goods!: string[];
  public description!: string;
  public location!: Location;
  public host!: string;
}
