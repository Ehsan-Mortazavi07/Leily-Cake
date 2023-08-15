import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createBookmark(
    @Req() req,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    const { bookmark } = await this.bookmarkService.isBookmarked(
      req,
      createBookmarkDto,
    );
    return { bookmark };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async showAll(@Req() req, @Query('page') page, @Query('limit') limit) {
    const posts = await this.bookmarkService.showAll(req, page, limit);
    return posts;
  }
}
