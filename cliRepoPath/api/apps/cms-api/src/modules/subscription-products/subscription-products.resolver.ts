import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionProductsService } from './subscription-products.service';
import { CreateSubscriptionProductInput } from './dto/input/create-subscription-product.input';
import {
  PaginatedSubscriptionProductResponse,
  SubsProductResponse,
  SubscriptionProductResponse,
} from './dto/response/subscription-product.dto';
import { UpdateSubscriptionProductInput } from './dto/input/update-subscription-product.input';
import { BasePaginationParams } from '../../common/dto/base-pagination.dto';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionProductsResolver
 * @typedef {SubscriptionProductsResolver}
 */
@Resolver(() => SubsProductResponse)
export class SubscriptionProductsResolver {
  /**
   * Creates an instance of SubscriptionProductsResolver.
   *
   * @constructor
   * @param {SubscriptionProductsService} subscriptionProductsService
   */
  constructor(private readonly subscriptionProductsService: SubscriptionProductsService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateSubscriptionProductInput} body
   * @returns {Promise<any>}
   */
  @Mutation(() => SubscriptionProductResponse)
  @Permissions('create-subscription-product')
  async createSubscriptionProduct(
    @Args('body')
    body: CreateSubscriptionProductInput,
  ) {
    return this.subscriptionProductsService.create(body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {BasePaginationParams} body
   * @returns {Promise<any>}
   */
  @Permissions('list-subscription-product')
  @Query(() => PaginatedSubscriptionProductResponse, {
    name: 'findSubscriptionProducts',
  })
  async findSubscriptionProducts(@Args('body') body: BasePaginationParams) {
    return this.subscriptionProductsService.findAll(body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Permissions('get-subscription-product')
  @Query(() => SubsProductResponse, {
    name: 'findSubscriptionProduct',
    nullable: true,
  })
  async findSubscriptionProduct(@Args('id') id: string) {
    return this.subscriptionProductsService.findOne(id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {UpdateSubscriptionProductInput} body
   * @returns {Promise<any>}
   */
  @Mutation(() => SubscriptionProductResponse)
  @Permissions('update-subscription-product')
  async updateSubscriptionProduct(
    @Args('body')
    body: UpdateSubscriptionProductInput,
  ) {
    return this.subscriptionProductsService.update(body);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Permissions('delete-subscription-product')
  @Mutation(() => MessageResponse)
  async removeSubscriptionProduct(@Args('id') id: string) {
    return this.subscriptionProductsService.remove(id);
  }
}
