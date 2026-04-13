import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { FeedReply, FeedReplyDocument } from './feed-reply.schema';
import { PaginationOptions } from '../repository/pagination.type';

@Injectable()
export class FeedReplyRepository extends BaseRepo<FeedReplyDocument> {
  constructor(
    @InjectModel(FeedReply.name)
    private readonly feedReply: Model<FeedReplyDocument>,
  ) {
    super(feedReply);
  }

  async findReplyById(replyId: string) {
    return this.feedReply.findOne({
      _id: replyId,
      deletedAt: null,
    });
  }

  async findAllByCommentId(
    commentId: string,
    selectQuery: string,
    paginationOptions: PaginationOptions,
  ) {
    const findQuery = {
      commentId,
      deletedAt: null,
    };
    return this.findWithPaginate(findQuery, paginationOptions, selectQuery);
  }
}
