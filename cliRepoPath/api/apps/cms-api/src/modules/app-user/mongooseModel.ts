import {
  User,
  UserSchema,
  EmailToken,
  EmailTokenSchema,
  EmailTemplate,
  EmailTemplateSchema,
} from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @type {{ name: any; schema: any; }[]\}
 */
export const models = [
  { name: User.name, schema: UserSchema },
  { name: EmailToken.name, schema: EmailTokenSchema },
  { name: EmailTemplate.name, schema: EmailTemplateSchema },
];
