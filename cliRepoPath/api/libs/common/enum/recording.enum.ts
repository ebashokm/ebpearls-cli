import { registerEnumType } from '@nestjs/graphql';
export enum Recording {
    recording = 'recording',
    completed = 'completed',
    stopped = 'stopped',
    failed = 'failed',
}

registerEnumType(Recording, {
  name: 'Recording',
});