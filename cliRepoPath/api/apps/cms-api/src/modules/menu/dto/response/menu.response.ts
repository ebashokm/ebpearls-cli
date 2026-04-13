import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class MenuItemChildResponse
 * @typedef {MenuItemChildResponse}
 */
@ObjectType()
class MenuItemChildResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  linkType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  link: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  iconType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  icon: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;
}

/**
 * ${1:Description placeholder}
 *
 * @class FileResponse
 * @typedef {FileResponse}
 */
@ObjectType()
class FileResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  name: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  contentType: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  url: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class MenuItemResponse
 * @typedef {MenuItemResponse}
 */
@ObjectType()
class MenuItemResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  linkType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  link: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  iconType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  icon: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  index: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {MenuItemChildResponse[]}
   */
  @Field(() => [MenuItemChildResponse], { nullable: true })
  children: MenuItemChildResponse[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Menu
 * @typedef {Menu}
 */
@ObjectType()
export class Menu {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  _id: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  title: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {FileResponse}
   */
  @Field(() => FileResponse, { nullable: true })
  logo: FileResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  imageAltText: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  menuPosition: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {MenuItemResponse[]}
   */
  @Field(() => [MenuItemResponse], { nullable: true })
  menuItems: MenuItemResponse[];

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  createdAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  updatedAt: Date;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MenuResponse
 * @typedef {MenuResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class MenuResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {Menu}
   */
  @Field(() => Menu, { nullable: true })
  menu: Menu;

  /**
   * ${1:Description placeholder}
   *
   * @type {[Menu]}
   */
  @Field(() => [Menu], { nullable: true })
  menus: [Menu];
}
