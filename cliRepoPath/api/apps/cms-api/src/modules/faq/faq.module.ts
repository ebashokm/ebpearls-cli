import { FAQ, FAQRepository, FaqSchema } from '@app/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FaqResolver } from './faq.resolver';
import { FAQService } from './faq.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FaqModule
 * @typedef {FaqModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: FAQ.name, schema: FaqSchema }])],
  providers: [FaqResolver, FAQService, FAQRepository],
})
export class FaqModule {}
