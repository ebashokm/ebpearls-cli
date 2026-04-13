import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';

export type MainFields = {
    metaTags: {
        title: string;
        text: string;
        description: string;
    }[];
};

export const defaultValue = {
    main: [{ id: uuid(), metaTags: [{ title: '', text: '', description: '' }] }],
    sub: []
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'metaTags',
                mainHeading: { align: 'left', title: 'Meta Tags', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Meta title'
                    },
                    {
                        name: 'tags',
                        type: 'text',
                        label: 'Tags',
                        placeholder: 'Tags'
                    },
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
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
            metaTags: Yup.array().of(
                Yup.object().shape({
                    title: Yup.string()
                        .min(3, 'Min 3 characters')
                        .max(20, 'Max 20 characters')
                        .trim()
                        .required('Meta title is a required field'),
                    text: Yup.string()
                        .min(5, 'Min 5 characters')
                        .max(50, 'Max 50 characters')
                        .trim()
                        .required('Meta text is a required field'),
                    description: Yup.string().trim().required('Meta description is a required field')
                })
            )
        })
    )
});
