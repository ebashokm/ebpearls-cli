// Module registry: maps CLI selection names to NestJS class names, import paths, and sub-modules.
// Used by index.js to dynamically inject modules into app.module.ts after scaffolding.

const API_MODULE_REGISTRY = {
  agora: {
    modules: [{ className: 'AgoraModule', importPath: './modules/agora/agora.module' }],
    graphqlInclude: true,
  },
  appointments: {
    modules: [{ className: 'AppointmentModule', importPath: './modules/appointments/appointment.module' }],
    graphqlInclude: true,
  },
  auth: {
    modules: [{ className: 'AuthModule', importPath: './modules/auth/auth.module' }],
    graphqlInclude: true,
  },
  chime: {
    modules: [{ className: 'ChimeModule', importPath: './modules/chime/chime.module' }],
    graphqlInclude: true,
  },
  'cloud-recording': {
    modules: [{ className: 'CloudRecordingModule', importPath: './modules/cloud-recording/cloud-recording.module' }],
    graphqlInclude: true,
  },
  'coin-management': {
    modules: [{ className: 'CoinManagementModule', importPath: './modules/coin-management/coin-management.module' }],
    graphqlInclude: true,
  },
  'comet-chat': {
    modules: [{ className: 'CometChatModule', importPath: './modules/comet-chat/comet-chat.module' }],
    graphqlInclude: true,
  },
  contacts: {
    modules: [{ className: 'ContactsModule', importPath: './modules/contacts/contacts.module' }],
    graphqlInclude: true,
  },
  cron: {
    modules: [{ className: 'CronModule', importPath: './modules/cron/cron.module' }],
    graphqlInclude: false,
  },
  'fake-api': {
    modules: [{ className: 'FakeApiModule', importPath: './modules/fake-api/fake-api.module' }],
    graphqlInclude: true,
  },
  faq: {
    modules: [{ className: 'FaqModule', importPath: './modules/faq/faq.module' }],
    graphqlInclude: true,
  },
  'feed-comments': {
    modules: [{ className: 'FeedCommentsModule', importPath: './modules/feed-comments/feed-comments.module' }],
    graphqlInclude: true,
    contextFactory: {
      service: { className: 'FeedCommentsService', importPath: './modules/feed-comments/feed-comments.service' },
      loaderName: 'commentLikeStatusLoader',
      loaderKeyType: '{ userId: string; commentId: string }',
      loaderValueType: 'boolean',
      loaderKeySerializer: '`${k.userId}:${k.commentId}`',
      loaderBatchFn: 'feedCommentsService.getLikeStatusForMany',
      loaderBatchKeyField: 'commentId',
    },
  },
  'feed-replies': {
    modules: [{ className: 'FeedRepliesModule', importPath: './modules/feed-replies/feed-replies.module' }],
    graphqlInclude: true,
    contextFactory: {
      service: { className: 'FeedRepliesService', importPath: './modules/feed-replies/feed-replies.service' },
      loaderName: 'replyLikeStatusLoader',
      loaderKeyType: '{ userId: string; replyId: string }',
      loaderValueType: 'boolean',
      loaderKeySerializer: '`${k.userId}:${k.replyId}`',
      loaderBatchFn: 'feedRepliesService.getLikeStatusForMany',
      loaderBatchKeyField: 'replyId',
    },
  },
  feeds: {
    modules: [{ className: 'FeedsModule', importPath: './modules/feeds/feeds.module' }],
    graphqlInclude: true,
    contextFactory: {
      service: { className: 'FeedsService', importPath: './modules/feeds/feeds.service' },
      loaderName: 'feedLikeStatusLoader',
      loaderKeyType: '{ userId: string; feedId: string }',
      loaderValueType: 'boolean',
      loaderKeySerializer: '`${k.userId}:${k.feedId}`',
      loaderBatchFn: 'feedsService.getLikeStatusForMany',
      loaderBatchKeyField: 'feedId',
    },
  },
  'manual-subscription': {
    modules: [{ className: 'ManualSubscriptionModule', importPath: './modules/manual-subscription/manual-subscription.module' }],
    graphqlInclude: true,
  },
  notifications: {
    modules: [{ className: 'NotificationsModule', importPath: './modules/notifications/notifications.module' }],
    graphqlInclude: true,
  },
  pages: {
    modules: [{ className: 'PagesModule', importPath: './modules/pages/pages.module' }],
    graphqlInclude: true,
  },
  paypal: {
    modules: [
      { className: 'PaypalOrderModule', importPath: './modules/paypal/paypal-order/paypal-order.module' },
      { className: 'PaypalSubscriptionModule', importPath: './modules/paypal/paypal-subscription/paypal-subscription.module' },
    ],
    graphqlInclude: true,
  },
  performance: {
    modules: [{ className: 'PerformanceModule', importPath: './modules/performance/performance.module' }],
    graphqlInclude: false,
  },
  permission: {
    modules: [{ className: 'PermissionModule', importPath: './modules/permission/permission.module' }],
    graphqlInclude: false,
  },
  rapidid: {
    modules: [{ className: 'RapidIdModule', importPath: './modules/rapidid/rapidid.module' }],
    graphqlInclude: true,
  },
  'site-settings': {
    modules: [{ className: 'SiteSettingsModule', importPath: './modules/site-settings/site-settings.module' }],
    graphqlInclude: true,
  },
  sqs: {
    modules: [{ className: 'SQSModule', importPath: './modules/sqs/sqs.module' }],
    graphqlInclude: true,
  },
  stripe: {
    modules: [
      { className: 'StripePaymentModule', importPath: './modules/stripe/stripe-payment/stripe-payment.module' },
      { className: 'StripeSubscriptionModule', importPath: './modules/stripe/stripe-subscriptions/stripe-subscriptions.module' },
      { className: 'StripeConnectModule', importPath: './modules/stripe/stripe-connect/stripe-connect.module' },
    ],
    graphqlInclude: true,
  },
  subscription: {
    modules: [{ className: 'SubscriptionModule', importPath: './modules/subscription/subscription.module' }],
    graphqlInclude: true,
  },
  users: {
    modules: [{ className: 'UsersModule', importPath: './modules/users/users.module' }],
    graphqlInclude: true,
    contextFactory: {
      service: { className: 'UsersService', importPath: './modules/users/users.service' },
      loaderName: 'userLoader',
      loaderKeyType: 'string',
      loaderValueType: 'any',
    },
  },
};

