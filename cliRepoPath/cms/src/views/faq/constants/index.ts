import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { FormInputType, HeadCell1, CustomFields } from '../types';

// export const defaultValue: FormInputType = {
//     section: '',
//     description: '',
//     question: [
//         {
//             title: '',
//             description: ''
//         }
//     ]
// };

// table header options
export const headCells: HeadCell1[] = [
    {
        id: 'id',
        numeric: true,
        label: 'S.No.',
        align: 'center',
        sort: false
    },
    {
        id: 'section',
        numeric: false,
        label: 'Section',
        align: 'center',
        sort: true
    },
    {
        id: 'description',
        numeric: false,
        label: 'Description',
        align: 'center',
        sort: true
    },
    {
        id: 'createdAt',
        numeric: false,
        label: 'Created At',
        align: 'center',
        sort: true
    },
    {
        id: 'updatedAt',
        numeric: false,
        label: 'Updated At',
        align: 'center',
        sort: true
    }
];

export const validationSchemaFaq = Yup.object().shape({
    section: Yup.string().min(3).max(100).trim().required().label('Section heading'),
    description: Yup.string().min(3).max(500).trim().required().label('Section description'),
    content: Yup.array().of(
        Yup.object().shape({
            question: Yup.string().min(3).max(100).trim().required().label('Question'),
            answer: Yup.string().min(3).max(500).trim().required().label('Answer')
        })
    )
})

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'faq',
                mainHeading: { align: 'left', title: '', variant: 'h5' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'section',
                        type: 'text',
                        label: 'Section Heading',
                        placeholder: 'Section'
                    },
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Section Description',
                        placeholder: 'Description'
                    }
                ]
            }
        ],
        sub: [
            {
                name: 'content',
                mainHeading: { align: 'left', title: 'FAQ List', variant: 'h5' },
                subHeading: { align: 'left', title: 'QUESTION', variant: 'h5' },
                iconButtonDisable: false,
                choice: [
                    {
                        name: 'question',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Title',
                        maxLength: '100'
                    },
                    {
                        name: 'answer',
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
            faq: Yup.array().of(
                Yup.object().shape({
                    section: Yup.string()
                        .trim()
                        .required('Section Heading is a required field')
                        .test('len', 'Must be minimun of 3 characters', (val) => {
                            if (!val) {
                                return true;
                            }
                            return val?.length >= 3;
                        }),
                    description: Yup.string()
                        .trim()
                        .required('Section Description is a required field')
                        .test('len', 'Must not exceed 200 characters', (val) => {
                            if (!val) {
                                return true;
                            }
                            return val?.length <= 200;
                        })
                })
            )
        })
    ),
    sub: Yup.array().of(
        Yup.object().shape({
            content: Yup.array().of(
                Yup.object().shape({
                    question: Yup.string()
                        .trim()
                        .required('Question is a required field')
                        .test('len', 'Must not exceed 100 characters', (val) => {
                            if (!val) {
                                return true;
                            }
                            return val?.length <= 100;
                        }),
                    answer: Yup.string()
                        .trim()
                        .required('Answer is a required field')
                        .test('len', 'Must not exceed 200 characters', (val) => {
                            if (!val) {
                                return true;
                            }
                            return val?.length <= 200;
                        })
                })
            )
        })
    )
});

export const defaultValue = {
    main: [{ faq: [{ section: '', description: '' }] }],
    sub: [{ id: uuid(), content: [{ question: '', answer: '' }] }]
};