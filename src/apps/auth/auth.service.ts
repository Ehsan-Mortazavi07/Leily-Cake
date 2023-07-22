import { Injectable, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { IJwtPayload, IUser } from './interfaces/user.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(
      email.toLocaleLowerCase(),
      true,
    );

    //Checking user exist
    if (!user) {
      return undefined;
    }

    //Checking user password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("چنین کاربری با این مشخصات وجود ندارد");
    }

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const payload: IJwtPayload = {
      email: user.email,
      sub: user._id.toString(),
    };
    const token = this.jwtService.sign(payload);

    await this.userModel.updateOne(
      { email: user.email },
      {
        $set: {
          token,
        },
      },
    );
    return {
      user: user,
      access_token: token,
    };
  }

  async login(user: IUser) {
    const payload: IJwtPayload = {
      email: user.email.toLocaleLowerCase(),
      sub: user._id,
    };
    const token = this.jwtService.sign(payload);

    await this.userModel.updateOne(
      { email: user.email },
      {
        $set: {
          token,
        },
      },
    );
    return {
      access_token: token,
    };
  }
  
  async validateUserByToken(id: string) {
    const user = await this.userModel.findById(id);

    if (!user || user.token === null) {
      throw new UnauthorizedException('چنین کاربری با این مشخصات وجود ندارد');
    }

    return user;
  }

 


}
