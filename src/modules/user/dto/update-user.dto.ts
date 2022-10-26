import { IsOptional, IsString } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsString()
  public avatarUrl?: string;
}
