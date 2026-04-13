import { TableCellProps } from '@mui/material';
import { initialValues } from './variables';

export interface EnhancedTableHeadProps extends TableCellProps {
    headCells: HeadCell[];
    order: ArrangementOrder;
    orderBy: string;
    onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type HeadCell = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

type Point = {
    type: string;
    coordinates: [number];
};

type Address = {
    displayAddress: string;
    location: Point;
};

type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type AppUser = {
    _id: string;
    __typename: string;
    authProvider: string;
    authProviderId: string;
    password: string;
    firstName: string;
    lastName: string;
    address: Address;
    status: string;
    bio: string;
    lastLoggedInAt: Date;
    createdAt: Date;
    updatedAt: Date;
    profileImage: string;
    profileImageUrl: string;

};

export type GetAppUsersDTO = {
    input: {
        searchText?: string;
        orderBy?: string;
        order?: string;
        limit?: number;
        skip?: number;
    };
};

export interface CreateAppUserDTO {
    input: {
        authProvider: string;
        authProviderId: string;
        firstName: string;
        lastName: string;
        address: string;
        bio: string;
        profileImage: string;
    };
}

export interface AppUserChangePasswordDTO {
    password: string;
    id: string;
}

export interface UpdateAppUserDTO {
    authProvider?: string;
    authProviderId?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    bio?: string;
}
interface IAppUser {
    message: string;
    user?: AppUser;
    users?: [AppUser];
    pagination?: Pagination;
}

export type UserResponse = {
    getAllAppUsers?: IAppUser;
    getAppUser?: IAppUser;
    createAppUser?: IAppUser;
    updateAppUser?: IAppUser;
    deleteAppUser?: IAppUser;
};

export type ChangePasswordResponse = {
    appUserchangePassword: {
        message: string;
    };
};

export type MailResponse = {
    sendPasswordResetMail: {
        message: string;
    };
};

export type FormInputType = typeof initialValues;

export type UpdateAppUserType = FormInputType & {_id: string};

export enum AuthType {
    EMAIL = 'email',
    PHONE = 'phone'
}

// review state options
export const appUserStatus = [
    {
        value: 'email_verified',
        label: 'Active'
    },
    {
        value: 'password_set_pending',
        label: 'Pending'
    }
];