import { AppointmentResolver } from './resolver/appointment.resolver';
import { AppointmentService } from './service/appointment.service';

export const providers = [
  /* resolvers */
  AppointmentResolver,

  /* services */
  AppointmentService,
];
