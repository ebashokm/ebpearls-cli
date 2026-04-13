import { ContactsDocument } from '@app/data-access';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ContactSearchService {
  private readonly index: string;

  constructor(private readonly esService: ElasticsearchService) {
    this.index = process.env.ELASTICSEARCH_INDEX || 'contacts';
  }

  async createContactsIndex(): Promise<void> {
    try {
      const exists = await this.esService.indices.exists({ index: this.index });

      if (!exists) {
        await this.esService.indices.create({
          index: this.index,
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                userId: { type: 'keyword' },
                isUserRegistered: { type: 'boolean' },
                contactId: { type: 'keyword' },
                name: { type: 'text' },
                deviceId: { type: 'keyword' },
                status: { type: 'keyword' },
                phoneNumbers: {
                  type: 'nested',
                  properties: {
                    countryCode: { type: 'keyword' },
                    phoneNumber: { type: 'keyword' },
                    phoneNumberId: { type: 'keyword' },
                    uuid: { type: 'keyword' },
                  },
                },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' },
              },
            },
          },
        });

        console.log(`Index ${this.index} created successfully.`);
      } else {
        console.log(`Index ${this.index} already exists.`);
      }
    } catch (error) {
      throw new Error(`Failed to create index: ${error.message}`);
    }
  }

  async syncContacts(contacts: any): Promise<void> {
    try {
      const esBulkOps = contacts.map((contact) => ({
        update: {
          _index: this.index,
          _id: contact.contactId, // Use contactId as the document ID in Elasticsearch
          _source: true,
          doc_as_upsert: true,
          doc: {
            userId: contact.userId,
            isUserRegistered: contact.isUserRegistered,
            contactId: contact.contactId,
            name: contact.name,
            deviceId: contact.deviceId,
            status: contact.status || 'ACTIVE', // Assuming status is either in the contact or default to ACTIVE
            phoneNumbers: contact.phoneNumbers,
            createdAt: contact.createdAt || new Date(),
            updatedAt: new Date(),
          },
        },
      }));

      await this.esService.bulk({ body: esBulkOps });
    } catch (error) {
      throw new Error(`Failed to sync contact: ${error.message}`);
    }
  }

  async syncContact(data: ContactsDocument): Promise<void> {
    try {
      await this.esService.index({
        index: this.index,
        id: data.contactId,
        body: {
          userId: data.userId,
          // isUserRegistered: data.isUserRegistered,
          contactId: data.contactId,
          name: data.name,
          deviceId: data.deviceId,
          status: data.status,
          phoneNumbers: data.phoneNumbers,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      });
    } catch (error) {
      throw new Error(`Failed to sync contact: ${error.message}`);
    }
  }

  async searchContacts(
    search: string,
    userId: string,
    status?: string,
  ): Promise<ContactsDocument[]> {
    try {
      const result = await this.esService.search<ContactsDocument>({
        index: this.index,
        body: {
          query: {
            bool: {
              must: [
                { match: { userId } },
                {
                  bool: {
                    should: [
                      status ? { match: { status } } : {},
                      { match: { name: search } },
                      {
                        nested: {
                          path: 'phoneNumbers',
                          query: {
                            match: { 'phoneNumbers.phoneNumber': search },
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      });

      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      throw new Error(`Failed to search contacts: ${error.message}`);
    }
  }

  async updateContact(contactId: string, updateData: Partial<ContactsDocument>): Promise<void> {
    try {
      await this.esService.update({
        index: this.index,
        id: contactId,
        body: {
          doc: updateData,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }

  async removeContact(contactId: string): Promise<void> {
    try {
      await this.esService.deleteByQuery({
        index: this.index,
        body: {
          query: {
            match: {
              contactId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove contact: ${error.message}`);
    }
  }
}
