import { UserDocument } from '@app/data-access';

export type UserRecord = UserDocument & {
  profileImageUrl?: string;
  profileImageThumbnails?: string[];
};
