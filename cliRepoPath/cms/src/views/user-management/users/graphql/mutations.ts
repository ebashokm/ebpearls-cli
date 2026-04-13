import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation ($input: CreateUserDTO!) {
        createUser(input: $input) {
            message
            user {
                _id
                name
                email
                password
                phone
                bio
                createdBy
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation ($id: String!, $input: UpdateUserDTO!) {
        updateUser(id: $id, input: $input) {
            message
            user {
                _id
                name
                email
                phone
                bio
                createdBy
            }
        }
    }
`;

export const DELETE_USER = gql`
    mutation ($id: String!) {
        deleteUser(id: $id) {
            message
        }
    }
`;

export const DELETE_ALL_USERS = gql`
    mutation {
        deleteAllUsers {
            message
        }
    }
`;
