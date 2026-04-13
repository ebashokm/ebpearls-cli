import { gql } from "@apollo/client";

export const GET_ALL_APP_USERS = gql`
    query ($input: GetAppUsersDTO!) {
        getAllAppUsers(input: $input) {
            message
            users {
                _id
                authProviderId
                firstName
                lastName
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const GET_ALL_BUSINESS_USERS = gql`
    query ListBusiness($input: GetAllBusinessInputDTO!) {
        listBusiness(input: $input) {
            data {
                updatedAt
                name
                email
                createdAt
                _id
            }
            message
            pagination {
                hasNextPage
                total
            }
        }
    }
`;

export const GET_BUSINESS_USER_QUERY = gql`
    query GetBusinessUser($getBusinessUserId: String!) {
        getBusinessUser(id: $getBusinessUserId) {
            _id
            createdAt
            email
            name
            updatedAt
        }
    }
`;