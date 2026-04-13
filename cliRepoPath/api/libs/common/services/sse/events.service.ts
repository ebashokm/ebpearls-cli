import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventsService {
  public readonly eventsSubject: Subject<any> = new Subject();

  sendEvent(data: any) {
    if (this.eventsSubject.observed) {
      console.log('Sending event:', data);
      this.eventsSubject.next(data);
    } else {
      console.log('No subscribers available. Event not sent.');
    }
  }
}
