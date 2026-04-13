import { gql } from '@apollo/client';

export const REMOVE_SUBSCRIPTION_PRODUCT = gql`
    mutation removeSubscriptionProduct($id: String!) {
        removeSubscriptionProduct(id: $id) {
            message
        }
    }
`;

export const CREATE_SUBSCRIPTION_PRODUCT = gql`
    mutation createSubscriptionProduct($input: CreateSubscriptionProductInput!) {
        createSubscriptionProduct(body: $input) {
            message
            data {
                name
                productId
                description
                isActive
                prices {
                    priceId
                    price
                    name
                    currency
                    isActive
                }
            }
        }
    }
`;

export const UPDATE_SUBSCRIPTION_PRODUCT = gql`
    mutation updateSubscriptionProduct($input: UpdateSubscriptionProductInput!) {
        updateSubscriptionProduct(body: $input) {
            message
            data {
                name
                productId
                description
                isActive
                prices {
                    priceId
                    price
                    name
                    currency
                    isActive
                }
            }
        }
    }
`;