const CMS_MODULE_REGISTRY = {
  admin: { className: 'AdminModule', importPath: './modules/admin/admin.module' },
  'advance-page': { className: 'AdvancePageModule', importPath: './modules/advance-page/advance-page.module' },
  'app-user': { className: 'AppUserModule', importPath: './modules/app-user/app-user.module' },
  'audit-log': { className: 'AuditLogModule', importPath: './modules/audit-log/audit-log.module' },
  auth: { className: 'AuthModule', importPath: './modules/auth/auth.module' },
  business: { className: 'BusinessModule', importPath: './modules/business/business.module' },
  'email-template': { className: 'EmailTemplateModule', importPath: './modules/email-template/email-template.module' },
  'fancy-email-template': { className: 'FancyEmailTemplateModule', importPath: './modules/fancy-email-template/fancy-email-template.module' },
  faq: { className: 'FaqModule', importPath: './modules/faq/faq.module' },
  'home-page-template': { className: 'HomePageTemplateModule', importPath: './modules/home-page-template/home-page-template.module' },
  menu: { className: 'MenuModule', importPath: './modules/menu/menu.module' },
  page: { className: 'PageModule', importPath: './modules/page/page.module' },
  'page-with-version': { className: 'PageWithVersionModule', importPath: './modules/page-with-version/pageWithVersion.module' },
  permission: { className: 'PermissionModule', importPath: './modules/permission/permission.module' },
  role: { className: 'RoleModule', importPath: './modules/role/role.module' },
  'site-settings': { className: 'SiteSettingsModule', importPath: './modules/site-settings/site-settings.module' },
  'subscription-plan': { className: 'SubscriptionPlanModule', importPath: './modules/subscription-plan/subscription-plan.module' },
  'subscription-products': { className: 'SubscriptionProductsModule', importPath: './modules/subscription-products/subscription-products.module' },
  'surveyjs-page': { className: 'SurveyJsPageModule', importPath: './modules/surveyjs-page/surveyjs-page.module' },
  taxonomy: { className: 'TaxonomyModule', importPath: './modules/taxonomy/taxonomy.module' },
  testimonials: { className: 'TestimonialsModule', importPath: './modules/testimonials/testimonials.module' },
  settings: { className: 'SettingModule', importPath: './modules/settings/settings.module' },
};

