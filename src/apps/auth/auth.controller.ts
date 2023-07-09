import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto copy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const { user, access_token } = await this.authService.register(
      createUserDto,
    );
    return { user, token: access_token };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Req() req) {
    const { access_token } = await this.authService.login(req.user);
    return { user: req.user, token: access_token };
  }

  @Get('salam')
  salam(){
    return 'salam'
  }
}
