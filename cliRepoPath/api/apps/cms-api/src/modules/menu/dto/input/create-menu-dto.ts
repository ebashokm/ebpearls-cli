import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @enum {number}
 */
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * ${1:Description placeholder}
 *
 * @enum {number}
 */
enum Position {
  HEADER = 'header',
  FOOTER = 'footer',
}

/**
 * ${1:Description placeholder}
 *
 * @class MenuItemChild
 * @typedef {MenuItemChild}
 */
@InputType()
class MenuItemChild {
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
 * @class MenuItem
 * @typedef {MenuItem}
 */
@InputType()
class MenuItem {
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
   * @type {MenuItemChild[]}
   */
  @Field(() => [MenuItemChild], { nullable: true })
  children: MenuItemChild[];
}

@InputType()
class File {
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
  objectKey: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  contentType: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateMenuDTO
 * @typedef {CreateMenuDTO}
 */
@InputType()
export class CreateMenuDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @Field(() => File, { nullable: true })
  logo?: File;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @IsString()
  @Field({ nullable: true })
  imageAltText?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsEnum(Status)
  @Field()
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @IsEnum(Position)
  @Field()
  menuPosition: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {MenuItem[]}
   */
  @Field(() => [MenuItem], { nullable: true })
  menuItems: MenuItem[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateMenuStatusDTO
 * @typedef {UpdateMenuStatusDTO}
 */
@InputType()
export class UpdateMenuStatusDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  status: string;
}
