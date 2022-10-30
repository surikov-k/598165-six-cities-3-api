import { DocumentType } from '@typegoose/typegoose';

import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferServiceInterface extends DocumentExistsInterface{
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(currentUserId?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string, currentUserId?: string): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string, currentUserId?: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(location: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  setFavorite(offerId: string, userId: string, status: number): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, value: number): Promise<DocumentType<OfferEntity> |null>;
  exists(documentId: string): Promise<boolean>;
  isOwner(currentUserId: string, offerId: string): Promise<boolean>;
}
