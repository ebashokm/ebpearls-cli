import { Taxonomy, TaxonomySchema } from '@app/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from './providers';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TaxonomyModule
 * @typedef {TaxonomyModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Taxonomy.name, schema: TaxonomySchema }])],
  providers: providers,
})
export class TaxonomyModule {}
