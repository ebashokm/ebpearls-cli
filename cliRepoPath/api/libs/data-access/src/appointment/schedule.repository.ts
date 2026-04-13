import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';

import { Schedule, ScheduleDocument } from './schedule.schema';

@Injectable()
export class ScheduleRepository extends BaseRepo<ScheduleDocument> {
  constructor(
    @InjectModel(Schedule.name)
    private readonly schedule: Model<ScheduleDocument>,
  ) {
    super(schedule);
  }
}
