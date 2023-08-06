import {
  Controller,
  Body,
  Req,
  Post,
  UseGuards,
  Put,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EditPosteDto } from './dtos/edit-post.dto';

@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/:slug')
  async showOne(@Param('slug') slug: string) {
    const post = await this.postsService.showOne(slug);
    return post;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const newPost = await this.postsService.createPost(createPostDto, req);

    return { newPost };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('/edit/:slug')
  async editArticle(
    @Req() req,
    @Param('slug') slug: string,
    @Body() EditPostDto: EditPosteDto,
  ) {
    const post = await this.postsService.editPost(req, EditPostDto, slug);
    return { post };
  }

  @Get('/all')
  async showAll(@Query('page') page, @Query('limit') limit) {
    const posts = await this.postsService.showAll(page, limit);
    return { posts };
  }

  @Get('/salam')
  async posts(){
    const post = await this.postsService.posts()
    console.log('salamm');

    return post
  }
}
