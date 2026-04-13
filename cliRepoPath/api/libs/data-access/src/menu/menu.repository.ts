import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './menu.schema';
import { BaseRepo } from './../repository/base.repo';
import { PaginationOptions } from '../repository/pagination.type';

@Injectable()
export class MenuRepository extends BaseRepo<MenuDocument> {
  projection;
  constructor(@InjectModel(Menu.name) private readonly menu: Model<MenuDocument>) {
    super(menu);

    this.projection = {
      _id: 1,
      title: 1,
      menuPosition: 1,
      status: 1,
      updatedAt: 1,
      createdAt: 1,
      insensitiveTitle: { $toLower: '$title' },
    };
  }

  async getAllMenus(filter: any = {}, pageMeta: PaginationOptions) {
    return this.findWithPaginate(filter, pageMeta, { ...this.projection });
  }
}
