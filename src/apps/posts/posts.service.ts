import { Injectable, Req, BadRequestException, UnauthorizedException,ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createPost(createPostDto: CreatePostDto, @Req() req) {
    const checkPost = await this.postModel.findOne({
      title: createPostDto.title,
    });
    if (checkPost) {
      throw new BadRequestException('this post already exist');
    }
    if(req.user.isAdmin !== true ){
      throw new ForbiddenException()
    }
      const newPost = new this.postModel({
        user: req.user._id,
        title: createPostDto.title,
        shortDescription: createPostDto.shortDescription,
        description: createPostDto.description,
        slug: createPostDto.slug,
        image: createPostDto.image,
        price: createPostDto.price,
      });
      await newPost.save()
      return newPost
    }
  }

