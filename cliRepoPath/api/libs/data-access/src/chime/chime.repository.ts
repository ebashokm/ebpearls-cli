import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Chime, ChimeDocument } from './chime.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChimeRepository extends BaseRepo<ChimeDocument> {
  constructor(
    @InjectModel(Chime.name)
    private readonly chime: Model<ChimeDocument>,
  ) {
    super(chime);
  }
}
