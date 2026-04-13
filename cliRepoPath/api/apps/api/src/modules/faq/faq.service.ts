import { FAQRepository } from '@app/data-access';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetFAQDto } from './dto/inputs/get-faqs.dto';
import { Order } from '@app/common/enum/pagination';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FAQService
 * @typedef {FAQService}
 */
@Injectable()
export class FAQService {
  /**
   * Creates an instance of FAQService.
   *
   * @constructor
   * @param {FAQRepository} faqRepository
   */
  constructor(private readonly faqRepository: FAQRepository) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async findAllFaqs() {
    const faqs = await this.faqRepository.find({}, {}, { sort: { createdAt: -1 } });
    return faqs;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetFAQDto} [input={}]
   * @returns {Promise<any>\}
   */
  async getAllFAQ(input: GetFAQDto = {}) {
    const { searchText, orderBy, order, limit, skip } = input;
    try {
      const pageMeta = { limit, skip, orderBy, order };

      const filter = {
        $or: [{ section: { $regex: searchText, $options: 'i' } }],
      };

      return await this.faqRepository.getAllFAQs(filter, pageMeta);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
