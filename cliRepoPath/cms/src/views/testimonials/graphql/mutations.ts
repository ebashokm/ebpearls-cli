import { gql } from '@apollo/client';

export const CREATE_TESTIMONIALS = gql`
    mutation ($input: CreateTestimonialDto!) {
        createTestimonial(input: $input) {
            message
            testimonial {
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
        }
    }
`;

export const UPDATE_TESTIMONIALS = gql`
    mutation ($id: String!, $input: UpdateTestimonialDto!) {
        updateTestimonial(id: $id, input: $input) {
            message
            testimonial {
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
        }
    }
`;

export const REMOVE_TESTIMONIALS = gql`
    mutation ($id: String!) {
        removeTestimonial(id: $id) {
            message
        }
    }
`;

export const UPLOAD_TESTIMONIAL_IMAGE = gql`
    mutation ($input: uploadImageDTO!) {
        uploadTestimonialImage(input: $input) {
            url
        }
    }
`;