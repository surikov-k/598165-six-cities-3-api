import { readFileSync } from 'fs';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';
import { City } from '../../types/city.enum.js';
import { Person } from '../../types/person.type.js';
import { Location } from '../../types/location.type.js';
import { Housing } from '../../types/housing.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {
  }

  private CSVtoArray(string: string): string[] {
    return string
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  private parsePerson(person: string): Person {
    const [name, email, password, isPro, avatarUrl] = this.CSVtoArray(person);
    return {
      name,
      email,
      password,
      isPro: this.parseBoolean(isPro),
      avatarUrl
    };
  }

  private parseBoolean(value: string): boolean {
    return value === 'true';
  }

  private parseLocation(location: string): Location {
    const [latitude, longitude] = this.CSVtoArray(location);
    return {
      latitude: parseFloat(latitude),
      longitude:parseFloat(longitude)
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        title,
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
        location]):  Offer => ({
        title,
        description,
        published: new Date(postedAt),
        city: City[city  as City],
        previewImage,
        images: this.CSVtoArray(images),
        isPremium: this.parseBoolean(isPremium),
        isFavorite: this.parseBoolean(isFavorite),
        rating: parseInt(rating, 10),
        housingType: Housing[housingType as Housing] ,
        bedrooms: parseInt(bedrooms, 10),
        maxAdults: parseInt(maxAdults, 10),
        price: parseInt(price, 10),
        goods: this.CSVtoArray(goods),
        host: this.parsePerson(host),
        comments: parseInt(comments, 10),
        location: this.parseLocation(location)
      }));
  }
}
