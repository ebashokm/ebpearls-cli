import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class NzPassportVerificationInput {
  @Field()
  @IsNotEmpty()
  DateOfBirth: string;

  @Field()
  @IsNotEmpty()
  @Length(7, 10, {
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
  TravelDocumentExpiryDate: string;
}
