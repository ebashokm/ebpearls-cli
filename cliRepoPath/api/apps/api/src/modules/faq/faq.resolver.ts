import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetFAQDto } from './dto/inputs/get-faqs.dto';
import { FAQ, FAQResponse, FAQsResponse } from './dto/response/faq.response';
import { FAQService } from './faq.service';
import { I18n, I18nContext } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FaqResolver
 * @typedef {FaqResolver}
 */
@Resolver(() => FAQ)
export class FaqResolver {
  constructor(private readonly faqService: FAQService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetFAQDto} input
   * @returns {Promise<{ message: any; faqs: any; pagination: any; }>\}
   */
  @Query(() => FAQResponse)
  async getAllFAQ(@Args('input') input: GetFAQDto, @I18n() i18n: I18nContext) {
    const { data, pagination } = await this.faqService.getAllFAQ(input);

    return {
      message: i18n.t('faqs.faq_listing'),
      faqs: data,
      pagination,
    };
  }

  /**
   * @description find all the FAQs
   *
   * @async
   * @returns {Promise<{ message: any; faqs: any; pagination: string; }>\}
   */
  @Query(() => FAQsResponse)
  async findAllFAQ(@I18n() i18n: I18nContext) {
    const faqs = await this.faqService.findAllFaqs();

    return {
      message: i18n.t('faqs.faq_listing'),
      faqs: faqs,
      total: faqs.length,
    };
  }
}
