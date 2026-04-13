import { IconButtonProps } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { FieldValueInit } from 'types';

export type Question = {
    id: string;
    title: string;
    description: string;
};

export type QuestionV1 = {
    _id: string;
    question: string;
    answer: string;
};

export type FormInputType = {
    section: string;
    description: string;
    question: {
        id?: string;
        title: string;
        description: string;
    }[];
};

export type FormInputTypeV1 = {
    _id?: string;
    section: string;
    description: string;
    content: {
        _id?: string;
        question: string;
        answer: string;
    }[];
};

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

export type GetFAQDto = {
    searchText?: string;
    orderBy?: string;
    order?: string;
    limit?: number;
    skip?: number;
};

export type CreateFAQDto = {
    section: string;
    description: string;
    content: ContentType[];
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

export interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

export type HeadCell1 = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

type MainField =
    | {
          name: string;
          mainHeading: {
              align: string;
              title: string;
              variant: string;
          };
          iconButtonDisable?: boolean;
          choice: {
              disabled?: boolean;
              name: string;
              type: string;
              label: string;
              meta?: {
                  buttonLabel: string;
              };
              placeholder?: string;
              options?: { value: string; label: string }[];
              customHandleChange?: (name, event, setFieldValue, handleChange) => void;
          }[];
      }[]
    | [];

type SubField =
    | {
          name: string;
          mainHeading: {
              align: string;
              title: string;
              variant: string;
              show?: boolean;
          };
          subHeading?: {
              align: string;
              title: string;
              variant: string;
          };
          iconButtonDisable: boolean;
          choice: {
              name: string;
              type: string;
              label: string;
              meta?: {
                  buttonLabel: string;
              };
              placeholder?: string;
              options?: { value: string; label: string }[];
              maxLength?: string;
          }[];
      }[]
    | [];

export type CustomFields = {
    main: MainField;
    sub: SubField;
}[];

export type mainFields = {
    faq: {
        section: string;
        description: string;
    }[];
};

export type subFields = {
    id: string;
    content: {
        question: string;
        answer: string;
    }[];
};

export type WrapperProps = {
    expand: boolean;
    children: React.ReactElement;
};

export type Props<T, U> = {
    keyName?: string;
    defaultValue: FieldValueInit<T, U & { id: string }>;
    fields: CustomFields;
    validationSchema: Object;
    sectionTitle: string;
    button: {
        show: boolean;
        buttonLabel: string;
    };

    iconButtonVisible: boolean;
    draggable: boolean;
    collapsible: boolean;
    mainCardSx?: Object;
    handleSubmit: (values: FieldValueInit<T, U & { id: string }>, setSubmitting: (isSubmitting: boolean) => void) => void;
    handleAdd?: (
        values: FieldValueInit<T, U & { id: string }>,
        setInitialState: Dispatch<SetStateAction<FieldValueInit<T, U & { id: string }>>>
    ) => void;
    handleRemove?: (
        id: string | undefined,
        values: FieldValueInit<T, U & { id: string }>,
        setInitialState: Dispatch<SetStateAction<FieldValueInit<T, U & { id: string }>>>
    ) => void;
    isLoaderShow?: boolean;
};