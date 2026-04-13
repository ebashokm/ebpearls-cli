import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBusinessUserInput } from './dto/create-business-user.input';
import { BusinessRepository, UsersRepository } from '@app/data-access';
import { I18nService } from 'nestjs-i18n';
import { GetAllBusinessInputDTO } from './dto/list-business.input';
import { Order } from '@app/common/enum/pagination';
import { UpdateBusinessUserInput } from './dto/update-business-user.input';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { BusinessResponse } from './dto/business.response';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BusinessService
 * @typedef {BusinessService}
 */
@Injectable()
export class BusinessService {
  /**
   * Creates an instance of BusinessService.
   *
   * @constructor
   * @param {BusinessRepository} businessRepository
   * @param {UsersRepository} userRepository
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UsersRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description creates a new business
   * @param {CreateBusinessUserInput} createBusinessUserInput - business user data
   * @returns
   */
  @Transactional()
  async create(createBusinessUserInput: CreateBusinessUserInput) {
    const { email, name, userId } = createBusinessUserInput;
    try {
      const existingBusiness = await this.businessRepository.findOne({
        email,
      });

      if (existingBusiness) {
        throw new BadRequestException(
          this.i18nService.t('common.already_exists', { args: { entity: 'Business' } }),
        );
      }

      const createData = {
        name,
        email,
        userId,
      };

      const business = await this.businessRepository.create(createData);
      await this.userRepository.updateOne({ _id: userId }, { businessId: business._id });
      return business;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * Update business
   *
   * @async
   * @param {UpdateBusinessUserInput} updateBusinessUserInput
   * @returns {unknown}
   */
  @Transactional()
  async update(updateBusinessUserInput: UpdateBusinessUserInput) {
    const { email, name, id } = updateBusinessUserInput;
    try {
      const business = await this.businessRepository.findOne({
        _id: toMongoId(id),
      });

      if (!business) {
        throw new BadRequestException(
          this.i18nService.t('common.not_found', { args: { entity: 'Business' } }),
        );
      }

      const updateData = {
        name,
        email,
      };

      return await this.businessRepository.updateById(id, updateData, { new: true });
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  async findById(id: string) {
    try {
      return await this.businessRepository.findById(id);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {{}} [input={\}]
   * @returns {Promise<any>\}
   */
  async findAll(input: GetAllBusinessInputDTO) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit,
        skip,
        order,
        orderBy,
      };

      /* create filter pipeline */
      const filter = {
        $or: [
          { name: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
        ],
      };

      return await this.businessRepository.getAllBusiness(filter, pageMeta);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @description deletes a business user
   * @param {string} id - business user id
   * @returns
   */
  @Transactional()
  async delete(id: string): Promise<{
    message: string;
  }> {
    try {
      const businessUser = await this.businessRepository.findById(id);
      if (!businessUser) {
        throw new BadRequestException(
          this.i18nService.t('common.not_exist', { args: { entity: 'Business user' } }),
        );
      }
      await this.businessRepository.softDeleteById(id);
      return {
        message: this.i18nService.t('common.delete_success', { args: { entity: 'Business user' } }),
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
