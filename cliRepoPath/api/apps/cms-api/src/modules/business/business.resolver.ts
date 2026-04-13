import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BusinessService } from './business.service';
import { CreateBusinessUserInput } from './dto/create-business-user.input';
import { ParseObjectIdPipe } from '@app/common/pipe/parse-mongoid.pipe';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { BusinessUser } from './dto/business-user.response';
import { GetAllBusinessInputDTO } from './dto/list-business.input';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BusinessResponse } from './dto/business.response';
import { UpdateBusinessUserInput } from './dto/update-business-user.input';
import { BusinessDocument } from '@app/data-access';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class BusinessResolver
 * @typedef {BusinessResolver}
 */
@Resolver(() => BusinessUser)
export class BusinessResolver {
  /**
   * Creates an instance of BusinessResolver.
   *
   * @constructor
   * @param {BusinessService} businessUserService
   */
  constructor(private readonly businessUserService: BusinessService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateBusinessUserInput} createBusinessUserInput
   * @returns {Promise<any>}
   */
  @Permissions('create-business')
  @Mutation(() => BusinessUser)
  async createBusinessUser(
    @Args('createBusinessUserInput')
    createBusinessUserInput: CreateBusinessUserInput,
  ): Promise<BusinessDocument> {
    return this.businessUserService.create(createBusinessUserInput);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateBusinessUserInput} createBusinessUserInput
   * @returns {Promise<any>}
   */
  @Permissions('get-business')
  @Query(() => BusinessUser)
  async getBusinessUser(
    @Args('id')
    id: string,
  ): Promise<BusinessDocument> {
    return this.businessUserService.findById(id);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateBusinessUserInput} createBusinessUserInput
   * @returns {Promise<any>}
   */
  @Permissions('update-business')
  @Mutation(() => BusinessUser)
  async updateBusinessUser(
    @Args('updateBusinessUserInput')
    updateBusinessUserInput: UpdateBusinessUserInput,
  ) {
    return this.businessUserService.update(updateBusinessUserInput);
  }

  /**
   * ${1:Description placeholder}
   *
   * @returns {*}
   */
  @Permissions('list-business')
  @Query(() => BusinessResponse, { name: 'listBusiness' })
  async listBusiness(@Args('input') input: GetAllBusinessInputDTO, @I18n() i18n: I18nContext) {
    const business = await this.businessUserService.findAll(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Business' } }),
      data: business?.data,
      pagination: business?.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Permissions('delete-business')
  @Mutation(() => MessageResponse)
  async deleteBusinessUser(@Args('id', new ParseObjectIdPipe()) id: string): Promise<{
    message: string;
  }> {
    return this.businessUserService.delete(id);
  }
}
