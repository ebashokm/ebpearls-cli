import { HeadCell } from './types';

// table header options
export const headCells: HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        label: 'User Name',
        align: 'center',
        sort: true
    },
    {
        id: 'email',
        numeric: true,
        label: 'Email',
        align: 'center',
        sort: true
    },
    {
        id: 'phone',
        numeric: true,
        label: 'Phone',
        align: 'center',
        sort: true
    },
    {
        id: 'added by',
        numeric: true,
        label: 'Added By',
        align: 'center',
        sort: true
    }
];
