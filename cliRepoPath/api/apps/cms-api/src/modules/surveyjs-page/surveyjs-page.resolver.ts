import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { CreateSurveyJsPageInput } from './dto/input/create-surveyjs-page.input';
import { DuplicateSurveyJsPageInput } from './dto/input/duplicate-surveyjs-page.input';
import { GetAllSurveyJsPagesInputDTO } from './dto/input/list-surveyjs-page.input';
import { UpdateSurveyJsPageInput } from './dto/input/update-surveyjs-page.input';
import {
  SurveyJsPageResponse,
  SurveyJsPageListResponse,
} from './dto/response/surveyjs-page.response';
import { SurveyJsPageService } from './surveyjs-page.service';

@Resolver(() => SurveyJsPageResponse)
export class SurveyJsPageResolver {
  constructor(private readonly surveyJsPageService: SurveyJsPageService) {}

  @Mutation(() => SurveyJsPageResponse)
  @Permissions('create-page')
  createSurveyJsPage(@Args('body') body: CreateSurveyJsPageInput) {
    return this.surveyJsPageService.create(body);
  }

  @Mutation(() => SurveyJsPageResponse)
  @Permissions('update-page')
  updateSurveyJsPage(@Args('body') body: UpdateSurveyJsPageInput) {
    return this.surveyJsPageService.update(body);
  }

  @Query(() => SurveyJsPageListResponse, { name: 'findAllSurveyJsPages' })
  @Permissions('list-page')
  async findAllSurveyJsPages(
    @Args('input') input: GetAllSurveyJsPagesInputDTO,
    @I18n() i18n: I18nContext,
  ) {
    return this.surveyJsPageService.findAll(input);
  }

  @Query(() => SurveyJsPageResponse, { name: 'surveyJsPage' })
  @Permissions('get-page')
  findOne(@Args('id') id: string) {
    return this.surveyJsPageService.findOne(id);
  }

  @Mutation(() => MessageResponse)
  @Permissions('delete-page')
  removeSurveyJsPage(@Args('id') id: string) {
    return this.surveyJsPageService.remove(id);
  }

  @Mutation(() => SurveyJsPageResponse)
  @Permissions('duplicate-page')
  async duplicateSurveyJsPage(@Args('input') input: DuplicateSurveyJsPageInput) {
    return this.surveyJsPageService.duplicatePage(input);
  }

  @Query(() => Boolean)
  async checkSurveyJsPageSlugExistence(@Args('slug') slug: string): Promise<boolean> {
    return this.surveyJsPageService.checkSlugExistence(slug);
  }
}
