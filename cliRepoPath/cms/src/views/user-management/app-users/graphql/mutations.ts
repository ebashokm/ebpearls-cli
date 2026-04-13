import { gql } from '@apollo/client';

export const CREATE_APP_USER = gql`
    mutation ($input: CreateAppUserDTO!) {
        createAppUser(input: $input) {
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
            }
        }
    }
`;

export const UPDATE_APP_USER = gql`
    mutation ($id: String!, $input: UpdateAppUserDTO!) {
        updateAppUser(id: $id, input: $input) {
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

export const DELETE_APP_USER = gql`
    mutation ($id: String!) {
        deleteAppUser(id: $id) {
            message
        }
    }
`;

export const APP_USER_CHANGE_PASSWORD = gql`
    mutation ($input: AppUserChangePasswordDTO!) {
        appUserchangePassword(input: $input) {
            message
        }
    }
`;

export const APP_USER_RESET_PASSWORD = gql`
    mutation ($input: AppUserResetPasswordDTO!) {
        appUserResetPassword(input: $input)
    }
`;

export const SEND_RESET_PASSWORD_MAIL = gql`
    mutation ($email: String!, $name: String!, $userId: String!) {
        sendPasswordResetMail(email: $email, name: $name, userId: $userId)
    }
`;