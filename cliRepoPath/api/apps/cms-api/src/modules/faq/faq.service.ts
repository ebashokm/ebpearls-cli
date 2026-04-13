import { FAQRepository } from '@app/data-access';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFAQDto } from './dto/inputs/create-faq.dto';
import { UpdateFAQDto } from './dto/inputs/update-faq.dto';
import { GetFAQDto } from './dto/inputs/get-faqs.dto';
import * as mongoose from 'mongoose';
import { Order } from '../../common/enum/pagination.enum';
import { I18nService } from 'nestjs-i18n';
import { Transactional } from '@nestjs-cls/transactional';

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
  constructor(
    private readonly faqRepository: FAQRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateFAQDto} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async create(input: CreateFAQDto) {
    try {
      const { section, description, content } = input;

      await this.faqRepository.updateOne(
        { section },
        { section, description, $push: { content: { $each: content } } },
        { upsert: true },
      );

      return await this.faqRepository.findOne({ section });
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} docId
   * @param {UpdateFAQDto} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async updateFAQ(docId: string, input: UpdateFAQDto) {
    try {
      return await this.faqRepository.updateOne({ _id: docId }, { $set: { ...input } });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} section
   * @param {string} id
   * @returns {Promise<void>}
   */
  @Transactional()
  async removeFAQ(section: string, id: string) {
    try {
      await this.faqRepository.updateOne(
        { $and: [{ section }, { 'content._id': id }] },
        { $unset: { 'content.$': '' } },
      );

      await this.faqRepository.updateMany({ section }, { $pull: { content: null } });

      return;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async deleteMany() {
    return await this.faqRepository.deleteMany({});
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} docId
   * @returns {Promise<void>}
   */
  @Transactional()
  async deleteFAQById(docId: string) {
    const faq = await this.faqRepository.softDeleteById(docId);
    if (!faq) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'FAQ' } }),
      );
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} docId
   * @returns {Promise<any>}
   */
  async getFAQ(docId: string) {
    try {
      const filter = {
        _id: new mongoose.Types.ObjectId(docId),
      };

      return this.faqRepository.getFAQ(filter);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<any>}
   */
  async findAllFaqs() {
    return await this.faqRepository.find({}, {}, { sort: { createdAt: -1 } });
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

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} section
   * @returns {Promise<any>}
   */
  async getFAQBySection(section: string) {
    try {
      return await this.faqRepository.find({ section });
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
