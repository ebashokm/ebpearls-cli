import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Taxonomy, TaxonomyDocument } from './taxonomy.schema';
import { BaseRepo } from './../repository/base.repo';

@Injectable()
export class TaxonomyRepository extends BaseRepo<TaxonomyDocument> {
  projection;

  constructor(
    @InjectModel(Taxonomy.name)
    private readonly taxonomies: Model<TaxonomyDocument>,
  ) {
    super(taxonomies);
  }

  async getTaxonomies(filter, pageMeta) {
    this.projection = {
      _id: 1,
      name: 1,
      createdAt: 1,
      updatedAt: 1,
      lowerCaseName: { $toLower: '$name' },
    };

    return this.findWithPaginate(filter, pageMeta, this.projection);
  }
}
