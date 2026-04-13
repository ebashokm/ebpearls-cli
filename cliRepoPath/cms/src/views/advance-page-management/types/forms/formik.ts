import { Dispatch, SetStateAction } from 'react';
import { CustomFields, FieldValueInit } from 'types';

export type WrapperProps = {
    expand: boolean;
    children: React.ReactElement;
};

export type Props<T, U> = {
    keyName?: string;
    defaultValue: FieldValueInit<T, U & { id: string }>;
    fields: CustomFields;
    validationSchema: Object;
    sectionTitle: string;
    button: {
        show: boolean;
        buttonLabel: string;
    };

    iconButtonVisible: boolean;
    draggable: boolean;
    collapsible: boolean;
    mainCardSx?: Object;
    handleSubmit: (values: FieldValueInit<T, U & { id: string }>, setSubmitting: (isSubmitting: boolean) => void) => void;
    handleAdd?: (
        values: FieldValueInit<T, U & { id: string }>,
        setInitialState: Dispatch<SetStateAction<FieldValueInit<T, U & { id: string }>>>
    ) => void;
    handleRemove?: (
        id: string | undefined,
        values: FieldValueInit<T, U & { id: string }>,
        setInitialState: Dispatch<SetStateAction<FieldValueInit<T, U & { id: string }>>>
    ) => void;
    isLoaderShow?: boolean;
};

export type SimpleFormProps<T, U> = {
    keyName?: string;
    defaultValue: FieldValueInit<T, U & { id: string }>;
    fields: CustomFields;
    chips?: { show: boolean; values: { label: string; value: string }[] };
    validationSchema: Object;
    button: { label?: string; align?: string; show: boolean; sx?: any };
    children?: JSX.Element;
    handleSubmit: (values: FieldValueInit<T, U & { id: string }>, setSubmitting: (isSubmitting: boolean) => void) => void;
};
