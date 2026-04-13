import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
    mutation ($input: ChangePasswordDTO!) {
        changePassword(input: $input) {
            message
            status
        }
    }
`;

// export const GET_PRESIGNED_URL = gql`
//     mutation ($input: PreSignedUrlInput!) {
//         getPreSignedUrl(input: $input) {
//             url
//         }
//     }
// `;

export const VERIFY_OTP = gql`
    mutation ($token: String!) {
        verifyAuthOTP(token: $token) {
            message
        }
    }
`;
export const AUTH_OTP_DISABLE = gql`
    mutation ($token: String!) {
        disableAuthOTP(token: $token)
    }
`;
