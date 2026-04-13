import { gql } from '@apollo/client';

export const CREATE_PAGE_WITH_VERSION_MUTATION = gql`
    mutation CreatePageWithVersion($body: CreatePageWithVersionInput!) {
        createPageWithVersion(body: $body) {
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

export const UPDATE_PAGE_WITH_VERSION_MUTATION = gql`
    mutation UpdatePageWithVersion($body: UpdatePageWithVersionInput!) {
        updatePageWithVersion(body: $body) {
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

export const REMOVE_PAGE_WITH_VERSION_MUTATION = gql`
    mutation RemovePageWithVersion($removePageWithVersionId: String!) {
        removePageWithVersion(id: $removePageWithVersionId) {
            message
        }
    }
`;