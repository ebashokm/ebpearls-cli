import { HeadCell } from '../types/page';

export const headCells: HeadCell[] = [
    {
        id: '1',
        label: 'S.No.',
        align: 'center',
        padding: 'none'
    },
    {
        id: 'title',
        label: 'Title',
        align: 'center',
        padding: 'none'
    },
    {
        id: 'author',
        label: 'Author',
        align: 'center',
        padding: 'none'
    },
    {
        id: 'status',
        label: 'Status',
        align: 'center',
        padding: 'none'
    },
    {
        id: 'createdAt',
        label: 'Created At',
        align: 'center',
        padding: 'none'
    },
    {
        id: '6',
        label: 'Action',
        align: 'center',
        padding: 'none'
    }
];

export const pageType = [
    { id: 1, value: 'help', label: 'Help' },
    { id: 2, value: 'terms and conditions', label: 'Terms and conditions' },
    { id: 3, value: 'privacy policy', label: 'Privacy Policy' }
];

export const pageStatus = [
    { id: 1, value: 'active', label: 'Active' },
    { id: 2, value: 'inactive', label: 'Inactive' }
];
