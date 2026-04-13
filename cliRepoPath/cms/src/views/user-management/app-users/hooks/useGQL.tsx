import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
    CREATE_APP_USER,
    DELETE_APP_USER,
    UPDATE_APP_USER,
    APP_USER_CHANGE_PASSWORD,
    SEND_RESET_PASSWORD_MAIL,
    GET_ALL_APP_USERS,
    GET_APP_USER,
    GET_PRESIGNED_URL 
} from '../graphql';
import {
    AppUserChangePasswordDTO,
    ChangePasswordResponse,
    CreateAppUserDTO,
    GetAppUsersDTO,
    MailResponse,
    UpdateAppUserDTO,
    UserResponse
} from '../constants/types';
import { PreSignedUrlInputDTO, PreSignedUrlResponse } from 'types/profile';

const useGQL = () => {
    const GET_USERS = () =>
        useQuery<UserResponse, GetAppUsersDTO>(GET_ALL_APP_USERS, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true
        });

    const CREATE_USER = () => useMutation<UserResponse, CreateAppUserDTO>(CREATE_APP_USER);

    const GET_USER = (id: string) =>
        useQuery<UserResponse, { id: string }>(GET_APP_USER, { variables: { id }, notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only' });

    const UPDATE_USER = () => useMutation<UserResponse, { id: string; input: UpdateAppUserDTO }>(UPDATE_APP_USER);
    const CHANGE_PASSWORD = () => useMutation<ChangePasswordResponse, { input: AppUserChangePasswordDTO }>(APP_USER_CHANGE_PASSWORD);

    const DELETE_USER = () => useMutation<UserResponse, { id: string }>(DELETE_APP_USER);

    const SEND_PASSWORD_RSET_MAIL = () =>
        useMutation<MailResponse, { userId: string; name: string; email: string }>(SEND_RESET_PASSWORD_MAIL);

    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    return { GET_USERS, GET_USER, CREATE_USER, UPDATE_USER, DELETE_USER, CHANGE_PASSWORD, SEND_PASSWORD_RSET_MAIL, IMAGE_UPLOAD };
};

export default useGQL;
