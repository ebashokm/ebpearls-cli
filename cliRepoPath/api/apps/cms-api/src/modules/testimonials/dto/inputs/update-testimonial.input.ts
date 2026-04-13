import { CreateTestimonialDto } from './create-testimonial.input';
import { InputType, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateTestimonialDto
 * @typedef {UpdateTestimonialDto}
 * @extends {PartialType(CreateTestimonialDto)}
 */
@InputType()
export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
