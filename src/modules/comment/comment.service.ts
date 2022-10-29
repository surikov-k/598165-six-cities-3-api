import { CommentServiceInterface } from './comment-service.interface.js';
import { inject, injectable } from 'inversify';
import { CommentEntity } from './comment.entity.js';
import { Component } from '../../types/component.types.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateCommentDto from './dto/create-comment.dto.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>[]> {
    const comment = await this.commentModel.create(dto);
    comment.populate('userId');
    return [comment];
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();
    return result.deletedCount;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }
}
