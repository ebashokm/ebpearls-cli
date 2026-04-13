export type PassportVerificationInput = {
  //Birth date of passport holder, format: YYYY-MM-DD
  BirthDate: string;

  //Gender of passport holder, format: M, F, X, OR BLANK
  Gender: string;

  //Passport number. Either one or two alpha characters followed by seven numeric characters. No spaces
  TravelDocumentNumber: string;

  //Given name of passport holder, max 31 characters
  GivenName: string;

  //Family name of passport holder, max 31 characters
  FamilyName: string;

  //Optional. Date passport expires, format: YYYY-MM-DD
  ExpiryDate: string;
};

export type MedicareVerificationInput = {
  //Birth date of the card holder, format: YYYY-MM-DD
  BirthDate: string;

  //Card number, min 10 characters
  CardNumber: string;

  //One of `Y` (Yellow), `G` (Green) or `B` (Blue)
  CardType: string;

  //Date of card expiry, format: Blue and Yellow Card Type: YYYY-MM-DD Green Card Type: YYYY-MM
  CardExpiry: string;

  //IRN of the person on card being validated, appears to the left of name on the card
  IndividualReferenceNumber: number;

  //Includes given name, middle initial (if any) and family name
  FullName1: string;
  FullName2?: string;
  FullName3?: string;
  FullName4?: string;
};

export type DriverLicenceVerificationInput = {
  //Birth date of citizen, format: YYYY-MM-DD OR YYYY-MM OR YYYY
  BirthDate: string;

  //Driver's Licence card number. This field is now mandatory for all states
  CardNumber: string;

  //State the license was issued in, must be one of: NSW, QLD, SA, TAS, VIC, WA, ACT, NT
  StateOfIssue: string;

  //Driver's licence number
  LicenceNumber: string;

  //First name of citizen, max 20 characters
  GivenName: string;

  //Optional. Middle name of citizen, max 20 characters
  MiddleName?: string;

  //Last name of citizen, max 40 characters
  FamilyName: string;
};

export type NzDriverLicenceVerificationInput = {
  BirthDate: string;

  //Driver licence number
  LicenseVersion: string;

  //Driver licence version number
  LicenseNumber: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
};

export type NzPassportVerificationInput = {
  //Date of birth, preferred format: yyyy/mm/dd
  DateOfBirth: string;

  //Passport number, format: 7-9 characters
  TravelDocumentNumber: string;
  GivenName: string;
  FamilyName: string;

  //Date the Passport expires, preferred format: yyyy/mm/dd
  TravelDocumentExpiryDate?: string;
};
