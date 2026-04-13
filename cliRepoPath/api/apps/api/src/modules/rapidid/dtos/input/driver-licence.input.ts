import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { DriverLicenceStateOfIssue } from '../../enums/docs-verification.enum';

@InputType()
export class DriverLicenceVerificationInput {
  @Field()
  @IsNotEmpty()
  BirthDate: string;

  @Field()
  @IsNotEmpty()
  @Length(6, 10, {
    message: 'Card number up to 10 characters',
  })
  CardNumber: string;

  @Field(() => DriverLicenceStateOfIssue)
  @IsNotEmpty()
  StateOfIssue: DriverLicenceStateOfIssue;

  @Field()
  @IsNotEmpty()
  @Length(6, 10, {
    message: 'Licence number up to 10 characters',
  })
  LicenceNumber: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 20)
  GivenName: string;

  @Field()
  @IsOptional()
  MiddleName: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 40)
  FamilyName: string;
}
