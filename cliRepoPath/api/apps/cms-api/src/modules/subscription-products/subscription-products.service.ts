import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionProductInput } from './dto/input/create-subscription-product.input';
import { UpdateSubscriptionProductInput } from './dto/input/update-subscription-product.input';
import { SubscriptionProductRepository, SubscriptionProduct } from '@app/data-access';
import {
  PaginatedSubscriptionProductResponse,
  SubsProductResponse,
  SubscriptionProductResponse,
} from './dto/response/subscription-product.dto';
import { BasePaginationParams } from '../../common/dto/base-pagination.dto';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { BillingCycleEnum } from './enum/subscription-products.enum';
import { BillingIntervalEnum } from '@app/common/enum/subscription.enum';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { StripeService } from '@app/stripe';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionProductsService
 * @typedef {SubscriptionProductsService}
 */
@Injectable()
export class SubscriptionProductsService {
  /**
   * Creates an instance of SubscriptionProductsService.
   *
   * @constructor
   * @param {SubscriptionProductRepository} subscriptionProductRepo
   * @param {StripeService} stripeService
   * @param {Model<SubscriptionProduct>} subscriptionProductModel
   */
  constructor(
    private readonly subscriptionProductRepo: SubscriptionProductRepository,
    private readonly stripeService: StripeService,
    @InjectModel('SubscriptionProduct')
    private readonly subscriptionProductModel: Model<SubscriptionProduct>,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description create subscription product
   * @param {CreateSubscriptionProductInput} createData create subscription product data
   * @returns
   */
  @Transactional()
  async create(createData: CreateSubscriptionProductInput): Promise<SubscriptionProductResponse> {
    const { productName, description, isActive, billingCycle, prices } = createData;

    try {
      const product = await this.stripeService.createProduct({
        name: productName,
        description,
        isActive,
      });

      const interval = BillingIntervalEnum.month; // default interval- month, can be changed by sending from client side
      let intervalCount = 1;
      if (billingCycle === BillingCycleEnum.QUARTERLY) {
        intervalCount = 3;
      } else if (billingCycle === BillingCycleEnum.BI_YEARLY) {
        intervalCount = 6;
      }

      const pricesPromises = [];
      for (const priceData of prices) {
        pricesPromises.push(
          this.stripeService.createPrice({
            price: priceData.price,
            currency: priceData.currency,
            productId: product.id,
            isActive,
            recurringOptions: {
              interval,
              intervalCount,
            },
          }),
        );
      }

      const stripePrices = await Promise.all(pricesPromises);

      for (const sp of stripePrices) {
        prices.forEach((price) => {
          if (price.price === sp.unit_amount / 100) {
            price['priceId'] = sp.id; // More readable than price['priceId']
          }
        });
      }

      const createSubscriptionProductData = {
        name: productName,
        billingCycle,
        productId: product.id,
        description,
        isActive,
        prices,
      };
      const subscriptionProduct = await this.subscriptionProductRepo.create(
        createSubscriptionProductData,
      );

      return {
        message: this.i18nService.t('common.create_success', {
          args: { entity: 'Subscription Product' },
        }),
        data: subscriptionProduct,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @description update the subscription product
   * @param {UpdateSubscriptionProductInput} updateData update data
   * @returns
   */
  @Transactional()
  async update(updateData: UpdateSubscriptionProductInput): Promise<SubscriptionProductResponse> {
    const { id, description, isActive, productName, prices, billingCycle } = updateData;
    try {
      const subscriptionProduct = await this.subscriptionProductRepo.findById(id);
      if (!subscriptionProduct) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', {
            args: { entity: 'Subscription product' },
          }),
        );
      }
      const stripeSubProduct = await this.stripeService.updateProduct(
        subscriptionProduct.productId,
        {
          description,
          isActive,
          name: productName,
        },
      );

      await this.stripeService.deletePrices(subscriptionProduct.productId);

      // Create updated prices for the product
      const newPricesPromise = [];
      for (const priceData of prices) {
        newPricesPromise.push(
          this.stripeService.createPrice({
            productId: stripeSubProduct.id,
            currency: priceData.currency,
            isActive: priceData.isActive,
            price: priceData.price,
          }),
        );
      }
      const newPrices = await Promise.all(newPricesPromise);

      for (const np of newPrices) {
        prices.forEach((p) => {
          if (p.price === np.unit_amount / 100) {
            p['priceId'] = np.id; // More readable than p['priceId']
          }
        });
      }

      const newUpdateData = {
        name: productName,
        billingCycle,
        productId: subscriptionProduct.productId,
        description,
        isActive,
        prices,
      };

      // update in database
      const updatedSubscriptionProduct = await this.subscriptionProductRepo.updateById(
        id,
        newUpdateData,
        {
          new: true,
        },
      );

      return {
        message: this.i18nService.t('common.update_success', {
          args: { entity: 'Subscription product' },
        }),
        data: updatedSubscriptionProduct,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @description find all subscription products
   * @param {BasePaginationParams} params - pagination params
   * @returns
   */
  async findAll(params: BasePaginationParams): Promise<PaginatedSubscriptionProductResponse> {
    const { searchText, orderBy, order, limit, skip } = params;
    const pageMeta = {
      limit,
      skip,
      order,
      orderBy,
    };

    const filter: FilterQuery<SubscriptionProduct> = {
      $or: [{ name: { $regex: searchText, $options: 'i' } }],
    };

    try {
      const { data, pagination } = await this.subscriptionProductRepo.getAllSubscriptions(
        filter,
        pageMeta,
      );
      return {
        message: this.i18nService.t('common.fetch_list_success', {
          args: { entity: 'Subscription product' },
        }),
        data,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description find one subscription product
   * @param {string} id ID of the subscription product
   * @returns {Promise<SubsProductResponse>}
   */
  async findOne(id: string): Promise<SubsProductResponse> {
    try {
      const subscriptionProduct = await this.subscriptionProductRepo.findOne({
        _id: id,
      });

      return subscriptionProduct;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * @description remove subscription product
   * @param {string} id  ID of the subscription product
   * @returns
   */
  @Transactional()
  async remove(id: string): Promise<MessageResponse> {
    const product = await this.subscriptionProductRepo.findOne({
      _id: id,
    });
    if (!product) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', {
          args: { entity: 'Subscription product' },
        }),
      );
    }
    await this.stripeService.deleteProduct(product.productId);

    const newPrices = [];
    product?.prices?.forEach((price) => {
      price.isActive = false;
      newPrices.push(price);
    });
    product.prices = newPrices;
    await this.subscriptionProductRepo.updateById(
      id,
      {
        isActive: false,
        prices: newPrices,
        isDeleted: true,
      },
      { new: true },
    );
    return {
      message: this.i18nService.t('common.deactivated', {
        args: { entity: 'Subscription product' },
      }),
    };
  }
}
