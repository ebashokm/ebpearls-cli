import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class UserEventsService {
  public readonly eventsSubject: Subject<any> = new Subject();
  private readonly userEventSubjects: Map<string, Subject<any>> = new Map();

  // Create a subject for a specific user
  public createUserEventSubject(userId: string): Subject<any> {
    const subject = new Subject();
    this.userEventSubjects.set(userId, subject);
    return subject;
  }

  // Get the subject for a specific user
  public getUserEventSubject(userId: string): Subject<any> | undefined {
    return this.userEventSubjects.get(userId);
  }

  // Send an event to a specific user
  public sendEventToUser(userId: string, data: any) {
    const subject = this.getUserEventSubject(userId);
    if (subject && subject.observed) {
      subject.next(data);
    } else {
      console.log(`No subscribers for user ${userId}. Event not sent.`);
    }
  }
}
