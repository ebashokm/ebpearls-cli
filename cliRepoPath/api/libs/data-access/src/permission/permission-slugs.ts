export const PermissionSlugs = {
  // admin
  CREATE_ADMIN: 'create-admin',
  UPDATE_ADMIN: 'update-admin',
  GET_ADMIN: 'get-admin',
  LIST_ADMIN: 'list-admin',
  DELETE_ADMIN: 'delete-admin',
  UPDATE_ADMIN_STATUS: 'update-admin-status',
  SEND_PASSWORD_RESET_MAIL_TO_ADMIN: 'send-password-reset-mail-to-admin',

  // admin role
  UPDATE_ADMIN_ROLE: 'update-admin-role',

  // user
  CREATE_USER: 'create-user',
  UPDATE_USER: 'update-user',
  GET_USER: 'get-user',
  LIST_USER: 'list-user',
  DELETE_USER: 'delete-user',
  SEND_PASSWORD_RESET_MAIL_TO_USER: 'send-password-reset-mail-to-user',
  RESET_USER_PASSWORD: 'reset-user-password',
  CHANGE_USER_PASSWORD: 'change-user-password',

  //business
  CREATE_BUSINESS: 'create-business',
  UPDATE_BUSINESS: 'update-business',
  GET_BUSINESS: 'get-business',
  LIST_BUSINESS: 'list-business',
  DELETE_BUSINESS: 'delete-business',

  //menu
  CREATE_MENU: 'create-menu',
  UPDATE_MENU: 'update-menu',
  GET_MENU: 'get-menu',
  LIST_MENU: 'list-menu',
  DELETE_MENU: 'delete-menu',
  UPDATE_MENU_STATUS: 'update-menu-status',

  //faq
  CREATE_FAQ: 'create-faq',
  UPDATE_FAQ: 'update-faq',
  GET_FAQ: 'get-faq',
  LIST_FAQ: 'list-faq',
  DELETE_FAQ: 'delete-faq',

  //email-template
  CREATE_EMAIL_TEMPLATE: 'create-email-template',
  UPDATE_EMAIL_TEMPLATE: 'update-email-template',
  GET_EMAIL_TEMPLATE: 'get-email-template',
  LIST_EMAIL_TEMPLATE: 'list-email-template',
  DELETE_EMAIL_TEMPLATE: 'delete-email-template',

  // page
  CREATE_PAGE: 'create-page',
  UPDATE_PAGE: 'update-page',
  GET_PAGE: 'get-page',
  LIST_PAGE: 'list-page',
  DELETE_PAGE: 'delete-page',
  DUPLICATE_PAGE: 'duplicate-page',

  //page-with-version
  CREATE_PAGE_WITH_VERSION: 'create-page-with-version',
  UPDATE_PAGE_WITH_VERSION: 'update-page-with-version',
  GET_PAGE_WITH_VERSION: 'get-page-with-version',
  LIST_PAGE_WITH_VERSION: 'list-page-with-version',
  DELETE_PAGE_WITH_VERSION: 'delete-page-with-version',

  // site-setting
  CREATE_SITE_SETTING: 'create-site-setting',
  GET_SITE_SETTING: 'get-site-setting',
  LIST_SITE_SETTING: 'list-site-setting',

  // taxonomy
  CREATE_TAXONOMY: 'create-taxonomy',
  UPDATE_TAXONOMY: 'update-taxonomy',
  GET_TAXONOMY: 'get-taxonomy',
  LIST_TAXONOMY: 'list-taxonomy',
  DELETE_TAXONOMY: 'delete-taxonomy',

  //testimonial
  CREATE_TESTIMONIAL: 'create-testimonial',
  UPDATE_TESTIMONIAL: 'update-testimonial',
  GET_TESTIMONIAL: 'get-testimonial',
  LIST_TESTIMONIAL: 'list-testimonial',
  DELETE_TESTIMONIAL: 'delete-testimonial',

  // role
  CREATE_ROLE: 'create-role',
  UPDATE_ROLE: 'update-role',
  GET_ROLE: 'get-role',
  LIST_ROLE: 'list-role',
  UPDATE_ROLE_PERMISSION: 'update-role-permission',
  UPDATE_ROLE_PERMISSIONS: 'update-role-permissions',
  DELETE_ROLE: 'delete-role',

  //subscription
  CREATE_SUBSCRIPTION_PRODUCT: 'create-subscription-product',
  LIST_SUBSCRIPTION_PRODUCT: 'list-subscription-product',
  GET_SUBSCRIPTION_PRODUCT: 'get-subscription-product',
  UPDATE_SUBSCRIPTION_PRODUCT: 'update-subscription-product',
  DELETE_SUBSCRIPTION_PRODUCT: 'delete-subscription-product',

  // subscription plans
  CREATE_SUBSCRIPTION_PLAN: 'create-subscription-plan',
  LIST_SUBSCRIPTION_PLAN: 'list-subscription-plan',
  GET_SUBSCRIPTION_PLAN: 'get-subscription-plan',
  UPDATE_SUBSCRIPTION_PLAN: 'update-subscription-plan',
  DELETE_SUBSCRIPTION_PLAN: 'delete-subscription-plan',

  // permission
  CREATE_PERMISSION: 'create-permission',
  UPDATE_PERMISSION: 'update-permission',
  GET_PERMISSION: 'get-permission',
  LIST_PERMISSION: 'list-permission',
  DELETE_PERMISSION: 'delete-permission',
  LIST_PERMISSION_MODULE: 'list-permission-module',
} as const;

export type PermissionSlug = (typeof PermissionSlugs)[keyof typeof PermissionSlugs];
