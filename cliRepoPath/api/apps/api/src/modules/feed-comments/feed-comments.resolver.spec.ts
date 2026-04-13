import { Test, TestingModule } from '@nestjs/testing';
import { FeedCommentsResolver } from './feed-comments.resolver';
import { FeedCommentsService } from './feed-comments.service';
import { FeedRepliesService } from '../feed-replies/feed-replies.service';
import { UsersService } from '../users/users.service';

describe('FeedCommentsResolver', () => {
  let resolver: FeedCommentsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedCommentsResolver,
        {
          provide: FeedCommentsService,
          useValue: {},
        },
        {
          provide: FeedRepliesService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<FeedCommentsResolver>(FeedCommentsResolver);
  });

  it('resolver should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
