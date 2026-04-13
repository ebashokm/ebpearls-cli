import { Test, TestingModule } from '@nestjs/testing';
import { FeedCommentsService } from './feed-comments.service';
import { FeedCommentRepository } from '@app/data-access/repository/feed-comment-repository';
import { FeedRepository } from '@app/data-access/repository/feed.repository';
import { PostLikeRepository } from '@app/data-access/repository/feed-like.repository';
import { FeedReplyRepository } from '@app/data-access/repository/feed-reply.repository';
import { CommentAssetType } from './enum/comment-asset.enum';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FeedStatus } from '../feeds/enum/feed-status.enum';

/**
 * ${1:Description placeholder}
 *
 * @type {"643fa2d72dfdfc02d0b233ed"}
 */
const mockUserId = '643fa2d72dfdfc02d0b233ed';
/**
 * ${1:Description placeholder}
 *
 * @type {"65018319f5697115115d002f"}
 */
const mockFeedId = '65018319f5697115115d002f';
/**
 * ${1:Description placeholder}
 *
 * @type {"65018319f5697115115d008z"}
 */
const mockCommentId = '65018319f5697115115d008z';

/**
 * ${1:Description placeholder}
 *
 * @type {{ commentText: string; assets: { type: any; url: string; }; \}\}
 */
const createCommentInputMock = {
  commentText: 'create comment test text',
  assets: {
    type: CommentAssetType.IMAGE,
    url: 'http://image.png',
  },
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ assets: {}; \}\}
 */
const createCommentInputMock1 = {
  assets: {},
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ commentText: string; }\}
 */
const updateCommentInputMock = {
  commentText: 'update comment test text',
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; status: any; commentCount: number; save: any; }\}
 */
const feedResponseMock = {
  _id: '65018319f5697115115d003g',
  status: FeedStatus.PUBLISHED,
  commentCount: 1,
  save: jest.fn(),
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; status: any; commentCount: number; }\}
 */
const feedResponseMock1 = {
  _id: '65018319f5697115115d004h',
  status: FeedStatus.DRAFT,
  commentCount: 1,
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; postedBy: string; }\}
 */
const commentResponseMock = {
  _id: '65018319f5697115115d017k',
  postedBy: '643fa2d72dfdfc02d0b233ff',
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; postedBy: string; }\}
 */
const commentResponseMock1 = {
  _id: '65018319f5697115115d017p',
  postedBy: '643fa2d72dfdfc02d0b233ed',
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; postedBy: string; likeCount: number; save: any; }\}
 */
const commentResponseMock2 = {
  _id: '65018319f5697115115d017q',
  postedBy: '643fa2d72dfdfc02d0b233ed',
  likeCount: 1,
  save: jest.fn(),
};

