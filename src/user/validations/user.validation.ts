import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserData {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;
}
