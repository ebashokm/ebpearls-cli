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
        id: 'title',
        numeric: false,
        label: 'Title',
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
    {
        id: 'status',
        numeric: false,
        label: 'Status',
        align: 'left',
        sort: true
    }
];

export const PageManagementListPath = '/page-management/list';
export const PageManagementEditPath = '/page-management/edit';
export const PageManagementAddPath = '/page-management/add';