// CMS Frontend registry: maps CLI selection names to view dirs, route files, and menu files.
// Used by index.js to dynamically wire routes and menu items into the CMS React app.
//
// Each entry can have:
//   viewDirs:    array of dirs under src/views/ to copy
//   route:       { file, exportName } — the route file to copy + its default export name
//   menuItem:    { file, exportName } — the menu-item file to copy + its default export name
//   apiFiles:    array of files under src/api/ to copy (optional)
//
// Core items (always included, never in registry):
//   Routes:    LoginRoutes, MainRoutes
//   Menu:      userManagement
//   Views:     profile/, user-management/ (admins portion), pages/ (auth/error pages)

const CMS_FRONTEND_REGISTRY = {
  dashboard: {
    viewDirs: ['dashboard'],
    route: { file: 'DashboardRoutes.tsx', exportName: 'DashboardRoutes' },
    menuItem: { file: 'dashboard.tsx', exportName: 'dashboard' },
  },
  'app-user': {
    viewDirs: ['user-management'],
    route: { file: 'AppUserRoutes.tsx', exportName: 'AppUserRoutes' },
    menuItem: null, // app-users item is inside core userManagement menu
  },
  'business-user': {
    viewDirs: ['business-user'],
    route: { file: 'BusinessUsersRoutes.tsx', exportName: 'BusinessUsersRoutes' },
    menuItem: { file: 'businessUser.tsx', exportName: 'businessUser' },
  },
  menu: {
    viewDirs: ['menu'],
    route: { file: 'MenuRoutes.tsx', exportName: 'MenuRoutes' },
    menuItem: { file: 'contentManagement.tsx', exportName: 'contentManagement' },
    apiFiles: ['menu.ts'],
  },
  'email-template': {
    viewDirs: ['email-template'],
    route: { file: 'EmailTemplateRoutes.tsx', exportName: 'EmailTemplateRoutes' },
    menuItem: { file: 'emailTemplate.tsx', exportName: 'emailTemplate' },
  },
  faq: {
    viewDirs: ['faq'],
    route: { file: 'FaqRoutes.tsx', exportName: 'FaqRoutes' },
    menuItem: { file: 'faq.tsx', exportName: 'faq' },
  },
  taxonomy: {
    viewDirs: ['taxonomy'],
    route: { file: 'TaxonomyRoutes.tsx', exportName: 'TaxonomyRoutes' },
    menuItem: { file: 'taxonomy.tsx', exportName: 'taxonomy' },
  },
  testimonials: {
    viewDirs: ['testimonials'],
    route: { file: 'TestimonialRoutes.tsx', exportName: 'TestimonialRoutes' },
    menuItem: { file: 'testimonial.tsx', exportName: 'testimonial' },
  },
  
  'advance-page-management': {
    viewDirs: ['advance-page-management'],
    route: { file: 'AdvancePageManagementRoutes.tsx', exportName: 'AdvancePageManagementRoutes' },
    menuItem: { file: 'advancePageManagement.tsx', exportName: 'advancePageManagement' },
  },
  'subscription-products': {
    viewDirs: ['subscription-products'],
    route: { file: 'SubscriptionRoutes.tsx', exportName: 'SubscriptionRoutes' },
    menuItem: { file: 'subscription.tsx', exportName: 'subscription' },
  },
  maintenance: {
    viewDirs: ['pages'],
    route: { file: 'MaintananceRoutes.tsx', exportName: 'MaintananceRoutes' },
    menuItem: { file: 'maintanance.tsx', exportName: 'maintanance' },
  },
  'page-management': {
    viewDirs: ['page-management'],
    route: { file: 'PageManagementRoutes.tsx', exportName: 'PageManagementRoutes' },
    menuItem: { file: 'pageManagement.tsx', exportName: 'pageManagement' },
  },
  'business-management': {
    viewDirs: ['businessManagement'],
    route: { file: 'BusinessRoutes.tsx', exportName: 'BusinessRoutes' },
    menuItem: null, // no menu entry for business management
  },
  'page-management-versions': {
    viewDirs: ['page-management-versions'],
    route: { file: 'PageManagementWithVersionsRoutes.tsx', exportName: 'PageManagementWithVersionsRoutes' },
    menuItem: { file: 'pageManagementVersion.tsx', exportName: 'pageManagementVersion' },
  },
  
  settings: {
    viewDirs: ['settings'],
    route: { file: 'SettingRoutes.tsx', exportName: 'SettingRoutes' },
    menuItem: { file: 'setting.tsx', exportName: 'setting' },
  },
};

module.exports = { API_MODULE_REGISTRY, CMS_MODULE_REGISTRY, CMS_FRONTEND_REGISTRY };
