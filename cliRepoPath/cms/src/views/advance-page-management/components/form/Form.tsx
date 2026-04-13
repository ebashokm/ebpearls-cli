import {
    Grid,
    FormHelperText,
    TextField,
    Grid as MuiGrid,
    Box,
    Button,
    CardProps,
    InputLabelProps,
    MenuItem,
    Typography
} from '@mui/material';
import { Formik } from 'formik';
import useSnackbar from 'hooks/common/useSnackbar';
import { forwardRef } from 'react';
import styled from 'styled-components';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Chip from 'ui-component/extended/Chip';
import { ChipWrapper } from './form.styles';

type PropTypes = {
    title: string;
    formFields: {
        disabled?: boolean;
        name: string;
        label: string;
        customHandleChange?: (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
            handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
        ) => void;
        selectConfig?: { select: boolean; label: string; options: { id: string; value: string; label: string }[] };
    }[];
    initialValues: any;
    validationSchema: Object;
    buttonLabel: string;
    handleFormSubmit: (value: any, setSubmitting: (isSubmitting: boolean) => void) => void;
    cardSx?: CardProps['sx'];
    textFieldSx?: InputLabelProps['sx'];
    renderChip?: boolean;
    children?: any;
};

const availableChips = [
    { label: 'Name', value: 'name' },
    { label: 'Link', value: 'link' },
    { label: 'Otp', value: 'otp' }
];

const ReusableForm = (
    {
        title,
        formFields,
        initialValues,
        validationSchema,
        buttonLabel,
        handleFormSubmit,
        cardSx = {},
        textFieldSx = {},
        renderChip,
        children
    }: PropTypes,
    ref
) => {
    const { handleOpenSnackbar } = useSnackbar();
    const getChips = (chips: { label: string; value: string }, index: number) => {
        return <Chip key={index} label={chips.label} size="medium" chipcolor="primary" onClick={() => handleChipClick(chips.value)} />;
    };

    const handleChipClick = async (value: string) => {
        await navigator.clipboard.writeText(`{{${value}}}`);
        handleOpenSnackbar({ message: 'Text copied!', alertType: 'success', timeout: 1000 });
    };
    return (
        <MainCard title={title} sx={cardSx}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container gap={3}>
                            {formFields.map(({ disabled, name, label, customHandleChange, selectConfig }, index) => {
                                // console.log(name, label, selectConfig);
                                return selectConfig?.select ? (
                                    <Grid key={index} item xs={12}>
                                        <TextField
                                            fullWidth
                                            select
                                            value={values[name]}
                                            name={name}
                                            label={selectConfig.label}
                                            size="medium"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            sx={textFieldSx}
                                        >
                                            {selectConfig.options.map((option) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        {touched[name] && errors[name] && (
                                            <FormHelperText error id={`${name}-error`}>
                                                {errors[name] as any}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                ) : (
                                    <Grid key={index} item xs={12}>
                                        <TextField
                                            disabled={disabled && true}
                                            fullWidth
                                            placeholder={`Enter ${name}`}
                                            value={values[name]}
                                            name={name}
                                            label={label}
                                            size="medium"
                                            onBlur={handleBlur}
                                            onChange={(event) => {
                                                if (typeof customHandleChange === 'function') {
                                                    customHandleChange(event, setFieldValue, handleChange);
                                                } else {
                                                    handleChange(event);
                                                }
                                            }}
                                            sx={textFieldSx}
                                        />
                                        {touched[name] && errors[name] && (
                                            <FormHelperText error id={`${name}-error`}>
                                                {errors[name] as any}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                );
                            })}
                            {renderChip && (
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        Placeholders
                                        <p style={{ fontSize: '10px' }}>
                                            Note: Use these placeholder according to requirement of your email body{' '}
                                        </p>
                                    </Typography>
                                    <ChipWrapper>{availableChips.map((chip, index) => getChips(chip, index))}</ChipWrapper>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                {children}
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: '1rem' }}>
                            <Button disabled={isSubmitting} ref={ref} type="submit" variant="contained" color="primary">
                                {buttonLabel}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </MainCard>
    );
};

export default forwardRef(ReusableForm) as (
    {
        title,
        formFields,
        initialValues,
        validationSchema,
        buttonLabel,
        handleFormSubmit,
        cardSx,
        textFieldSx,
        renderChip,
        children
    }: PropTypes,
    ref
) => JSX.Element;
