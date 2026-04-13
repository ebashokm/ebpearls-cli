import { toMongoId } from '@app/common/helpers/mongo-helper';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Contacts, ContactsDocument } from './contacts.schema';

@Injectable()
export class ContactsRepository extends BaseRepo<ContactsDocument> {
  constructor(
    @InjectModel(Contacts.name)
    private readonly contacts: Model<ContactsDocument>,
  ) {
    super(contacts);
  }

  async bulkWrite(contacts) {
    this.contacts.bulkWrite(contacts);
  }

  async updateConactRegisteredFlag(userId: string, contactsArray: string[]) {
    // Fetch the contacts that contain any of the phone numbers in the array
    const contacts = await this.contacts.find({
      userId: toMongoId(userId),
      'phoneNumbers.fullPhoneNumber': { $in: contactsArray },
      //'phoneNumbers.phoneNumber': { $in: [    '+61253652365'] }
    });

    const bulkOps = contacts.map((contact) => {
      const updatedPhoneNumbers = contact.phoneNumbers.map((phoneNumberObj) => {
        if (contactsArray.includes(phoneNumberObj.fullPhoneNumber)) {
          return {
            ...phoneNumberObj,
            isPhoneRegistered: true,
          };
        }
        return phoneNumberObj;
      });

      return {
        updateOne: {
          filter: { _id: contact._id },
          update: { $set: { phoneNumbers: updatedPhoneNumbers } },
        },
      };
    });

    if (bulkOps.length > 0) {
      await this.contacts.bulkWrite(bulkOps);
      console.log('Bulk update completed successfully.');
    } else {
      console.log('No matching contacts found for the bulk update.');
    }
  }

  // {
  //   "mappings": {
  //     "dynamic": false,
  //     "fields": {
  //       "contactId": {
  //         "type": "string"
  //       },
  //       "deviceId": {
  //         "type": "string"
  //       },
  //       "name": [
  //         {
  //           "analyzer": "lucene.swedish",
  //           "minGrams": 4,
  //           "tokenization": "nGram",
  //           "type": "autocomplete"
  //         }
  //       ],
  //       "phoneNumbers": {
  //         "dynamic": true,
  //         "type": "document"
  //       },
  //       "phoneNumbers.fullPhoneNumbers": [
  //         {
  //           "analyzer": "lucene.swedish",
  //           "minGrams": 4,
  //           "tokenization": "nGram",
  //           "type": "autocomplete"
  //         }
  //       ],
  //       "phoneNumbers.phoneNumber": [
  //         {
  //           "analyzer": "lucene.swedish",
  //           "minGrams": 4,
  //           "tokenization": "nGram",
  //           "type": "autocomplete"
  //         }
  //       ],
  //       "phoneNumbers.phoneNumberId": {
  //         "type": "string"
  //       },
  //       "status": {
  //         "type": "string"
  //       },
  //       "userId": {
  //         "type": "objectId"
  //       }
  //     }
  //   }
  // }

  async getAllContacts(deviceId: string, userId: string, meta, sort, searchText = '') {
    const stages = [];
    const mustFilter = [];
    const filter = [];
    const compound: any = {};

    // Add the search text filter

    if (deviceId) {
      filter.push({
        text: {
          path: 'deviceId',
          query: [deviceId],
        },
      });
    }

    filter.push({
      text: {
        path: 'status',
        query: ['ACTIVE'],
      },
    });

    if (userId) {
      mustFilter.push({
        equals: {
          path: 'userId',
          value: toMongoId(userId),
        },
      });
    }

    if (searchText && searchText != '') {
      mustFilter.push({
        compound: {
          should: [
            {
              autocomplete: {
                query: searchText,
                path: 'name',
              },
            },
            {
              autocomplete: {
                query: searchText,
                path: 'phoneNumbers.phoneNumber',
              },
            },
            {
              autocomplete: {
                query: searchText,
                path: 'phoneNumbers.fullPhoneNumbers',
              },
            },
          ],
        },
      });
    }

    compound.filter = filter;
    compound.must = mustFilter;

    // Add the $search stage
    stages.push({
      $search: {
        index: 'contactSearch',
        compound: compound,
      },
    });

    // Add the $unwind stage
    stages.push({ $unwind: '$phoneNumbers' });

    // Add the $project stage
    stages.push({
      $project: {
        score: { $meta: 'searchScore' },
        contactId: 1,
        deviceId: 1,
        isUserRegistered: 1,
        name: 1,
        fullPhoneNumber: '$phoneNumbers.fullPhoneNumber',
        phoneNumber: '$phoneNumbers.phoneNumber',
        phoneNumberId: '$phoneNumbers.phoneNumberId',
        isPhoneRegistered: '$phoneNumbers.isPhoneRegistered',
        userId: 1,
        _id: 1,
      },
    });

    // Add the $sort stage

    if (!sort || sort == '') {
      sort = { sort: -1 };
    }
    stages.push({
      $sort: sort,
    });

    // Return the aggregated results with pagination
    return this.aggregatePaginate(stages, meta);
  }

  async findOneFromContactIdAndPhoneNumberId(
    deviceId: string,
    contactId: string,
    phoneNumber: string,
  ) {
    const result = await this.aggregate([
      {
        $match: {
          contactId: contactId,
          deviceId: deviceId,
        },
      },
      {
        $unwind: '$phoneNumbers',
      },
      {
        $match: {
          'phoneNumbers.phoneNumber': phoneNumber,
        },
      },
      {
        $project: {
          _id: 1,
          contactId: 1,
          deviceId: 1,
          fullPhoneNumber: '$phoneNumbers.fullPhoneNumber',
          phoneNumberId: '$phoneNumbers.phoneNumberId',
          phoneNumber: '$phoneNumbers.phoneNumber',
          userId: 1,
          __v: 1,
          createdAt: 1,
          name: 1,
          status: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result[0];
  }
}
