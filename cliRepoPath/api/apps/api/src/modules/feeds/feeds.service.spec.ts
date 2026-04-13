import { Test, TestingModule } from '@nestjs/testing';
import { FeedsService } from './feeds.service';
import { FeedRepository } from '@app/data-access/repository/feed.repository';
import { PostLikeRepository } from '@app/data-access/repository/feed-like.repository';
import { FeedStatus } from './enum/feed-status.enum';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FeedAssetType } from './enum/feed-asset.enum';
import { PostLikeDocument } from '@app/data-access/schema/post-like.schema';
import { VisibilityType } from './enum/visibility-type.enum';
import { UpdateFeedInput } from './dto/input/update-feed.input';

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
 * @type {{ location: { city: string; }; status: any; \}\}
 */
const mockFeedInput1 = {
  location: {
    city: 'kathmandu',
  },
  status: FeedStatus.DRAFT,
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ caption: string; assets: { type: any; url: string; }; location: { city: string; \}; status: any; \}\}
 */
const mockFeedInput2 = {
  caption: 'test feed',
  assets: {
    type: FeedAssetType.IMAGE,
    url: 'http://abc.jpg',
  },
  location: {
    city: 'kathmandu',
  },
  status: FeedStatus.PUBLISHED,
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ caption: string; location: { city: string; }; status: any; \}\}
 */
const mockFeedUpdateInput = {
  caption: 'test feed',
  location: {
    city: 'Pokhara',
  },
  status: FeedStatus.PUBLISHED,
};

/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; userId: string; caption: string; }\}
 */
const mockFeedRes = {
  _id: '65018319f5697115115d002f',
  userId: '643fa2d72dfdfc02d0b233eh',
  caption: 'test caption response',
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; userId: string; caption: string; }\}
 */
const mockFeedRes1 = {
  _id: '65018319f5697115115d002f',
  userId: '643fa2d72dfdfc02d0b233ed',
  caption: 'test caption response 1',
};
/**
 * ${1:Description placeholder}
 *
 * @type {{ _id: string; userId: string; caption: string; save: any; }\}
 */
const mockFeedRes2 = {
  _id: '65018319f5697115115d002f',
  userId: '643fa2d72dfdfc02d0b233ed',
  caption: 'test caption response 2',
  save: jest.fn(),
};

