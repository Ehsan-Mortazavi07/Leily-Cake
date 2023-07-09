import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto copy';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
