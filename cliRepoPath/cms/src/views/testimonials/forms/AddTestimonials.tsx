import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

import useSnackbar from 'hooks/common/useSnackbar';

import MainCard from 'ui-component/cards/MainCard';
import { Formik } from 'formik';
import { Box, Button, CircularProgress, FormHelperText, FormLabel, Grid, InputLabel, TextField, Typography } from '@mui/material';

import useGQL from '../hooks/useGQL';
import { defaultFile, defaultValue1, validationSchema1 } from '../constants/testimonials';
import { GridDivider } from 'components/divider/Divider';
import ImageUploadHelper from 'utils/imageUploadHelper';
import { FileUploadParams } from 'types/file-upload';

const AddTestimonials = () => {
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const { CREATE_TESTIMONIAL, IMAGE_UPLOAD } = useGQL();
    const [handleCreate, { data }] = CREATE_TESTIMONIAL();
    const [isLoaderShow, setIsLoaderShow] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
    const [img, setImg] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER);
    const [imageLoading, setImageLoading] = useState(false);
    const [image, setImage] = useState<any>(defaultFile);
    const [handleImageUpload] = IMAGE_UPLOAD();
    const handleFormSubmit = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true);

        /* api call  */
        handleCreate({
            variables: {
                input: {
                    text: values.text,
                    customer: [
                        {
                            id: uuid(),
                            name: values.name,
                            location: values.location,
                            image: { name: image.name, objectKey: image.objectKey, contentType: image.contentType },
                            comment: values.comment
                        }
                    ]
                }
            }
        })
            .then((success: any) => {
                handleOpenSnackbar({ message: success.data.createTestimonial.message, alertType: 'success' });
                setIsLoaderShow(false);
                setSubmitting(false);
                navigate('/testimonials/list');
            })
            .catch((err: any) => {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
                setSubmitting(false);
                setIsLoaderShow(false);
            });
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [...values.sub, { id: uuid(), customer: [{ comment: '', image: '', name: '', location: '' }] }]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };
    const handleUploadImage = async (event) => {
        if (
            event.target.files[0].type == 'image/png' ||
            event.target.files[0].type == 'image/jpg' ||
            event.target.files[0].type == 'image/jpeg'
        ) {
            if (event.target.files[0].size > 1048576) {
                handleOpenSnackbar({ message: 'Image size must not exceed 1mb', alertType: 'error' });
            } else {
                setImageLoading(true);

                const filename = `${uuid()}.${event.target.files[0].name.split('.').pop()}`;
                const fileUploadParams: FileUploadParams = {
                    event,
                    uploadFunction: handleImageUpload,
                    filename
                };
                const imageUpload = await ImageUploadHelper(fileUploadParams);
                setImageLoading(false);
                setImageUrl(imageUpload?.uploadResponse?.data?.getPreSignedUrl.url);
                setImage(imageUpload?.fileDetails);
            }
        } else {
            handleOpenSnackbar({ message: 'Only jpg, jpeg and png  are allowed.', alertType: 'error' });
        }
    };
    return (
        <Formik
            enableReinitialize
            initialValues={defaultValue1}
            validationSchema={validationSchema1}
            onSubmit={(values, { setSubmitting }) => {
                handleFormSubmit(values, setSubmitting);
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <MainCard title="Add Testimonials">
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Headline</InputLabel>
                                <TextField
                                    fullWidth
                                    id="text"
                                    placeholder="Our happy customers"
                                    value={values.text}
                                    name="text"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched.text && errors.text && (
                                    <FormHelperText error id="title-error">
                                        {errors.text}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12}>
                                <Typography variant="h4">Customer</Typography>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Customer name</InputLabel>
                                <TextField
                                    fullWidth
                                    id="name"
                                    placeholder="Enter  Name"
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
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <FormLabel>Image:</FormLabel>
                                <Box position="relative" height={120} mb={2}>
                                    {imageLoading ? <CircularProgress /> : <img src={imageUrl} style={{ height: '100%' }} />}
                                </Box>
                                <Button variant="outlined" component={FormLabel}>
                                    <input type="file" name="image" onBlur={handleBlur} onChange={handleUploadImage} hidden />
                                    Change
                                </Button>
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Location</InputLabel>
                                <TextField
                                    fullWidth
                                    id="location"
                                    placeholder="Enter location"
                                    value={values.location}
                                    name="location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched.location && errors.location && (
                                    <FormHelperText error id="location-error">
                                        {errors.location}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Comment</InputLabel>
                                <TextField
                                    fullWidth
                                    id="comment"
                                    placeholder="Enter Comment"
                                    value={values.comment}
                                    name="comment"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                />
                                {touched.comment && errors.comment && (
                                    <FormHelperText error id="comment-error">
                                        {errors.comment}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <Button disabled={isSubmitting} variant="contained" type="submit">
                                    Add testimonials
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </form>
            )}
        </Formik>
    );
};

export default AddTestimonials;
