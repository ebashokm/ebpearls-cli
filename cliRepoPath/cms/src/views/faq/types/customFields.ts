import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';

type MainField =
    | {
          name: string;
          mainHeading: {
              align: string;
              title: string;
              variant: string;
          };
          iconButtonDisable?: boolean;
          choice: {
              disabled?: boolean;
              name: string;
              type: string;
              label: string;
              meta?: {
                  buttonLabel: string;
              };
              placeholder?: string;
              options?: { value: string; label: string }[];
              customHandleChange?: (name, event, setFieldValue, handleChange) => void;
          }[];
      }[]
    | [];

type SubField =
    | {
          name: string;
          mainHeading: {
              align: string;
              title: string;
              variant: string;
              show?: boolean;
          };
          subHeading?: {
              align: string;
              title: string;
              variant: string;
          };
          iconButtonDisable: boolean;
          choice: {
              name: string;
              type: string;
              label: string;
              meta?: {
                  buttonLabel: string;
              };
              placeholder?: string;
              options?: { value: string; label: string }[];
              maxLength?: string;
          }[];
      }[]
    | [];

export type Field = MainField | SubField;

export type FieldValueInit<T, U> = {
    main: T[];
    sub: U[];
};

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
