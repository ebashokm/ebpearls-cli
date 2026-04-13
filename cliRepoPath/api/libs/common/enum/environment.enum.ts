import { registerEnumType } from '@nestjs/graphql';

export enum Environment {
  PRODUCTION = 'prod',
  DEVELOPMENT = 'development',
  STAGE = 'stage',
  UAT = 'uat',
  LOCAL = 'local',
}

registerEnumType(Environment, {
  name: 'Environment',
});
