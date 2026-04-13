import { AdminDocument, Permission } from '@app/data-access';

export type AdminUserRecord = AdminDocument & {
  profileImageUrl?: string;
  permissions?: Permission[];
  isSuperAdmin?: boolean;
};
