import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeviceDto {
  @Field()
  deviceId: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  deviceName?: string;

  @Field({ nullable: true })
  deviceType?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  lastActive?: Date;

  @Field(() => [String], { nullable: true })
  tokenTypes?: string[];
}
