import { useMutation, useQuery } from '@apollo/client';
import {
    GET_USER_PROFILE,
    CREATE_PAGE_WITH_VERSION_MUTATION,
    GET_ALL_PAGES_WITH_VERSION,
    GET_PAGE_DETAIL_WITH_VERSION,
    UPDATE_PAGE_WITH_VERSION_MUTATION,
    REMOVE_PAGE_WITH_VERSION_MUTATION
} from '../graphql';

import { PageManagement, PageManagementResponse } from '../types';
import { AdvancePageDto, CreateAdvancePageResponse } from '../types/gql/advancedPage';

export const useGQL = () => {
    const CREATE_PAGE_WITH_VERSION = () => useMutation(CREATE_PAGE_WITH_VERSION_MUTATION);


    const GET_ADMIN_PROFILE = () => useQuery(GET_USER_PROFILE);
    const GET_ALL_LIST_PAGES_WITH_VERSION = () =>
        useQuery(GET_ALL_PAGES_WITH_VERSION, {
            variables: {
                input: {}
            },
            notifyOnNetworkStatusChange: true
        });
    const GET_PAGE_WITH_VERSION = (getPageWithVersionId: string) => useQuery(GET_PAGE_DETAIL_WITH_VERSION, {
        variables: {
            getPageWithVersionId
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only'
    });
    const UPDATE_PAGE_WITH_VERSION = () => useMutation(UPDATE_PAGE_WITH_VERSION_MUTATION);
    const REMOVE_PAGE_WITH_VERSION = () => useMutation(REMOVE_PAGE_WITH_VERSION_MUTATION);
        

    return {
        CREATE_PAGE_WITH_VERSION,
        UPDATE_PAGE_WITH_VERSION,
        GET_ADMIN_PROFILE,
        GET_ALL_LIST_PAGES_WITH_VERSION,
        GET_PAGE_WITH_VERSION,
        REMOVE_PAGE_WITH_VERSION
    };
};
