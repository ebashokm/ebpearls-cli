import { TestimonialsDocument, TestimonialsRepository } from '@app/data-access';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTestimonialDto } from './dto/inputs/create-testimonial.input';
import { UpdateTestimonialDto } from './dto/inputs/update-testimonial.input';
import { GetTestimonialsDto } from './dto/inputs/get-testimonials.dto';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { I18nService } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TestimonialsService
 * @typedef {TestimonialsService}
 */
@Injectable()
export class TestimonialsService {
  /**
   * Creates an instance of TestimonialsService.
   *
   * @constructor
   * @param {TestimonialsRepository} repo
   * @param {S3Service} s3Service
   */
  constructor(
    private readonly repo: TestimonialsRepository,
    private readonly s3Service: S3Service,
    private readonly i18nService: I18nService,
  ) {}
  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {CreateTestimonialDto} input
   * @returns {Promise<any>}
   */
  async create(input: CreateTestimonialDto) {
    const existingTestimonial = await this.repo.findOneWithSoftDeleted({ text: input.text });

    if (existingTestimonial) {
      const messageKey = existingTestimonial.isDeleted
        ? 'common.exists_but_deleted'
        : 'common.already_exists';

      throw new BadRequestException(
        this.i18nService.t(messageKey, { args: { entity: 'Headline' } }),
      );
    }

    const testimonial = await this.repo.create(input);
    const imageKey = testimonial?.customer[0]?.image?.name;
    if (imageKey) {
      const newImageKey = `public/testimonials/${String(testimonial._id)}/${imageKey}`;
      await this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${imageKey}`, newImageKey);
      testimonial.customer[0].image.url = await this.s3Service.getPreSignedUrl(
        newImageKey,
        SignedUrlMethod.GET,
      );
    }
    return testimonial;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetTestimonialsDto} input
   * @returns {Promise<any>}
   */
  async findAll(input: GetTestimonialsDto) {
    try {
      const { searchText, orderBy, order, limit, skip } = input;

      const pageMeta = {
        limit,
        skip,
        order,
        orderBy,
      };

      const filter = {
        $or: [{ text: { $regex: searchText, $options: 'i' } }],
      };

      return await this.repo.getTestimonialsList(filter, pageMeta);
    } catch (error) {
      throw new HttpException(
        this.i18nService.t('common.something_went_wrong'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async findOne(id: string): Promise<TestimonialsDocument> {
    const target = await this.repo.findById(id);
    if (!target) {
      throw new NotFoundException(this.i18nService.t('taxanomy.target_not_found'));
    }
    return target;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {UpdateTestimonialDto} input
   * @returns {Promise<any>}
   */
  async update(id: string, input: UpdateTestimonialDto): Promise<TestimonialsDocument> {
    const { customer, text } = input;
    const imageKey = customer[0]?.image?.name;
    const contentType = customer[0]?.image?.contentType;

    const target = await this.repo.findById(id);

    const ifNewTextTestimonial = target?.text !== text;

    if (ifNewTextTestimonial) {
      const ifTestimonialAlreadyExists = await this.repo.findOneWithSoftDeleted({
        text,
      });

      if (ifTestimonialAlreadyExists) {
        const messageKey = ifTestimonialAlreadyExists.isDeleted
          ? 'common.exists_but_deleted'
          : 'common.already_exists';

        throw new BadRequestException(
          this.i18nService.t(messageKey, { args: { entity: 'Headline' } }),
        );
      }
    }

    let isFileUpdated;
    const updates = {
      ...input,
    };
    const prevImageKey = target?.customer[0]?.image?.name;
    if (imageKey !== undefined && imageKey !== prevImageKey) {
      isFileUpdated = true;
      updates.customer[0].image = {
        name: imageKey,
        contentType,
        objectKey: imageKey,
      };

      await this.s3Service.deleteKey(`public/testimonials/${id}/${prevImageKey}`);
    }
    const updated = await this.repo.updateById(id, updates, { new: true });

    if (updated?.customer[0]?.image?.name) {
      const newImageKey = `public/testimonials/${id}/${imageKey}`;
      if (isFileUpdated) {
        await this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${imageKey}`, newImageKey);
      }
      updated.customer[0].image.url = await this.s3Service.getPreSignedUrl(
        newImageKey,
        SignedUrlMethod.GET,
      );
    }
    return updated;
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async remove(id: string): Promise<any> {
    try {
      return await this.repo.softDeleteById(id);
    } catch (error) {
      throw new HttpException(
        this.i18nService.t('taxanomy.target_not_found'),
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
