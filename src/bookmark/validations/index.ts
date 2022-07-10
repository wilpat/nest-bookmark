import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkData {
  @IsString()
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;
  @IsString()
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;
  @IsString()
  @IsNotEmpty({
    message: 'Link is required',
  })
  @IsUrl()
  link: string;
}

export class EditBookmarkData {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Link is required',
  })
  @IsUrl()
  link: string;
}
