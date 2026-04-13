import { gql } from '@apollo/client';

export const CREATE_BANK_ACCOUNT_LINK = gql`
    mutation ($input: CreateBankAccountLinkInput!) {
        createBankAccountLink(body: $input) {
            object
            created
            expires_at
            url
        }
    }
`;

export const CREATE_CUSTOM_CONNECT_ACCOUNT = gql`
    mutation {
        createCustomConnectAccount {
            message
            connectAccountId
        }
    }
`;

export const CREATE_PAYMENT_INTENT = gql`
    mutation ($input: CreatePaymentIntentInput!) {
        createPaymentIntent(body: $input) {
            clientSecret
        }
    }
`;
