import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { CreateSubscriptionPlanInput } from './dto/input/create-subscription-plan.input';
import { UpdateSubscriptionPlanInput } from './dto/input/update-subscription-plan.input';
import { SubscriptionPlan, SubscriptionPlanRepository } from '@app/data-access/subscription-plan';
import { SubscriptionPlanStatus } from '@app/data-access/subscription-plan/enum/subscription-plan.enum';
import { DeleteSubscriptionPlanInput } from './dto/input/delete-subscription-plan.input';
import { BasePaginationParams } from '@cms-api/common/dto/base-pagination.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    private readonly i18nService: I18nService,
  ) {}
  async create(input: CreateSubscriptionPlanInput) {
    const { slug } = input;
    try {
      const existingPlan = await this.subscriptionPlanRepository.findOne({ slug });
      console.log(existingPlan, 'existingPlan');
      if (existingPlan) {
        throw new BadRequestException('Subscription plan with this slug already exists.');
      }
      const createData = {
        ...input,
        status: SubscriptionPlanStatus.ACTIVE,
      };
      return this.subscriptionPlanRepository.create(createData);
    } catch (error) {
      throw error;
    }
  }

  async update(input: UpdateSubscriptionPlanInput) {
    const { _id } = input;
    try {
      const plan = await this.subscriptionPlanRepository.findById(_id);
      if (!plan) {
        throw new NotFoundException('Subscription plan not found.');
      }

      if (plan.status === SubscriptionPlanStatus.ARCHIVED) {
        throw new BadRequestException('Cannot update archived plan');
      }

      const updatedPlan = await this.subscriptionPlanRepository.findOneAndUpdate(
        {
          _id,
        },
        {
          ...input,
        },
        {
          new: true,
        },
      );
      return updatedPlan;
    } catch (error) {
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      return await this.subscriptionPlanRepository.findOne({ slug });
    } catch (error) {
      throw error;
    }
  }

  async findAll(input: BasePaginationParams) {
    const { searchText, orderBy, order, limit, skip } = input;
    const pageMeta = {
      limit,
      skip,
      order,
      orderBy,
    };

    const filter: FilterQuery<SubscriptionPlan> = {
      $or: [{ name: { $regex: searchText, $options: 'i' } }],
    };
    try {
      const { data, pagination } = await this.subscriptionPlanRepository.findWithPaginate(
        filter,
        pageMeta,
      );
      return {
        message: this.i18nService.t('common.fetch_list_success', {
          args: { entity: 'Subscription plan' },
        }),
        data,
        pagination,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(input: DeleteSubscriptionPlanInput) {
    const { planId } = input;
    try {
      const plan = await this.subscriptionPlanRepository.findById(planId);
      if (!plan) {
        throw new NotFoundException('Subscription plan not found.');
      }

      await this.subscriptionPlanRepository.deleteById(planId);
      return {
        message: this.i18nService.t('common.delete_success', {
          args: { entity: 'Subscription plan' },
        }),
      };
    } catch (error) {
      throw error;
    }
  }
}
