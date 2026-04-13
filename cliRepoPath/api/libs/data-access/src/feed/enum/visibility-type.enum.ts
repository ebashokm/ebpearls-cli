import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum VisibilityType {
  PUBLIC = 'public',
  FRIEND = 'friend',
  ONLY_ME = 'only_me',
}

registerEnumType(VisibilityType, {
  name: 'VisibilityType',
});
