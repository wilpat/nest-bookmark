import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

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
