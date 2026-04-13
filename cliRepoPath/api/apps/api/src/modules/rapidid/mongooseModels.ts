import { UserSchema, User } from '@app/data-access';

export const mongooseModels = [
  {
    name: User.name,
    schema: UserSchema,
  },
];
