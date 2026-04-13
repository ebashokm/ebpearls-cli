import { HomePageTemplateRepository } from '@app/data-access';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomePageTemplateDto } from './dto/inputs/create-home-page-template.dto';
import { GetHomePageTemplateDto } from './dto/inputs/get-home-page-template.dto';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HomePageTemplateService
 * @typedef {HomePageTemplateService}
 */
@Injectable()
export class HomePageTemplateService {
  /**
   * Creates an instance of HomePageTemplateService.
   *
   * @constructor
   * @param {HomePageTemplateRepository} repo
   */
  constructor(private readonly repo: HomePageTemplateRepository) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateHomePageTemplateDto} input
   * @returns {Promise<any>}
   */
  @Transactional()
  async create(input: CreateHomePageTemplateDto) {
    try {
      const {
        header: [header],
        ...others
      } = input;

      const { id, ...headerFields } = header;

      const template = await this.repo.create({
        ...headerFields,
        ...others,
      });
      return template;
    } catch (error) {
      throw new HttpException(
        'Keys must be unique. Apply unique keys and try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetHomePageTemplateDto} [input={}]
   * @returns {Promise<any>\}
   */
  async getAllHomePageList(input: GetHomePageTemplateDto = {}) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const meta = { limit, skip };
      const filter = [
        {
          $match: {
            isDeleted: { $ne: true },
            $or: [{ title: { $regex: searchText, $options: 'i' } }],
          },
        },
        {
          $sort: {
            [orderBy]: order === 'asc' ? -1 : 1,
          },
        },
      ];

      return await this.repo.getAllHomePageListings(meta, filter);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async findOne(id: string) {
    const target = await this.repo.findById(id);
    if (!target) {
      throw new NotFoundException('target id not found');
    }

    return target;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  @Transactional()
  async remove(id: string) {
    const target = await this.repo.softDeleteById(id);
    if (!target) {
      throw new NotFoundException('target id not found');
    }

    return target;
  }
}
