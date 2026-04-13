import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HomePageTemplateService } from './home-page-template.service';
import { CreateHomePageTemplateDto } from './dto/inputs/create-home-page-template.dto';
import { HomePageTemplateResponse } from './dto/response/home-page-template.response';
import { GetHomePageTemplateDto } from './dto/inputs/get-home-page-template.dto';
import { Permissions } from '../auth/decorator/permissions.decorator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class HomePageTemplateResolver
 * @typedef {HomePageTemplateResolver}
 */
@Resolver(() => HomePageTemplateResponse)
export class HomePageTemplateResolver {
  /**
   * Creates an instance of HomePageTemplateResolver.
   *
   * @constructor
   * @param {HomePageTemplateService} homePageTemplateService
   */
  constructor(readonly homePageTemplateService: HomePageTemplateService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateHomePageTemplateDto} input
   * @returns {Promise<{ message: any; template: any; }>\}
   */
  @Mutation(() => HomePageTemplateResponse)
  @Permissions('create-page')
  async createHomePage(@Args('input') input: CreateHomePageTemplateDto) {
    const template = await this.homePageTemplateService.create(input);
    return {
      message: 'Home Template created successfully',
      template,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetHomePageTemplateDto} input
   * @returns {Promise<{ message: any; templates: any; pagination: any; }>\}
   */
  @Query(() => HomePageTemplateResponse, { name: 'getAllHomePageList' })
  @Permissions('list-page')
  async findAll(@Args('input') input: GetHomePageTemplateDto) {
    const templatesList = await this.homePageTemplateService.getAllHomePageList(input);

    return {
      message: 'Home Template listings',
      templates: templatesList.data,
      pagination: templatesList.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {string} id
   * @returns {{ message: any; template: any; }\}
   */
  @Query(() => HomePageTemplateResponse, { name: 'getHomePageList' })
  @Permissions('get-page')
  findOne(@Args('id') id: string) {
    const template = this.homePageTemplateService.findOne(id);
    return { message: 'Home Template listings', template };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => HomePageTemplateResponse)
  @Permissions('delete-page')
  async removeHomePage(@Args('id') id: string) {
    await this.homePageTemplateService.remove(id);
    return { message: 'Home Template deleted successfully' };
  }
}
