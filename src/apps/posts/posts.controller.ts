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
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  ParseFilePipeBuilder,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EditPosteDto } from './dtos/edit-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');

@Controller('post')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/all')
  async showAll(@Query('page') page, @Query('limit') limit) {
    const posts = await this.postsService.showAll(page, limit);
    return posts;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = path.parse(file.originalname).name;
          const extension = path.parse(file.originalname).ext;

          return cb(null, `${filename}-${Date.now()}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const extension = path.parse(file.originalname).ext;

        if (extension !== '.jpg' && '.png') {
          return cb(new BadRequestException('Erorr ...'), false);
        }

        return cb(null, true);
      },
    }),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
    @UploadedFile()
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 1000 }),
    //     new FileTypeValidator({ fileType: 'image/jpeg' }),
    //   ],
    // }),
    image: Express.Multer.File,
  ) {
    const newPost = await this.postsService.createPost(
      createPostDto,
      req,
      image,
    );

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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('publish/:id')
  async publishPost(@Param('id') id: string) {
    await this.postsService.publishPost(id);
    return { message: 'عملیات با موفقیت انجام شد' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:slug')
  async showOne(@Param('slug') slug: string, @Req() req) {
    const post = await this.postsService.showOne(slug, req);
    return post;
  }
}
