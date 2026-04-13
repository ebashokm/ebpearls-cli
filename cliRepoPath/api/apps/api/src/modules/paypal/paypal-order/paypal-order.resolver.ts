import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PaypalOrderService } from './paypal-order.service';
import { PaypalOrder } from './model/paypal-order.schema';
import { CreatePaypalOrderInput } from './dto/input/create-paypal-order.input';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { UseGuards } from '@nestjs/common';
import { LoginDetail } from '@api/modules/auth/decorator/login.decorator';
import {
  CapturePaypalOrderResponse,
  CreatePaypalOrderResponse,
} from './dto/response/paypal-order.response';
import { PayPalOAuthTokenResponse } from './dto/response/paypal-oauth-token.response';
import { PaypalCoreService } from '@app/paypal-core/paypal-core.service';
import { CapturePaypalOrderInput } from './dto/input/capture-paypal-order.input';

@Resolver(() => CreatePaypalOrderResponse)
export class PaypalOrderResolver {
  constructor(
    private readonly paypalOrderService: PaypalOrderService,
    private readonly paypalService: PaypalCoreService,
  ) {}

  /**
   * Get PayPal OAuth Token
   * @returns PayPalOAuthTokenResponse
   */
  @Query(() => PayPalOAuthTokenResponse)
  @UseGuards(AuthUserGuard)
  async paypalGetOauthToken() {
    return await this.paypalService.getOauthToken();
  }

  /**
   * Create a PayPal order and return approval URL
   * @param createPaypalOrderInput
   * @returns
   */
  @Mutation(() => CreatePaypalOrderResponse, {
    description: 'Create a PayPal order and return approval URL',
  })
  @UseGuards(AuthUserGuard)
  async createPaypalOrder(@Args('input') input: CreatePaypalOrderInput, @LoginDetail() user) {
    return this.paypalOrderService.createOrder(input, user);
  }

  @Mutation(() => CapturePaypalOrderResponse, {
    description: 'Capture a PayPal order by ID',
  })
  @UseGuards(AuthUserGuard)
  async capturePaypalOrder(@Args('input') input: CapturePaypalOrderInput, @LoginDetail() user) {
    return this.paypalOrderService.captureOrder(input, user);
  }
}
