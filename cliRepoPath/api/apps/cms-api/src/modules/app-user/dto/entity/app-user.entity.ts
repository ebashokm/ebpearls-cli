import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum AuthProviderType {
  email = 'email',
  facebook = 'facebook',
  tiktok = 'tiktok',
  google = 'google',
  apple = 'apple',
  twitter = 'twitter',
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum UserStatus {
  email_verified = 'email_verified',
  password_set = 'password_set',
  password_set_pending = 'password_set_pending',
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Point
 * @typedef {Point}
 */
@ObjectType()
export class Point {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  type: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {[number]}
   */
  @Field(() => [Number], { nullable: true })
  coordinates: [number, number];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Address
 * @typedef {Address}
 */
@ObjectType()
export class Address {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  displayAddress: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Point}
   */
  @Field(() => Point, { nullable: true })
  location: Point;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUser
 * @typedef {AppUser}
 */
@ObjectType()
export class AppUser {
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
  authProvider: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  authProviderId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  password: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  firstName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  lastName: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  profileImage: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  profileImageUrl: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Address}
   */
  @Field(() => Address, { nullable: true })
  address: Address;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  status: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  bio: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  lastLoggedInAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field()
  createdAt: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field()
  updatedAt: Date;
}
