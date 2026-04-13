import { CreateManualSubscriptionInput } from './create-manual-subscription.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateManualSubscriptionInput extends PartialType(CreateManualSubscriptionInput) {
  @Field(() => Int)
  id: number;
}
