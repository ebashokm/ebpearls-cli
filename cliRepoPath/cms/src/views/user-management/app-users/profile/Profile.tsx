import { useEffect, useState } from 'react';
import { Avatar, Button, FormHelperText, Grid, TextField, InputLabel, Stack, Typography } from '@mui/material';
import { Formik } from 'formik';

import FailureLoad from 'components/spinner/fail';
/* assets */
import useGQL from '../hooks/useGQL';
import { AppUser, AuthType, UpdateAppUserType } from '../constants/types';
import { firstLetterUppercase } from 'utils/commonHelpers';
import { validationSchemaAppUser } from '../constants/variables';
import { useDispatch } from 'react-redux';
import { closeModal } from 'store/slices/modal';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
import CustomLoader from 'components/loader';
import ImageCropperModal from 'components/modal/ImageCropModal';
import { base64ToBlob } from 'utils/base64ToBlob';
import { v4 as uuid } from 'uuid';
import blobUploadHelper from 'utils/blogUploader';

type Props = {
    userData: any;
    error: any;
    loading: any;
};
const ProfileDetail = ({ userData, loading, error }: Props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const [user, setUser] = useState<Partial<AppUser>>();

    const [croppedImage, setCroppedImage] = useState();
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [imageType, setImageType] = useState('');
    
    const { UPDATE_USER, IMAGE_UPLOAD } = useGQL();
    const [handleImageUpload] = IMAGE_UPLOAD();
    const [handleUserUpdate, { data: updateUser }] = UPDATE_USER();

    useEffect(() => {
        if (userData?.getAppUser) {
            const { password, createdAt, updatedAt, lastLoggedInAt, ...others } = userData.getAppUser.user!;
            setUser(others);
        }
    }, [userData]);

    useEffect(() => {
        if (updateUser?.updateAppUser) {
            handleOpenSnackbar({ message: `${updateUser?.updateAppUser?.message}. Redirecting ...`, alertType: 'success' });
            setTimeout(() => {
                navigate('/app-user/list');
            }, 2000);
        }
    }, [updateUser]);

    const handleFormSubmit = async (values: UpdateAppUserType, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            if (croppedImage) {
                try {
                    const blob = base64ToBlob(croppedImage, imageType);
                    const imageExt = imageType.split('/').pop();
                    const filename = `${uuid()}.${imageExt}`;
                    await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                    values.profileImage = filename;
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            const { _id, ...others } = values;
            await handleUserUpdate({
                variables: { id: _id!, input: { ...others } }
            });
            dispatch(closeModal());
            setSubmitting(false);
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
            setSubmitting(false);
        }
    };

    const handleSelectProfileImage = async (event) => {
        const file = event.target.files[0];
        if (file?.type == 'image/png' || file?.type == 'image/jpg' || file?.type == 'image/jpeg') {
            if (file.size > 1048576) {
                handleOpenSnackbar({ message: 'Image size must not exceed 1mb', alertType: 'error' });
            } else {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setOpenCropper(true);
                    setImageType(file.type);
                    setBase64Image(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            handleOpenSnackbar({ message: 'Only jpg, jpeg or png are allowed.', alertType: 'error' });
        }
    };

    if (loading || !user) {
        return <CustomLoader  />;
    }

    if (error) {
        return <FailureLoad />;
    }

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    _id: user._id || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    authProviderId: user.authProviderId || '',
                    address: user.address?.displayAddress || '',
                    bio: user.bio || '',
                    profileImage: user.profileImage || '',
                }}
                validationSchema={validationSchemaAppUser(user._id, user.authProvider === AuthType.EMAIL)}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Stack className="avatar-wrapper">
                                        <Avatar alt={user?.firstName} src={croppedImage || user.profileImageUrl} sx={{ height: 64, width: 64 }} />
                                        <input
                                            name="profileImage"
                                            accept="image/*"
                                            id="contained-button-file"
                                            onChange={handleSelectProfileImage}
                                            type="file"
                                            hidden
                                        />
                                        <Button component="label" htmlFor="contained-button-file" size="small" variant="text">
                                            <Typography color="text.primary">Change profile picture</Typography>
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel htmlFor="firstName">First name </InputLabel>
                                    <TextField
                                        id="firstName"
                                        fullWidth
                                        placeholder="First name"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <FormHelperText error id="firstName-error">
                                            {firstLetterUppercase(errors.firstName)}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel htmlFor="lastName">Last name </InputLabel>
                                    <TextField
                                        id="lastName"
                                        fullWidth
                                        placeholder="Last name"
                                        value={values.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <FormHelperText error id="lastName-error">
                                            {firstLetterUppercase(errors.lastName)}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                {user.authProvider === AuthType.EMAIL ? (
                                    <>
                                        <Grid item xs={12}>
                                            <InputLabel htmlFor="email">Contact email </InputLabel>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                placeholder="Your email address"
                                                value={values.authProviderId}
                                                name="authProviderId"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.authProviderId && errors.authProviderId && (
                                                <FormHelperText error id="authProviderId-error">
                                                    {errors.authProviderId}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={12}>
                                            <InputLabel htmlFor="phone">Contact number</InputLabel>
                                            <TextField
                                                fullWidth
                                                id="phone"
                                                placeholder="Phone"
                                                value={values.authProviderId}
                                                name="authProviderId"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                            {touched.authProviderId && errors.authProviderId && (
                                                <FormHelperText error id="authProviderId-error">
                                                    {errors.authProviderId}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="address">Address</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="address"
                                        placeholder="Enter Address"
                                        value={values.address}
                                        name="address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.address && errors.address && (
                                        <FormHelperText error id="address-error">
                                            {errors.address}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="bio">Bio</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="bio"
                                        placeholder="Enter Bio"
                                        value={values.bio}
                                        name="bio"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.bio && errors.bio && (
                                        <FormHelperText error id="bio-error">
                                            {errors.bio}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" size="large" type="submit">
                                        Save changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    );
                }}
            </Formik>
            {openCropper && (
                <ImageCropperModal
                    open={openCropper}
                    setOpen={setOpenCropper}
                    base64Image={base64Image}
                    setCroppedImage={setCroppedImage}
                    title="Crop profile picture"
                    squareImage={true}
                />
            )}
        </>
    );
};

export default ProfileDetail;
