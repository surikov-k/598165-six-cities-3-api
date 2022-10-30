import typegoose, { getModelForClass, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';

import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {modelOptions, prop} = typegoose;

export interface CommentEntity extends Base {}

@modelOptions({
  schemaOptions: {
  collection: 'comments'
  }
  })
export class CommentEntity extends TimeStamps {
  @prop({
    trim: true,
    required: true
    })
  public text!: string;

  @prop({
    ref: OfferEntity,
    required: true
    })
  public offerId!: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true
    })
  public userId!: Ref<UserEntity>;

  @prop()
  public rating!: number;
}

export const CommentModel = getModelForClass(CommentEntity);
