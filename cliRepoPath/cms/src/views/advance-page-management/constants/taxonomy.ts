import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';
import lang from 'constants/language';
import slugify from 'slugify';

export type mainFields = {
    header: {
        name: string;
        metaTitle: string;
        metaDescription: string;
        metaKeywords: string;
        image: string;
        description: string;
        nestedUnder: string;
    }[];
};

export type taxonValue = {
    name: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    image: string;
    description: string;
    nestedUnder: string;
};

export type nestedType = [
    {
        label: string;
        value: string;
    }
];
// export const defaultValue = {
//     main: [
//         {
//             id: uuid(),
//             header: [{ name: '', metaTitle: '', metaDescription: '', metaKeywords: '', image: '', description: '', nestedUnder: '' }]
//         }
//     ],

//     sub: []
// };

export const defaultValue = {
    name: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    image: '',
    description: '',
    nestedUnder: ''
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'header',
                mainHeading: { align: 'left', title: 'Taxon Details', variant: 'h4' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        placeholder: 'Name',
                        customHandleChange: (name, event, setFieldValue, handleChange) => {
                            setFieldValue('main[0][header][0][slug]', slugify(event.target.value).toLowerCase());
                            handleChange(event);
                        }
                    },
                    {
                        disabled: true,
                        name: 'slug',
                        type: 'text',
                        label: ''
                    },
                    {
                        name: 'metaTitle',
                        type: 'text',
                        label: 'Meta Title',
                        placeholder: 'Meta Title'
                    },
                    {
                        name: 'metaDescription',
                        type: 'text',
                        label: 'Meta Description',
                        placeholder: 'Meta Description'
                    },
                    {
                        name: 'metaKeywords',
                        type: 'text',
                        label: 'Meta Keywords',
                        placeholder: 'Meta Keywords'
                    },
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    }
                ]
            }
        ],
        sub: []
    }
];

export const validationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(3, 'Name must be at least 3 characters long')
        .max(30, 'Name must not be more than 30 characters')
        .required('Name is a required field'),
    slug: Yup.string().trim().required('Slug is a required field'),
    // image: Yup.mixed()
    //     .test('fileFormat', lang.INVALID_FILE_FORMAT, (value) => {
    //         if (value) {
    //             return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
    //         }
    //         return true;
    //     })
    //     .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value) => {
    //         if (value) {
    //             return value && (typeof value === 'string' || value.size <= 1024 * 1024);
    //         }
    //         return true;
    //     }),
    metaTitle: Yup.string()
        .trim()
        .nullable()
        .min(3, 'Must be at least 3 characters long')
        .max(30, 'Must not be more than 30 characters'),
    metaDescription: Yup.string()
        .trim()
        .nullable()
        .min(3, 'Must be at least 3 characters long')
        .max(30, 'Must not be more than 30 characters'),
    metaKeywords: Yup.string()
        .trim()
        .nullable()
        .min(3, 'Must be at least 3 characters long')
        .max(30, 'Must not be more than 30 characters'),
    nestedUnder: Yup.string().trim().nullable()
});
