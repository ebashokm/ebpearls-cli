import { CustomFields } from 'types';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import lang from 'constants/language';

export const defaultValue = {
    main: [{ id: uuid(), title: [{ text: '' }] }],
    sub: [{ id: uuid(), icons: [{ image: '', align: '', main: '', sub: '' }] }]
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
                        placeholder: 'Welcome'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'icons',
                mainHeading: { align: 'left', title: 'Icons Section', variant: 'h4' },
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
                        name: 'align',
                        type: 'select',
                        label: 'Alignment',
                        options: [
                            { value: 'center', label: 'Center' },
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' }
                        ]
                    },
                    {
                        name: 'main',
                        type: 'text',
                        label: 'Icon Heading',
                        placeholder: 'Make a booking'
                    },
                    {
                        name: 'sub',
                        type: 'textarea',
                        label: 'Sub Text',
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
            icons: Yup.array().of(
                Yup.object().shape({
                    image: Yup.mixed()
                        .required('Image is a required field')
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        }),
                    align: Yup.string().trim().required('Image Alignment is a required field'),
                    main: Yup.string()
                        .trim()
                        .required('Icon Heading is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters'),
                    sub: Yup.string()
                        .trim()
                        .required('Description is a required field')
                        .min(3, 'Must be at least 3 characters long')
                        .max(30, 'Must not be more than 30 characters')
                })
            )
        })
    )
});
