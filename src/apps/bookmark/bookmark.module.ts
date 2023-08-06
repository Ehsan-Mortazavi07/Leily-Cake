import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark, BookmarkSchema } from './schema/bookmark.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema,Post } from '../posts/schema/posts.schema';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  imports: [
    MongooseModule.forFeature([{ name: Bookmark.name, schema: BookmarkSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),

  ],
})
export class BookmarkModule {}
