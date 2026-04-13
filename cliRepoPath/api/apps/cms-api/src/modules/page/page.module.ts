import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Page,
  PageRepository,
  PageSchema,
  User,
  UserSchema,
  UsersRepository,
} from '@app/data-access';
import { PageResolver } from './page.resolver';
import { PageService } from './page.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Page.name,
        schema: PageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [PageResolver, PageService, PageRepository, UsersRepository],
})
export class PageModule {}
