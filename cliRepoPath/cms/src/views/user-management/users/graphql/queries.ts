import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query {
        getUserProfile {
            _id
            firstName
            lastName
            email
            phone
            status
            role
            profileImage
            profileImageUrl
        }
    }
`;

export const GET_USER = gql`
    query ($id: String!) {
        getUser(id: $id) {
            message
            user {
                _id
                name
                email
                phone
                bio
                admin {
                    _id
                    name
                    email
                    role
                }
            }
        }
    }
`;

export const GET_ALL_USERS = gql`
    query ($input: GetUsersDTO!) {
        getAllUsers(input: $input) {
            message
            users {
                _id
                name
                email
                bio
                phone
                admin {
                    _id
                    name
                    email
                    phone
                    role
                }
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;
