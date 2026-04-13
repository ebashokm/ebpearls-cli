import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepo } from './../repository/base.repo';
import { CoinPurchase, CoinPurchaseDocument } from './coin-purchase.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoinPurchaseRepository extends BaseRepo<CoinPurchaseDocument> {
  constructor(
    @InjectModel(CoinPurchase.name)
    private readonly coinPurchase: Model<CoinPurchaseDocument>,
  ) {
    super(coinPurchase);
  }
}
