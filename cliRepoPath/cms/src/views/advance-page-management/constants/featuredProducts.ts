import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';
import lang from 'constants/language';

export const defaultValue = {
    main: [{ id: uuid(), title: [{ text: '' }] }],
    sub: [{ id: uuid(), product: [{ image: '', name: '', type: '' }] }]
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'title',
                mainHeading: { align: 'left', title: '', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'text',
                        type: 'text',
                        label: 'Section Heading',
                        placeholder: 'Trending'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'product',
                mainHeading: { align: 'left', title: 'Products', variant: 'h4' },
                subHeading: { align: 'left', title: 'PRODUCT', variant: 'body1' },
                iconButtonDisable: false,
                choice: [
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    },
                    {
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        placeholder: 'Product Name'
                    },
                    {
                        name: 'type',
                        type: 'select',
                        label: 'Product Type',
                        placeholder: 'Alignment',
                        options: [
                            { value: 'type-a', label: 'Type A' },
                            { value: 'type-b', label: 'Type B' },
                            { value: 'type-c', label: 'Type C' }
                        ]
                    }
                ]
            }
        ]
    }
];

export const validationSchema = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            title: Yup.array().of(
                Yup.object().shape({
                    text: Yup.string()
                        .required('Title is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters')
                })
            )
        })
    ),
    sub: Yup.array().of(
        Yup.object().shape({
            product: Yup.array().of(
                Yup.object().shape({
                    image: Yup.mixed()
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            if (!value) {
                                return true;
                            }
                            return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            if (!value) {
                                return true;
                            }
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        })
                        .required('Image is a required field'),
                    name: Yup.string()
                        .trim()
                        .required('Product Name is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    type: Yup.string().trim().required('Product Type is a required field')
                })
            )
        })
    )
});
