import { endTypeEnum, repeatFrequencyEnum } from '@app/common/enum/recurrence.enum';
import { isNullOrUndefined } from '@app/common/helpers/genericFunction';
import { Field, InputType } from '@nestjs/graphql';

import {
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsIn,
  IsNotEmpty,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

@InputType()
export class RecurrencePatternDTO {
  @Field(() => String)
  @IsEnum(repeatFrequencyEnum)
  @IsNotEmpty()
  frequency: repeatFrequencyEnum;

  @Field()
  @Min(1)
  @IsNotEmpty()
  interval: number;

  @Field(() => [Number], { nullable: true })
  @ValidateIf((o) => o.frequency === repeatFrequencyEnum.week)
  @IsIn([0, 1, 2, 3, 4, 5, 6], { each: true })
  @ArrayMinSize(1)
  daysOfWeek: number[];

  @Field({ nullable: true })
  @ValidateIf((o) => o.frequency === repeatFrequencyEnum.month && !isNullOrUndefined(o.weekOfMonth))
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number;

  @Field({ nullable: true })
  @ValidateIf((o) => o.frequency === repeatFrequencyEnum.month && isNullOrUndefined(o.dayOfMonth))
  @Min(0)
  @Max(6) // first(0) - sixth(5) / last(6) week of month
  @IsNotEmpty()
  weekOfMonth: number;

  @Field({ nullable: true })
  @ValidateIf(
    (o) =>
      (o.frequency === repeatFrequencyEnum.month && isNullOrUndefined(o.weekOfMonth)) ||
      o.frequency === repeatFrequencyEnum.year,
  )
  @Min(1)
  @Max(31) // 1 - 31
  @IsNotEmpty()
  dayOfMonth: number;

  @Field({ nullable: true })
  @ValidateIf((o) => o.frequency === repeatFrequencyEnum.year)
  @Min(0)
  @Max(11) // 0 - 11
  @IsNotEmpty()
  monthOfYear: number;

  @Field(() => String)
  @IsEnum(endTypeEnum)
  @IsNotEmpty()
  endType: endTypeEnum;

  @Field({ nullable: true })
  @ValidateIf((o) => o.endType === endTypeEnum.date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Field({ nullable: true })
  @ValidateIf((o) => o.endType === endTypeEnum.occurrence)
  @IsNotEmpty()
  @Max(365)
  endAfterOccurrence: number;
}