describe('FeedsService', () => {
  let service: FeedsService;
  let postLikeRepository: PostLikeRepository;
  let feedRepository: FeedRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedsService,
        FeedRepository,
        PostLikeRepository,
        {
          provide: FeedRepository,
          useValue: {
            create: jest.fn(),
            findFeedById: jest.fn(),
            updateById: jest.fn(),
          },
        },
        {
          provide: PostLikeRepository,
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FeedsService>(FeedsService);
    postLikeRepository = module.get<PostLikeRepository>(PostLikeRepository);
    feedRepository = module.get<FeedRepository>(FeedRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        await service.create(mockUserId, mockFeedInput1);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Cannot create feed without content');
      }
    });

    it('should create feed and return success message', async () => {
      const result = await service.create(mockUserId, mockFeedInput2);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Feed created successfully');
    });
  });

  describe('getLikeStatus', () => {
    it('should get like status of true for the user', async () => {
      const findLikeResponse = {
        _id: '643fa2d72dfdfc02d0b233ee',
        postId: '65018319f5697115115d002f',
        postType: 'feed',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      };
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(findLikeResponse as PostLikeDocument);

      const result = await service.getLikeStatus(mockUserId, mockFeedId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '65018319f5697115115d002f',
        postType: 'feed',
        likedBy: mockUserId,
      });

      expect(result).toBe(true);
    });
    it('should get like status of false for the user', async () => {
      const findOneSpy = jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(null);

      const mockFeedId = '65018319f5697115115d002f';
      const result = await service.getLikeStatus(mockUserId, mockFeedId);

      expect(findOneSpy).toHaveBeenCalledWith({
        postId: '65018319f5697115115d002f',
        postType: 'feed',
        likedBy: mockUserId,
      });

      expect(result).toBe(false);
    });
  });

  describe('findFeedDetail', () => {
    it('should return undefined if feed is not found', async () => {
      const findFeedSpy = jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(null);

      const result = await service.findFeedDetail(mockUserId, mockFeedId);
      expect(findFeedSpy).toHaveBeenCalledWith(mockFeedId);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('message');
      expect(result.message).toEqual('Feed not found');
      expect(result.feed).toBe(undefined);
    });
    it('should return null if userId is not matched and feed is not public or published', async () => {
      const findFeedSpy = jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue({
          userId: '643fa2d72dfdfc02d0b233eg',
          visibilityType: VisibilityType.ONLY_ME,
        } as any);

      const result = await service.findFeedDetail(mockUserId, mockFeedId);
      expect(findFeedSpy).toHaveBeenCalledWith(mockFeedId);
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('message');
      expect(result.message).toEqual('Feed not found');
      expect(result.feed).toBe(null);
    });
    it('should return feed data with success message', async () => {
      const findFeedSpy = jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue({
          userId: '643fa2d72dfdfc02d0b233eg',
          visibilityType: VisibilityType.PUBLIC,
          status: FeedStatus.PUBLISHED,
        } as any);

      const result = await service.findFeedDetail(mockUserId, mockFeedId);
      expect(findFeedSpy).toHaveBeenCalledWith(mockFeedId);
      expect(typeof result).toBe('object');
      expect(Object.keys(result)).toEqual(['feed', 'message']);
      expect(result.message).toEqual('Feed detail success');
      expect(typeof result.feed).toBe('object');
      expect(result.feed?.userId).toBe('643fa2d72dfdfc02d0b233eg');
    });
  });

  describe('update', () => {
    const updateFeedInput: UpdateFeedInput = {
      caption: 'update feed data',
    };
    it('should throw NotFoundException error if feed is not found', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue(null);
      try {
        await service.update(mockUserId, mockFeedId, updateFeedInput);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Feed not found!');
      }
    });
    it('should throw error if feed is not found', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue(null);
      try {
        await service.update(mockUserId, mockFeedId, updateFeedInput);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Feed not found!');
      }
    });
    it('should throw ForbiddenException error if userId is not matched', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes as any);
      try {
        await service.update(mockUserId, mockFeedId, updateFeedInput);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('No permission to update');
      }
    });
    it('should throw BadRequestException if no content is provided', async () => {
      try {
        jest
          .spyOn(feedRepository, 'findFeedById')
          .mockResolvedValue(mockFeedRes1 as any);

        await service.update(mockUserId, mockFeedId, mockFeedInput1);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Cannot update feed without content');
      }
    });
    it('should update feed and return success message', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes1 as any);
      const result = await service.update(
        mockUserId,
        mockFeedId,
        mockFeedUpdateInput,
      );
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Feed updated successfully');
    });
  });

  describe('deleteFeed', () => {
    it('should throw NotFoundException error if feed is not found', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue(null);
      try {
        await service.deleteFeed(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Feed not found');
      }
    });
    it('should throw ForbiddenException error if userId is not matched', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes as any);
      try {
        await service.deleteFeed(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenException);
        expect(err.message).toEqual('No permission to delete');
      }
    });
    it('should delete feed and return success message', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes1 as any);
      const result = await service.deleteFeed(mockUserId, mockFeedId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Feed deleted successfully');
    });
  });

  describe('addLike', () => {
    it('should throw NotFoundException error if feed is not found', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue(null);
      try {
        await service.addLike(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Feed not found');
      }
    });
    it('should throw BadRequestException error if userId is not matched and feed is not published or public', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue({
        userId: '643fa2d72dfdfc02d0b233ek',
        visibilityType: VisibilityType.ONLY_ME,
      } as any);
      try {
        await service.addLike(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('Feed not published or public');
      }
    });
    it('should return already liked message if already liked', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes1 as any);

      const postLikedResponseMock = {
        _id: 'randomlikeId',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      };
      jest
        .spyOn(postLikeRepository, 'findOne')
        .mockResolvedValue(postLikedResponseMock as any);
      const result = await service.addLike(mockUserId, mockFeedId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Already liked');
    });
    it('should like feed and return success message', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes2 as any);
      jest.spyOn(postLikeRepository, 'findOne').mockResolvedValue({
        _id: 'randomlikeId',
      } as any);
      const result = await service.addLike(mockUserId, mockFeedId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Liked a feed');
    });
  });

  describe('removeLike', () => {
    it('should throw NotFoundException error if feed is not found', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue(null);
      try {
        await service.removeLike(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Feed not found');
      }
    });
    it('should throw BadRequestException error if userId is not matched and feed is not published or public', async () => {
      jest.spyOn(feedRepository, 'findFeedById').mockResolvedValue({
        userId: '643fa2d72dfdfc02d0b233ek',
        visibilityType: VisibilityType.ONLY_ME,
      } as any);
      try {
        await service.removeLike(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('Feed not published or public');
      }
    });
    it('should return error message if not liked already', async () => {
      const postLikedResponseMock = {
        _id: 'randomlikeId',
        likedBy: [],
      };
      try {
        jest
          .spyOn(feedRepository, 'findFeedById')
          .mockResolvedValue(mockFeedRes1 as any);

        jest
          .spyOn(postLikeRepository, 'findOne')
          .mockResolvedValue(postLikedResponseMock as any);

        await service.removeLike(mockUserId, mockFeedId);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('Cannot unlike feed');
      }
    });
    it('should unlike feed and return success message', async () => {
      jest
        .spyOn(feedRepository, 'findFeedById')
        .mockResolvedValue(mockFeedRes2 as any);
      jest.spyOn(postLikeRepository, 'findOne').mockResolvedValue({
        _id: 'randomlikeId',
        likedBy: ['643fa2d72dfdfc02d0b233ed'],
      } as any);
      const result = await service.removeLike(mockUserId, mockFeedId);
      expect(result).not.toBe(null);
      expect(typeof result).toBe('object');
      expect(result.message).toBe('Unliked a feed');
    });
  });
});
