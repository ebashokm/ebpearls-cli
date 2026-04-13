import { useMutation, useQuery } from '@apollo/client';
import { GetUserDTO, GetUsersDTO, UpdateUserDTO, UserResponse } from '../constants/types';
import { GET_USER_PROFILE, DELETE_USER as DELETE_USR, UPDATE_USER, GET_ALL_USERS, GET_USER as SINGLE_USER } from '../graphql';

const useGQL = () => {
    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);

    const GET_USERS = () =>
        useQuery<UserResponse, GetUsersDTO>(GET_ALL_USERS, {
            variables: { input: {} },
            notifyOnNetworkStatusChange: true
        });

    const GET_USER = (id: string) =>
        useQuery<UserResponse, GetUserDTO>(SINGLE_USER, { variables: { id }, notifyOnNetworkStatusChange: true });

    const UPDATE_USER_DETAILS = () => useMutation<UserResponse, { id: string; input: UpdateUserDTO }>(UPDATE_USER);

    const DELETE_USER = () => useMutation<UserResponse, { id: string }>(DELETE_USR);

    return { GET_ADMIN_PROFILE, GET_USERS, GET_USER, UPDATE_USER_DETAILS, DELETE_USER };
};

export default useGQL;
