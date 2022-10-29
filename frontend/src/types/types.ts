import { CITIES, Sorting, TYPES } from '../const';

export type CityName = typeof CITIES[number];
export type Type = typeof TYPES[number];
export type SortName = keyof typeof Sorting;

export type Location = {
  latitude: number;
  longitude: number;
};

export type City = {
  name: CityName;
  location: Location;
};

export type User = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
};

export type UserAuth = Pick<User, 'email'> & { password: string };
export type CommentAuth = Pick<Comment, 'comment' | 'rating'> &
  Pick<Offer, 'id'>;
export type FavoriteAuth = Pick<Offer, 'id'> & { status: 1 | 0 };
export type UserRegister = Omit<User, 'avatarUrl'> &
  Pick<UserAuth, 'password'> & { avatar?: File };

export type Comment = {
  id: string;
  comment: string;
  date: string;
  rating: number;
  user: User;
};

export type Signup = {
  name: string,
  email: string,
  avatar: string,
  password: string,
  isPro: string,
}


export type Offer = {
  id: string;
  price: number;
  rating: number;
  title: string;
  isPremium: boolean;
  isFavorite: boolean;
  city: City;
  location: Location;
  previewImage: string;
  type: Type;
  bedrooms: number;
  description: string;
  goods: string[];
  host: User;
  images: string[];
  maxAdults: number;
};

export type NewOffer = {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  isPremium: boolean;
  type: Type;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  location: Location;
};

export type ErrorType = unknown;

export type ValidationErrorField = {
  property: string;
  value: string;
  messages: string[];
}
