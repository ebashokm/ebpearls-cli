import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateFAQDto } from './dto/inputs/create-faq.dto';
import { GetFAQDto } from './dto/inputs/get-faqs.dto';
import { UpdateFAQDto } from './dto/inputs/update-faq.dto';
import { FAQ, FAQResponse } from './dto/response/faq.response';
import { FAQService } from './faq.service';
import { NotFoundException } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FaqResolver
 * @typedef {FaqResolver}
 */
@Resolver(() => FAQ)
export class FaqResolver {
  /**
   * Creates an instance of FaqResolver.
   *
   * @constructor
   * @param {FAQService} faqService
   */
  constructor(private readonly faqService: FAQService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateFAQDto} input
   * @returns {Promise<{ message: any; faq: any; }>\}
   */
  @Mutation(() => FAQResponse)
  @Permissions('create-faq')
  async createFAQ(@Args('input') input: CreateFAQDto, @I18n() i18n: I18nContext) {
    const faq = await this.faqService.create(input);
    return { message: i18n.t('common.create_success', { args: { entity: 'FAQ' } }), faq };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateFAQDto} input
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => FAQResponse)
  @Permissions('update-faq')
  async updateFAQ(
    @Args('docId') id: string,
    @I18n() i18n: I18nContext,
    @Args('input') input: UpdateFAQDto,
  ) {
    await this.faqService.updateFAQ(id, input);
    return { message: i18n.t('common.update_success', { args: { entity: 'FAQ' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} section
   * @param {string} id
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => FAQResponse)
  @Permissions('delete-faq')
  async deleteFAQ(
    @Args('section') section: string,
    @I18n() i18n: I18nContext,
    @Args('faqId') id: string,
  ) {
    await this.faqService.removeFAQ(section, id);
    return { message: i18n.t('common.remove_success', { args: { entity: 'FAQ' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => FAQResponse)
  @Permissions('delete-faq')
  async deleteAllFAQs(@I18n() i18n: I18nContext) {
    await this.faqService.deleteMany();
    return { message: i18n.t('common.delete_all_success', { args: { entity: 'FAQ' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} docId
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => FAQResponse)
  @Permissions('delete-faq')
  async deleteFAQById(@Args('docId') docId: string, @I18n() i18n: I18nContext) {
    await this.faqService.deleteFAQById(docId);
    return { message: i18n.t('common.delete_success', { args: { entity: 'FAQ' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} docId
   * @returns {Promise<{ message: any; faq: any; }>\}
   */
  @Query(() => FAQResponse)
  @Permissions('get-faq')
  async getFAQ(@Args('docId') docId: string, @I18n() i18n: I18nContext) {
    const [faq] = await this.faqService.getFAQ(docId);
    if (!faq) {
      throw new NotFoundException(i18n.t('common.not_exist', { args: { entity: 'FAQ' } }));
    }

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'FAQ' } }),
      faq,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetFAQDto} input
   * @returns {Promise<{ message: any; faqs: any; pagination: any; }>\}
   */
  @Query(() => FAQResponse)
  @Permissions('list-faq')
  async getAllFAQ(@Args('input') input: GetFAQDto, @I18n() i18n: I18nContext) {
    const { data, pagination } = await this.faqService.getAllFAQ(input);

    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'FAQ' } }),
      faqs: data,
      pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<{ message: any; faqs: any; pagination: string; }>\}
   */
  @Query(() => FAQResponse)
  @Permissions('list-faq')
  async findAllFAQ(@I18n() i18n: I18nContext) {
    const faqs = await this.faqService.findAllFaqs();

    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'FAQ' } }),
      faqs: faqs,
      pagination: '',
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} section
   * @returns {Promise<{ message: any; faqs: any; }>\}
   */
  @Query(() => FAQResponse)
  @Permissions('get-faq')
  async getFAQBySection(@Args('section') section: string, @I18n() i18n: I18nContext) {
    const faqs = await this.faqService.getFAQBySection(section);
    return { message: i18n.t('common.fetch_detail_success', { args: { entity: 'FAQ' } }), faqs };
  }
}
