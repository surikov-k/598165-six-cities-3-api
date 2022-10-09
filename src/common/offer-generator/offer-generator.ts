import dayjs from 'dayjs';

import { MockData } from '../../types/mock-data.type.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { getRandom, getRandomItem, getRandomItems, getTrueOrFalse } from '../../utils/random.js';
import { Location } from '../../types/location.type.js';
import { City } from '../../types/city.enum.js';
import { User } from '../../types/user.type.js';

export const OFFER_TITLE_MIN = 10;
export const OFFER_TITLE_MAX = 100;

export const IMAGES_URL = 'https://10.react.pages.academy/static/hotel/';
export const IMAGES_NUMBER = 6;

export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const RATING_PRECISION = 1;

export const BEDROOMS_MIN = 1;
export const BEDROOMS_MAX = 8;

export const ADULTS_MIN = 1;
export const ADULTS_MAX = 10;

export const PRICE_MIN = 100;
export const PRICE_MAX = 10000;

export const GOODS_MIN = 1;
export const GOODS_MAX = 5;

export const FIRST_WEEK_DAY = 1;
export const LAST_WEEK_DAY = 7;

const cityLocations = {
  'Paris': {
    latitude: 48.85661,
    longitude: 2.351499
  },
  'Cologne': {
    latitude: 50.938361,
    longitude: 6.959974
  },
  'Brussels': {
    latitude: 50.846557,
    longitude: 4.351697
  },
  'Amsterdam': {
    latitude: 52.370216,
    longitude: 4.895168
  },
  'Hamburg': {
    latitude: 53.550341,
    longitude: 10.000654
  },
  'Dusseldorf': {
    latitude: 51.225402,
    longitude: 6.776314
  },
};

const getLocation = (city: City): Location => {
  const LOCATION_DISPERSE = 0.0005;
  const LOCATION_PRECISION = 5;

  const {latitude, longitude} = cityLocations[city];

  return {
    latitude: getRandom(
      latitude - LOCATION_DISPERSE,
      latitude + LOCATION_DISPERSE,
      LOCATION_PRECISION
    ),
    longitude: getRandom(
      longitude - LOCATION_DISPERSE,
      longitude + LOCATION_DISPERSE,
      LOCATION_PRECISION
    ),
  };
};

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const city = getRandomItem<City>(this.mockData.city as City[]);
    const previewImage = `${IMAGES_URL}${getRandom(0, 20)}.jpg`;

    const images = Array
      .from(
        {length: IMAGES_NUMBER},
        () => `${IMAGES_URL}${getRandom(0, 20)}.jpg`)
      .join(', ');

    const published = dayjs()
      .subtract(getRandom(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const title = getRandomItem<string>(this.mockData.title);
    const favorites: User[] = [];
    const isPremium = getTrueOrFalse().toString();
    const rating = getRandom(RATING_MIN, RATING_MAX, RATING_PRECISION).toString();
    const housingType = getRandomItem(this.mockData.type);
    const bedrooms = getRandom(BEDROOMS_MIN, BEDROOMS_MAX).toString();
    const maxAdults = getRandom(ADULTS_MIN, ADULTS_MAX).toString();
    const price = getRandom(PRICE_MIN, PRICE_MAX).toString();

    const goods = getRandomItems(
      this.mockData.goods,
      getRandom(GOODS_MIN, GOODS_MAX)
    )
      .join(', ');

    const host = Object
      .values(getRandomItem(this.mockData.host))
      .join(', ');

    const description = getRandomItems(
      this.mockData.description,
      getRandom(1, 4)
    )
      .join(', ');

    const location = Object
      .values(getLocation(city))
      .join(', ');

    return [
      city as string,
      previewImage,
      images,
      published,
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
      location,
    ].join('\t');
  }
}
