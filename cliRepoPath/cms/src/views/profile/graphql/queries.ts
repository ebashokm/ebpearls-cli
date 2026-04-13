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

export const GET_AUTH_URL = gql`
    query {
        generateOtpAuthUrl {
            base32
            otpAuthUrl
        }
    }
`;

export const GET_PRESIGNED_URL = gql`
    query GetPreSignedUrl($input: PreSignedUrlInput!) {
        getPreSignedUrl(input: $input) {
            message
            url
        }
    }
`;