describe('FeedCommentsService', () => {
  let service: FeedCommentsService;
  let feedRepository: FeedRepository;
  let feedCommentRepository: FeedCommentRepository;
  let postLikeRepository: PostLikeRepository;
  // let feedReplyRepository: FeedReplyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedCommentsService,
        {
          provide: FeedCommentRepository,
          useValue: {
            create: jest.fn(),
            findCommentById: jest.fn(),
            updateById: jest.fn(),
          },
        },
        {
          provide: FeedRepository,
          useValue: {
            findFeedById: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: PostLikeRepository,
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: FeedReplyRepository,
          useValue: {
            updateMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeedCommentsService>(FeedCommentsService);
    feedRepository = module.get<FeedRepository>(FeedRepository);
    feedCommentRepository = module.get<FeedCommentRepository>(
      FeedCommentRepository,
    );
    postLikeRepository = module.get<PostLikeRepository>(PostLikeRepository);
  });

  it('Feed comment service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        await service.create(mockUserId, mockFeedId, createCommentInputMock1);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Comment content is required');
      }
    });

    it('should throw BadRequestException if feed is not found', async () => {
      try {
        jest
          .spyOn(feedRepository, 'findFeedById')
          .mockImplementation(() => null);
        await service.create(mockUserId, mockFeedId, createCommentInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Feed not found or not published');
      }
    });
    it('should throw BadRequestException if feed is not published', async () => {
      try {
        jest
          .spyOn(feedRepository, 'findFeedById')
          .mockImplementation(() => feedResponseMock1 as any);
        await service.create(mockUserId, mockFeedId, createCommentInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Feed not found or not published');
      }
    });

    it('should create feed comment, increase comment count and return success message', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockImplementation(() => feedResponseMock as any);

      const result = await service.create(
        mockUserId,
        mockFeedId,
        createCommentInputMock,
      );

      expect(feedResponseMock.commentCount).toEqual(2);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Feed comment posted successfully');
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        await service.update(mockUserId, mockCommentId, {});
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Comment content is required');
      }
    });

    it('should throw NotFoundException if comment is not found', async () => {
      try {
        jest
          .spyOn(feedCommentRepository, 'findCommentById')
          .mockImplementation(() => null);
        await service.update(mockUserId, mockCommentId, updateCommentInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Comment not found');
      }
    });
    it('should throw ForbiddenException if user is not matched', async () => {
      try {
        jest
          .spyOn(feedCommentRepository, 'findCommentById')
          .mockImplementation(() => commentResponseMock as any);
        await service.update(mockUserId, mockCommentId, updateCommentInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toBe('No permission to update');
      }
    });
    it('should update feed comment, and return success message', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockImplementation(() => commentResponseMock1 as any);

      const result = await service.update(
        mockUserId,
        mockFeedId,
        createCommentInputMock,
      );

      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Comment updated successfully');
    });
  });

  describe('getLikeStatus', () => {
    it('should get like status of true for the user', async () => {
      const findLikeResponse = {
        _id: '643fa2d72dfdfc02d0b233ee',
        postId: '65018319f5697115115d008z',
        postType: 'comment',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      };
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(findLikeResponse as any);

      const result = await service.getLikeStatus(mockUserId, mockCommentId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '65018319f5697115115d008z',
        postType: 'comment',
        likedBy: mockUserId,
      });

      expect(result).toBe(true);
    });
    it('should get like status of false for the user', async () => {
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await service.getLikeStatus(mockUserId, mockCommentId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '65018319f5697115115d008z',
        postType: 'comment',
        likedBy: mockUserId,
      });

      expect(result).toBe(false);
    });
  });

  describe('deleteFeedComment', () => {
    it('should throw NotFoundException error if feed comment is not found', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(null);
      try {
        await service.deleteFeedComment(mockUserId, mockCommentId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Comment not found');
      }
    });
    it('should throw ForbiddenException error if userId is not matched', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(commentResponseMock as any);
      try {
        await service.deleteFeedComment(mockUserId, mockCommentId);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('No permission to delete');
      }
    });
    it('should delete feed and return success message', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(commentResponseMock1 as any);
      const result = await service.deleteFeedComment(mockUserId, mockCommentId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Comment deleted successfully');
    });
  });

  describe('addLike', () => {
    it('should throw NotFoundException error if feed comment is not found', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(null);
      try {
        await service.addLike(mockUserId, mockCommentId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Comment not found');
      }
    });
    it('should return already liked message if already liked', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(commentResponseMock1 as any);

      const postLikedResponseMock = {
        _id: 'randomlikeId',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      };
      jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(postLikedResponseMock as any);
      const result = await service.addLike(mockUserId, mockCommentId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Already liked');
    });
    it('should like feed and return success message', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(commentResponseMock2 as any);
      jest.spyOn(postLikeRepository, 'findOne').mockResolvedValue({
        _id: 'randomlikeId',
      } as any);
      const result = await service.addLike(mockUserId, mockCommentId);
      expect(commentResponseMock2.likeCount).toEqual(2);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Liked a comment');
    });
  });

  describe('removeLike', () => {
    it('should throw NotFoundException error if feed comment is not found', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(null);
      try {
        await service.removeLike(mockUserId, mockCommentId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Comment not found');
      }
    });
    it('should return error message if not liked already', async () => {
      const postLikedResponseMock = {
        _id: 'randomlikeId',
        likedBy: [],
      };
      try {
        jest
          .spyOn(feedCommentRepository, 'findCommentById')
          .mockResolvedValue(commentResponseMock1 as any);

        jest
          .spyOn(postLikeRepository, 'findOne')
          .mockResolvedValue(postLikedResponseMock as any);

        await service.removeLike(mockUserId, mockCommentId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('Cannot unlike comment');
      }
    });
    it('should unlike feed comment and return success message', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockResolvedValue(commentResponseMock2 as any);
      jest.spyOn(postLikeRepository, 'findOne').mockResolvedValue({
        _id: 'randomlikeId',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      } as any);
      const result = await service.removeLike(mockUserId, mockCommentId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Unliked a comment');
    });
  });
});
