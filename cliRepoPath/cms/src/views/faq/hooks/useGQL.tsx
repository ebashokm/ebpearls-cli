import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_FAQS,
    DELETE_FAQ_BY_ID,
    DELETE_FAQ_BY_SECTION,
    UPDATE_FAQ_BY_ID,
    UPDATE_FAQ_BY_SECTION,
    FILTER_FAQ_BY_SECTION,
    GET_FAQ_BY_ID,
    GET_FAQ_LIST,
    FIND_FAQ_LIST
} from '../graphql';
import { CreateFAQDto, FAQResponse, FAQResponseType1, GetFAQDto } from '../types';

export const useGQL = () => {
    const CREATE_FAQ_LIST = () =>
        useMutation<FAQResponse, { input: CreateFAQDto }>(CREATE_FAQS, {
            refetchQueries: [{ query: GET_FAQ_LIST, variables: { input: {} } }]
        });

    const UPDATE_FAQ = () =>
        useMutation<FAQResponse, { section: string; description: string; input: Partial<CreateFAQDto> }>(UPDATE_FAQ_BY_SECTION, {
            refetchQueries: [{ query: GET_FAQ_LIST, variables: { input: {} } }]
        });

    const UPDATE_ON_FAQ_ID = () => useMutation<FAQResponse, { docId: string; input: Partial<CreateFAQDto> }>(UPDATE_FAQ_BY_ID);

    const DELETE_FAQ = () => useMutation<FAQResponse, { section: string; faqId: string }>(DELETE_FAQ_BY_SECTION);

    const DELETE_ON_FAQ_ID = () =>
        useMutation<FAQResponse, { docId: string }>(DELETE_FAQ_BY_ID, {
            refetchQueries: [{ query: GET_FAQ_LIST, variables: { input: {} } }]
        });

    const GET_ALL_FAQS = (input: GetFAQDto) =>
        useQuery<FAQResponse, { input: GetFAQDto }>(GET_FAQ_LIST, { variables: { input }, notifyOnNetworkStatusChange: true });

    const FIND_ALL_FAQS = () => useQuery<FAQResponse>(FIND_FAQ_LIST);

    const FAQ_FILTER_LIST = (section: string) =>
        useQuery<FAQResponse, { section: string }>(FILTER_FAQ_BY_SECTION, { variables: { section } });

    const GET_FAQ = (docId: string) => useQuery<FAQResponse, { docId: string }>(GET_FAQ_BY_ID, { variables: { docId } });

    return {
        CREATE_FAQ_LIST,
        UPDATE_FAQ,
        DELETE_FAQ,
        GET_ALL_FAQS,
        FAQ_FILTER_LIST,
        UPDATE_ON_FAQ_ID,
        GET_FAQ,
        DELETE_ON_FAQ_ID,
        FIND_ALL_FAQS
    };
};
