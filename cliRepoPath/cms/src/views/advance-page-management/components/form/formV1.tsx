import { Dispatch, FC, forwardRef, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, chipClasses, Grid, IconButton, Typography } from '@mui/material';
import { Formik, FormikProps, useFormikContext } from 'formik';
import { PersistFormikValues } from 'formik-persist-values';
import { useDispatch } from 'react-redux';
import lodash from 'lodash';

import CustomFieldArray from '../formik/CustomFieldArray';

import { ChipWrapper, MainWrapper } from './form.styles';

import { setErrors } from 'store/slices/form';
import useSnackbar from 'hooks/common/useSnackbar';
import Chip from 'ui-component/extended/Chip';
import { SimpleFormProps } from '../../types/forms/formik';
import { fontSize } from '@mui/system';

const BubbleErrors = () => {
    const dispatch = useDispatch();
    // Grab values and submitForm from context
    const { errors } = useFormikContext();
    useEffect(() => {
        if (lodash.isEmpty(errors)) {
            dispatch(setErrors(false));
            return;
        }
        dispatch(setErrors(true));
    }, [errors]);
    return null;
};

const SimpleFrom = <T extends Object, U extends Object>(
    { keyName, defaultValue, fields, chips, validationSchema, button, children, handleSubmit }: SimpleFormProps<T, U>,
    ref: any
) => {
    const [initialState, setInitialState] = useState(defaultValue);
    const { handleOpenSnackbar } = useSnackbar();

    useEffect(() => {
        if (keyName) {
            const data = sessionStorage.getItem(keyName) || '';
            if (data) {
                setInitialState(JSON.parse(data));
            }
        }
    }, []);

    const getChips = (renderChip: { label: string; value: string }, index: number) => {
        return (
            <Chip
                key={index}
                label={renderChip.label}
                size="medium"
                chipcolor="primary"
                onClick={() => handleChipClick(renderChip.value)}
            />
        );
    };

    const handleChipClick = async (value: string) => {
        await navigator.clipboard.writeText(`{{${value}}}`);
        handleOpenSnackbar({ message: 'Text copied!', alertType: 'success', timeout: 1000 });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={defaultValue}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, setSubmitting);
            }}
        >
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <>
                        <Grid container maxWidth="100%" spacing={3} sx={{ margin: 'auto' }}>
                            {initialState.main?.map((subField, index) => (
                                <MainWrapper key={`main-wrapper-${index}`}>
                                    <Grid container maxWidth="50%">
                                        <CustomFieldArray<T, U>
                                            accessKey="main"
                                            formFields={fields[0].main}
                                            formikProps={props}
                                            controlIndex={index}
                                        />
                                    </Grid>
                                </MainWrapper>
                            ))}

                            {chips?.show && (
                                <Grid sx={{ ml: '15px' }} item xs={12}>
                                    <Typography variant="body2">
                                        Placeholders
                                        <p style={{ fontSize: '10px' }}>
                                            Note: Use these placeholder according to requirement of your email body{' '}
                                        </p>
                                    </Typography>
                                    <ChipWrapper>{chips?.values.map((chip, index) => getChips(chip, index))}</ChipWrapper>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                {children}
                            </Grid>

                            <Grid item xs={12} textAlign="left" sx={{ display: button.show ? '' : 'none' }} marginTop="1rem">
                                <Button
                                    ref={ref}
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        position: keyName === 'addMenu' ? 'relative' : 'static',
                                        bottom: '20px',
                                        mb: '20px',
                                        ml: '20px',
                                        ...(button.sx || {})
                                    }}
                                >
                                    {button.label}
                                </Button>
                            </Grid>
                        </Grid>
                    </>

                    <BubbleErrors />
                    {keyName && <PersistFormikValues name={keyName} storage="sessionStorage" debounce={100} />}
                </form>
            )}
        </Formik>
    );
};

export default forwardRef(SimpleFrom) as <T extends Object, U extends Object>(
    { keyName, defaultValue, fields, validationSchema, button, handleSubmit }: SimpleFormProps<T, U>,
    ref: any
) => JSX.Element;
