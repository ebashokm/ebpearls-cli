import { InjectModel } from '@nestjs/mongoose';

import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';

import { EmailBuilder, EmailBuilderDocument } from './fancy-email-template.schema';

import { toMongoId } from '@app/common/helpers/mongo-helper';

import { ListEmailTemplatesDTO } from '@cms-api/modules/fancy-email-template/dto/input/list-email.builder.dto';
import { generateSearchRegex } from '@app/common/helpers/genericFunction';

export class FancyEmailTemplateRepository extends BaseRepo<EmailBuilderDocument> {
  projection;
  constructor(@InjectModel(EmailBuilder.name) private readonly model: Model<EmailBuilderDocument>) {
    super(model);
  }

  async findAll() {
    return this.model.find();
  }

  async listEmailBuilderTemplates(input: ListEmailTemplatesDTO) {
    const stages: any = [{ $sort: { createdAt: -1 } }];
    if (input.searchText) {
      const searchRegex = generateSearchRegex(input.searchText);

      stages.push({
        $match: {
          name: {
            $regex: `${searchRegex}`,
            $options: 'i',
          },
        },
      });
    }

    const res = await this.aggregatePaginate(stages, input.pageMeta);

    return res;
  }
}
