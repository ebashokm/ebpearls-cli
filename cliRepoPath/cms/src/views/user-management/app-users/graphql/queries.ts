import { gql } from '@apollo/client';

export const GET_ALL_APP_USERS = gql`
    query ($input: GetAppUsersDTO!) {
        getAllAppUsers(input: $input) {
            message
            users {
                _id
                authProvider
                authProviderId
                firstName
                lastName
                address {
                    displayAddress
                    location {
                        type
                        coordinates
                    }
                }
                bio
                status
                lastLoggedInAt
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

export const GET_APP_USER = gql`
    query ($id: String!) {
        getAppUser(id: $id) {
            message
            user {
                _id
                authProvider
                authProviderId
                firstName
                lastName
                address {
                    displayAddress
                    location {
                        type
                        coordinates
                    }
                }
                bio
                status
                lastLoggedInAt
                createdAt
                updatedAt
                profileImage
                profileImageUrl
            }
        }
    }
`;

export const GET_PRESIGNED_URL = gql`query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }`