import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';

@ObjectType()
export class BaseResponseDTO extends BaseEntityResponse {
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
  email: string;
}

@ObjectType()
export class BusinessResponse extends BaseResponse {
  @Field(() => [BaseResponseDTO], { nullable: true })
  data: BaseResponseDTO[];
}
