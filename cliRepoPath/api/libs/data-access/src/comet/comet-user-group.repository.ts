import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { CometUserGroup, CometUserGroupDocument } from './comet-user-group.schema';
import { Model } from 'mongoose';

@Injectable()
export class CometUserGroupRepository extends BaseRepo<CometUserGroupDocument> {
  constructor(
    @InjectModel(CometUserGroup.name)
    private readonly cometUserGroup: Model<CometUserGroupDocument>,
  ) {
    super(cometUserGroup);
  }
}
