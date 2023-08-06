import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Post } from 'src/apps/posts/schema/posts.schema';
import { User } from 'src/apps/users/schema/user.schema';

export type BookmarkDocument = mongoose.HydratedDocument<Bookmark>;

@Schema({ timestamps: true })
export class Bookmark {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
