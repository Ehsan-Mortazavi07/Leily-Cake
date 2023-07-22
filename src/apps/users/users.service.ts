import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(email: string, needPassword: boolean) {
    const user = await this.userModel.findOne({
      email: email.toLocaleLowerCase(),
    });
    
    if (!user) {
      throw new UnauthorizedException('چنین کاربری با این مشخصات وجود ندارد');
    }

    return user;
  }
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({
      email: createUserDto.email.toLocaleLowerCase(),
    });
    
    if (user) {
      throw new BadRequestException('چنین کاربری با این مشخصات وجود دارد');
    }
    const password = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = new this.userModel({
      fullName: createUserDto.fullName,
      email: createUserDto.email.toLocaleLowerCase(),
      password: password,
    });
    await newUser.save();
    return newUser;
  }
}
