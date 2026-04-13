import { Controller, Sse, Get, Param, LoggerService, Inject } from '@nestjs/common';
import { Observable, map, merge } from 'rxjs';
import { EventsService } from './events.service';
import { UserEventsService } from './user.events.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('events')
export class EventsController {
  private successCount = 0;
  private errorCount = 0;
  constructor(
    private readonly eventsService: EventsService,
    private readonly userEventsService: UserEventsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
  ) {}

  @Sse('sse/:userId')
  sseEvents(@Param('userId') userId: string): Observable<MessageEvent> {
    const userSubject = this.userEventsService.createUserEventSubject(userId);

    return userSubject.asObservable().pipe(
      map((data) => ({
        data: data.data,
        type: data.type,
      })),
    );
  }

  @Get('/test-sse-listen')
  testSseListen() {
    const url = 'http://localhost:3001/events/sse/1';
    const EventSource = require('eventsource');
    // Initialize EventSource
    const eventSource = new EventSource(url);
    // Listen for the 'message' event
    eventSource.onmessage = (event) => {
      this.successCount += this.successCount;
      this.logger.log('This is log message');

      console.log('New message:', event.data);
    };

    // Listen for custom events if the server sends them
    eventSource.addEventListener('customEvent', (event) => {
      console.log('Custom Event:', event.data);
    });

    // Handle connection errors
    eventSource.onerror = (error) => {
      this.logger.error('Winstone This is an success message');

      console.error('EventSource failed:', error);
      this.errorCount += this.errorCount;
      eventSource.close(); // Optional: Close connection on error
    };
  }

  // testing multiple
  @Get('/test-sse-multiple')
  testSseMultipleEvents() {
    this.logger.log('========Trigger..  test-sse-multiple========');
    this.eventsService.sendEvent({
      type: 'term-and-condition-version-changed',
      data: { version: `V1` },
    });

    for (let j = 1; j <= 40000; j++) {
      this.userEventsService.sendEventToUser(`${j}`, {
        type: 'delete-user-from-user-event',
        data: { userId: j },
      });
    }

    setTimeout(
      () =>
        this.logger.log(
          `========Listner after event Count :: successCount: ${this.successCount}, failCount : ${this.errorCount}========`,
        ),
      10000,
    );
  }

  @Get('/test-sse-multiple-listen')
  async testSseMultipleListen() {
    this.logger.log('========Setting up SSE listeners: test-sse-multiple-listen========');

    const EventSource = require('eventsource');
    const totalConnections = 40000;
    const batchSize = 100; // Number of connections per batch
    const delayBetweenBatches = 2000; // Delay between batches in ms

    const openBatch = async (startIndex: number, endIndex: number) => {
      for (let i = startIndex; i <= endIndex; i++) {
        const url = `http://localhost:3001/events/sse/${i}`;
        const eventSource = new EventSource(url);

        this.logger.log(`Listening to instance ${i}`);

        eventSource.onmessage = (event) => {
          this.successCount++;
          this.logger.log(`Instance ${i} - New message: ${JSON.stringify(event.data)}`);
        };

        eventSource.addEventListener('customEvent', (event) => {
          this.logger.log(`Instance ${i} - Custom Event: ${JSON.stringify(event.data)}`);
        });

        eventSource.onerror = (error) => {
          this.errorCount++;
          this.logger.error(`Instance ${i} - EventSource failed: ${JSON.stringify(error)}`);
          eventSource.close();
        };
      }
    };

    for (let i = 1; i <= totalConnections; i += batchSize) {
      const endIndex = Math.min(i + batchSize - 1, totalConnections);
      await openBatch(i, endIndex);
      await this.delay(delayBetweenBatches);
    }

    this.logger.log('========Finished setting up all SSE connections========');
    this.logger.log(
      `========Listener setup Count :: Error: ${this.errorCount} Success: ${this.successCount}========`,
    );
  }

  // Helper function to introduce a delay
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
