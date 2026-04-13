import { PageStatus } from './types';

export type HeadCell = {
    id: string;
    label: string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
    padding?: 'checkbox' | 'none' | 'normal' | undefined;
};

export type EditorSubmit = {
    title: string;
    slug: string;
    status: PageStatus | string;
};
