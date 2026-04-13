import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './appointment.schema';

@Injectable()
export class AppointmentRepository extends BaseRepo<AppointmentDocument> {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointment: Model<AppointmentDocument>,
  ) {
    super(appointment);
  }
}
