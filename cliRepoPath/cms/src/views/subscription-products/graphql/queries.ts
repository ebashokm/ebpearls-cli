import { gql } from '@apollo/client';

export const GET_SUBSCRIPTION_PRODUCTS = gql`
    query ($input: BasePaginationParams!) {
        findSubscriptionProducts(body: $input) {
            message
            data {
                _id
                name
                billingCycle
                productId
                description
                isActive
                createdAt
                updatedAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const GET_SUBSCRIPTION_PRODUCT = gql`
    query ($id: String!) {
        findSubscriptionProduct(id: $id) {
            _id
            name
            productId
            billingCycle
            description
            isActive
            createdAt
            updatedAt
            prices {
                price
                name
                currency
                isActive
                priceId
            }
        }
    }
`;
