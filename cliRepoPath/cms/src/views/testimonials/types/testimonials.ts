export type FileType = {
    name: string;
    objectKey: string;
    contentType: string;
    url?: string;
};

export type FileUploadParams = {
    event: any;
    uploadFunction: any;
    contentType?: string;
    filename?: string;
};

export type Customer = {
    id: string;
    comment: string;
    image: FileType;
    name: string;
    location: string;
};

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type Testimonial = {
    _id: string;
    text: string;
    customer: Customer[];
    createdAt: Date;
    updatedAt: Date;
};

export type CreateTestimonialDto = {
    text: string;
    customer: Customer[];
};

export type UpdateTestimonialDto = Partial<CreateTestimonialDto>;

export type GetTestimonialsDto = {
    searchText: string;
    orderBy: string;
    order: string | undefined;
    limit: number;
    skip: number;
};

export type TestimonialsResponseType = {
    message: string;
    pagination: Pagination;
    testimonials: Testimonial[];
    testimonial: Testimonial;
};

export type TestimonialsResponse = {
    createTestimonial: Pick<TestimonialsResponseType, 'message' | 'testimonial'>;
    updateTestimonial: Pick<TestimonialsResponseType, 'message' | 'testimonial'>;
    GetAllTestimonials: Omit<TestimonialsResponseType, 'testimonial'>;
    GetTestimonial: Omit<TestimonialsResponseType, 'testimonials' | 'pagination'>;
    removeTestimonial: Pick<TestimonialsResponseType, 'message'>;
};
