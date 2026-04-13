import { Test, TestingModule } from '@nestjs/testing';
import { CometChatResolver } from './comet-chat.resolver';
import { CometChatService } from './comet-chat.service';

describe('CometChatResolver', () => {
  let resolver: CometChatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CometChatResolver, CometChatService],
    }).compile();

    resolver = module.get<CometChatResolver>(CometChatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
