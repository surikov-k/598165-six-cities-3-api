import { OfferListDto } from '../dto/offer-list.dto';
import { Comment, Offer, Type } from '../types/types';
import OfferDto from '../dto/offer-dto';
import { CityLocation } from '../const';
import { CommentDto } from '../dto/comment.dto';

export const adaptOffersToClient = (offers: OfferListDto[]): Offer[] => offers
  .map((offer) => ({
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: {
      name: offer.city,
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    location: {
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
    },
    previewImage: offer.previewImage,
    type: offer.housingType as unknown as Type,
    bedrooms: 0,
    description: '',
    goods: [''],
    host: {
      name: '',
      avatarUrl: '',
      isPro: false,
      email: '',
    },
    images: [''],
    maxAdults: 0,
  }));

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city,
    location: CityLocation[offer.city]
  },
  location: offer.location,
  previewImage: offer.previewImage,
  type: offer.housingType as Type,
  bedrooms: offer.bedrooms,
  description: offer.description,
  goods: offer.goods,
  host: offer.host,
  images: offer.images,
  maxAdults: offer.maxAdults,
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map((dto) => ({
    id: dto.id,
    comment: dto.text,
    date: dto.postDate,
    rating: dto.rating,
    user: dto.user,
  }));

