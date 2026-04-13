import { TableCellProps } from '@mui/material';

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

type Admin = {
    _id: string;
    name: string;
    email?: string;
    role?: string;
    status?: string;
    phone?: string;
};

type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type User = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    admin?: Admin;
};

export type Users = User[];

export type GetUsersDTO = {
    input: {
        searchText?: string;
        orderBy?: string;
        order?: string;
        limit?: number;
        skip?: number;
    };
};

export type GetUserDTO = {
    id: string;
};

export type UpdateUserDTO = {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    password?: string;
    createdBy: string;
};

export type UserResponse = {
    getUser?: {
        message: string;
        user: User;
    };
    getAllUsers?: {
        message: string;
        pagination: Pagination;
        users: User[];
    };
    updateUser?: {
        message: string;
        user: User;
    };
    deleteUser?: {
        message: string;
    };
};
