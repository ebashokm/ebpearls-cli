import { useMutation, useQuery } from '@apollo/client';
import { AdvancePageDto, CreateAdvancePageResponse } from '../types/gql/advancedPage';

import { FAQResponse, GetTestimonialsDto, TestimonialsResponse } from '../types/types';

import {
    UPDATE_PAGE as UPDATE_PG,
    DELETE_PAGE as DELETE_PG,
    LIST_PAGE as GET_LIST_PAGE,
    LIST_PAGES as GET_LIST_PAGES,
    UPLOAD_PAGE_IMAGE as IMG_UPLOAD,
    GET_ADMIN as ADMIN,
    FIND_FAQ_LIST,
    GET_ALL_TESTIMONIALS,
    CREATE_ADVANCE_PAGE,
} from '../graphql';

type GetPagesDTO = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};
export const useGQL = () => {
    const CREATE_ADV_PAGE = () => useMutation<CreateAdvancePageResponse, { input: AdvancePageDto }>(CREATE_ADVANCE_PAGE);
    const LIST_PAGES = (input: GetPagesDTO = {}) => useQuery(GET_LIST_PAGES, { variables: { input }, notifyOnNetworkStatusChange: true });
    const LIST_PAGE = (id: String) => useQuery(GET_LIST_PAGE, { variables: { id } });
    const UPDATE_PAGE = () => useMutation(UPDATE_PG);
    const UPLOAD_PAGE_IMAGE = () => useMutation(IMG_UPLOAD);
    const GET_ADMIN = (id: String) => useQuery(ADMIN, { variables: { id } });

    // const UPDATE_ADVANCE_PAGE = () => useMutation(UPDATE_PG);
    const DELETE_PAGE = () => useMutation(DELETE_PG);

    const FIND_ALL_FAQS = () => useQuery<FAQResponse>(FIND_FAQ_LIST);

    const GET_TESTIMONIALS_LIST = (input: GetTestimonialsDto) =>
        useQuery<TestimonialsResponse, { input: GetTestimonialsDto }>(GET_ALL_TESTIMONIALS, {
            variables: { input },
            notifyOnNetworkStatusChange: true
        });

    return { DELETE_PAGE, CREATE_ADV_PAGE, LIST_PAGES, LIST_PAGE, UPDATE_PAGE, UPLOAD_PAGE_IMAGE, GET_ADMIN, FIND_ALL_FAQS, GET_TESTIMONIALS_LIST };
};
