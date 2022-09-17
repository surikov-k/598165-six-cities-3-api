import { City } from './city.enum.js';
import { Housing } from './housing.enum.js';
import { Person } from './person.type.js';
import { Location } from './location.type.js';

export type Offer = {
  city: City,
  previewImage: string,
  images: string[],
  published: Date,
  title: string,
  isFavorite: boolean,
  isPremium: boolean,
  rating: number,
  housingType: Housing,
  bedrooms: number,
  maxAdults:number,
  price: number,
  goods: string[],
  host: Person,
  description: string,
  comments: number,
  location: Location,
}
