import { Page, PageRepository, PageSchema } from '@app/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesResolver } from './pages.resolver';
import { PagesService } from './pages.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PagesModule
 * @typedef {PagesModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Page.name,
        schema: PageSchema,
      },
    ]),
  ],
  providers: [PagesResolver, PagesService, PageRepository],
  exports: [],
})
export class PagesModule {}
