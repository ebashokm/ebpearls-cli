import { PageRepository } from '@app/data-access';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PagesService
 * @typedef {PagesService}
 */
@Injectable()
export class PagesService {
  /**
   * Creates an instance of PagesService.
   *
   * @constructor
   * @param {PageRepository} pagesRepository
   */
  constructor(private readonly pagesRepository: PageRepository) {}

  async getPageBySlug(slug: string): Promise<any> {
    try {
      const page = await this.pagesRepository.findOne({
        slug,
      });
      return { page: page };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
