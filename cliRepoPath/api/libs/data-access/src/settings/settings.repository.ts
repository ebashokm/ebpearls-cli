import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from './../repository/base.repo';
import { Settings, SettingsDocument } from './settings.schema';

@Injectable()
export class SettingsRepository extends BaseRepo<SettingsDocument> {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {
    super(settingsModel);
  }
}
