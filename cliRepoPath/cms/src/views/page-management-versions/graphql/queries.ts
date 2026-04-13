import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
    query {
        getUserProfile {
            _id
            firstName
            lastName
            email
            phone
            status
            role
            profileImage
            profileImageUrl
        }
    }
`;

export const GET_ALL_PAGES_WITH_VERSION = gql`
    query FindAllPagesWithVersiion($input: GetAllPagesWithVersionInputDTO!) {
        findAllPagesWithVersiion(input: $input) {
            message
            pagination {
                hasNextPage
                total
            }
            data {
                _id
                createdAt
                updatedAt
                title
                slug
                content
                status
                seoTags {
                    title
                    description
                    tags
                }
                pageType
                version
            }
        }
    }
`;

export const GET_PAGE_DETAIL_WITH_VERSION = gql`
    query GetPageWithVersion($getPageWithVersionId: String!) {
        getPageWithVersion(id: $getPageWithVersionId) {
            _id
            createdAt
            updatedAt
            title
            slug
            content
            status
            seoTags {
                title
                description
                tags
            }
            pageType
            version
        }
    }
`;