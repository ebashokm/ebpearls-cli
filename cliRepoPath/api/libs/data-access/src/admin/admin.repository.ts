import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { BaseRepo } from './../repository/base.repo';
import { Model, ProjectionType } from 'mongoose';
import { PaginationOptions } from '../repository/pagination.type';

@Injectable()
export class AdminRepository extends BaseRepo<AdminDocument> {
  constructor(@InjectModel(Admin.name) private readonly admin: Model<AdminDocument>) {
    super(admin);
  }

  async getAllAdmins(pageMeta: PaginationOptions, filter: any = {}) {
    const projection: ProjectionType<AdminDocument> = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      phone: 1,
      status: 1,
      roles: 1,
      roleDetails: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const pipelineStage = this.admin
      .aggregate()
      .match(filter)
      .lookup({
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roleDetails',
      })
      .project(projection)
      .pipeline();

    return this.aggregatePaginate(pipelineStage, pageMeta);
  }

  async getAdminByEmail(email: string) {
    return this.admin.findOne({
      email,
    });
  }

  async getAdminById(id: string) {
    return await this.admin
      .findById(id, {
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phone: 1,
        status: 1,
        roles: 1,
        roleDetails: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .populate('roleDetails');
  }
}
