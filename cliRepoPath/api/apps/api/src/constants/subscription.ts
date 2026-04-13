/**
 * ${1:Description placeholder}
 *
 * @type {*}
 */
export const PRO_SUBSCRIPTION_ID = process.env.PRO || 'ebtheme_pro';
/**
 * ${1:Description placeholder}
 *
 * @type {*}
 */
export const PREMIUM_SUBSCRIPTION_ID = process.env.PREMIUM || 'ebtheme_premium';

/**
 * ${1:Description placeholder}
 *
 * @type {{ name: string; productId: any; price: { amount: number; currency: string; }; \}[]\}
 */
export const IAP_SUBSCRIPTION = [
  {
    name: 'Pro',
    productId: PRO_SUBSCRIPTION_ID,
    price: {
      amount: 10.0,
      currency: 'aud',
    },
  },
  {
    name: 'Premium',
    productId: PREMIUM_SUBSCRIPTION_ID,
    price: {
      amount: 20.0,
      currency: 'aud',
    },
  },
];
