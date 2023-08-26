import { IsEmail, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  shortDescription: string;

  @IsString()
  description: string;
  
  @IsString()
  price: string;

  @IsString()
  slug: string;
}
