export type AppointmentRecord = {
  _id: string;
  type: 'appointment';
  title: string;
  date: Date;
  isUnavailableBlock: boolean;
  startTime: Date;
  endTime: Date;
  color: string;
  user: {
    _id: string;
    fullName: string;
    profilePicture: string;
  };
  client: {
    _id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  locationTimezone: string;
  unavailableBlockNote: string;
  fullyPaid: boolean;
  status: string;
  bookedFrom: string;
  appointmentNotes: string;
  address: string;
  note: string;
  isFirstAppointment: boolean;
  confirmationStatus: string;
};
