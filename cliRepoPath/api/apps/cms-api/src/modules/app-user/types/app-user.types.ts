import { UserDocument } from '@app/data-access';

export type AppUserRecord = UserDocument & {
  profileImageUrl?: string;
  profileImageThumbnails?: string[];
};
