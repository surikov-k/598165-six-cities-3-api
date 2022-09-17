import { Person } from '../types/person.type.js';
import { Location } from '../types/location.type.js';
import { Offer } from '../types/offer.type.js';
import { City } from '../types/city.enum.js';
import { Housing } from '../types/housing.enum.js';


export const createOffer = (row: string): Offer => {

  const parseCSV = (string: string): string[] => string
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  const parseBoolean = (value: string): boolean => value === 'true';

  const parsePerson = (person: string): Person => {
    const [name, email, password, isPro, avatarUrl] = parseCSV(person);
    return {
      name,
      email,
      password,
      isPro: parseBoolean(isPro),
      avatarUrl
    };
  };

  const parseLocation = (location: string): Location => {
    const [latitude, longitude] = parseCSV(location);
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };
  };

  const tokens = row.replace('\n', '').split('\t');

  const [title,
    description,
    postedAt,
    city,
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    housingType,
    bedrooms,
    maxAdults,
    price,
    goods,
    host,
    comments,
    location] = tokens;
  return {
    title,
    description,
    published: new Date(postedAt),
    city: City[city as City],
    previewImage,
    images: parseCSV(images),
    isPremium: parseBoolean(isPremium),
    isFavorite: parseBoolean(isFavorite),
    rating: parseInt(rating, 10),
    housingType: Housing[housingType as Housing],
    bedrooms: parseInt(bedrooms, 10),
    maxAdults: parseInt(maxAdults, 10),
    price: parseInt(price, 10),
    goods: parseCSV(goods),
    host: parsePerson(host),
    comments: parseInt(comments, 10),
    location: parseLocation(location)
  } as Offer;
};

export const getErrorMessage = (error: unknown):string => error instanceof Error ? error.message : '';
