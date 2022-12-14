import { City } from './city.enum.js';
import { Goods } from './goods.enum.js';
import { Housing } from './housing.enum.js';
import { Location } from './location.type.js';
import { User } from './user.type.js';

export type Offer = {
  city: City,
  previewImage: string,
  images: string[],
  published: Date,
  title: string,
  favorites: string[],
  isPremium: boolean,
  rating: number,
  housingType: Housing,
  bedrooms: number,
  maxAdults:number,
  price: number,
  goods: Goods[],
  host: User,
  description: string,
  location: Location,
}
