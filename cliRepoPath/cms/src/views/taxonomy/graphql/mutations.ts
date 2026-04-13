import { gql } from "@apollo/client";

export const CREATE_TAXONOMY = gql`
    mutation ($input: CreateTaxonomyDTO!) {
        createTaxonomy(input: $input) {
            message
            taxonomy {
                _id
                name
            }
        }
    }
`;

export const UPDATE_TAXONOMY = gql`
    mutation ($id: String!, $input: CreateTaxonomyDTO!) {
        updateTaxonomy(id: $id, input: $input) {
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
                        }
                    }
                }
            }
        }
    }
`;

export const DELETE_TAXONOMY = gql`
    mutation ($id: String!) {
        deleteTaxonomy(id: $id) {
            message
        }
    }
`;

export const UPLOAD_TAXONOMY_IMAGE = gql`
    mutation ($input: uploadImageDTO!) {
        uploadTaxonomyImage(input: $input) {
            url
        }
    }
`;