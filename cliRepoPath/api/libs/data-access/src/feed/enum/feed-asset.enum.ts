import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum FeedAssetType {
  IMAGE = 'image',
  VIDEO = 'video',
}

registerEnumType(FeedAssetType, {
  name: 'FeedAssetType',
});
