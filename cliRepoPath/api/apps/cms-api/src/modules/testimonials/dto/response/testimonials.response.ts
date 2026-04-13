import { Field, ObjectType } from '@nestjs/graphql';
import { Testimonial } from '../../entities/testimonial.entity';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class TestimonialsResponse
 * @typedef {TestimonialsResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class TestimonialsResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?Testimonial[]}
   */
  @Field(() => [Testimonial], { nullable: true })
  testimonials?: Testimonial[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?Testimonial}
   */
  @Field(() => Testimonial, { nullable: true })
  testimonial?: Testimonial;
}
