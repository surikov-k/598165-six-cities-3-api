import { User } from '../types/user.type.js';
import { Location } from '../types/location.type.js';
import { Offer } from '../types/offer.type.js';
import { City } from '../types/city.enum.js';
import { Housing } from '../types/housing.enum.js';
import * as crypto from 'crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as jose from 'jose';

export const createOffer = (row: string): Offer => {

  const parseCSV = (string: string): string[] => string
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  const parseBoolean = (value: string): boolean => value === 'true';

  const parsePerson = (person: string): User => {
    const [name, email, isPro, avatarUrl] = parseCSV(person);
    return {
      name,
      email,
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

  const [city,
    previewImage,
    images,
    postedAt,
    title,
    favorites,
    isPremium,
    rating,
    housingType,
    bedrooms,
    maxAdults,
    price,
    goods,
    host,
    description,
    location] = tokens;

  return {
    title,
    description,
    published: new Date(postedAt),
    city: City[city as City],
    previewImage,
    images: parseCSV(images),
    favorites: parseCSV(favorites),
    isPremium: parseBoolean(isPremium),
    rating: parseInt(rating, 10),
    housingType: Housing[housingType as Housing],
    bedrooms: parseInt(bedrooms, 10),
    maxAdults: parseInt(maxAdults, 10),
    price: parseInt(price, 10),
    goods: parseCSV(goods),
    host: parsePerson(host),
    location: parseLocation(location)
  } as unknown as Offer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message
});

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

