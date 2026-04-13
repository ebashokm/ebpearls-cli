import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from './providers';
import { AdvancePage, AdvancePageSchema } from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PageModule
 * @typedef {PageModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: AdvancePage.name, schema: AdvancePageSchema }])],
  providers: providers,
})
export class AdvancePageModule {}
