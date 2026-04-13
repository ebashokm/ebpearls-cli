import { TaxonomyRepository } from '@app/data-access';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaxonomyDTO } from './dto/input/create-taxonomy.dto';
import { I18nService } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TaxonomyService
 * @typedef {TaxonomyService}
 */
@Injectable()
export class TaxonomyService {
  /**
   * Creates an instance of TaxonomyService.
   *
   * @constructor
   * @param {TaxonomyRepository} taxonomyRepository
   */
  constructor(
    private readonly taxonomyRepository: TaxonomyRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateTaxonomyDTO} input
   * @returns {Promise<any>}
   */
  async createTaxonomy(input: CreateTaxonomyDTO) {
    try {
      const newTaxonomy = await this.taxonomyRepository.create(input);
      if (!newTaxonomy) {
        throw new BadRequestException(
          this.i18nService.t('common.invalid_inputs', { args: { entity: 'taxonomy' } }),
        );
      }
      return newTaxonomy;
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async listTaxonomy(id: string) {
    const taxonomy = await this.taxonomyRepository.findById(id);
    if (!taxonomy) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Taxonomy' } }),
      );
    }
    return taxonomy;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteTaxonomy(id: string) {
    const taxonomy = await this.taxonomyRepository.softDeleteById(id);
    if (!taxonomy) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Taxonomy' } }),
      );
    }
    await this.taxonomyRepository.deleteById(id);
    return true;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} input
   * @returns {Promise<any>}
   */
  async getAllTaxonomies(input) {
    const { orderBy, order, limit, skip } = input;

    const pageMeta = {
      limit,
      skip,
      order,
      orderBy,
    };

    return await this.taxonomyRepository.getTaxonomies(null, pageMeta);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {CreateTaxonomyDTO} input
   * @returns {Promise<any>}
   */
  async updateTaxonomy(id: string, input: CreateTaxonomyDTO) {
    const taxonomy = await this.taxonomyRepository.findById(id);
    if (!taxonomy) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Taxonomy' } }),
      );
    }

    const updatedTaxonomy = await this.taxonomyRepository.updateById(id, input);
    if (!updatedTaxonomy) {
      throw new BadRequestException(
        this.i18nService.t('common.invalid_inputs', { args: { entity: 'taxonomy' } }),
      );
    }
    return updatedTaxonomy;
  }
}
