import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Model } from 'mongoose';
import { PaginationOptions } from '../repository/pagination.type';
import { CommunicationEmail, CommunicationEmailDocument } from './communication-email.schema';

export class CommunicationEmailRepository extends BaseRepo<CommunicationEmailDocument> {
  projection;
  constructor(
    @InjectModel(CommunicationEmail.name) private readonly model: Model<CommunicationEmailDocument>,
  ) {
    super(model);
  }
}
