import { registerEnumType } from '@nestjs/graphql';
export enum AwsRegion {
  US_EAST_1 = 0,
  US_EAST_2 = 1,
  US_WEST_1 = 2,
  US_WEST_2 = 3,
  EU_WEST_1 = 4,
  EU_WEST_2 = 5,
  EU_WEST_3 = 6,
  EU_CENTRAL_1 = 7,
  AP_SOUTHEAST_1 = 8,
  AP_SOUTHEAST_2 = 9,
  AP_NORTHEAST_1 = 10,
  AP_NORTHEAST_2 = 11,
  SA_EAST_1 = 12,
  CA_CENTRAL_1 = 13,
  AP_SOUTH_1 = 14,
  CN_NORTH_1 = 15,
  CN_NORTHWEST_1 = 16,
  AF_SOUTH_1 = 18,
  AP_EAST_1 = 19,
  AP_NORTHEAST_3 = 20,
  EU_NORTH_1 = 21,
  ME_SOUTH_1 = 22,
  AP_SOUTHEAST_3 = 24,
  EU_SOUTH_1 = 25,
}

registerEnumType(AwsRegion, { name: 'AwsRegion' });