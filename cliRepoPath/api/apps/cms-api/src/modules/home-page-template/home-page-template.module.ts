import { Module } from '@nestjs/common';
import { HomePageTemplateService } from './home-page-template.service';
import { HomePageTemplateResolver } from './home-page-template.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HomePageTemplate,
  HomePageTemplateRepository,
  HomePageTemplateSchema,
} from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HomePageTemplateModule
 * @typedef {HomePageTemplateModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HomePageTemplate.name,
        schema: HomePageTemplateSchema,
      },
    ]),
  ],
  providers: [
    HomePageTemplateResolver,
    HomePageTemplateService,
    HomePageTemplateRepository,
  ],
})
export class HomePageTemplateModule {}
