import { endTypeEnum, repeatFrequencyEnum } from '@app/common/enum/recurrence.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type RecurrencePatternDocument = RecurrencePattern & Document;

@Schema()
export class RecurrencePattern {
  @Prop({ type: String, default: null })
  frequency: repeatFrequencyEnum;

  @Prop()
  interval: number;

  @Prop([Number])
  daysOfWeek: number[];

  @Prop(Number)
  dayOfWeek: number;

  @Prop()
  weekOfMonth: number;

  @Prop()
  dayOfMonth: number;

  @Prop()
  monthOfYear: number;

  @Prop({ type: String, default: endTypeEnum.never })
  endType: endTypeEnum;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  endAfterOccurrence: number;
}

export const recurrencePatternSchema = SchemaFactory.createForClass(RecurrencePattern);
