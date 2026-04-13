import { Field, ObjectType } from '@nestjs/graphql';
import { CoinPackageResponse } from './coin-package.response';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { MessageResponse } from '@app/common/dto/response/message.response';

@ObjectType()
export class ListCoinPackageResponse extends MessageResponse {
  @Field(() => [CoinPackageResponse])
  data: CoinPackageResponse[];

  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
