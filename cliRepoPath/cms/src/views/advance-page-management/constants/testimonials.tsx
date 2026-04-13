import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { CustomFields } from 'types';
import lang from 'constants/language';

export const defaultValue = {
    main: [{ title: [{ text: '' }] }],
    sub: [
        {
            id: uuid(),
            customer: [
                {
                    comment: '',
                    image: '',
                    name: '',
                    location: ''
                }
            ]
        }
    ]
};

export const defaultValue1 = {
    id: uuid(),
    text: '',
    comment: '',
    image: '',
    name: '',
    location: ''
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
                        label: 'Headline',
                        placeholder: 'Our Happy Customers'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'customer',
                mainHeading: { align: 'left', title: 'Customer', variant: 'h4' },
                subHeading: { align: 'left', title: 'CUSTOMER', variant: 'body2' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        placeholder: 'Username'
                    },
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    },

                    {
                        name: 'location',
                        type: 'text',
                        label: 'Location',
                        placeholder: 'User location',
                        maxLength: '100'
                    },
                    {
                        name: 'comment',
                        type: 'textarea',
                        label: 'Comment',
                        placeholder: 'Comments'
                    }
                ]
            }
        ]
    }
];

export const validationSchema1 = Yup.object().shape({
    text: Yup.string()
        .required('Title is a required field')
        .test('len', 'Must be at least 3 characters long', (val) => {
            if (!val) {
                return true;
            }

            return val?.length >= 3;
        }),
    name: Yup.string()
        .required('Customer name is a required field')
        .trim()
        .test('len', 'Must be at least 3 characters long', (val) => {
            if (!val) {
                return true;
            }

            return val?.length >= 3;
        }),
    comment: Yup.string()
        .required('Comment is a required field')
        .trim()
        .test('len', 'Must be at least 3 characters long', (val) => {
            if (!val) {
                return true;
            }

            return val?.length >= 3;
        })
        .test('len', 'Must not exceed 200 characters', (val) => {
            if (!val) {
                return true;
            }

            return val?.length <= 200;
        }),
    location: Yup.string().required('Customer location is a required field').trim()
    // image: Yup.mixed()
    //     .required('Image is a required field')
    //     .test('fileFormat', lang.INVALID_FILE_FORMAT, (value) => {
    //         return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/svg', 'image/jpg'].includes(value.type));
    //     })
    //     .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value) => {
    //         return value && (typeof value === 'string' || value.size <= 1024 * 1024);
    //     })
});

export const validationSchema = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            title: Yup.array().of(
                Yup.object().shape({
                    text: Yup.string()
                        .required('Title is a required field')
                        .test('len', 'Must be at least 3 characters long', (val) => {
                            if (!val) {
                                return true;
                            }

                            return val?.length >= 3;
                        })
                })
            )
        })
    ),
    sub: Yup.array().of(
        Yup.object().shape({
            customer: Yup.array().of(
                Yup.object().shape({
                    image: Yup.mixed()
                        .required('Image is a required field')
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            return (
                                value &&
                                (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/svg', 'image/jpg'].includes(value.type))
                            );
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        }),
                    comment: Yup.string()
                        .required('Comment is a required field')
                        .trim()
                        .test('len', 'Must be at least 3 characters long', (val) => {
                            if (!val) {
                                return true;
                            }

                            return val?.length >= 3;
                        })
                        .test('len', 'Must not exceed 200 characters', (val) => {
                            if (!val) {
                                return true;
                            }

                            return val?.length <= 200;
                        }),
                    name: Yup.string()
                        .required('Customer name is a required field')
                        .trim()
                        .test('len', 'Must be at least 3 characters long', (val) => {
                            if (!val) {
                                return true;
                            }

                            return val?.length >= 3;
                        }),

                    location: Yup.string().required('Customer location is a required field').trim()
                })
            )
        })
    )
});

export const defaultValueForPage = {
    main: [{ id: uuid(), heading: [{ text: '' }] }],
    sub: []
};

export const defaultValueForPage1 = {
    main: [{ id: uuid(), heading1: [{ text1: '' }] }],
    sub: []
};

export const fieldsForPage: CustomFields = [
    {
        main: [
            {
                name: 'heading',
                mainHeading: { align: 'left', title: '', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'text',
                        type: 'text',

                        label: 'Heading',
                        placeholder: 'Heading'
                    }
                ]
            }
        ],
        sub: []
    }
];

export const fieldsForPage1: CustomFields = [
    {
        main: [
            {
                name: 'heading1',
                mainHeading: { align: 'left', title: '', variant: 'h5' },
                iconButtonDisable: true,

                choice: [
                    {
                        name: 'text1',
                        type: 'hidden',

                        label: 'Heading',
                        placeholder: 'Heading'
                    }
                ]
            }
        ],
        sub: []
    }
];

export const validationSchemaForPage = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            heading: Yup.array().of(
                Yup.object().shape({
                    text: Yup.string()
                        .required('Heading is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters')
                })
            )
        })
    )
});

export const validationSchemaForPage1 = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            heading1: Yup.array().of(
                Yup.object().shape({
                    text1: Yup.string()
                })
            )
        })
    )
});
