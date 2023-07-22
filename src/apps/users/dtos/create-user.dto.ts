import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 999, { message: 'پسورد حداقل باید 5 کاراکتر باشد' })
  password: string;
}
