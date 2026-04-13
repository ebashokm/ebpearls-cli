import { ModelDefinition } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './contacts';
import { User, UserSchema } from './user';
import {
  AdminBlock,
  AdminBlockSchema,
  Appointment,
  AppointmentInstance,
  AppointmentInstanceSchema,
  AppointmentSchema,
  AppointmentSettings,
  AppointmentSettingsSchema,
  AppointmentType,
  AppointmentTypeSchema,
  CalenderFilter,
  CalenderFilterSchema,
  Locations,
  LocationsSchema,
  Schedule,
  ScheduleSchema,
  Timezone,
  TimezoneSchema,
} from './appointment';
import { Business, BusinessSchema } from './business';
import { AuditLog, AuditLogSchema } from './audit-log';

export const dataAccessModels: ModelDefinition[] = [
  { name: Contacts.name, schema: ContactsSchema },
  { name: User.name, schema: UserSchema },
  { name: Appointment.name, schema: AppointmentSchema },
  { name: AppointmentInstance.name, schema: AppointmentInstanceSchema },
  { name: AppointmentType.name, schema: AppointmentTypeSchema },
  { name: AppointmentSettings.name, schema: AppointmentSettingsSchema },
  { name: CalenderFilter.name, schema: CalenderFilterSchema },
  { name: Business.name, schema: BusinessSchema },
  { name: Timezone.name, schema: TimezoneSchema },
  { name: Schedule.name, schema: ScheduleSchema },
  { name: AdminBlock.name, schema: AdminBlockSchema },
  { name: Locations.name, schema: LocationsSchema },
  { name: AuditLog.name, schema: AuditLogSchema },
];
