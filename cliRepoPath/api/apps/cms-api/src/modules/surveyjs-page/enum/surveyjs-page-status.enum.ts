import { registerEnumType } from '@nestjs/graphql';

export enum SurveyJsPageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(SurveyJsPageStatus, { name: 'SurveyJsPageStatus' });
