import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TestimonialsService } from './testimonials.service';
import { TestimonialsResolver } from './testimonials.resolver';
import { Testimonials, TestimonialsRepository, TestimonialsSchema } from '@app/data-access';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TestimonialsModule
 * @typedef {TestimonialsModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Testimonials.name, schema: TestimonialsSchema }])],
  providers: [TestimonialsResolver, TestimonialsService, S3Service, TestimonialsRepository],
})
export class TestimonialsModule {}
