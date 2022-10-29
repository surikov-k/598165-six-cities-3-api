import { IsMongoId, IsString, Length } from 'class-validator';
import { COMMENT_MAX, COMMENT_MIN } from '../comment.constants.js';

export default class CreateCommentDto {
  @IsString({message: 'Comment text should be a string type'})
  @Length(
    COMMENT_MIN, COMMENT_MAX,
    {message: `Min length is${COMMENT_MIN}, max length is ${COMMENT_MAX}`}
  )
  public text!: string;

  @IsMongoId({message: 'OfferId field must be a valid id'})
  public offerId!: string;

  public userId!: string;

  public rating!: number;
}
