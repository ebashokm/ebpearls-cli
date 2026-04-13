import { gql } from '@apollo/client';

export const LIST_TAXONOMIES = gql`
    query ($input: BasePaginationParams!) {
        listTaxonomies(input: $input) {
            message
            taxonomies {
                _id
                name
                createdAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const LIST_TAXONOMY = gql`
    query ($id: String!) {
        listTaxonomy(id: $id) {
            message
            taxonomy {
                _id
                name
                taxons {
                    name
                    uuid
                    metaTitle
                    metaDescription
                    metaKeywords
                    image {
                        name
                        contentType
                        objectKey
                    }
                    description
                    nestedUnder
                    slug
                    children {
                        name
                        uuid
                        metaTitle
                        metaDescription
                        metaKeywords
                        image {
                            name
                            contentType
                            objectKey
                        }
                        description
                        nestedUnder
                        slug
                        children {
                            name
                            uuid
                            metaTitle
                            metaDescription
                            metaKeywords
                            image {
                                name
                                contentType
                                objectKey
                            }
                            description
                            nestedUnder
                            slug
                        }
                    }
                }
            }
        }
    }
`;

export const GET_PRESIGNED_URL = gql`query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }`