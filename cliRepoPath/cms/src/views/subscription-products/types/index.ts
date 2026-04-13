import { BasePaginationResponse } from "types/pagination";

export enum BillingCycleEnum {
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    BI_YEARLY = 'BI_YEARLY',
    YEARLY = 'YEARLY'
}

export const BillingCycleMap = {
    Monthly: 'MONTHLY',
    Quarterly: 'QUARTERLY',
    Bi_Yearly: 'BI_YEARLY',
    Yearly: 'YEARLY'
};

export enum ProductStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export const ActiveStatus = [
    {
        value: 'Active',
        label: 'Active'
    },
    {
        value: 'Inactive',
        label: 'Inactive'
    }
];

export const activeStatusMap = {
    Active: true,
    Inactive: false
};

export const BillingCycles = [
    {
        value: 'MONTHLY',
        label: 'Monthly'
    },
    {
        value: 'QUARTERLY',
        label: 'Quarterly'
    },
    {
        value: 'BI_YEARLY',
        label: 'Bi_Yearly'
    },
    {
        value: 'YEARLY',
        label: 'Yearly'
    }
];

export type SubscriptionProduct = {
    _id: string;
    name: string;
    description: string;
    isActive: string;
    createdAt: string;
    updatedAt: string;
};

export type Price = {
    price: number;
    name?: string;
    currency?: string;
    isActive?: boolean;
};

export type CreateProductDto = {
    productName: string;
    description?: string;
    isActive?: boolean;
    billingCycle: BillingCycleEnum;
    prices?: Price[];
};

export type UpdateProductDto = {
    id: string;
    productName: string;
    description?: string;
    isActive?: boolean;
    billingCycle: BillingCycleEnum;
    prices?: Price[];
};

export type PriceInput = {
    price: number;
    name?: string;
    currency?: string;
    status?: string;
};

export type FormInputType = {
    productName: string;
    description?: string;
    status: string;
    billingCycle?: BillingCycleEnum;
    prices: PriceInput[];
};

export type SubscriptionProductsListResponse = {
    message: string;
    data: SubscriptionProduct[];
    pagination: BasePaginationResponse;
};

export type CreateSubscriptionProductResponse = {
    message: string;
    data: SubscriptionProduct;
};

export type UpdateSubscriptionProductResponse = {
    message: string;
    data: SubscriptionProduct;
};

export type SubscriptionProductsResponse = {
    findSubscriptionProducts: SubscriptionProductsListResponse;
    createSubscriptionProduct: CreateSubscriptionProductResponse;
    updateSubscriptionProduct: UpdateSubscriptionProductResponse;
};

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

