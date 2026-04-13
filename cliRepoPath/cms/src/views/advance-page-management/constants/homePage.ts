import { CustomFields } from 'types';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import lang from 'constants/language';

export const defaultValue = {
    fieldArray: [{ id: uuid(), image: [{ image: '', alt: '' }], content: [{ heading: '' }], button: [{ label: '', url: '' }] }]
};

export const fields = [
    {
        name: 'image',
        type: 'fieldArray',
        mainHeading: { align: 'left', title: 'Image Settings', variant: 'h5' },
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
        type: 'fieldArray',
        mainHeading: { align: 'left', title: 'Content Settings', variant: 'h5' },
        iconButtonDisable: true,
        choice: [
            {
                name: 'heading',
                type: 'text',
                label: 'Heading',
                placeholder: 'Welcome'
            }
        ]
    },
    {
        name: 'button',
        type: 'fieldArray',
        mainHeading: { align: 'left', title: 'Button Settings', variant: 'h5' },
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
];

export const validationSchema = Yup.object().shape({
    fieldArray: Yup.array().of(
        Yup.object().shape({
            image: Yup.array().of(
                Yup.object().shape({
                    alt: Yup.string().required('Alt text is a required field').trim(),
                    image: Yup.mixed()
                        .required('Image is a required field')
                        .test('fileFormat', lang.INVALID_FILE_FORMAT, (value: any) => {
                            return value && (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
                        })
                        .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value: any) => {
                            return value && (typeof value === 'string' || value.size <= 1024 * 1024);
                        })
                })
            ),
            content: Yup.array().of(
                Yup.object().shape({
                    heading: Yup.string().required('Heading is a required field').trim()
                })
            ),
            button: Yup.array().of(
                Yup.object().shape({
                    label: Yup.string().required('Button label is a required field').trim(),
                    url: Yup.string().required('Destination URL is a required field').trim()
                })
            )
        })
    )
});
