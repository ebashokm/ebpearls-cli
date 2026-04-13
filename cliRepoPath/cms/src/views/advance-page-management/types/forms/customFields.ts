import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { Field, FieldValueInit } from 'types';

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
