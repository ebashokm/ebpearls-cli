import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGQL } from '../hooks/useGQL';
import { Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import useSnackbar from 'hooks/common/useSnackbar';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, InputLabel, Paper, Stack, Button, Typography, CircularProgress, MenuItem, Autocomplete, Box } from '@mui/material';
import { BUSSINESS_USER_LIST_URL, validationSchemaBusinessUser } from '../constants';
import PageTitle from 'components/page-title/PageTitle';
import CustomLoader from 'components/loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import SelectUsers from '../components/SelectUsers';

const AddEditBusinessUser = () => {
    const { id } =  useParams();
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        name: '',
        email: '',
        userId: ''
    });
    const { handleOpenSnackbar } = useSnackbar();
    const { CREATE_BUSINESS_USER, UPDATE_BUSINESS_USER, GET_BUSINESS_USER } = useGQL();
    const [handleCreateBusinessUser] = CREATE_BUSINESS_USER();
    const [handleUpdateBusinessUser] = UPDATE_BUSINESS_USER();
    const {data} = GET_BUSINESS_USER(id!);

    useEffect(() => {
        if(data?.getBusinessUser) {
            setInitialValues({
                name: data?.getBusinessUser?.name,
                email: data?.getBusinessUser?.email,
                userId: data?.getBusinessUser?._id
            });
        }
    },[data]);

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if(id) {
            try {
                await handleUpdateBusinessUser({
                    variables: {
                        updateBusinessUserInput: {
                            ...values,
                            id: id,
                        }
                    }
                });
                handleOpenSnackbar({ message: "Business user updated successfully", alertType: 'success' });
                setSubmitting(false);
                setPageLoading(true);
                navigate(BUSSINESS_USER_LIST_URL);
            } catch (error: any) {
                setPageLoading(false);
                handleOpenSnackbar({ message: error.message, alertType: 'error' });
                setSubmitting(false);
            }
        }else {
            try {
                await handleCreateBusinessUser({
                    variables: {
                        createBusinessUserInput: {
                            ...values
                        }
                    }
                });
                handleOpenSnackbar({ message: "Business user created successfully", alertType: 'success' });
                setSubmitting(false);
                setPageLoading(true);
                navigate(BUSSINESS_USER_LIST_URL);
            } catch (error: any) {
                setPageLoading(false);
                handleOpenSnackbar({ message: error.message, alertType: 'error' });
                setSubmitting(false);
            }
        }
    };

    let breadcrumbLinks = [
        { title: 'Business user management', to: BUSSINESS_USER_LIST_URL },
        { title: id ? 'Edit new business user' : 'Add new business user' }
    ];

    if (pageLoading) {
        return <CustomLoader  />;
    }

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <PageTitle title={id ? "Edit new business user" : "Add new business user" } />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchemaBusinessUser}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <MainCard>
                                <Typography variant="h3" mb={2.5}>
                                    Business account details
                                </Typography>
                                <Grid container spacing={2.5}>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Name</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            placeholder="Enter Name"
                                            value={values.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="name-error">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Email</InputLabel>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            placeholder="Enter Email"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={id ? true : false}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="email-error">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel>Select user</InputLabel>
                                        <SelectUsers name="userId" values={values.userId} setFieldValue={setFieldValue} disabled={id ? true : false} />
                                        {touched.userId && errors.userId && (
                                            <FormHelperText error id="userId-error">
                                                {errors.userId}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                            </MainCard>
                            <Paper className="form-button-wrapper">
                                <Stack>
                                    <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" size="large">
                                        {id ? 'Update' : 'Create business user'} 
                                    </Button>
                                </Stack>
                            </Paper>
                        </form>
                    );
                }}
            </Formik>
        </>
    );
};
export default AddEditBusinessUser;
