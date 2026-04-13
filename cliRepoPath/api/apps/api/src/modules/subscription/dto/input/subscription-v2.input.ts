import { Field, InputType } from '@nestjs/graphql';
import { AndroidReceipt, IosReceipt } from './validate-receipt.input';

@InputType()
export class SubscribeDtoV2 {
  @Field(() => AndroidReceipt, { nullable: true })
  androidRecieptData: AndroidReceipt;

  @Field(() => AndroidReceipt, { nullable: true })
  iosRecieptData: IosReceipt;

  @Field(() => String)
  platform: string;
}
