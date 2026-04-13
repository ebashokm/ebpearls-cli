export interface PhoneNumbers {
  //countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  phoneNumberId: string;
  isUserRegistered?: boolean;
}

export interface ContactData {
  contactId: string;
  phoneNumbers: PhoneNumbers[];
  name: string;
}

export interface InsertContactData extends ContactData {
  deviceId: string;
  userId: string;
}

export interface SyncContactData {
  userId: string;
  deviceId: string;
  contacts: ContactData[];
}
