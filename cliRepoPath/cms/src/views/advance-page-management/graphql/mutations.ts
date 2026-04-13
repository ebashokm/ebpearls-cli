import { gql } from '@apollo/client';

export const CREATE_ADVANCE_PAGE = gql`
    mutation ($input: CreateAdvancePageDTO!) {
        createAdvancePage(input: $input) {
            message
            page {
                _id
                title
                status
                slug
                content
            }
        }
    }
`;

export const UPDATE_PAGE = gql`
    mutation ($id: String!, $input: UpdateAdvancePageDTO!) {
        updateAdvancePage(id: $id, input: $input) {
            message
            page {
                _id
                title
                slug
                status
                content
            }
        }
    }
`;

export const DELETE_PAGE = gql`
    mutation ($id: String!) {
        deleteAdvancePage(id: $id) {
            message
        }
    }
`;

export const UPLOAD_PAGE_IMAGE = gql`
    mutation ($input: uploadImageDTO!) {
        uploadPageImage(input: $input) {
            url
        }
    }
`;

export const CREATE_FAQS = gql`
    mutation ($input: CreateFAQDto!) {
        createFAQ(input: $input) {
            message
        }
    }
`;

export const UPDATE_FAQ_BY_SECTION = gql`
    mutation ($section: String!, $description: String!, $input: UpdateFAQDto!) {
        updateFAQ(section: $section, description: $description, input: $input) {
            message
        }
    }
`;

export const UPDATE_FAQ_BY_ID = gql`
    mutation ($docId: String!, $input: UpdateFAQDto!) {
        updateFAQ(docId: $docId, input: $input) {
            message
        }
    }
`;

export const DELETE_FAQ_BY_SECTION = gql`
    mutation ($section: String!, $faqId: String!) {
        deleteFAQ(section: $section, faqId: $faqId) {
            message
        }
    }
`;

export const DELETE_FAQ_BY_ID = gql`
    mutation ($docId: String!) {
        deleteFAQById(docId: $docId) {
            message
        }
    }
`;