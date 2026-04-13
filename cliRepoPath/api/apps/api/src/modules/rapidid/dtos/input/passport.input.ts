import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { DocsVerificationGenderType } from '../../enums/docs-verification.enum';

@InputType()
export class PassportVerificationInput {
  @Field()
  @IsNotEmpty()
  BirthDate: string;

  @Field(() => DocsVerificationGenderType)
  @IsNotEmpty()
  Gender: DocsVerificationGenderType;

  @Field()
  @IsNotEmpty()
  @Length(7, 9, {
    message: 'Travel document number must be between 7 and 9 characters long',
  })
  TravelDocumentNumber: string;

  @Field()
  @IsNotEmpty()
  GivenName: string;

  @Field()
  @IsNotEmpty()
  FamilyName: string;

  @Field()
  @IsOptional()
  ExpiryDate: string;
}
