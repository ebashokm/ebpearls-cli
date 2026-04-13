import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';

export const defaultValue = {
    main: [{ heading: [{ text: '' }] }],
    sub: [{ id: uuid(), listings: [{ image: '', alt: '', title: '', url: '' }] }]
};

export const fields: CustomFields = [
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
                        label: 'Section Heading',
                        placeholder: 'Welcome'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'listings',
                mainHeading: { align: 'left', title: 'Section', variant: 'h4' },
                subHeading: { align: 'left', title: 'GRID', variant: 'body1' },
                iconButtonDisable: false,
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
                    },
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Cocktail'
                    },
                    {
                        name: 'url',
                        type: 'text',
                        label: 'Destination URL',
                        placeholder: 'Default',
                        maxLength: '300'
                    }
                ]
            }
        ]
    }
];

export const validationSchema = Yup.object().shape({
    main: Yup.array().of(
        Yup.object().shape({
            heading: Yup.array().of(
                Yup.object().shape({
                    text: Yup.string().trim().required('Section Heading is a required field')
                })
            )
        })
    ),
    sub: Yup.array().of(
        Yup.object().shape({
            listings: Yup.array().of(
                Yup.object().shape({
                    alt: Yup.string().trim().required('Section Heading is a required field'),
                    title: Yup.string().trim().required('Title is a required field'),
                    url: Yup.string().trim().required('Destination URL is a required field')
                })
            )
        })
    )
});
