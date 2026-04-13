import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';
import lang from 'constants/language';

export const defaultValue = {
    main: [{ id: uuid(), title: [{ text: '' }] }],
    sub: [{ id: uuid(), steps: [{ image: '', title: '', description: '' }] }]
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
                        placeholder: 'Title'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'steps',
                mainHeading: { align: 'left', title: 'How it works', variant: 'h4' },
                subHeading: { align: 'left', title: 'SECTION', variant: 'body1' },
                iconButtonDisable: false,
                choice: [
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    },
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Title'
                    },
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        placeholder: 'Description'
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
            steps: Yup.array().of(
                Yup.object().shape({
                    image: Yup.mixed()
                        .required('Image is a required field')
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        }),

                    title: Yup.string()
                        .trim()
                        .required('Title is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    description: Yup.string()
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(200, 'Must not be more than 200 characters')
                })
            )
        })
    )
});
