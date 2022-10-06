import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;
export interface UserEntity extends Base {}

@modelOptions({schemaOptions: {collection: 'users'}})
export class UserEntity extends TimeStamps implements User {
  constructor(data: User) {
    super();
    this.name = data.name;
    this.email = data.email;
    this.isPro = data.isPro;
    this.avatarUrl = data.avatarUrl;
  }

  @prop({
    required: true,
    minlength: [1, 'Min length for the user name is 1 character'],
    maxlength: [15, 'Max length for the user name is 15 character']}
  )
  public name: string;

  @prop({
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
    required: true,
  })
  public email: string;

  @prop({
    required: true,
    default: ''
  })
  private password!: string;

  @prop({
    required: true
  })
  public isPro: boolean;

  @prop({
    match: [/\.(jpg|png)$/i, 'User\'s avatar has to be a jpeg or png'],
    default: 'defaultUserAvatar.jpg'
  })
  public avatarUrl: string;

  public setPassword(password: string, salt: string) {
    this.password  = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
