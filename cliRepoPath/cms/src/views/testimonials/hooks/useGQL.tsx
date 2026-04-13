import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { TestimonialsResponse, CreateTestimonialDto, UpdateTestimonialDto, GetTestimonialsDto } from '../types/testimonials';

import {
    GET_PRESIGNED_URL,
    UPLOAD_TESTIMONIAL_IMAGE as IMG_TEST_UPLOAD,
    GET_ALL_TESTIMONIALS,
    GET_TESTIMONIAL_BY_ID,
    CREATE_TESTIMONIALS as CREATE,
    REMOVE_TESTIMONIALS as REMOVE,
    UPDATE_TESTIMONIALS as UPDATE
} from '../graphql';
import { PreSignedUrlInputDTO, PreSignedUrlResponse } from 'types/file-upload';
const useGQL = () => {
    const CREATE_TESTIMONIAL = () => useMutation<TestimonialsResponse, { input: CreateTestimonialDto }>(CREATE);
    const UPDATE_TESTIMONIAL = () => useMutation<TestimonialsResponse, { id: string; input: UpdateTestimonialDto }>(UPDATE);
    const REMOVE_TESTIMONIAL = () => useMutation<TestimonialsResponse, { id: string }>(REMOVE);

    const IMAGE_UPLOAD = () => useLazyQuery(GET_PRESIGNED_URL);

    const GET_TESTIMONIALS_LIST = (input: GetTestimonialsDto) =>
        useQuery<TestimonialsResponse, { input: GetTestimonialsDto }>(GET_ALL_TESTIMONIALS, {
            variables: { input },
            notifyOnNetworkStatusChange: true
        });

    const GET_TESTIMONIAL = (id: string) =>
        useQuery<TestimonialsResponse, { id: string }>(GET_TESTIMONIAL_BY_ID, { variables: { id }, fetchPolicy: 'network-only' });
    const UPLOAD_TESTIMONIAL_IMAGE = () => useMutation(IMG_TEST_UPLOAD);
    return {
        CREATE_TESTIMONIAL,
        UPDATE_TESTIMONIAL,
        REMOVE_TESTIMONIAL,
        GET_TESTIMONIAL,
        GET_TESTIMONIALS_LIST,
        UPLOAD_TESTIMONIAL_IMAGE,
        IMAGE_UPLOAD
    };
};

export default useGQL;
