import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import invariant from 'tiny-invariant';

import useSnackbar from 'hooks/common/useSnackbar';

import { useNavigate, useParams } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';
import FailureLoad from 'components/spinner/fail';

import { Formik } from 'formik';

import { Box, Button, CircularProgress, Divider, FormHelperText, FormLabel, Grid, InputLabel, TextField, Typography } from '@mui/material';

import { defaultFile, defaultValue1, validationSchema1 } from '../constants/testimonials';
import useGQL from '../hooks/useGQL';
import { GridDivider } from 'components/divider/Divider';
import ImageUploadHelper from 'utils/imageUploadHelper';
import { FileUploadParams } from 'types/file-upload';
import CustomLoader from 'components/loader';

const EditTestimonials = () => {
    const params = useParams();
    const { handleOpenSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { GET_TESTIMONIAL, UPDATE_TESTIMONIAL, IMAGE_UPLOAD } = useGQL();
    invariant(params.id, 'Not empty on target edit');
    const { error, loading, data } = GET_TESTIMONIAL(params.id);
    const [handleUpdate, { data: updateData }] = UPDATE_TESTIMONIAL();
    const [isLoaderShow, setIsLoaderShow] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER);
    const [imageLoading, setImageLoading] = useState(false);
    const [image, setImage] = useState<any>(defaultFile);
    const [handleImageUpload] = IMAGE_UPLOAD();

    useEffect(() => {
        if (data?.GetTestimonial) {
            setImageLoading(true);
            const { text, customer } = data?.GetTestimonial.testimonial;
            if (data?.GetTestimonial.testimonial.customer[0].image?.url) {
                setImageLoading(false);
                setImageUrl(data?.GetTestimonial.testimonial.customer[0].image?.url);
            }
            setImageLoading(false);
        }
    }, [data]);

    const handleFormSubmit = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
        setSubmitting(true);

        /* api call  */
        invariant(params.id, 'Not empty on target edit');
        await handleUpdate({
            variables: {
                id: params.id,
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
                handleOpenSnackbar({ message: success.data.updateTestimonial.message, alertType: 'success' });
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

    return (
        <>
            {loading ? (
                <CustomLoader />
            ) : error ? (
                <FailureLoad />
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={{
                        text: data?.GetTestimonial.testimonial.text || '',
                        name: data?.GetTestimonial.testimonial.customer[0].name || '',
                        location: data?.GetTestimonial.testimonial.customer[0].location || '',
                        comment: data?.GetTestimonial.testimonial.customer[0].comment || ''
                    }}
                    validationSchema={validationSchema1}
                    onSubmit={(values, { setSubmitting }) => {
                        handleFormSubmit(values, setSubmitting);
                    }}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <MainCard title="Edit Testimonials">
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
                                    <Grid item xs={12}>
                                        <Button disabled={isSubmitting} variant="contained" type="submit">
                                            Edit testimonials
                                        </Button>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default EditTestimonials;
