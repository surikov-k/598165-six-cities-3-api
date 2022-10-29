import { NewOffer, Signup } from '../types/types';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { CreateUserDto } from '../dto/create-user.dto';

export const adaptOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  city: offer.city.name,
  previewImage: offer.previewImage,
  title: offer.title,
  isPremium: offer.isPremium,
  housingType: offer.type,
  bedrooms: offer.bedrooms,
  maxAdults: offer.maxAdults,
  price: offer.price,
  goods: offer.goods,
  description: offer.description,
  location: {
    latitude: offer.location.latitude,
    longitude: offer.location.longitude,
  },
  rating: 0,
  published: new Date().toISOString()
});

export const adaptUserToServer = (user: Signup): CreateUserDto => ({
  name: user.name,
  email: user.email,
  password: user.password,
  avatarUrl: ' ',
  isPro: user.isPro === 'on'
});
