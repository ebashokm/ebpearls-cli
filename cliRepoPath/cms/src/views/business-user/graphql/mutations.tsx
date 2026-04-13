import { gql } from "@apollo/client";
 
export const CREATE_BUSINESS_USER_MUTATION = gql`
    mutation CreateBusinessUser($createBusinessUserInput: CreateBusinessUserInput!) {
        createBusinessUser(createBusinessUserInput: $createBusinessUserInput) {
            _id
            createdAt
            updatedAt
            name
            email
        }
    }
`;

export const UPDATE_BUSINESS_USER_MUTATION = gql`
    mutation UpdateBusinessUser($updateBusinessUserInput: UpdateBusinessUserInput!) {
        updateBusinessUser(updateBusinessUserInput: $updateBusinessUserInput) {
            _id
            createdAt
            updatedAt
            name
            email
        }
    }
`;

export const DELETE_BUSINESS_USER_MUTATION = gql`mutation DeleteBusinessUser($deleteBusinessUserId: String!) {
  deleteBusinessUser(id: $deleteBusinessUserId) {
    message
  }
}`;