import {
  Admin,
  AdminSchema,
  DeviceInfo,
  DeviceInfoSchema,
  EmailToken,
  EmailTokenSchema,
  OTPRequest,
  OTPRequestSchema,
  Settings,
  SettingsSchema,
  EmailTemplateSchema,
  EmailTemplate,
  Business,
  BusinessSchema,
  LoginInfo,
  LoginInfoSchema,
} from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @type {{ name: any; schema: any; }[]\}
 */
export const mongooseModels = [
  { name: Admin.name, schema: AdminSchema },
  { name: EmailToken.name, schema: EmailTokenSchema },
  { name: OTPRequest.name, schema: OTPRequestSchema },
  { name: DeviceInfo.name, schema: DeviceInfoSchema },
  { name: Settings.name, schema: SettingsSchema },
  { name: EmailTemplate.name, schema: EmailTemplateSchema },
  { name: Business.name, schema: BusinessSchema },

  { name: LoginInfo.name, schema: LoginInfoSchema },
];
