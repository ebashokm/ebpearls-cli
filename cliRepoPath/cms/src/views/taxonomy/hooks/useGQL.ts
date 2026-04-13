import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import {
    CREATE_TAXONOMY as CREATE_TAXONOMYS,
    UPDATE_TAXONOMY as TAXONOMY_UPDATE,
    DELETE_TAXONOMY as TAXONOMY_DELETE,
    LIST_TAXONOMY as GET_LIST_TAXONOMY,
    LIST_TAXONOMIES as GET_TAXONOMIES_LIST,
    GET_PRESIGNED_URL
} from '../graphql';

import { PreSignedUrlInputDTO, PreSignedUrlResponse } from 'types/file-upload';

type BasePaginationParams = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

const useGQL = () => {
    const CREATE_TAXONOMY = () => useMutation(CREATE_TAXONOMYS);
    const UPDATE_TAXONOMY = () => useMutation(TAXONOMY_UPDATE);
    const DELETE_TAXONOMY = () => useMutation(TAXONOMY_DELETE);
    const LIST_TAXONOMY = (id: String | undefined) => useQuery(GET_LIST_TAXONOMY, { variables: { id }, fetchPolicy: 'network-only' });
    const LIST_TAXONOMIES = (input: BasePaginationParams = {}) =>
        useQuery(GET_TAXONOMIES_LIST, { variables: { input }, notifyOnNetworkStatusChange: true });
    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    return {
        CREATE_TAXONOMY,
        UPDATE_TAXONOMY,
        DELETE_TAXONOMY,
        LIST_TAXONOMY,
        LIST_TAXONOMIES,
        IMAGE_UPLOAD
    };
};

export default useGQL;
