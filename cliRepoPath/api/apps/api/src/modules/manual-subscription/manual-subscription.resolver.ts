import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ManualSubscriptionService } from './manual-subscription.service';
import { CreateManualSubscriptionInput } from './dto/input/create-manual-subscription.input';
import {
  CreateManualSubscriptionResponse,
  ManualSubscriptionResponse,
} from './dto/response/manual-subscription.response';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { ActivateManualSubscriptionInput } from './dto/input/activate-manual-subscription.input';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { CancelSubscriptionInput } from './dto/input/cancel-manual-subscription.input';
import { PauseManualSubscriptionInput } from './dto/input/pause-manual-subscription.input';
import { ResumeManualSubscriptionInput } from './dto/input/resume-manual-subscription.input';

@Resolver(() => ManualSubscriptionResponse)
export class ManualSubscriptionResolver {
  constructor(private readonly manualSubscriptionService: ManualSubscriptionService) {}

  @Mutation(() => CreateManualSubscriptionResponse)
  @UseGuards(AuthUserGuard)
  createManualSubscription(
    @Args('input')
    input: CreateManualSubscriptionInput,
    @LoginDetail() user,
  ) {
    return this.manualSubscriptionService.createSubscription(input, user);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  captureManualPaypalOrder(
    @Args('orderId')
    orderId: string,
    @LoginDetail() user,
  ) {
    return this.manualSubscriptionService.capturePaypalOrder(orderId, user);
  }

  @Mutation(() => ManualSubscriptionResponse)
  @UseGuards(AuthUserGuard)
  activateManualSubscription(
    @Args('input')
    input: ActivateManualSubscriptionInput,
    @LoginDetail() user,
  ) {
    return this.manualSubscriptionService.activateSubscriptionAfterPayment(input);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  cancelManualSubscription(
    @Args('input')
    input: CancelSubscriptionInput,
    @LoginDetail() user,
  ) {
    return this.manualSubscriptionService.cancelSubscription(input, user);
  }

  @Query(() => [ManualSubscriptionResponse])
  @UseGuards(AuthUserGuard)
  getUserManualSubscriptions(@LoginDetail() user) {
    return this.manualSubscriptionService.getUserSubscriptions(user.userId);
  }

  @Mutation(() => ManualSubscriptionResponse)
  @UseGuards(AuthUserGuard)
  pauseManualSubscription(@Args('input') input: PauseManualSubscriptionInput, @LoginDetail() user) {
    return this.manualSubscriptionService.pauseSubscription(input, user.userId);
  }

  @Mutation(() => ManualSubscriptionResponse)
  @UseGuards(AuthUserGuard)
  resumeManualSubscription(
    @Args('input') input: ResumeManualSubscriptionInput,
    @LoginDetail() user,
  ) {
    return this.manualSubscriptionService.resumeSubscription(input, user.userId);
  }
}
