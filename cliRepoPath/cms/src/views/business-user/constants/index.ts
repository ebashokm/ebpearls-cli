import * as Yup from 'yup';

export type HeadCell1 = {
    id: string;
    numeric: boolean;
    label: string;
    disablePadding?: string | boolean | undefined;
    align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    sort: boolean;
};

export const headCells: HeadCell1[] = [
    {
        id: 'name',
        numeric: false,
        label: 'Name',
        align: 'left',
        sort: true
    },
    {
        id: 'email',
        numeric: false,
        label: 'Email',
        align: 'left',
        sort: true
    },
    {
        id: 'createdAt',
        numeric: false,
        label: 'Date published',
        align: 'left',
        sort: true
    },
    
];

export enum PaginationSortEnum {
    ASC = 'asc',
    DESC = 'desc'
}

// export enum PageStatusEnum {
//     ACTIVE = 'ACTIVE',
//     INACTIVE = 'INACTIVE'
// }

export enum AdminStatusEnum {
    ACTIVE = 'ACTIVE',
    VERIFIED = 'VERIFIED',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE'
}

export enum AdminRolesTypeEnum {
    SUPER_ADMIN = 'SUPERADMIN',
    ADMIN = 'ADMIN'
}

export const validationSchemaBusinessUser = Yup.object().shape({
    name: Yup.string().min(3).max(20).required().label('Full name'),
    email: Yup.string().required().label('Email'),
    userId: Yup.string().required().label('User id')
});

export interface User {
    _id: string;
    authProviderId: string;
    firstName: string | null;
    lastName: string | null;
  }
  
  export interface Pagination {
    total: number;
    hasNextPage: boolean;
  }
  
  export interface GetAllAppUsersResponse {
    message: string;
    users: User[];
    pagination: Pagination;
  }
  
  export interface SelectUsersProps {
    setFieldValue: (field: string, value: string) => void;
    values: string;
    name: string;
    disabled?: boolean
  }

//routes
export const BUSSINESS_USER_LIST_URL= '/business-user/list';
export const ADD_BUSSINESS_USER_URL= '/business-user/add';