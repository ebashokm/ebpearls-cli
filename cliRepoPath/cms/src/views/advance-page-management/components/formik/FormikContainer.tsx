import React from 'react';
import { Formik } from 'formik';
import { Container, Grid } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

interface ContainerProps {
    initialValues: any;
    validationSchema: Object;
    handleSubmit: (values: any, setSubmitting: (isSubmitting: boolean) => void) => void;
    children: any;
    others?: any;
}

const FormikContainer = ({ initialValues, validationSchema, handleSubmit, children, ...others }: ContainerProps) => (
    <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
        }}
    >
        {(props) => <form onSubmit={props.handleSubmit}>{children(props)}</form>}
    </Formik>
);

export default FormikContainer;
