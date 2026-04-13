import { registerEnumType } from '@nestjs/graphql';

export enum PageTypeWithVersion {
  ABOUT = 'About Us',
  CONTACT = 'Contact Us',
  TERMS_AND_CONDITION = 'Terms And Conditions',
  PRIVACY_POLICY = 'Privacy Policy',
  // other titles
}
registerEnumType(PageTypeWithVersion, { name: 'PageTypeWithVersion' });

export enum PageStatusWithVersion {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(PageStatusWithVersion, { name: 'PageStatusWithVersion' });
