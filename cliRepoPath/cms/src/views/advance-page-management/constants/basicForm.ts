import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import slugify from 'slugify';
import { CustomFields } from 'types';

export type mainFields = {
    header: {
        title: string;
        slug: string;
        status: string;
        seoTitle: string;
        seoTags: string;
        seoDescription: string;
    }[];
};

export const defaultValue = {
    main: [
        {
            id: uuid(),
            header: [{ title: '', slug: '', status: '', seoTitle: '', seoTags: '', seoDescription: '' }]
        }
    ],

    sub: []
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'header',
                mainHeading: { align: 'left', title: 'Page Details', variant: 'h4' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Page Title',
                        customHandleChange: (name, event, setFieldValue, handleChange) => {
                            setFieldValue('main[0][header][0][slug]', slugify(event.target.value).toLowerCase());
                            handleChange(event);
                        }
                    },
                    {
                        disabled: true,
                        name: 'slug',
                        type: 'text',
                        label: 'Slug',
                        placeholder: 'Slug'
                    },
                    {
                        name: 'status',
                        type: 'select',
                        label: 'Page Status',
                        options: [
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' }
                        ]
                    },
                    {
                        name: 'seoTitle',
                        type: 'text',
                        label: 'Seo Title',
                        placeholder: 'Meta title'
                    },
                    {
                        name: 'seoTags',
                        type: 'text',
                        label: 'Seo Tags',
                        placeholder: 'Tags'
                    },
                    {
                        name: 'seoDescription',
                        type: 'textarea',
                        label: 'SEO Description',
                        placeholder: 'Meta description'
                    }
                ]
            }
        ],
        sub: []
    }
];

export const validationSchema = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            header: Yup.array().of(
                Yup.object().shape({
                    title: Yup.string()
                        .trim()
                        .required('Title is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    slug: Yup.string().trim().required('Slug is a required field'),
                    status: Yup.string().trim().required('Status is a required field'),
                    seoTitle: Yup.string()
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    seoTags: Yup.string()
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    seoDescription: Yup.string()
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(200, 'Must not be more than 200 characters')
                })
            ),
            seoTags: Yup.array().of(Yup.object().shape({}))
        })
    )
});
