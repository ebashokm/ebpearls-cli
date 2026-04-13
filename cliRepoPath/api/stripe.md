# Stripe Documentation

## Stripe Subscription Functionality

### Overview

This documentation provides information on implementing Stripe subscription functionality with the ability for users to apply discounts using promotion or coupon codes. Additionally, each subscription will include a trial period of 7 days if configured in the settings. Users are required to add payment details during the subscription purchase due to the trial period feature. However, Payment will only be deducted when the trial period ends.

<!-- For creating the subscription, we should call the `createStripeSubscription` method, which takes the required parameters as `priceId`, `productId`, `cardId`. And optional parameters as `couponCode`, if user want to avail the discount on applicable product. User can provide coupon code or promotion code to `couponCode`. -->

### Prerequisites

- Stripe Node.js library installed in your project (npm install stripe).
- Stripe API key obtained from the <a href="https://dashboard.stripe.com/test/apikeys">Stripe Dashboard</a>.

### Implementation

1.  **Create Subscription Function**

    Create a function to handle the subscription creation with discount and trial period:

    ```
    async function createSubscription(customerId, priceId, promoCode = '') {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            ...(couponCode && { coupon: couponCode }),
            ...(config.trialPeriodDays && { trial_period_days: config.trialPeriodDays }),
        });

        return subscription;

        } catch (error) {
            throw error;
        }
    }
    ```

    Here, the `customerId` is the ID of the stripe customer, `priceId` is the product price which the subscription will be created with, and optional `promoCode` is the coupon codes or promotion codes using which we will get the discount on subscription. Trial period is defined in the config or settings.

2.  **Coupon Code Usage**

    Coupon code and trial period is optional while creating subscription. `coupon` field can be provided with either the coupon code or the promotion code.

    Coupon codes or promotion codes can be created manually or using the stripe api. For now, we are using the manually created coupon codes. For using the api and more about coupon, follow the <a href="https://stripe.com/docs/api/coupons/create">Stripe Docs</a>.

    As an alternative to coupon code or promotion code, we can use another approach, which is creating a subscription product to provide a discount. We can create a brand new subscription product for a specific user with a reduced price if we need to provide a discount to that user. Generally, providing discounts with coupon codes is intuitive and recommended by Stripe docs. However, we can use both the approaches as per our requirements.

3.  **Trial Period Logic**

    Delay payments on actice subscription using the trial period.

    We can start a customer’s subscription with a free trial period by providing a `trial_end` or `trial_period_days` argument when creating the subscription.

    In our case, we are providing the 7 days(may vary) trial period to all the customers when new subscriptions are created.

    Note: Trial period is not applied in case of renew subscription(which are handled within the createStripeSubscription method). Hence, we are checking with the `isRenewing` field while applying the trial period.

    ```
    const subscription = await stripe.subscriptions.create({
            customer: '{{CUSTOMER_ID}}',
            items: [
                {
                price: '{{PRICE_ID}}',
                },
            ],
            collection_method: 'charge_automatically',
            trial_end: 1610403705, // takes timeStamp, use 'now' to end the trial period immediately
            // or trial_period_days: 7 // takes the days to end the trial after, 7 in this case
        });
    ```

    As we are passing `charge_automatically` to the collection method, Stripe will attempt to pay this subscription at the end of the cycle(trial period in our case) using the default source attached to the customer. Another option is `send_invoice`, which works with sending the email to the customer. For more information, follow <a href="https://stripe.com/docs/billing/subscriptions/trials">Stripe Docs</a>.

    If we choose to provide the trial period to the customer without collecting the payment details initially, then after the trial period has passed, we can

4.  **Update Subscription**

    We can update the existing subscription to alter the specified parameters like plans, quantity, or billing thresholds. When changing prices or quantities, stripe optionally prorates the price it charges next month to make up for any price changes. The changes done with the update subscription is only application for next cycle subscriptions. For immedialte changes in subscriptions, we can upgrade subscriptions. i.e applying the high price subscription and managing in our server or database.

    In case of upgrading subscriptions, as the new subscription will be of high price and proration is already managed by the the stripe, we only need to update in the database and manage the required access accordingly to the user. In case of upgrading, user needs to be given access to the new feature immediately.

5.  **End Trial Period**

    Users can end trial period for subscriptions after any time they want. We have `endTrial` method for ending the trial period. It checks if user has a trial subscription and then ends the trial period after the time user provided.

    ```
        await this.stripe.subscriptions.update(
        subscriptionId,
        {
          trial_end: 'now',
        },
      );
    ```

    `trial_end` takes a Unix timestamp representing the end of the trial period the customer will get before being charged for the first time. This will always overwrite any trials that might apply via a subscribed plan. The special value `now` can be provided to end the customer's trial immediately. Can be at most two years from `billing_cycle_anchor.

6.  **Cancel subscription**

    Users are allowed to cancel their subscriptions anytime they want. The `cancelSubscription` will cancel the subscription associated with the customer.

    ```
    await this.stripe.subscriptions.del(
        subscriptionId,
    );
    ```

    Cancels a customer's subscription immediately. The customer will not be charged again for the subscription. However, that any pending invoice items that you've created will still be charged for at the end of the period, unless manually deleted.

7.  **Trial period Wehbook**
