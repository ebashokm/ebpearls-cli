import { Injectable } from '@nestjs/common';
import {
  AnyKeys,
  Document,
  FilterQuery,
  Model,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  Types,
  SaveOptions,
  InsertManyOptions,
  mongo,
  MongooseBaseQueryOptions,
  AggregateOptions,
} from 'mongoose';

type ObjectId = Types.ObjectId;
import { Order } from './pagination.enum';
import { PaginatedResult } from './pagination.type';

@Injectable()
export class BaseRepo<T extends Document> {
  private readonly _model: Model<T>;
  constructor(_model: Model<T>) {
    this._model = _model;
  }

  private getSoftDeleteFilter(): FilterQuery<T> {
    return {
      $and: [
        { $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }] },
        { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      ],
    };
  }

  async create(doc: AnyKeys<T> | T, options?: SaveOptions): Promise<T> {
    return await new this._model(doc).save(options);
  }

  async createMany(doc: any, options?: InsertManyOptions): Promise<any> {
    return await this._model.insertMany(doc, options);
  }

  async findOne(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this._model.findOne({ ...filter, ...this.getSoftDeleteFilter() }, projection, options);
  }

  async findById(
    id: string,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this._model.findOne({ _id: id, ...this.getSoftDeleteFilter() }, projection, options);
  }

  async find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): Promise<T[]> {
    return this._model.find({ ...filter, ...this.getSoftDeleteFilter() }, projection, options);
  }

  async updateOne(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ) {
    return this._model.updateOne(filter, update, options);
  }

  async findOneAndUpdate(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this._model.findOneAndUpdate(filter, update, options);
  }

  async updateMany(
    filter?: FilterQuery<T>,
    update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ) {
    return this._model.updateMany(filter, update, options);
  }

  async updateById(
    id: ObjectId | string,
    update: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, update, options);
  }

  async deleteOne(
    filter?: FilterQuery<T>,
    options?: (mongo.DeleteOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<any> {
    return this._model.deleteOne(filter, options);
  }

  async deleteById(id: ObjectId | string, options?: QueryOptions<T>): Promise<T | null> {
    return this._model.findByIdAndDelete(id, options);
  }

  async deleteMany(
    filter?: FilterQuery<T>,
    options?: mongo.DeleteOptions & MongooseBaseQueryOptions<T>,
  ): Promise<any> {
    return this._model.deleteMany(filter, options);
  }

  async findWithPaginate(
    filters: FilterQuery<T>,
    paginationOptions: { skip: number; limit: number; orderBy?: string; order?: string },
    projection?: ProjectionType<T> | null,
  ): Promise<PaginatedResult<T>> {
    const { skip, limit, orderBy, order } = paginationOptions;

    const sort: any = {};
    if (orderBy && order) sort[orderBy] = order === Order.ASC ? 1 : -1;

    filters = { ...filters, ...this.getSoftDeleteFilter() };

    const query = this._model.find(filters, projection);

    if (sort) query.sort(sort);

    query.skip(skip).limit(limit);

    const result = await query;

    const total = await this._model.countDocuments(filters);

    return {
      data: result,
      pagination: {
        total,
        hasNextPage: total > skip + limit,
      },
    };
  }

  async aggregate(stages: PipelineStage[], options?: AggregateOptions): Promise<any[]> {
    return this._model.aggregate([{ $match: this.getSoftDeleteFilter() }, ...stages], options);
  }

  async aggregatePaginate(
    stages: PipelineStage[],
    {
      skip,
      limit,
      orderBy,
      order,
    }: { skip: number; limit: number; orderBy?: string; order?: string },
  ) {
    const baseStages = [{ $match: this.getSoftDeleteFilter() }, ...stages];

    if (orderBy && order) {
      const sort = {};
      sort[orderBy] = order === Order.ASC ? 1 : -1;
      baseStages.push({ $sort: sort });
    }

    const data = await this._model.aggregate([...baseStages, { $skip: skip }, { $limit: limit }]);
    const total = await this.totalAggregate(baseStages);

    return {
      data,
      pagination: {
        total,
        hasNextPage: total > skip + limit,
      },
    };
  }

  // Note: Old code may need in feature
  // async aggregate(stages: PipelineStage[]): Promise<any[]> {
  //   return this._model.aggregate(stages);
  // }
  // async aggregatePaginate(
  //   stages: PipelineStage[],
  //   paginationOptions: { skip: number; limit: number },
  // ) {
  //   const { skip, limit } = paginationOptions;
  //   const facetData: any = [{ $skip: skip }, { $limit: limit }];
  //   stages.push({
  //     $facet: {
  //       pagination: [{ $count: 'total' }],
  //       data: facetData,
  //     },
  //   });
  //   const aggregationResult = await this._model.aggregate(stages);
  //   const total = aggregationResult[0].pagination[0] ? aggregationResult[0].pagination[0].total : 0;
  //   const hasNextPage = total - (skip + limit) > 0;
  //   return {
  //     data: aggregationResult[0].data,
  //     pagination: {
  //       total,
  //       hasNextPage,
  //     },
  //   };
  // }

  async softDelete(
    filter?: FilterQuery<T>,
    options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<any> {
    return this._model.updateMany(filter, { deletedAt: new Date(), isDeleted: true }, options);
  }

  async softDeleteById(
    id: ObjectId | string,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<any> {
    return this._model.updateOne({ _id: id }, { deletedAt: new Date(), isDeleted: true }, options);
  }

  async restoreSoftDeleted(
    id: ObjectId | string,
    options?: (mongo.UpdateOptions & MongooseUpdateQueryOptions<T>) | null,
  ): Promise<any> {
    return this._model.updateOne({ _id: id }, { deletedAt: null, isDeleted: false }, options);
  }

  async findSoftDeleteById(id: ObjectId | string, options?: QueryOptions<T>): Promise<any> {
    return this._model.findOne(
      { _id: id, deletedAt: { $ne: null }, isDeleted: true },
      null,
      options,
    );
  }

  async findSoftDeleted(): Promise<any> {
    return this._model.find({ deletedAt: { $ne: null }, isDeleted: true });
  }

  async findWithSoftDeleted(): Promise<any> {
    return this._model.find({});
  }

  async findOneWithSoftDeleted(
    filter?: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null> {
    return this._model.findOne(filter, projection, options);
  }

  async total(filter: FilterQuery<T>): Promise<number> {
    return this._model.countDocuments(filter);
  }

  async totalAggregate(stages: PipelineStage[]): Promise<number> {
    const result = await this._model.aggregate([...stages, { $count: 'totalCount' }]);
    return result[0]?.totalCount || 0;
  }
}
