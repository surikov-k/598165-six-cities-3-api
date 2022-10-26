import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';
import { PASSWORD_MAX, PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from '../user.constants.js';

export default class CreateUserDto {
  @IsString({message: 'User name is required'})
  @Length(USERNAME_MIN, USERNAME_MAX,
    {message: `Username min length is ${USERNAME_MIN}, max is ${USERNAME_MAX}`})
  public name!: string;

  @IsEmail({}, {message: 'Email must be a valid e-mail address'})
  public email!: string;

  @IsString({message: 'Password is required'})
  @Length(PASSWORD_MIN, PASSWORD_MAX,
    {message: `Password min length is ${PASSWORD_MIN}, max is ${PASSWORD_MAX}`})
  public password!: string;

  @IsBoolean()
  public isPro!: boolean;
}
