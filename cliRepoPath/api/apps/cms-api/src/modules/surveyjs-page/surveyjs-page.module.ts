import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminRepository,
  AdminSchema,
  SurveyJsPage,
  SurveyJsPageRepository,
  SurveyJsPageSchema,
  User,
  UserSchema,
  UsersRepository,
} from '@app/data-access';
import { SurveyJsPageResolver } from './surveyjs-page.resolver';
import { SurveyJsPageService } from './surveyjs-page.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SurveyJsPage.name,
        schema: SurveyJsPageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  providers: [
    SurveyJsPageResolver,
    SurveyJsPageService,
    SurveyJsPageRepository,
    UsersRepository,
    AdminRepository,
  ],
})
export class SurveyJsPageModule {}
