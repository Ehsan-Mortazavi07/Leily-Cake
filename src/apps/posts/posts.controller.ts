import { Controller, Body, Req, Post,UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const newPost = await this.postsService.createPost(createPostDto, req);
    return { newPost };
  }
}
