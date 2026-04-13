type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type ContentType = {
    _id: string;
    question: string;
    answer: string;
};

export type FAQ = {
    _id: string;
    section: string;
    description: string;
    content: ContentType[];
    createdAt: Date;
    updatedAt: Date;
};

export type FAQResponseType1 = {
    message: string;
    faqs?: FAQ[];
};

type FAQResponseType = {
    message: string;
    pagination?: Pagination;
    faq?: FAQ;
    faqs?: FAQ[];
};


export type AllFAQResponse = {
    getAllFAQ: FAQResponseType;
    findAllFAQ: FAQResponseType1;
    getFAQ: FAQResponseType;
    createFAQ: FAQResponseType;
    updateFAQ: FAQResponseType;
    deleteFAQ: FAQResponseType;
    getFAQBySection: FAQResponseType;
    deleteFAQById: FAQResponseType;
};

export type FAQResponse = AllFAQResponse;

export enum PageStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export type FileType = {
    name: string;
    objectKey: string;
    contentType: string;
    url?: string;
};
export type Customer = {
    id: string;
    comment: string;
    image: FileType;
    name: string;
    location: string;
};

export type GetTestimonialsDto = {
    searchText: string;
    orderBy: string;
    order: string | undefined;
    limit: number;
    skip: number;
};

export type Testimonial = {
    _id: string;
    text: string;
    customer: Customer[];
    createdAt: Date;
    updatedAt: Date;
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