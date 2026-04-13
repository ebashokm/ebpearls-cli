import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { PurchasePlatform } from '../../subscription/enum/subscription-platform.enum';

@ObjectType()
export class CurrentSubscription {
  @Field(() => PurchasePlatform)
  @Prop({ type: PurchasePlatform })
  purchasePlatform: PurchasePlatform;

  @Field({ nullable: true })
  @Prop()
  isTrailPeriod: boolean;

  @Field({ nullable: true })
  @Prop()
  originalTransactionId: string;

  @Field()
  @Prop()
  purchaseDate: Date;

  @Field({ nullable: true })
  @Prop()
  isAutoRenewing: boolean;

  @Field()
  @Prop()
  expirationDate: Date;

  @Field({ nullable: true })
  @Prop()
  isCancelled: boolean;

  @Field({ nullable: true })
  @Prop()
  cancellationDate: Date;

  @Field({ nullable: true })
  @Prop()
  environment: string;

  @Field()
  @Prop()
  packageName: string;
}
