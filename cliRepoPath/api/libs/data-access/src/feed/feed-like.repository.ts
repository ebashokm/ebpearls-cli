import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { PostLike, PostLikeDocument } from './post-like.schema';

@Injectable()
export class PostLikeRepository extends BaseRepo<PostLikeDocument> {
  constructor(
    @InjectModel(PostLike.name)
    private readonly postLike: Model<PostLikeDocument>,
  ) {
    super(postLike);
  }
}
