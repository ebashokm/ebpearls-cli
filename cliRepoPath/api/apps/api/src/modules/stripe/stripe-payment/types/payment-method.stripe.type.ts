/**
 * Delete card local service call
 */
export type DeletePaymentMethod = {
  paymentMethodId: string;
  userId: string;
};
/**
 * Delete card stipe api call
 */
export type DeletePaymentMethodFromStripe = {
  customerId: string;
  paymentMethodId: string;
};
