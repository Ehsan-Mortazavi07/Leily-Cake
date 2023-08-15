import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './schema/bookmark.schema';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { PostDocument, Post } from '../posts/schema/posts.schema';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name)
    private readonly bookmarkModel: Model<BookmarkDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async isBookmarked(@Req() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    const post = await this.postModel.findOne({
      _id: createBookmarkDto.post,
    });

    if (!post) {
      throw new NotFoundException('چنین مقاله ای با این مشخصات وجود ندارد');
    }

    const bookmark = await this.bookmarkModel.findOne({
      post: post._id,
      user: req.user._id,
    });

    if (bookmark) {
      await this.bookmarkModel.deleteOne({
        _id: bookmark._id,
      });
    } else {
      const newBookmark = new this.bookmarkModel({
        user: req.user._id,
        post: post._id,
      });
      await newBookmark.save();
    }
    return { bookmark };
  }

  async showAll(@Req() req, page: string, limit: string) {
    const pageQuery = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const totalItems: any = (await this.postModel.find({})).length;
    const totalPages = Math.ceil(totalItems / perPage);

    const posts = await this.bookmarkModel
      .find({ user: req.user._id })
      .skip((pageQuery - 1) * perPage)
      .limit(perPage)
      .sort({ updatedAt: -1 });

    if (!posts) {
      throw new NotFoundException('هیچ پستی سافت ند');
    }

    return { posts, totalPages, totalItems };
  }
}
