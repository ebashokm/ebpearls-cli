import { gql } from '@apollo/client';

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
