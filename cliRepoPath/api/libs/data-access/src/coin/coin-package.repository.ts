import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { CoinPackage, CoinPackageDocument } from './coin-package.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoinPackageRepository extends BaseRepo<CoinPackageDocument> {
  constructor(
    @InjectModel(CoinPackage.name)
    private readonly coinPackage: Model<CoinPackageDocument>,
  ) {
    super(coinPackage);
  }
}
