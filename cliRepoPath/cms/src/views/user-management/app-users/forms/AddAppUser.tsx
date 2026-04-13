import { auth, initialValues, validationSchemaAppUser } from '../constants/variables';
import { useEffect, useState } from 'react';
import { FormInputType } from '../constants/types';
import useGQL from '../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import MainCard from 'ui-component/cards/MainCard';
import { Grid, TextField, FormHelperText, InputLabel, Paper, Stack, Button, Typography, CircularProgress } from '@mui/material';
import PageTitle from 'components/page-title/PageTitle';
import Avatar from 'ui-component/extended/Avatar';
import CustomLoader from 'components/loader';
import { base64ToBlob } from 'utils/base64ToBlob';
import { v4 as uuid } from 'uuid';
import blobUploadHelper from 'utils/blogUploader';
import ImageCropperModal from 'components/modal/ImageCropModal';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

const AddAppUser = () => {
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const { CREATE_USER, IMAGE_UPLOAD } = useGQL();
    const [handleCreateUser, { data }] = CREATE_USER();
    const [pageLoading, setPageLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileimage, setProfileimage] = useState('');
    const [croppedImage, setCroppedImage] = useState();
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [imageType, setImageType] = useState('');
    const [profileUrl, setProfileUrl] = useState<any>('');

    const [handleImageUpload] = IMAGE_UPLOAD();

    const handleFormSubmit = async (values: FormInputType, setSubmitting: (isSubmitting: boolean) => void) => {
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

            await handleCreateUser({
                variables: {
                    input: { ...values, authProvider: auth.authProvider }
                }
            });

            setSubmitting(false);
            setPageLoading(true);
        } catch (error: any) {
            setPageLoading(false);
            handleOpenSnackbar({ message: error.message, alertType: 'error' });
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

    useEffect(() => {
        if (data?.createAppUser) {
            handleOpenSnackbar({ message: data.createAppUser.message, alertType: 'success' });
            setTimeout(() => {
                navigate('/app-user/list');
            }, 2000);
            if (data?.createAppUser?.user?.profileImage) {
                setProfileLoading(true);
                setProfileimage(base64Image);
                setProfileLoading(false);
            }
        }
    }, [data]);

    let breadcrumbLinks = [
        { title: 'User management', to: '/app-user/list' },
        { title: 'Add new user' }
    ];

    if (pageLoading) {
        return <CustomLoader  />;
    }

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <PageTitle title="Add new user" />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchemaAppUser}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                    return(
                    <form onSubmit={handleSubmit}>
                        <MainCard>
                            <Typography variant="h3" mb={2.5}>
                                Account details
                            </Typography>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <Stack className="avatar-wrapper">
                                        {profileLoading ? (
                                            <CircularProgress />
                                        ) : (
                                            <Avatar alt="user-picture" src={croppedImage || profileUrl} size="md" />
                                        )}
                                        <input
                                            name="profileImage"
                                            accept="image/*"
                                            id="appuser-profile"
                                            onChange={handleSelectProfileImage}
                                            type="file"
                                            hidden
                                        />
                                        <Button component="label" htmlFor="appuser-profile" size="small" variant="text">
                                            <Typography color="text.primary">Add profile picture</Typography>
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>First Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        placeholder="Enter First Name"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <FormHelperText error id="firstName-error">
                                            {errors.firstName}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Last Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        placeholder="Enter Last Name"
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
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Email</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="authProviderId"
                                        placeholder="Enter Email"
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
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Address</InputLabel>
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
                                <Grid item xs={12} sm={6}>
                                    <InputLabel>Bio</InputLabel>
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
                            </Grid>
                        </MainCard>
                        <Paper className="form-button-wrapper">
                            <Stack>
                                <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" size="large">
                                    Create new user
                                </Button>
                            </Stack>
                        </Paper>
                    </form>
                )}}
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
export default AddAppUser;
