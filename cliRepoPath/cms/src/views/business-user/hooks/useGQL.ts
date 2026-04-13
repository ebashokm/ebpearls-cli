import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_BUSINESS_USER_MUTATION,
    UPDATE_BUSINESS_USER_MUTATION,
    DELETE_BUSINESS_USER_MUTATION,
    GET_ALL_APP_USERS,
    GET_ALL_BUSINESS_USERS,
    GET_BUSINESS_USER_QUERY
} from '../graphql';
import { GetAppUsersDTO, UserResponse } from '../types';

export const useGQL = () => {
    const GET_USERS = (limit: number, searchText: string) =>
        useQuery<UserResponse, GetAppUsersDTO>(GET_ALL_APP_USERS, {
            variables: {
                input: {
                    limit,
                    searchText
                }
            },
            notifyOnNetworkStatusChange: true
        });
        const GET_BUSINESS_USERS = () =>
            useQuery(GET_ALL_BUSINESS_USERS, {
                variables: {
                    input: {}
                },
                notifyOnNetworkStatusChange: true
            });
    const CREATE_BUSINESS_USER = () => useMutation(CREATE_BUSINESS_USER_MUTATION);
    const UPDATE_BUSINESS_USER = () => useMutation(UPDATE_BUSINESS_USER_MUTATION);
    const DELETE_BUSINESS_USER = () => useMutation(DELETE_BUSINESS_USER_MUTATION);
    const GET_BUSINESS_USER = (getBusinessUserId: string) =>
        useQuery(GET_BUSINESS_USER_QUERY, {
            variables: {
                getBusinessUserId
            },
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only'
        });


    return {
        GET_USERS,
        GET_BUSINESS_USERS,
        CREATE_BUSINESS_USER,
        UPDATE_BUSINESS_USER,
        DELETE_BUSINESS_USER,
        GET_BUSINESS_USER
    };
};
