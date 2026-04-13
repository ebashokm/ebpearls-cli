import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { CustomFields } from 'types';
import lang from 'constants/language';

export const defaultValue = {
    main: [{ title: [{ text: '' }] }],
    sub: [{ id: uuid(), image: [{ image: '', url: '' }], content: [{ main: '', sub: '', text: '' }], button: [{ label: '', url: '' }] }]
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
                name: 'image',
                mainHeading: { align: 'left', title: 'IMAGE SETTINGS', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'image',
                        type: 'file',
                        label: 'Image',
                        meta: { buttonLabel: 'Change' }
                    },
                    {
                        name: 'url',
                        type: 'text',
                        label: 'Image Link',
                        placeholder: 'Welcome'
                    }
                ]
            },

            {
                name: 'content',
                mainHeading: { align: 'left', title: 'CONTENT SETTINGS', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'main',
                        type: 'text',
                        label: 'Heading',
                        placeholder: 'Welcome'
                    },
                    {
                        name: 'sub',
                        type: 'text',
                        label: 'Sub Heading',
                        placeholder: 'Welcome'
                    },
                    {
                        name: 'text',
                        type: 'text',
                        label: 'Text',
                        placeholder: 'Welcome'
                    }
                ]
            },
            {
                name: 'button',
                mainHeading: { align: 'left', title: 'BUTTON SETTINGS', variant: 'subtitle1' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'label',
                        type: 'text',
                        label: 'Heading',
                        placeholder: 'Shop now'
                    },
                    {
                        name: 'url',
                        type: 'text',
                        label: 'Button Link',
                        placeholder: 'Welcome'
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
                    text: Yup.string().trim().required('Section Heading is a required field')
                })
            )
        })
    ),
    sub: Yup.array().of(
        Yup.object().shape({
            image: Yup.array().of(
                Yup.object().shape({
                    image: Yup.mixed()
                        .required('Image is a required field')
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        }),
                    url: Yup.string().trim().required('Image link is a required field')
                })
            ),
            content: Yup.array().of(
                Yup.object().shape({
                    main: Yup.string().trim().required('Heading is a required field'),
                    sub: Yup.string().trim().required('Sub Heading is a required field'),
                    text: Yup.string().trim().required('Text is a required field')
                })
            ),
            button: Yup.array().of(
                Yup.object().shape({
                    label: Yup.string().trim().required('Button label is a required field'),
                    url: Yup.string().trim().required('Button link is a required field')
                })
            )
        })
    )
});
