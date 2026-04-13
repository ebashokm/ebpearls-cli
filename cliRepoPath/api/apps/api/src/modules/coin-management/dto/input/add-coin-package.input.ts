import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AddCoinPackageInput
 * @typedef {AddCoinPackageInput}
 */
@InputType()
export class AddCoinPackageInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field(() => Int)
  @IsNotEmpty()
  numberOfCoins: number;

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
   * @type {string}
   */
  @Field({ nullable: true })
  appleProductId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  androidProductId: string;
}
