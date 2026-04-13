import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum CommentAssetType {
  IMAGE = 'image',
  VIDEO = 'video',
}

registerEnumType(CommentAssetType, {
  name: 'CommentAssetType',
});
