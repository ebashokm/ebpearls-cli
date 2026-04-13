import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonials, TestimonialsDocument } from './testimonials.schema';
import { BaseRepo } from './../repository/base.repo';

@Injectable()
export class TestimonialsRepository extends BaseRepo<TestimonialsDocument> {
  projection;
  constructor(
    @InjectModel(Testimonials.name)
    private readonly model: Model<TestimonialsDocument>,
  ) {
    super(model);
  }

  async getTestimonialsList(filter, pageMeta) {
    this.projection = {
      _id: 1,
      text: 1,
      customer: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    return this.findWithPaginate(filter, pageMeta, this.projection);
  }
}
