// material-ui
import { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, FormHelperText, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';

import FailureLoad from 'components/spinner/fail';
import useSnackbar from 'hooks/common/useSnackbar';
import { useGQL } from './hooks/useGQL';

import { Admin, SignedUrlMethod } from '../../types/profile';
import { defaultValue } from '../../constants/profile';
import { AdminRoles, gridSpacing } from 'store/constant';

// assets
import ConfirmModal from 'components/modal/ConfirmModal';
import { dispatch } from 'store';
import { closeModal, openModal } from 'store/slices/modal';
import { validationSchemaUserProfile } from './constant/constant';
import Avatar from 'ui-component/extended/Avatar';
import ImageCropperModal from 'components/modal/ImageCropModal';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';
import CustomLoader from 'components/loader';

// ==============================|| PROFILE 2 - USER PROFILE ||============================== //
const UserProfile = () => {
    const { handleOpenSnackbar } = useSnackbar();

    const [adminProfile, setAdminProfile] = useState<Partial<typeof defaultValue>>(defaultValue);
    const [profileUrl, setProfileUrl] = useState<any>('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileimage, setProfileimage] = useState('');
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [croppedImage, setCroppedImage] = useState();
    const [imageType, setImageType] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const { GET_ADMIN_PROFILE, UPDATE_ADMIN_PROFILE, IMAGE_UPLOAD } = useGQL();
    const { error, loading, data, refetch } = GET_ADMIN_PROFILE();
    const [handleUpdate, {data: updateData}] = UPDATE_ADMIN_PROFILE();
    const [handleImageUpload] = IMAGE_UPLOAD();

    const formRef = useRef<any>();
    const handleSubmitExternally = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handleOpenModal = () => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    useEffect(() => {
        if (data?.getUserProfile) {
            let { _id, firstName, lastName, email, phone, status, role, profileImage, profileImageUrl } = data.getUserProfile;

            if (phone == null) {
                phone = '';
            }
            if (role == 'superAdmin') {
                role = AdminRoles.SUPERADMIN;
            } else if (role == 'admin') {
                role = AdminRoles.ADMIN;
            } else if (role == 'editor') {
                role = AdminRoles.EDITOR;
            } else {
                role = AdminRoles.EDITOR;
            }
            if (profileImage) {
                setProfileLoading(true);
                setProfileUrl(profileImageUrl);
                setProfileimage(profileImage);
                setProfileLoading(false);
            }
            setAdminProfile({ _id, firstName, lastName, email, phone, status, role, profileImage });
        }
    }, [data]);

    useEffect(() => {
        if (updateData?.updateAdmin) {
            window.location.reload();
        }
    }, [updateData]);

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

    const handleProfileUpdate = async (values: Partial<Admin>, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const {_id, email, role, ...input} = { ...adminProfile };
            const response = await handleUpdate({ variables: { id: adminProfile._id!, input: { ...input, ...values } } });
            setUpdateLoading(false);
            handleOpenSnackbar({ message: response?.data?.updateAdmin?.message!, alertType: 'success' });
            refetch();
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
            setSubmitting(false);
        }
    };

    const handleUserProfileUpdate = async (values: Partial<Admin>, setSubmitting) => {
        const {_id, email, role, ...input} = { ...values };
        
        setSubmitting(true);
        dispatch(closeModal());
        setUpdateLoading(true);
        if (croppedImage) {
            try {
                const blob = base64ToBlob(croppedImage, imageType);
                const imageExt = imageType.split('/').pop();
                const filename = `${uuid()}.${imageExt}`;
                const key = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                input.profileImage = key?.fileDetails?.name; //passing objectkey return error so pass name here fix this later
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        handleProfileUpdate(input, setSubmitting);
    };

    return (
        <Grid container spacing={gridSpacing}>
            {loading || updateLoading ? (
                <Grid item xs={12}>
                    <CustomLoader  />
                </Grid>
            ) : error ? (
                <FailureLoad />
            ) : (
                <>
                    <Grid item xs={12}>
                        <Stack className="avatar-wrapper">
                            {profileLoading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <Avatar alt={data?.getUserProfile?.firstName} src={croppedImage || profileUrl} size="md" />
                                </>
                            )}
                            <input accept="image/*" id="contained-button-file" name="profileImage" onChange={handleSelectProfileImage} type="file" hidden />
                            <Button component="label" htmlFor="contained-button-file" size="small" variant="text">
                                <Typography color="text.primary">Change profile picture</Typography>
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Formik
                            innerRef={formRef}
                            enableReinitialize
                            initialValues={adminProfile}
                            validationSchema={validationSchemaUserProfile}
                            onSubmit={async (values, { setSubmitting }) => handleUserProfileUpdate(values, setSubmitting)}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>First Name</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter full name"
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
                                                placeholder="Enter full name"
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
                                                placeholder="Enter email"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Status</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Status"
                                                value={values.status}
                                                name="status"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Role</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Role"
                                                value={values.role}
                                                name="role"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack className="button-wrapper-row">
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    // onClick={handleOpenModal}
                                                >
                                                    Save Changes
                                                </Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Grid>
                </>
            )}

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

            <ConfirmModal
                title="Update Profile"
                content="Are you sure you want to update the profile ?"
                yes={handleSubmitExternally}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </Grid>
    );
};
export default UserProfile;
