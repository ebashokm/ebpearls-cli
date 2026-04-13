import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { MedicareCardType } from '../../enums/docs-verification.enum';
import { CardExpiryFormat } from '../../interface/expiry-date-formate.interface';

@InputType()
export class MedicareVerificationInput {
  @Field()
  @IsNotEmpty()
  BirthDate: string;

  @Field()
  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Card number must be exactly 10 characters long',
  })
  CardNumber: string;

  @Field(() => MedicareCardType)
  @IsNotEmpty()
  CardType: MedicareCardType;

  @Field()
  @IsNotEmpty()
  @CardExpiryFormat()
  CardExpiry: string;

  @Field()
  @IsNotEmpty()
  IndividualReferenceNumber: number;

  @Field()
  @IsNotEmpty()
  FullName1: string;

  @Field()
  @IsOptional()
  FullName2: string;

  @Field()
  @IsOptional()
  FullName3: string;

  @Field()
  @IsOptional()
  FullName4: string;
}
