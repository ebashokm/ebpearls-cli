import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { CustomFields } from 'types';
import lang from 'constants/language';

export const defaultValue = {
    main: [],
    sub: [
        {
            id: uuid(),
            image: [{ image: '', alt: '' }],
            content: [{ description: '' }],
            button: [{ label: '', url: '' }]
        }
    ]
};

export const fields: CustomFields = [
    {
        main: [],
        sub: [
            {
                name: 'image',
                mainHeading: { align: 'left', title: 'IMAGE SETTINGS', variant: 'subtitle1', show: true },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    },
                    {
                        name: 'alt',
                        type: 'text',
                        label: 'Image Alt Text',
                        placeholder: 'Logo'
                    }
                ]
            },

            {
                name: 'content',
                mainHeading: { align: 'left', title: 'CONTENT SETTINGS', variant: 'subtitle1', show: true },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        placeholder: 'Welcome'
                    }
                ]
            },
            {
                name: 'button',
                mainHeading: { align: 'left', title: 'BUTTON SETTINGS', variant: 'subtitle1', show: true },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'label',
                        type: 'text',
                        label: 'Heading',
                        placeholder: 'Welcome'
                    },
                    {
                        name: 'url',
                        type: 'text',
                        label: 'Destination URL',
                        placeholder: 'url.com',
                        maxLength: '300'
                    }
                ]
            }
        ]
    }
];

export const validationSchema = Yup.object().shape({
    sub: Yup.array().of(
        Yup.object().shape({
            image: Yup.array().of(
                Yup.object().shape({
                    alt: Yup.string()
                        .required('Alt text is a required field')
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    image: Yup.mixed()
                        .required('Image is required field')
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
                })
            ),
            content: Yup.array().of(
                Yup.object().shape({
                    description: Yup.string()
                        .required('Description is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(200, 'Must not be more than 200 characters')
                        .trim()
                })
            ),
            button: Yup.array().of(
                Yup.object().shape({
                    label: Yup.string()
                        .required('Button label is a required field')
                        .trim()
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    url: Yup.string()
                        .required('Destination URL is a required field')
                        .trim()
                        .matches(
                            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                            'Please enter correct url!'
                        )
                })
            )
        })
    )
});
