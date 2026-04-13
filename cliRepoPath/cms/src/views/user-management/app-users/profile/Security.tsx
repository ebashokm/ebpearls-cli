// material-ui
import { Box, Button, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';

// project imports
import { Formik } from 'formik';
import useGQL from '../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useEffect, useState } from 'react';
import Spinner from 'components/spinner';
import { AppUser } from '../constants/types';
import CustomLoader from 'components/loader';

// ==============================|| PROFILE 3 - SECURITY ||============================== //
type Props = {
    userId: string;
};
const Security = ({ userId }: Props) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState<AppUser>();
    const { GET_USER, SEND_PASSWORD_RSET_MAIL } = useGQL();

    const { error, loading, data, refetch } = GET_USER(userId);
    const [handleMail, { data: mailData }] = SEND_PASSWORD_RSET_MAIL();

    useEffect(() => {
        if (data?.getAppUser) {
            setUser(data.getAppUser.user);
        }
    }, [data]);

    useEffect(() => {
        if (mailData?.sendPasswordResetMail) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Password reset mail sent',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
        }
    }, [mailData]);

    if (loading) {
        return <CustomLoader  />;
    }

    return (
        <>
            {user?.authProvider === 'email' && (
                <>
                    <Typography variant="h5" sx={{ mb: '0.5em' }}>
                        Send reset password link
                    </Typography>
                    <Formik
                        enableReinitialize
                        initialValues={{ authProviderId: user?.authProviderId || '' }}
                        onSubmit={async (values, { setSubmitting }) => {
                            // setTimeout(() => {
                            //     alert(JSON.stringify(values, null, 2));
                            //     setSubmitting(false);
                            // }, 400);

                            await handleMail({
                                variables: {
                                    userId: user._id,
                                    name: user.firstName ? user.firstName : values.authProviderId,
                                    email: values.authProviderId
                                }
                            });
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
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextField
                                            disabled
                                            placeholder="Enter email"
                                            value={values.authProviderId}
                                            name="authProviderId"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            sx={{ width: ' 50%' }}
                                        />
                                        {touched.authProviderId && errors.authProviderId && (
                                            <FormHelperText error id="authProviderId-error">
                                                {errors.authProviderId}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: '1rem' }}>
                                    <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" size="large">
                                        Send
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </>
            )}
        </>
    );
};
export default Security;
