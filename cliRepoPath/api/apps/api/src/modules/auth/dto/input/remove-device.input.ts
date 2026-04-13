// device-info/dto/remove-device.input.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RemoveDeviceInput {
  @Field(() => String)
  deviceId: string;

  @Field(() => String, { nullable: true })
  userId?: string; // optional: only needed if admin removing someone else's device
}
