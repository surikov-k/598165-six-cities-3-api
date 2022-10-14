import dayjs from 'dayjs';

import { MockData } from '../../types/mock-data.type.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { getRandom, getRandomItem, getRandomItems, getTrueOrFalse } from '../../utils/random.js';
import { Location } from '../../types/location.type.js';
import { City } from '../../types/city.enum.js';
import { User } from '../../types/user.type.js';
import {
  ADULTS_MAX,
  ADULTS_MIN,
  BEDROOMS_MAX,
  BEDROOMS_MIN,
  cityLocations,
  FIRST_WEEK_DAY, GOODS_MAX, GOODS_MIN,
  IMAGES_NUMBER,
  IMAGES_URL,
  LAST_WEEK_DAY, PRICE_MAX, PRICE_MIN, RATING_MAX,
  RATING_MIN, RATING_PRECISION
} from '../../constants.js';

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
