// ==============================|| MENU TYPES  ||============================== //
import { NavItemType } from 'types';
export type MenuProps = {
    selectedItem: string[];
    selectedID: string | null;
    drawerOpen: boolean;
    error: null;
    menu: NavItemType;
};

export type EditorSubmit = {
    title: string;
    logo: string;
    imageAltText: string;
};

export enum SignedUrlMethod {
    PUT = 'PUT',
    GET = 'GET'
}

export type FileType = {
    name: string;
    objectKey: string;
    contentType: string;
};

export type InitialValueMenu = {
    title: string;
    imageAltText: string;
    status: string;
    menuPosition: string;
};

export type HeadCell = {
    id: string;
    label: string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' | undefined;
    padding?: 'checkbox' | 'none' | 'normal' | undefined;
};

export type EditorSubmit1 = {
    title: string;
    slug: string;
    status: PageStatus | string;
};

export enum PageStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}
