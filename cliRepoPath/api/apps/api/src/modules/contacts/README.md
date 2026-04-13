## Description

Contact Sync Module

## Installation

Contact Sync Module module come with initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/api/src/modules/contacts folder


- Remove folowing code from apps/api/src/app.module.ts
```bash
import { ContactsModule } from './modules/contacts/contacts.module';

and ContactsModule from import array

and ContactsModule from include array of graphql
```

### Resolver Methods
- findAll
- findOne
- getFromContactIdAndPhoneNumberId
- removeContacts
- removeContacts

### Controller Methods
- uploadContacts

  Endpoint is POST /upload-contacts/upload
  In body file, deviceId to be send. File must be JSON file.

Example file format:
```bash
{
  "deletedContacts": [],
  "contacts": [
    {
      "contactId": "F57C8277-585D-4327-88A6-B5689FF69DFE",
      "name": "Anna Haro",
      "phoneNumbers": [
        {
          "phoneNumberId": "8E126115-DA29-439E-8CBE-7F0BD06ED62B",
          "phoneNumber": "5555228242",
          "countryCode": ""
        }
      ]
    },
    {
      "contactId": "64248D78-C46B-4258-95F9-1E021D468E53:ABPerson",
      "phoneNumbers": [
        {
          "phoneNumberId": "DF1ED72A-5654-421B-B467-F7A462E829AB",
          "phoneNumber": "11121312312",
          "countryCode": ""
        },
        {
          "phoneNumber": "3123123123",
          "phoneNumberId": "4CDDE8FF-EA68-4B74-9AB3-604AA3D1E976",
          "countryCode": ""
        }
      ],
      "name": "Test"
    }
  ]
}
```

BullMq is used for queue and all the queue list can be seen in https://dev-et-api.draftserver.com/queues