import { gql } from '@apollo/client';

export const GET_FAQ_BY_SECTION = gql`
    query ($section: String!, $faqId: String!) {
        getFAQ(section: $section, faqId: $faqId) {
            message
            faq {
                _id
                section
                description
                content {
                    _id
                    question
                    answer
                }
            }
        }
    }
`;

export const GET_FAQ_LIST = gql`
    query ($input: GetFAQDto!) {
        getAllFAQ(input: $input) {
            message
            faqs {
                _id
                section
                description
                content {
                    _id
                    question
                    answer
                }
                createdAt
                updatedAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const FIND_FAQ_LIST = gql`
    query {
        findAllFAQ {
            message
            faqs {
                _id
                section
                description
                content {
                    _id
                    question
                    answer
                }
                createdAt
                updatedAt
            }
        }
    }
`;

export const GET_FAQ_GROUP_LIST = gql`
    query ($input: GroupFAQDTO!) {
        getFAQByGroup(input: $input) {
            message
            faqs {
                _id
                section
                description
                data {
                    _id
                    question
                    answer
                }
            }
        }
    }
`;

export const FILTER_FAQ_BY_SECTION = gql`
    query ($section: String!) {
        getFAQBySection(section: $section) {
            message
            faqs {
                section
                description
                content {
                    _id
                    question
                    answer
                }
            }
        }
    }
`;

export const GET_FAQ_BY_ID = gql`
    query ($docId: String!) {
        getFAQ(docId: $docId) {
            message
            faq {
                _id
                section
                description
                content {
                    _id
                    question
                    answer
                }
            }
        }
    }
`;
