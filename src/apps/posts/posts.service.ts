import {
  Injectable,
  Req,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schema/posts.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { EditPosteDto } from './dtos/edit-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async showOne(slug: string) {
    const post = await this.postModel.findOne({ slug: slug });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return { post };
  }

  async createPost(createPostDto: CreatePostDto, @Req() req) {
    const checkPost = await this.postModel.findOne({
      slug: createPostDto.slug,
    });
    if (checkPost) {
      throw new BadRequestException('this post already exist');
    }
    const newPost = new this.postModel({
      user: req.user._id,
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      description: createPostDto.description,
      slug: createPostDto.slug,
      image: createPostDto.image,
      price: parseInt(createPostDto.price),
    });
    await newPost.save();
    return newPost;
  }

  async editPost(@Req() req, editPostDto: EditPosteDto, slug: string) {
    let post = await this.postModel.findOne({
      slug: slug,
    });

    if (!post) {
      throw new NotFoundException('چنین مقاله ای وجود ندارد');
    } else if (req.user.isAdmin === false) {
      throw new ForbiddenException();
    }

    const checkSlugPost = await this.postModel.findOne({
      slug: editPostDto.slug,
    });

    if (checkSlugPost && checkSlugPost.id !== post.id) {
      throw new BadRequestException(
        'چنین مقاله ای با این مشخصات از قبل وجود دارد',
      );
    }

    await post.updateOne({
      $set: {
        title: editPostDto.title,
        description: editPostDto.description,
        shortDescription: editPostDto.shortDescription,
        price: parseInt(editPostDto.price),
        image: editPostDto.image,
        slug: editPostDto.slug,
      },
    });

    post = await this.postModel.findOne({
      slug: slug,
    });

    return post;
  }

  async showAll(page: string, limit: string) {
    const pageQuery = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const totalItems: any = (await this.postModel.find({})).length;
    const totalPages = Math.ceil(totalItems / perPage);

    const posts = await this.postModel
      .find({})
      .skip((pageQuery - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    if (!posts) {
      throw new NotFoundException('هیچ پستی سافت ند');
    }

    return { posts, totalPages, totalItems };
  }

  async posts() {
    const post = await this.postModel.find({});
    console.log('salamm');

    if (!post) {
      throw new NotFoundException('chenin posti yaft nashod');
    }

    return post;
  }
}
