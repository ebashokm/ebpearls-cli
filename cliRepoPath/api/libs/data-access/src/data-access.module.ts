import { Module } from '@nestjs/common';
import { DataAccessService } from './data-access.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactsRepository } from './contacts';
import { UsersRepository } from './user';
import {
  AdminBlockRepository,
  AppointmentRepository,
  AppointmentSettingsRepository,
  CalendarFilterRepository,
  LocationsRepository,
  ScheduleRepository,
  TimezoneRepository,
} from './appointment';
import { AppointmentInstanceRepository } from './appointment/appointment-instance.repository';
import { AppointmentTypeRepository } from './appointment/appointment-type.repository';
import { dataAccessModels } from './data-access.models';
import { BusinessRepository } from './business';

@Module({
  imports: [
    // Register schemas with Mongoose
    MongooseModule.forFeature(dataAccessModels),
  ],
  providers: [
    UsersRepository,
    ContactsRepository,
    DataAccessService,
    AppointmentRepository,
    AppointmentInstanceRepository,
    AppointmentTypeRepository,
    AppointmentSettingsRepository,
    CalendarFilterRepository,
    BusinessRepository,
    TimezoneRepository,
    ScheduleRepository,
    LocationsRepository,
    AdminBlockRepository,
  ],
  exports: [
    UsersRepository,
    ContactsRepository,
    MongooseModule,
    DataAccessService,
    AppointmentRepository,
    AppointmentInstanceRepository,
    AppointmentTypeRepository,
    AppointmentSettingsRepository,
    CalendarFilterRepository,
    BusinessRepository,
    TimezoneRepository,
    ScheduleRepository,
    LocationsRepository,
    AdminBlockRepository,
  ],
})
export class DataAccessModule {}
