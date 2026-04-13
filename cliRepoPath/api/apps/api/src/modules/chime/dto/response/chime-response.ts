import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @class MediaPlacement
 * @typedef {MediaPlacement}
 */
@ObjectType()
class MediaPlacement {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  AudioFallbackUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  AudioHostUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  EventIngestionUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  ScreenDataUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  ScreenSharingUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  ScreenViewingUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  SignalingUrl?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  TurnControlUrl?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @class Capabilities
 * @typedef {Capabilities}
 */
@ObjectType()
class Capabilities {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  Audio?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  Content?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  Video?: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MeetingResponse
 * @typedef {MeetingResponse}
 */
@ObjectType()
export class MeetingResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  ExternalMeetingId?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  MediaRegion?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  MeetingArn?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  MeetingId?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?MediaPlacement}
   */
  @Field(() => MediaPlacement, { nullable: true })
  MediaPlacement?: MediaPlacement;
}

/**
 * ${1:Description placeholder}
 *
 * @class AttendeeResponse
 * @typedef {AttendeeResponse}
 */
@ObjectType()
class AttendeeResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  AttendeeId?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  ExternalUserId?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field()
  JoinToken?: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {?Capabilities}
   */
  @Field(() => Capabilities, { nullable: true })
  Capabilities?: Capabilities;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class InitiateMeetingResponse
 * @typedef {InitiateMeetingResponse}
 */
@ObjectType()
export class InitiateMeetingResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {MeetingResponse}
   */
  @Field(() => MeetingResponse, { nullable: true })
  meetingResponse: MeetingResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {AttendeeResponse}
   */
  @Field(() => AttendeeResponse, { nullable: true })
  attendeeResponse: AttendeeResponse;
}
