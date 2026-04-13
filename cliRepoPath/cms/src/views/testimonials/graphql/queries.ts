import { gql } from '@apollo/client';

export const GET_TESTIMONIAL_BY_ID = gql`
    query ($id: String!) {
        GetTestimonial(id: $id) {
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

export const GET_PRESIGNED_URL = gql`query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }`