import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/inputs/create-testimonial.input';
import { UpdateTestimonialDto } from './dto/inputs/update-testimonial.input';
import { TestimonialsResponse } from './dto/response/testimonials.response';
import { GetTestimonialsDto } from './dto/inputs/get-testimonials.dto';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { S3Service } from '@app/common/services/s3';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { Testimonial } from './entities/testimonial.entity';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TestimonialsResolver
 * @typedef {TestimonialsResolver}
 */
@Resolver(() => Testimonial)
export class TestimonialsResolver {
  /**
   * Creates an instance of TestimonialsResolver.
   *
   * @constructor
   * @param {TestimonialsService} testimonialsService
   * @param {S3Service} s3service
   */
  constructor(
    private readonly testimonialsService: TestimonialsService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateTestimonialDto} input
   * @returns {Promise<{ message: any; testimonial: any; }>\}
   */
  @Mutation(() => TestimonialsResponse)
  @Permissions('create-testimonial')
  async createTestimonial(
    @Args('input')
    input: CreateTestimonialDto,
    @I18n() i18n: I18nContext,
  ) {
    const target = await this.testimonialsService.create(input);

    return {
      message: i18n.t('common.create_success', { args: { entity: 'Testimonial' } }),
      testimonial: target,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetTestimonialsDto} input
   * @returns {Promise<{ message: any; testimonials: any; pagination: any; }>\}
   */
  @Query(() => TestimonialsResponse, { name: 'GetAllTestimonials' })
  @Permissions('list-testimonial')
  async findAll(@Args('input') input: GetTestimonialsDto, @I18n() i18n: I18nContext) {
    const list = await this.testimonialsService.findAll(input);
    return {
      message: i18n.t('common.fetch_list_success', { args: { entity: 'Testimonial' } }),
      testimonials: list.data,
      pagination: list.pagination,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; testimonial: any; }>\}
   */
  @Query(() => TestimonialsResponse, { name: 'GetTestimonial' })
  @Permissions('get-testimonial')
  async findOne(@Args('id') id: string, @I18n() i18n: I18nContext) {
    const target = await this.testimonialsService.findOne(id);

    if (target.customer[0].image.objectKey) {
      const objectKey = target.customer[0].image.objectKey;
      const prefixedObjectKey = `public/testimonials/${id}/${objectKey}`;
      const contentType = target.customer[0].image.contentType;
      const imageUrl = await this.s3service.getPreSignedUrl(
        prefixedObjectKey,
        SignedUrlMethod.GET,
        contentType,
      );

      target.customer[0].image = {
        name: target.customer[0].image.name,
        objectKey,
        contentType,
        url: imageUrl,
      };
    } else {
      target.customer[0].image = {
        name: undefined,
        objectKey: undefined,
        contentType: undefined,
        url: undefined,
      };
    }

    return {
      message: i18n.t('common.fetch_detail_success', { args: { entity: 'Testimonial' } }),
      testimonial: target,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateTestimonialDto} input
   * @returns {Promise<{ message: any; testimonial: any; }>\}
   */
  @Mutation(() => TestimonialsResponse)
  @Permissions('update-testimonial')
  async updateTestimonial(
    @Args('id') id: string,
    @Args('input')
    input: UpdateTestimonialDto,
    @I18n() i18n: I18nContext,
  ) {
    const updatedTarget = await this.testimonialsService.update(id, input);
    return {
      message: i18n.t('common.update_success', { args: { entity: 'Testimonial' } }),
      testimonial: updatedTarget,
    };
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<{ message: any; }>\}
   */
  @Mutation(() => TestimonialsResponse)
  @Permissions('delete-testimonial')
  async removeTestimonial(@Args('id') id: string, @I18n() i18n: I18nContext) {
    await this.testimonialsService.remove(id);
    return {
      message: i18n.t('common.delete_success', { args: { entity: 'Testimonial' } }),
    };
  }
}
