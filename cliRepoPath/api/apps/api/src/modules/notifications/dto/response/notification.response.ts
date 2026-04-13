import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { ObjectType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ThemeAttributesEntity
 * @typedef {ThemeAttributesEntity}
 */
@ObjectType()
export class ThemeAttributesEntity {
  /**
   * ${1:Description placeholder}
   *
   * @type {?JSON}
   */
  @Field(() => GraphQLJSON, { nullable: true })
  attributes?: JSON;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class NotificationResponse
 * @typedef {NotificationResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class NotificationResponse extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  userId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  theme: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {ThemeAttributesEntity}
   */
  @Field(() => ThemeAttributesEntity, { nullable: true })
  themeAttributes: ThemeAttributesEntity;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  readAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  viewedAt: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaginatedNotifications
 * @typedef {PaginatedNotifications}
 */
@ObjectType()
export class PaginatedNotifications {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?NotificationResponse}
   */
  @Field(() => NotificationResponse, { nullable: true })
  notification?: NotificationResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {?NotificationResponse[]}
   */
  @Field(() => [NotificationResponse], { nullable: true })
  notifications?: NotificationResponse[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BasePaginationResponse}
   */
  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
