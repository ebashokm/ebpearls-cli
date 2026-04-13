import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
// import { GET_PRESIGNED_URL, GET_AUTH_URL, VERIFY_OTP, AUTH_OTP_DISABLE } from 'grapqhl';

import {
    Admin,
    AdminResponse,
    OTPAuthUrlResponse,
    PreSignedUrlInputDTO,
    PreSignedUrlResponse,
    UserProfileResponse,
    VerifyOTPAuthUrlResponse
} from '../../../types/profile';
import {UPDATE_ADMIN } from 'views/user-management/admins/graphql';

import { CHANGE_PASSWORD, GET_USER_PROFILE, GET_PRESIGNED_URL, GET_AUTH_URL, VERIFY_OTP, AUTH_OTP_DISABLE } from '../graphql';


export const useGQL = () => {
    const ADMIN_CHANGE_PASSWORD = () => useMutation(CHANGE_PASSWORD);
    const GET_ADMIN_PROFILE = () => useQuery<UserProfileResponse>(GET_USER_PROFILE);
    const UPDATE_ADMIN_PROFILE = () => useMutation<AdminResponse, { id: string; input: Partial<Admin> }>(UPDATE_ADMIN);
    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);
    const GET_OTP_AUTH_URL = (skipCondition) => useQuery<OTPAuthUrlResponse>(GET_AUTH_URL, { skip: skipCondition });
    const VERIFY_AUTH_OTP = () => useMutation<VerifyOTPAuthUrlResponse, { token: string }>(VERIFY_OTP);
    const DISABLE_AUTH_OTP = () => useMutation<any, { token: string }>(AUTH_OTP_DISABLE);

    return {
        ADMIN_CHANGE_PASSWORD,
        GET_ADMIN_PROFILE,
        UPDATE_ADMIN_PROFILE,
        IMAGE_UPLOAD,
        GET_OTP_AUTH_URL,
        VERIFY_AUTH_OTP,
        DISABLE_AUTH_OTP
    };
};
