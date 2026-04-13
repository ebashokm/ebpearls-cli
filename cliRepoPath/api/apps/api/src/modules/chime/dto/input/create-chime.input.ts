import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class InitiateMeetingInput
 * @typedef {InitiateMeetingInput}
 */
@InputType()
export class InitiateMeetingInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  calleeId?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @IsEnum(['audio', 'video'])
  callType?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['android', 'ios'])
  deviceType?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MeetingInput
 * @typedef {MeetingInput}
 */
@InputType()
export class MeetingInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  meetingId?: string;
}
