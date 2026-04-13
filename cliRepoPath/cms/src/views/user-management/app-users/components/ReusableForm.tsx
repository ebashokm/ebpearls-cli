// material-ui
import { Divider, Grid, TextField, FormHelperText, Box, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import { Formik } from 'formik';

// import AnimateButton from 'ui-component/extended/AnimateButton';
import styled from 'styled-components';
import { FormInputType } from '../constants/types';
import { firstLetterUppercase } from 'utils/commonHelpers';

type Props = {
    title: string;
    buttonLabel: string;
    initialValues: FormInputType;
    validationSchema: Object;
    handleUserSubmit: (values: FormInputType, setSubmitting: (isSubmitting: boolean) => void) => void;
};

const ReusableForm = ({ title, buttonLabel, initialValues, validationSchema, handleUserSubmit }: Props) => {
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                handleUserSubmit(values, setSubmitting);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <Grid item xs={12} lg={6}>
                        <MainCard title={title}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <InputLabel>First Name</InputLabel>
                                    <CustomTextField
                                        fullWidth
                                        placeholder="Enter first name"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <FormHelperText error className="capit" id="firstName-error">
                                            {firstLetterUppercase(errors.firstName)}
                                        </FormHelperText>
                                    )}
                                    {/* <FormHelperText>Please enter First Name</FormHelperText> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel>Last Name</InputLabel>
                                    <CustomTextField
                                        fullWidth
                                        placeholder="Enter last name"
                                        value={values.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <FormHelperText error id="lastName-error">
                                            {errors.lastName}
                                        </FormHelperText>
                                    )}
                                    <FormHelperText>Please enter Last Name</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel>Auth ProviderId</InputLabel>
                                    <CustomTextField
                                        fullWidth
                                        disabled={initialValues.authProviderId !== ''}
                                        placeholder="Enter Auth Provider Id"
                                        value={values.authProviderId}
                                        name="authProviderId"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.authProviderId && errors.authProviderId && (
                                        <FormHelperText error id="authProviderId-error">
                                            {firstLetterUppercase(errors.authProviderId)}
                                        </FormHelperText>
                                    )}
                                    <FormHelperText>Please enter Auth Provider Id</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <InputLabel>Address</InputLabel>
                                    <CustomTextField
                                        fullWidth
                                        placeholder="Enter Address"
                                        value={values.address}
                                        name="address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.address && errors.address && (
                                        <FormHelperText error id="address-error">
                                            {firstLetterUppercase(errors.address)}
                                        </FormHelperText>
                                    )}
                                    <FormHelperText>Please enter Phone No.</FormHelperText>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <InputLabel>Bio</InputLabel>
                                    <TextArea
                                        rows={10}
                                        placeholder="Enter user bio"
                                        name="bio"
                                        value={values.bio}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <FormHelperText>Please enter user bio</FormHelperText>
                                    {touched.bio && errors.bio && (
                                        <FormHelperText error id="bio-error">
                                            {firstLetterUppercase(errors.bio)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </MainCard>
                        <Box sx={{ mt: '1rem' }}>
                            <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                                {buttonLabel}
                            </Button>
                            {/* <AnimateButton>
                            </AnimateButton> */}
                        </Box>
                    </Grid>
                </form>
            )}
        </Formik>
    );
};

const TextArea = styled.textarea`
    width: 100%;
    border-radius: 8px;
    padding: 1em;
    &:focus {
        border: 1px solid #1cb1f5;
        background-color: transparent;
        resize: none;
        outline: none;
    }
`;

const CustomTextField = styled(({ ...otherProps }) => <TextField {...otherProps} />)`
    width: 400px;
`;

export default ReusableForm;
