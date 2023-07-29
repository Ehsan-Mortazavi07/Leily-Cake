import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/apps/users/schema/user.schema';

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
 
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: null })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, unique: true  })
  slug: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
