import {
  Controller,
  Body,
  Req,
  Post,
  UseGuards,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';


@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard,RoleGuard)

  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const newPost = await this.postsService.createPost(createPostDto, req);
    console.log('salam');
    
    return { newPost };
  }
}
