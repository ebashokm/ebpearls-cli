import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { FeedComment, FeedCommentDocument } from './feed-comment.schema';
import { PaginationOptions } from '../repository/pagination.type';

@Injectable()
export class FeedCommentRepository extends BaseRepo<FeedCommentDocument> {
  constructor(
    @InjectModel(FeedComment.name)
    private readonly feedComment: Model<FeedCommentDocument>,
  ) {
    super(feedComment);
  }

  async findCommentById(id: string, projection = {}) {
    return this.feedComment.findOne(
      {
        _id: id,
        deletedAt: null,
      },
      projection,
    );
  }

  async findAllByFeedId(feedId: string, selectQuery: string, paginationOptions: PaginationOptions) {
    const findQuery = {
      feedId,
      deletedAt: null,
    };

    return this.findWithPaginate(findQuery, paginationOptions, selectQuery);
  }
}
