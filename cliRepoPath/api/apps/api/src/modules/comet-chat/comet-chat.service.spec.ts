import { Test, TestingModule } from '@nestjs/testing';
import { CometChatService } from './comet-chat.service';

describe('CometChatService', () => {
  let service: CometChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CometChatService],
    }).compile();

    service = module.get<CometChatService>(CometChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
