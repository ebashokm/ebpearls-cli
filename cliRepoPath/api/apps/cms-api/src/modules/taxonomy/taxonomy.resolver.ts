import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTaxonomyDTO } from './dto/input/create-taxonomy.dto';
import { TaxonResponse, TaxonomyResponse } from './dto/response/taxonomy.response';
import { TaxonomyService } from './taxonomy.service';
import { S3Service } from '@app/common/services/s3';
import { BasePaginationParams } from '../../common/dto/base-pagination.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { BadRequestException } from '@nestjs/common';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TaxonomyResolver
 * @typedef {TaxonomyResolver}
 */
@Resolver(() => TaxonomyResponse)
export class TaxonomyResolver {
  /**
   * Creates an instance of TaxonomyResolver.
   *
   * @constructor
   * @param {TaxonomyService} taxonomyService
   * @param {S3Service} s3service
   */
  constructor(
    private readonly taxonomyService: TaxonomyService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {BasePaginationParams} input
   * @returns {Promise<{ message: string; taxonomies: any; pagination: any; }>\}
   */
  @Query(() => TaxonomyResponse)
  @Permissions('list-taxonomy')
  async listTaxonomies(@Args('input') input: BasePaginationParams, @I18n() i18n: I18nContext) {
    const { data: taxonomies, pagination } = await this.taxonomyService.getAllTaxonomies(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Taxonomy' } }),
      taxonomies,
      pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateTaxonomyDTO} input
   * @returns {Promise<{ message: string; taxonomy: any; }>\}
   */
  @Mutation(() => TaxonomyResponse)
  @Permissions('create-taxonomy')
  async createTaxonomy(@Args('input') input: CreateTaxonomyDTO, @I18n() i18n: I18nContext) {
    try {
      const taxonomy = await this.taxonomyService.createTaxonomy(input);
      return {
        message: i18n.t('common.create_success', { args: { entity: 'Taxonomy' } }),
        taxonomy,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; taxonomy: any; }>\}
   */
  @Query(() => TaxonomyResponse)
  @Permissions('get-taxonomy')
  async listTaxonomy(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const taxonomy = await this.taxonomyService.listTaxonomy(id);
    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Taxonomy' } }),
      taxonomy,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: string; }>\}
   */
  @Mutation(() => TaxonResponse)
  @Permissions('delete-taxonomy')
  async deleteTaxonomy(@Args('id') id: string, @I18n() i18n: I18nContext) {
    await this.taxonomyService.deleteTaxonomy(id);
    return { message: i18n.t('common.delete_success', { args: { entity: 'Taxonomy' } }) };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {CreateTaxonomyDTO} input
   * @returns {Promise<{ message: string; taxonomy: any; }>\}
   */
  @Mutation(() => TaxonomyResponse)
  @Permissions('update-taxonomy')
  async updateTaxonomy(
    @Args('id') id: string,
    @Args('input') input: CreateTaxonomyDTO,
    @I18n() i18n: I18nContext,
  ) {
    try {
      const taxonomy = await this.taxonomyService.updateTaxonomy(id, input);
      return {
        message: i18n.t('common.update_success', { args: { entity: 'Taxonomy' } }),
        taxonomy,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
