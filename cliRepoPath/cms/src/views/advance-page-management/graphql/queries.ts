import { gql } from '@apollo/client';

export const GET_ADMIN = gql`
    query ($id: String!) {
        getAdmin(id: $id) {
            message
            admin {
                _id
                firstName
                lastName
                email
                role
                status
                phone
            }
        }
    }
`;

export const LIST_PAGES = gql`
    query ($input: GetAdvancePagesDTO!) {
        listAdvancePages(input: $input) {
            message
            pages {
                _id
                title
                slug
                status
                content
                createdBy
                updatedAt
                createdAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const LIST_ALL_PAGES = gql`
    query ($input: GetAllAdvancePagesDTO!) {
        listAllAdvancePages(input: $input) {
            message
            pages {
                _id
                title
                slug
                status
            }
        }
    }
`;

export const LIST_PAGE = gql`
    query ($id: String!) {
        listAdvancePage(id: $id) {
            message
            page {
                _id
                title
                slug
                content
                status
                banner {
                    image
                    altText
                    slug
                    content
                    button {
                        heading
                        destinationUrl
                    }
                    uuid
                    index
                }
                homePage {
                    image
                    altText
                    slug
                    content
                    button {
                        heading
                        destinationUrl
                    }
                    uuid
                    index
                }
                imageColumn {
                    heading
                    sections {
                        id
                        image
                        alignment
                        iconHeading
                        subText
                    }
                    uuid
                    index
                }
                howItWorks {
                    heading
                    sections {
                        id
                        image
                        title
                        description
                    }
                    uuid
                    index
                }
                featuredProducts {
                    heading
                    sections {
                        id
                        image
                        name
                        productType
                    }
                    uuid
                    index
                }
                seoTags {
                    title
                    tags
                    description
                }
                faq {
                    showFaqs
                    selectedFaqs
                    uuid
                    index
                    disabled
                }
                testimonials {
                    heading
                    showTestimonials
                    uuid
                    index
                    disabled
                    selectedTestimonials
                }
                createdAt
                updatedAt
            }
        }
    }
`;


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

export const GET_ALL_TESTIMONIALS = gql`
    query ($input: GetTestimonialsDto!) {
        GetAllTestimonials(input: $input) {
            message
            testimonials {
                _id
                text
                customer {
                    id
                    name
                    location
                    image {
                        url
                        name
                        contentType
                        objectKey
                    }
                    comment
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

