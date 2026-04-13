import * as Yup from 'yup';
import { AuthType, HeadCell } from './types';

// table header options
export const headCells: HeadCell[] = [
    {
        id: 'firstName',
        numeric: false,
        label: 'First name',
        align: 'left',
        sort: true
    },
    {
        id: 'lastName',
        numeric: false,
        label: 'Last name',
        align: 'left',
        sort: true
    },
    {
        id: 'authProviderId',
        numeric: false,
        label: 'Email',
        align: 'left',
        sort: true
    },
    {
        id: 'authProviderId',
        numeric: false,
        label: 'Contact number',
        align: 'left',
        sort: false
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: false
    }
];

export const initialValues = {
    firstName: '',
    lastName: '',
    authProviderId: '',
    address: '',
    bio: '',
    profileImage: '',
};

export enum auth {
    authProvider = 'email'
}

export const formFields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'authProviderId', label: 'Email' },
    { name: 'address', label: 'Address' },
    { name: 'bio', label: 'Bio' }
];

export const editFormFields = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { id: 'email', name: 'authProviderId', label: 'Email', disabled: true },
    { id: 'phone', name: 'authProviderId', label: 'Phone', disabled: true },
    { name: 'address', label: 'Address' },
    { name: 'bio', label: 'Bio' }
];

export const validationSchemaAppUser = (user, type) =>
    Yup.object().shape({
        firstName: Yup.string().min(3).max(20).required().label('First name'),
        lastName: Yup.string().min(3).max(20).required().label('Last name'),
        authProviderId: !user
            ? Yup.string().email().required().label('Email address')
            : !type
              ? Yup.string().min(10).max(16).matches(/^\d+$/, 'Phone number must be numeric').required().label('Phone')
              : Yup.string().email().required().label('Email address'),
        address: Yup.string().min(3).max(50).required().label('Address'),
        bio: Yup.string().min(3).max(80).required().label('Bio')
    });

export const validationSchemaConfirmPassword = Yup.object().shape({
    password: Yup.string()
        .min(8)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required().label('Password'),
    passwordConfirm: Yup.string()
        .required()
        .label('Confirm password')
        .when('password', {
            is: (val: string) => !!(val && val.length > 0),
            then: () => Yup.string().oneOf([Yup.ref('password')], 'Both Password must match!')
        })
})

export type RegisterUserType = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
};