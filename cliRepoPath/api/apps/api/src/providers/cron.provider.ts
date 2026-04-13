import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CronProvider
 * @typedef {CronProvider}
 */
@Module({
  imports: [ScheduleModule.forRoot()],
})
export class CronProvider {}
