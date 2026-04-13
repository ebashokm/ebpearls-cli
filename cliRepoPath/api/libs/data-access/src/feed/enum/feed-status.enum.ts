import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum FeedStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

registerEnumType(FeedStatus, {
  name: 'FeedStatus',
});
