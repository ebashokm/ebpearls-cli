import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, FormHelperText, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from 'views/pages/AuthWrapper1';
import AuthCardWrapper from 'views/pages/AuthCardWrapper';
import Logo from 'ui-component/Logo';
import { useDispatch, useSelector } from 'react-redux';
// import OtpInput from 'react-otp-input-rc-17';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { openSnackbar } from 'store/slices/snackbar';
import { useState } from 'react';
import useGQL from '../hooks/useGQL';
import { setLoginState } from 'store/slices/auth';
import OtpInput from 'react18-input-otp';
import BackgroundPattern2 from 'ui-component/cards/BackgroundPattern2';
import { GridDivider } from 'components/divider/Divider';

// assets

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

const AuthOtpVerification = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const userDetails = useSelector((state: any) => state.auth.user);
    const [otp, setOtp] = useState();
    const dispatch = useDispatch();
    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];
    const { VALIDATE_AUTH_OTP } = useGQL();
    const [validateOtp] = VALIDATE_AUTH_OTP();

    return (
        <AuthWrapper1>
            <Grid container justifyContent={{ xs: 'center', md: 'space-between' }} alignItems="center" sx={{ minHeight: '100vh' }}>
                <Grid md={6} lg={7} xs={12} sx={{ minHeight: '100vh' }}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="#">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Enter Verification Code
                                                    </Typography>
                                                    <Typography variant="subtitle1" fontSize="1rem">
                                                        Two-Factor Authentication
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="0.875rem"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        {`Open the two-step verification app on your mobile device to get your verification code`}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Formik
                                        initialValues={{
                                            otp: otp,
                                            email: userDetails?.email
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={Yup.object().shape({
                                            otp: Yup.string().required('Code is required').min(6, 'Requires 6 digits')
                                        })}
                                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                            console.log('values', values);
                                            try {
                                                const codeVerifyResponse = await validateOtp({
                                                    variables: {
                                                        input: {
                                                            otp: values.otp,
                                                            email: values.email
                                                        }
                                                    }
                                                });
                                                if (codeVerifyResponse.data?.validateAuthOTP?.accessToken) {
                                                    localStorage.setItem(
                                                        'accessToken',
                                                        codeVerifyResponse.data.validateAuthOTP.accessToken
                                                    );
                                                    localStorage.setItem(
                                                        'refreshToken',
                                                        codeVerifyResponse.data.validateAuthOTP.refreshToken
                                                    );
                                                    dispatch(
                                                        setLoginState({
                                                            isLoggedIn: true,
                                                            accessToken: codeVerifyResponse.data.validateAuthOTP.accessToken,
                                                            refreshToken: codeVerifyResponse.data.validateAuthOTP.refreshToken,
                                                            user: codeVerifyResponse.data.validateAuthOTP.admin,
                                                            isBrowserVerified: true
                                                        })
                                                    );
                                                    navigate('/dashboard', { replace: true });
                                                }
                                            } catch (err) {
                                                dispatch(
                                                    openSnackbar({
                                                        open: true,
                                                        message: 'OTP Authenticator verification failed!. Please try again!',
                                                        anchorOrigin: { horizontal: 'center' },
                                                        variant: 'alert',
                                                        alert: {
                                                            color: 'error'
                                                        }
                                                    })
                                                );
                                                setStatus({ success: false });
                                                setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {({
                                            errors,
                                            handleBlur,
                                            handleChange,
                                            handleSubmit,
                                            setFieldValue,
                                            isSubmitting,
                                            touched,
                                            values
                                        }) => (
                                            <form noValidate onSubmit={handleSubmit}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12}>
                                                        <OtpInput
                                                            value={values.otp}
                                                            onChange={(otpNumber) => setFieldValue('otp', otpNumber, false)}
                                                            numInputs={6}
                                                            containerStyle={{ justifyContent: 'space-between' }}
                                                            inputStyle={{
                                                                width: '100%',
                                                                margin: '8px',
                                                                padding: '10px',
                                                                border: `1px solid ${borderColor}`,
                                                                borderRadius: 4,
                                                                ':hover': {
                                                                    borderColor: theme.palette.primary.main
                                                                }
                                                            }}
                                                            focusStyle={{
                                                                outline: 'none',
                                                                border: `2px solid ${theme.palette.primary.main}`
                                                            }}
                                                            shouldAutoFocus
                                                        />
                                                        {touched.otp && errors.otp && (
                                                            <FormHelperText error id="standard-weight-helper-text--register">
                                                                {errors.otp}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button disableElevation fullWidth size="large" type="submit" variant="contained">
                                                            Continue
                                                        </Button>
                                                    </Grid>
                                                    <GridDivider />
                                                    <Grid item xs={12}>
                                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                                            <Typography
                                                                variant="body1"
                                                                color="grey.600"
                                                                sx={{ textAlign: 'center', textDecoration: 'none' }}
                                                            >
                                                                Didn’t receive the code
                                                            </Typography>
                                                            <Button
                                                                disableElevation
                                                                fullWidth
                                                                size="large"
                                                                type="submit"
                                                                variant="text"
                                                                color="primary"
                                                                // onClick={resendCodeOtp}
                                                            >
                                                                Resend Code
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Grid container item direction="row-reverse" alignItems="center" xs={12}>
                                                            {/* <Grid xs={6} /> */}
                                                            <Grid item xs={6}>
                                                                <Typography
                                                                    component={Link}
                                                                    to="/login"
                                                                    variant="subtitle1"
                                                                    sx={{
                                                                        textDecoration: 'none',
                                                                        display: 'flex',
                                                                        justifyContent: 'flex-end'
                                                                    }}
                                                                >
                                                                    Back to Login ?
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        )}
                                    </Formik>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern2>
                        <></>
                    </BackgroundPattern2>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default AuthOtpVerification;
