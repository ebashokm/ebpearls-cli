// ==============================|| MENU TYPES  ||============================== //
import { NavItemType } from 'types';

import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { Field, FieldValueInit } from 'types';

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

export enum SignedUrlMethod {
    PUT = 'PUT',
    GET = 'GET'
}

export type PreSignedUrlInputDTO = {
    path: string;
    contentType: string;
    method: SignedUrlMethod;
};

export type PreSignedUrlResponse = {
    getPreSignedUrl: {
        url: string;
    };
};

//formik types
export type Controls<T, U> = {
    id?: string;
    handleAdd?: (
        values: FieldValueInit<
            T,
            U & {
                id: string;
            }
        >,
        setInitialState: Dispatch<
            SetStateAction<
                FieldValueInit<
                    T,
                    U & {
                        id: string;
                    }
                >
            >
        >
    ) => void;
    handleRemove?: (
        id: string | undefined,
        values: FieldValueInit<
            T,
            U & {
                id: string;
            }
        >,
        setInitialState: Dispatch<
            SetStateAction<
                FieldValueInit<
                    T,
                    U & {
                        id: string;
                    }
                >
            >
        >
    ) => void;

    setInitialState?: Dispatch<
        SetStateAction<
            FieldValueInit<
                T,
                U & {
                    id: string;
                }
            >
        >
    >;
};

export type Props<T, U> = {
    accessKey: string;
    formFields: Field;
    formikProps: FormikProps<
        FieldValueInit<
            T,
            U & {
                id: string;
            }
        >
    >;
    controlIndex: number;
    controls?: Controls<T, U>;
};
