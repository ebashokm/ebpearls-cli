// material-ui
import { Box, Button, FormHelperText, Grid, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';

// project imports
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useState } from 'react';
import { useGQL } from './hooks/useGQL';
import TwoFactorAuth from './components/TwoFactorAuth';
import { setLoginState } from 'store/slices/auth';
import { Formik } from 'formik';
import { initialValuesOtp, validationSchemaOtp } from './constant/constant';
import { MetaButtonWrapper } from './profile.styles';

// ==============================|| PROFILE 2 - CHANGE PASSWORD ||============================== //

const OtpAuthenticator = () => {
    const { GET_OTP_AUTH_URL } = useGQL();
    const [skip, setSkip] = useState<boolean>(true);
    const { refetch } = GET_OTP_AUTH_URL(skip);
    const auth = useSelector((state: any) => state.auth);
    const [secret, setSecret] = useState({
        otpAuthUrl: '',
        base32: ''
    });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showDisable, setShowDisable] = useState<boolean>(false);
    const { DISABLE_AUTH_OTP } = useGQL();
    const [disableAuthOtp] = DISABLE_AUTH_OTP();
    const dispatch = useDispatch();

    const generateQrCode = async () => {
        setSkip(false);
        const response = await refetch();
        if (response.data?.generateOtpAuthUrl) {
            const { generateOtpAuthUrl } = response.data;
            setOpenModal(true);
            setSecret({
                base32: generateOtpAuthUrl.base32,
                otpAuthUrl: generateOtpAuthUrl.otpAuthUrl
            });
        }
    };

    const disableTwoFactorAuth = async () => {
        setShowDisable(true);
    };

    const handleSubmitOtpGenerator = async (values) => {
        try {
            const isAuthOTPDisable = await disableAuthOtp({
                variables: {
                    token: values.token
                }
            });
            if (isAuthOTPDisable.data?.disableAuthOTP) {
                const authUser = { ...auth.user, enabled2FA: false };
                dispatch(
                    setLoginState({
                        isLoggedIn: auth.isLoggedIn,
                        accessToken: auth.accessToken,
                        refreshToken: auth.refreshToken,
                        isBrowserVerified: auth.isBrowserVerified,
                        user: authUser,
                        otpExpiresAt: auth.otpExpiresAt
                    })
                );
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'OTP Authenticator disabled successfully',
                        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    })
                );
                setShowDisable(false);
            }
        } catch (err: any) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: err.message,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                })
            );
        }
    }

    const styles = {
        orderedList: `space-y-1 text-sm list-decimal`
    };

    return (
        <>
            {auth?.user.enabled2FA ? (
                <>
                    <Button variant="outlined" size="large" onClick={() => disableTwoFactorAuth()}>
                        Disable OTP Authenticator
                    </Button>
                    {showDisable && (
                        <Formik
                            initialValues={initialValuesOtp}
                            validationSchema={validationSchemaOtp}
                            onSubmit={(values) => handleSubmitOtpGenerator(values)}
                        >
                            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3} mt={0.5}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                placeholder="Authentication Code"
                                                value={values.token}
                                                name="token"
                                                label="Authentication Code"
                                                onChange={handleChange}
                                            />
                                            {touched.token && errors.token && (
                                                <FormHelperText error id="standard-weight-helper-text--register">
                                                    {errors.token}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <MetaButtonWrapper item xs={12}>
                                            <Button
                                                variant="outlined"
                                                size="large"
                                                onClick={() => setShowDisable(false)}
                                            >
                                                Close
                                            </Button>
                                            <Button variant="outlined" size="large" type="submit" disabled={isSubmitting}>
                                                Verify & Deactivate
                                            </Button>
                                        </MetaButtonWrapper>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    )}
                </>
            ) : (
                <Button variant="outlined" size="large" onClick={() => generateQrCode()}>
                    Setup OTP Authenticator
                </Button>
            )}
            {openModal && <TwoFactorAuth base32={secret.base32} otpAuthUrl={secret.otpAuthUrl} closeModal={() => setOpenModal(false)} />}
        </>
    );
};
export default OtpAuthenticator;
