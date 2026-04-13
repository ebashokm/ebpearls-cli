import { Test, TestingModule } from '@nestjs/testing';
import { FeedRepliesService } from './feed-replies.service';
import { FeedReplyRepository } from '@app/data-access/repository/feed-reply.repository';
import { FeedCommentRepository } from '@app/data-access/repository/feed-comment-repository';
import { FeedRepository } from '@app/data-access/repository/feed.repository';
import { PostLikeRepository } from '@app/data-access/repository/feed-like.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

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
 * @type {"64fee734820ffd9a6ad74323"}
 */
const mockReplyId = '64fee734820ffd9a6ad74323';

/**
 * ${1:Description placeholder}
 *
 * @type {{ replyText: string; }\}
 */
const createReplyInputMock = {
  replyText: 'Test reply text',
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ replyText: string; }\}
 */
const updateReplyInputMock = {
  replyText: 'update reply text ',
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; feedId: string; replyCount: number; save: any; }\}
 */
const commentResponseMock = {
  _id: '65018319f5697115115d008z',
  feedId: '65018319f5697115115d002f',
  replyCount: 1,
  save: jest.fn(),
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; feedId: string; postedBy: string; }\}
 */
const replyResponseMock = {
  _id: '65018319f5697115115d008y',
  feedId: '65018319f5697115115d002g',
  postedBy: '643fa2d72dfdfc02d0b233ee',
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; feedId: string; postedBy: string; save: any; }\}
 */
const replyResponseMock1 = {
  _id: '65018319f5697115115d008x',
  feedId: '65018319f5697115115d002f',
  postedBy: '643fa2d72dfdfc02d0b233ed',
  save: jest.fn(),
};

describe('FeedRepliesService', () => {
  let service: FeedRepliesService;
  let feedCommentRepository: FeedCommentRepository;
  let postLikeRepository: PostLikeRepository;
  let feedReplyRepository: FeedReplyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedRepliesService,
        {
          provide: FeedReplyRepository,
          useValue: {
            create: jest.fn(),
            findReplyById: jest.fn(),
            updateById: jest.fn(),
          },
        },
        {
          provide: FeedCommentRepository,
          useValue: {
            findCommentById: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: FeedRepository,
          useValue: {
            updateOne: jest.fn(),
          },
        },
        {
          provide: PostLikeRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeedRepliesService>(FeedRepliesService);
    feedCommentRepository = module.get<FeedCommentRepository>(
      FeedCommentRepository,
    );
    postLikeRepository = module.get<PostLikeRepository>(PostLikeRepository);
    feedReplyRepository = module.get<FeedReplyRepository>(FeedReplyRepository);
  });

  it('Feed replies should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        await service.create(mockUserId, mockCommentId, {});
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Reply content is required');
      }
    });

    it('should throw NotFoundException if comment is not found', async () => {
      try {
        jest
          .spyOn(feedCommentRepository, 'findCommentById')
          .mockImplementation(() => null);
        await service.create(mockUserId, mockFeedId, createReplyInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Comment not found');
      }
    });

    it('should create a reply, increase reply count and return success message', async () => {
      jest
        .spyOn(feedCommentRepository, 'findCommentById')
        .mockImplementation(() => commentResponseMock as any);

      const result = await service.create(
        mockUserId,
        mockFeedId,
        createReplyInputMock,
      );

      expect(commentResponseMock.replyCount).toEqual(2);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Comment reply posted successfully');
    });
  });
  describe('getLikeStatus', () => {
    it('should get like status of true for the user', async () => {
      const findLikeResponse = {
        _id: '643fa2d72dfdfc02d0b233ee',
        postId: '64fee734820ffd9a6ad74323',
        postType: 'reply',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      };
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(findLikeResponse as any);

      const result = await service.getLikeStatus(mockUserId, mockReplyId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '64fee734820ffd9a6ad74323',
        postType: 'reply',
        likedBy: mockUserId,
      });

      expect(result).toBe(true);
    });
    it('should get like status of false for the user', async () => {
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(null);

      const result = await service.getLikeStatus(mockUserId, mockReplyId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '64fee734820ffd9a6ad74323',
        postType: 'reply',
        likedBy: mockUserId,
      });

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        await service.update(mockUserId, mockReplyId, {});
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Reply content is required');
      }
    });

    it('should throw NotFoundException if reply is not found', async () => {
      try {
        jest
          .spyOn(feedReplyRepository, 'findReplyById')
          .mockImplementation(() => null);
        await service.update(mockUserId, mockReplyId, updateReplyInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe('Reply not found');
      }
    });
    it('should throw ForbiddenException if user is not matched', async () => {
      try {
        jest
          .spyOn(feedReplyRepository, 'findReplyById')
          .mockImplementation(() => replyResponseMock as any);
        await service.update(mockUserId, mockReplyId, updateReplyInputMock);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toBe('No permission to update');
      }
    });
    it('should update feed comment, and return success message', async () => {
      jest
        .spyOn(feedReplyRepository, 'findReplyById')
        .mockImplementation(() => replyResponseMock1 as any);

      const result = await service.update(
        mockUserId,
        mockReplyId,
        updateReplyInputMock,
      );

      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Reply updated successfully');
    });
  });

  describe('deleteFeedReply', () => {
    it('should throw NotFoundException error if feed reply is not found', async () => {
      jest.spyOn(feedReplyRepository, 'findReplyById').mockResolvedValue(null);
      try {
        await service.deleteFeedReply(mockUserId, mockReplyId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Reply not found');
      }
    });
    it('should throw ForbiddenException error if userId is not matched', async () => {
      jest
        .spyOn(feedReplyRepository, 'findReplyById')
        .mockResolvedValue(replyResponseMock as any);
      try {
        await service.deleteFeedReply(mockUserId, mockReplyId);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('No permission to delete');
      }
    });
    it('should delete reply and return success message', async () => {
      jest
        .spyOn(feedReplyRepository, 'findReplyById')
        .mockResolvedValue(replyResponseMock1 as any);
      const result = await service.deleteFeedReply(mockUserId, mockReplyId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Reply deleted successfully');
    });
  });
});
