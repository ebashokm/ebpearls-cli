import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from './contacts.schema';
import { ContactsRepository } from './contacts.repository';
import { User, UserSchema, UsersRepository } from '../user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contacts.name, schema: ContactsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UsersRepository, ContactsRepository],
  exports: [UsersRepository, ContactsRepository, MongooseModule],
})
export class ContactsDataModule {}
