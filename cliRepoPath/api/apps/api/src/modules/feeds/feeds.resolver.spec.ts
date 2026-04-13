import { Test, TestingModule } from '@nestjs/testing';
import { FeedsResolver } from './feeds.resolver';
import { FeedsService } from './feeds.service';
import { FeedCommentsService } from '../feed-comments/feed-comments.service';
import { UsersService } from '../users/users.service';

describe('FeedsResolver', () => {
  let feedsResolver: FeedsResolver;
  // let feedsService: FeedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedsResolver,
        FeedsService,
        FeedCommentsService,
        UsersService,
        {
          provide: FeedsService,
          useValue: {},
        },
        {
          provide: FeedCommentsService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    feedsResolver = module.get<FeedsResolver>(FeedsResolver);
    // feedsService = module.get<FeedsService>(FeedsService);
  });

  it('should be defined', () => {
    expect(feedsResolver).toBeDefined();
  });
});
