import { Admin, AdminSchema, EmailToken, EmailTokenSchema } from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @type {{ name: any; schema: any; }[]\}
 */
export const mongooseModels = [
  { name: Admin.name, schema: AdminSchema },
  { name: EmailToken.name, schema: EmailTokenSchema },
];
