import { Test, TestingModule } from '@nestjs/testing';
import { FeedRepliesResolver } from './feed-replies.resolver';
import { FeedRepliesService } from './feed-replies.service';
import { UsersService } from '../users/users.service';

describe('FeedRepliesResolver', () => {
  let resolver: FeedRepliesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedRepliesResolver,
        { provide: FeedRepliesService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<FeedRepliesResolver>(FeedRepliesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
