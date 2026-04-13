import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import {
    UPLOAD_MENU_IMAGE as IMG_UPLOAD,
    CREATE_MENU as CREATE_MENUS,
    LIST_MENUS as GET_LIST_MENUS,
    DELETE_MENU as MENU_DELETE,
    UPDATE_MENU as MENU_UPDATE,
    UPDATE_MENU_STATUS as MENU_STATUS_UPDATE,
    LIST_MENU as GET_LIST_MENU,
    LIST_TAXONOMIES as GET_TAXONOMIES_LIST,
    LIST_PAGES as GET_LIST_PAGES,
    LIST_ALL_PAGES as GET_LIST_ALL_PAGES,
    GET_PRESIGNED_URL
} from '../graphql';
import { PageStatus } from '../types/menu';
import { PreSignedUrlInputDTO, PreSignedUrlResponse } from 'types/file-upload';

type GetMenusDTO = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

type BasePaginationParams = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

type GetPagesDTO = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
    status?: PageStatus | string;
};

type GetAllPagesDTO = {
    status?: PageStatus | string;
};

const useGQL = () => {
    const CREATE_MENU = () => useMutation(CREATE_MENUS);
    const LIST_MENUS = (input: GetMenusDTO = {}) => useQuery(GET_LIST_MENUS, { variables: { input }, notifyOnNetworkStatusChange: true });
    const DELETE_MENU = () => useMutation(MENU_DELETE);
    const LIST_MENU = (id: String | undefined) => useQuery(GET_LIST_MENU, { variables: { id }, fetchPolicy: 'network-only' });
    const UPDATE_MENU = () => useMutation(MENU_UPDATE);
    const UPDATE_MENU_STATUS = () => useMutation(MENU_STATUS_UPDATE);
    const UPLOAD_MENU_IMAGE = () => useMutation(IMG_UPLOAD);
    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    const LIST_TAXONOMIES = (input: BasePaginationParams = {}) =>
        useQuery(GET_TAXONOMIES_LIST, { variables: { input }, notifyOnNetworkStatusChange: true });

    const LIST_PAGES = (input: GetPagesDTO = {}) => useQuery(GET_LIST_PAGES, { variables: { input }, notifyOnNetworkStatusChange: true });
    const LIST_ALL_PAGES = (input: GetAllPagesDTO = {}) =>
        useQuery(GET_LIST_ALL_PAGES, { variables: { input }, notifyOnNetworkStatusChange: true });
    return {
        CREATE_MENU,
        LIST_MENUS,
        DELETE_MENU,
        LIST_MENU,
        UPDATE_MENU,
        UPDATE_MENU_STATUS,
        UPLOAD_MENU_IMAGE,
        LIST_TAXONOMIES,
        LIST_PAGES,
        LIST_ALL_PAGES,
        IMAGE_UPLOAD
    };
};

export default useGQL;
