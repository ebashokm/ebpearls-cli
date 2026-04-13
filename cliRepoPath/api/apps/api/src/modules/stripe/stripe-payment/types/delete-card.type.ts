/**
 * Delete card local service call
 */
export type DeleteCard = {
  cardId: string;
  userId: string;
};
/**
 * Delete card stipe api call
 */
export type DeleteCardFromStripe = {
  customerId: string;
  cardId: string;
};
