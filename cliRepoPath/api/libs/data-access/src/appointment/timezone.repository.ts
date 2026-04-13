import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';

import { Timezone, TimezoneDocument } from './time-zone.schema';

@Injectable()
export class TimezoneRepository extends BaseRepo<TimezoneDocument> {
  constructor(
    @InjectModel(Timezone.name)
    private readonly timeZone: Model<TimezoneDocument>,
  ) {
    super(timeZone);
  }
}
