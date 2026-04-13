const { webpack } = require('webpack');
const swcDefaultConfig =
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions;
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: swcDefaultConfig,
        },
      },
    ],
  },
  // plugins: [
  //   new webpack.ProgressPlugin((percentage, message, ...args) => {
  //     console.info(`Progress: ${Math.round(percentage * 100)}% - ${message}`, ...args);
  //   }),
  // ],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'apps/api/src'),
      '@cms-api': path.resolve(__dirname, 'apps/cms-api/src'),

      '@app/authentication': path.resolve(__dirname, 'libs/authentication/src'),
      '@app/data-access': path.resolve(__dirname, 'libs/data-access/src'),
      '@app/facebook-auth': path.resolve(__dirname, 'libs/facebook-auth/src'),

      '@app/google-auth': path.resolve(__dirname, 'libs/google-auth/src'),
      '@app/otp': path.resolve(__dirname, 'libs/otp/src'),
      '@app/social-auth': path.resolve(__dirname, 'libs/social-auth/src'),

      '@app/inapp-subscription': path.resolve(__dirname, 'libs/inapp-subscription/src'),
      '@app/apple-auth': path.resolve(__dirname, 'libs/apple-auth/src'),
      '@app/stripe': path.resolve(__dirname, 'libs/stripe'),

      '@app/tiktok-auth': path.resolve(__dirname, 'libs/tiktok-auth/src'),
      '@app/email': path.resolve(__dirname, 'libs/email/src'),
      '@app/search': path.resolve(__dirname, 'libs/elastic-search/src'),
      '@app/graphql-redis-cache': path.resolve(__dirname, 'libs/graphql-redis-cache/src'),
      '@app/paypal-core': path.resolve(__dirname, 'libs/paypal-core/src'),

      '@app/winston-logger': path.resolve(__dirname, 'libs/winston-logger/src'),
      '@app/fcm': path.resolve(__dirname, 'libs/fcm'),

      '@app/common': path.resolve(__dirname, 'libs/common'),
      '@app': path.resolve(__dirname, 'libs'),

      '@app/sentry': path.resolve(__dirname, 'libs/sentry'),
    },
    extensions: ['.ts', '.js'],
  },
};
