import { HeadCell } from '../types/menu';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { CustomFields } from 'types';

export const headCells: HeadCell[] = [
    {
        id: 'title',
        label: 'Title',
        align: 'left',
        padding: 'none'
    },
    {
        id: 'menuPosition',
        label: 'Menu Position',
        align: 'left',
        padding: 'none'
    },
    {
        id: 'status',
        label: 'Status',
        align: 'left',
        padding: 'none'
    },
    {
        id: 'action',
        label: '',
        align: 'left',
        padding: 'none'
    }
];

export type mainFields = {
    header: {
        title: string;
        logo: string;
        imageAltText: string;
    }[];
};

export type mainFieldsMenuIcon = {
    header: {
        name: string;
        link: string;
        icon: string;
    }[];
};

export const defaultValue = {
    main: [
        {
            id: uuid(),
            header: [{ title: '', logo: '', imageAltText: '', status: '', menuPosition: '' }]
        }
    ],

    sub: []
};

export const defaultValueMenu = {
    title: '',
    imageAltText: '',
    status: '',
    menuPosition: '',
    image: ''
};

export const fields: CustomFields = [
    {
        main: [
            {
                name: 'header',
                mainHeading: { align: 'left', title: 'Menu Details', variant: 'h4' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'title',
                        type: 'text',
                        label: 'Title',
                        placeholder: 'Menu Title'
                    },
                    {
                        name: 'logo',
                        type: 'file',
                        label: 'Logo',
                        meta: { buttonLabel: 'Change' }
                    },
                    {
                        name: 'imageAltText',
                        type: 'text',
                        label: 'Image Alt Text',
                        placeholder: 'Image Alt Text'
                    },
                    {
                        name: 'status',
                        type: 'select',
                        label: 'Menu Status',
                        options: [
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' }
                        ]
                    },
                    {
                        name: 'menuPosition',
                        type: 'select',
                        label: 'Menu Position',
                        options: [
                            { value: 'header', label: 'Header' },
                            { value: 'footer', label: 'Footer' }
                        ]
                    }
                ]
            }
        ],
        sub: []
    }
];

export const validationSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .min(3, 'Must be at least 3 characters long')
        .max(30, 'Must not be more than 30 characters')
        .required('Title is a required field'),
    imageAltText: Yup.string().optional(),
    status: Yup.string().trim().required('Status is a required field'),
    menuPosition: Yup.string().trim().required('Position is a required field')
});

export const defaultValueMenuItem = {
    id: uuid(),
    name: '',
    linkType: '',
    link: '',
    iconType: '',
    //@ts-ignore
    icon: {} || 'none',
    children: []
    // index: Number
};

export const defaultFile = {
    name: '',
    objectKey: '',
    contentType: ''
};

export const fieldsMenuItem: CustomFields = [
    {
        main: [
            {
                name: 'header',
                mainHeading: { align: 'left', title: 'Menu Items', variant: 'h4' },
                iconButtonDisable: true,
                choice: [
                    {
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        placeholder: 'Name'
                    },
                    {
                        name: 'link',
                        type: 'text',
                        label: 'Link',
                        placeholder: 'Link'
                    },
                    {
                        name: 'icon',
                        type: 'text',
                        label: 'Icon',
                        placeholder: 'Icon'
                    }
                ]
            }
        ],
        sub: []
    }
];

export const validationSchemaMenuItem = Yup.object().shape({
    name: Yup.string()
        .trim()
        .min(3)
        .max(30)
        .required().label('Name'),
    linkType: Yup.string().required().label('Link'),
    link: Yup.string().when('linkType', {
        is: (val: string) => val === 'customPage',
        then: () =>
            Yup.string()
                .matches(
                    /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                    'Please enter a correct URL...!'
                )
                .required().label('Link'),

        otherwise: () =>
            Yup.string().when('linkType', {
                is: (val: string) => val === 'taxonomy',
                then: () => Yup.string().required().label('Link'),

                otherwise: () =>
                    Yup.string().when('linkType', {
                        is: (val: string) => val === 'page',
                        then: () => Yup.string().required().label('Link'),

                        otherwise: () => Yup.string() // Add more cases or validation rules as needed
                    })
            })
    }),
    iconType: Yup.string().required().label('Icon type'),
    icon: Yup.mixed().when('iconType', {
        is: (val: string) => val === 'icon',
        then: () =>
            Yup.string()
                .matches(/fa-[a-z-]+/g, 'Please enter correct font awesome format.')
                .required().label('Icon')
    }).nullable()


    // .when('iconType', {
    //     is: 'image',
    //     then: Yup.mixed()
    //         .test('required', 'Icon is a required field', (value) => {
    //             if (!value?.type) {
    //                 return value;
    //             }
    //             return true;
    //         })
    //         .test('fileFormat', lang.INVALID_FILE_FORMAT, (value) => {
    //             if (value) {
    //                 return (
    //                     value &&
    //                     (typeof value === 'string' || ['image/jpeg', 'image/png', 'image/jpeg', 'image/svg'].includes(value.type))
    //                 );
    //             }
    //             return true;
    //         })
    //         .test('fileSize', lang.IMAGE_MAX_SIZE_VALIDATION, (value) => {
    //             if (value) {
    //                 return value && (typeof value === 'string' || value.size <= 2 * 1024 * 1024);
    //             }
    //             return true;
    //         })
    // })
});

export const defaultImageConfig = {
    // imagePlaceholder: process.env.REACT_APP_IMAGE_PLACEHOLDER || '',
    imagePlaceholder: import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '',
    imageSet: false
};

export const linkTypeSelectOptions = [
    { label: 'Homepage', value: 'homepage' },
    { label: 'Page', value: 'page' },
    { label: 'Taxonomy', value: 'taxonomy' },
    { label: 'Custom Page', value: 'customPage' }
];

export const linkSelectOptions = [
    { label: 'Homepage', value: '/homepage' },
    { label: 'Taxons', value: '/taxons' },
    { label: 'Menus', value: '/menus' }
];

export const iconTypeSelectOptions = [
    { label: 'None', value: 'none' },
    { label: 'Icon', value: 'icon' },
    { label: 'Image', value: 'image' }
];

export const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

export type currentStatusProps = {
    status: string;
    _id: string;
};
