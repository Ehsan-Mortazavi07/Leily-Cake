import { Body, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './schema/bookmark.schema';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { PostDocument,Post } from '../posts/schema/posts.schema';



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
      },
    );

    if (!post) {
      throw new NotFoundException('چنین مقاله ای با این مشخصات وجود ندارد');
    }

    const bookmark = await this.bookmarkModel.findOne({
        post: post._id,
        user: req.user._id,
      },
    );

    if (bookmark) {
      await this.bookmarkModel.deleteOne({
          _id: bookmark._id,
      });
    } else {
      const newBookmark = new this.bookmarkModel({
        user: req.user._id,
        post:post._id
      });
      await newBookmark.save();
    }
    return { bookmark };
  }


}
