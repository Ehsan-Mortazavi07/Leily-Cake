import { IsNumber, IsString } from 'class-validator';

export class EditPosteDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  shortDescription: string;

  @IsString()
  image: string;

  @IsString()
  price: string;

  @IsString()
  slug: string;
}
