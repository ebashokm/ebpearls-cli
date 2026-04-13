import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentNotificationType {
  Email = 'Email',
  App = 'App',
  Sms = 'Sms',
}

registerEnumType(AppointmentNotificationType, {
  name: 'AppointmentNotificationType',
});

export enum AppointmentStatus {
  upcoming = 'upcoming',
  checkedIn = 'checkedIn',
  noShow = 'noShow',
  cancelled = 'cancelled',
}

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
});

export enum BookedFromType {
  web = 'web',
  mobile = 'mobile',
  urlBuilder = 'urlBuilder',
}

registerEnumType(BookedFromType, { name: 'BookedByType' });

export enum EarlyAppointmentShifts {
  morning = 'Morning',
  afternoon = 'Afternoon',
  afterhours = 'After Hours',
}

registerEnumType(EarlyAppointmentShifts, {
  name: 'EarlyAppointmentShifts',
});

export enum UpdateAppointmentOption {
  thisOnly = 'thisOnly',
  thisAndFuture = 'thisAndFuture',
}

registerEnumType(UpdateAppointmentOption, {
  name: 'UpdateAppointmentOption',
});

export enum UpdateAppointmenAction {
  update = 'update',
  reschedule = 'reschedule',
}

registerEnumType(UpdateAppointmenAction, {
  name: 'UpdateAppointmentAction',
});

export enum CancelClassOption {
  thisOnly = 'thisOnly',
  thisAndFollowing = 'thisAndFollowing',
}

registerEnumType(CancelClassOption, {
  name: 'CancelClassOption',
});

export enum BookingsStatus {
  completed = 'completed',
  booked = 'booked',
  cancelled = 'cancelled',
  noShow = 'noShow',
}

registerEnumType(BookingsStatus, {
  name: 'BookingsStatus',
});

export enum CalendarActiveTabEnum {
  CLASS = 'classes',
  APPOINTMENT = 'appointments',
}
registerEnumType(CalendarActiveTabEnum, {
  name: 'CalendarActiveTabEnum',
});

export enum BusinessStatus {
  active = 'active',
  disabled = 'disabled',
  registered = 'registered',
}

registerEnumType(BusinessStatus, {
  name: 'BusinessStatus',
});

export enum ClassTypeStatus {
  Live = 'Live',
  Inactive = 'Inactive',
  Draft = 'Draft',
}

registerEnumType(ClassTypeStatus, {
  name: 'ClassTypeStatus',
});

export enum UserRoles {
  admin = 'admin',
  practitioner = 'practitioner',
  coach = 'coach',
  client = 'client',

  // internally used roles (for managing permissions)
  studentPractitioner = 'studentPractitioner',
  businessOwner = 'businessOwner',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
});
