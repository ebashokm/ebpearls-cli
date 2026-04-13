import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { VisibilityType } from './enum/visibility-type.enum';
import { Feed, FeedDocument } from './feed.schema';
import { FeedStatus } from './enum/feed-status.enum';

@Injectable()
export class FeedRepository extends BaseRepo<FeedDocument> {
  constructor(
    @InjectModel(Feed.name)
    private readonly feed: Model<FeedDocument>,
  ) {
    super(feed);
  }

  async findFeedById(feedId: string, projection = {}) {
    const query = {
      _id: feedId,
      deletedAt: null,
    };
    return this.feed.findOne(query, projection);
  }

  async getAllFeeds(userId, filter, sort, pageMeta) {
    const stages: PipelineStage[] = [
      {
        $match: {
          $and: [
            {
              status: FeedStatus.PUBLISHED,
              deletedAt: null,
            },
            {
              $or: [
                { caption: { $regex: filter.searchText, $options: 'i' } },
                { 'location.city': { $regex: filter.searchText, $options: 'i' } },
                { 'assets.url': { $regex: filter.searchText, $options: 'i' } },
              ],
            },
          ],
        },
      },
    ];
    stages.push({
      $addFields: {
        isOwner: {
          $cond: {
            if: {
              $eq: ['$userId', userId],
            },
            then: true,
            else: false,
          },
        },
      },
    });

    stages.push({
      $match: {
        $expr: {
          $cond: {
            if: {
              $eq: ['$isOwner', true],
            },
            then: {},
            else: {
              $eq: ['$visibilityType', VisibilityType.PUBLIC],
            },
          },
        },
      },
    });

    stages.push(
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', '$$userId'],
                    },
                    {
                      $or: [{ $not: '$deletedAt' }, { $eq: ['$deletedAt', null] }],
                    },
                  ],
                },
              },
            },
          ],
          as: 'feedOwner',
        },
      },
      {
        $unwind: '$feedOwner',
      },
    );

    stages.push({
      $sort: { [sort.orderBy]: sort.order === 'asc' ? 1 : -1 },
    });

    return this.aggregatePaginate(stages, pageMeta);
  }
}
