import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UsersRepository } from '@app/data-access';
import {
  PageWithVersion,
  PageWithVersionRepository,
  PageWithVersionSchema,
} from '@app/data-access/pageWithVersion';
import { PageWithVersionResolver } from './pageWithVersion.resolver';
import { PageWithVersionService } from './pageWithVersion.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PageWithVersion.name,
        schema: PageWithVersionSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    PageWithVersionResolver,
    PageWithVersionService,
    PageWithVersionRepository,
    UsersRepository,
  ],
})
export class PageWithVersionModule {}
