// material-ui
import { Button, FormHelperText, Grid, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import ErrorLoad from 'components/spinner/fail';

// assets
import { useNavigate, useParams } from 'react-router-dom';
import useGQL from '../hooks/useGQL';
import { useEffect, useState } from 'react';
import { User } from '../constants/types';
import { GridContainer, TextArea } from './profile.styles';
import useSnackbar from 'hooks/common/useSnackbar';
import CustomLoader from 'components/loader';

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams<string>();
    const { handleOpenSnackbar } = useSnackbar();
    const [user, setUser] = useState<User>({ _id: '', name: '', email: '', bio: '', phone: '' });

    const {GET_ADMIN_PROFILE, GET_USER, UPDATE_USER_DETAILS } = useGQL();
    const { error, loading, data, refetch } = GET_USER(id!);
    const { error: profileError, loading: profileLoading, data: profileData } = GET_ADMIN_PROFILE();
    const [handleUserUpdate, { loading: updateLoading, data: updateUserData }] = UPDATE_USER_DETAILS();

    useEffect(() => {
        if (data?.getUser) {
            setUser(data.getUser.user);
        }
    }, [data]);

    useEffect(() => {
        if (updateUserData?.updateUser) {
            handleOpenSnackbar({ message: updateUserData.updateUser.message, alertType: 'success' });
            navigate(`/user/list`);
        }
    }, [updateUserData]);

    if (error || profileError) {
        return <ErrorLoad />;
    }

    if (loading || profileLoading || updateLoading) {
        return <CustomLoader  />;
    }

    return (
        <GridContainer container spacing={gridSpacing}>
            <Grid item sm={12} md={9}>
                <SubCard title="Edit Account Details">
                    <Formik
                        enableReinitialize
                        initialValues={{ ...user }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().min(3).max(20).required().trim(),
                            email: Yup.string().email().required().trim(),
                            phone: Yup.string().min(7).max(10).required().trim(),
                            bio: Yup.string().trim().min(10).max(1000).required()
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                setSubmitting(false);
                                await handleUserUpdate({
                                    variables: {
                                        id: user._id,
                                        input: {
                                            name: values.name,
                                            email: values.email,
                                            phone: values.phone,
                                            bio: values.bio,
                                            createdBy: user.admin!._id
                                        }
                                    }
                                });
                            } catch (err: any) {
                                handleOpenSnackbar({ message: err.message, alertType: 'error' });
                            }
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter full name"
                                            value={values.name}
                                            name="name"
                                            label="Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="name-error">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter email"
                                            value={values.email}
                                            name="email"
                                            label="Email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="email-error">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter phone number"
                                            value={values.phone}
                                            name="phone"
                                            label="Phone No."
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {touched.phone && errors.phone && (
                                            <FormHelperText error id="phone-error">
                                                {errors.phone}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextArea
                                            rows={10}
                                            placeholder="Enter user bio"
                                            name="bio"
                                            value={values.bio}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched.bio && errors.bio && (
                                            <FormHelperText error id="bio-error">
                                                {errors.bio}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Stack direction="row">
                                            <AnimateButton>
                                                <Button variant="contained" type="submit">
                                                    Update User Details
                                                </Button>
                                            </AnimateButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </SubCard>
            </Grid>
        </GridContainer>
    );
};

export default Profile;
