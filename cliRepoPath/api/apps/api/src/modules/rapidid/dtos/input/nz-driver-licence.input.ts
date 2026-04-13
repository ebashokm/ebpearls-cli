import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

@InputType()
export class NzDriverLicenceVerificationInput {
  @Field()
  @IsNotEmpty()
  BirthDate: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 10, {
    message: 'Licence number must be between 1 to 10 characters',
  })
  LicenseVersion: string;

  @Field()
  @IsNotEmpty()
  @Length(5, 10, {
    message: 'Licence number must be 5 to 10 characters',
  })
  LicenseNumber: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 20)
  FirstName: string;

  @Field()
  @IsOptional()
  MiddleName: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 40)
  LastName: string;
}
