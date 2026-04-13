import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import useSnackbar from 'hooks/common/useSnackbar';
import { defaultValue, fields, validationSchema } from '../constants/taxanomy';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from 'store';
import TinyMCE from '../components/editors/TinyMCE';
import { EditorState } from 'types';
import { v4 as uuid } from 'uuid';
import Spinner from 'components/spinner';
import useGQL from '../hooks/useGQL';
import { Formik } from 'formik';
import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, Grid, InputLabel, Select, TextField } from '@mui/material';
import { ImageWrapper } from '../components/formik/formik.styles';
import slugify from 'slugify';

import { defaultFile } from '../constants/taxanomy';
import { GridDivider } from 'components/divider/Divider';
import ImageUploadHelper from 'utils/imageUploadHelper';
import { FileUploadParams } from 'types/file-upload';
import CustomLoader from 'components/loader';
import ImageCropperModal from 'components/modal/ImageCropModal';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';

const AddTaxon = () => {
    const editorDefault = '';
    const [editorState, setEditorState] = useState<EditorState>();
    const { taxonomyId } = useParams();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const form = useSelector((state: RootState) => state.form);
    const defaultFields = { ...fields };
    const dispatch = useDispatch();
    const taxonFromState: any = useSelector((state: RootState) => state.taxon);
    const { UPDATE_TAXONOMY, LIST_TAXONOMY, IMAGE_UPLOAD } = useGQL();
    const { data: taxonomyData } = LIST_TAXONOMY(taxonomyId);
    const [handleUpdateTaxonomy, { loading }] = UPDATE_TAXONOMY();
    const [img, setImg] = useState<string>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
    const [imageUrl, setImageUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
    const [imageLoading, setImageLoading] = useState(false);
    const [image1, setImage1] = useState<any>(defaultFile);

    //image cropper
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [croppedImage, setCroppedImage] = useState();
    const [imageType, setImageType] = useState('');

    const [handleImageUpload] = IMAGE_UPLOAD();

    useEffect(() => {
        sessionStorage.clear();
        return () => {
            defaultFields[0].main[0].choice.pop();
        };
    }, []);

    useEffect(() => {
        if (taxonFromState && taxonFromState?.data.length > 0) {
            const optionsArray: any = [];
            taxonFromState?.data?.map((taxon) => {
                optionsArray.push({
                    value: taxon.uuid,
                    label: taxon.name
                });
                taxon?.children?.map((child) => {
                    optionsArray.push({
                        value: child.uuid,
                        label: child.name
                    });
                });
            });
        }
    }, [taxonFromState]);

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!form.errors) {
            if (croppedImage) {
                try {
                    const blob = base64ToBlob(croppedImage, imageType);
                    const imageExt = imageType.split('/').pop();
                    const fileid = `${uuid()}`;
                    const filename = `${uuid()}.${imageExt}`;
                    const imgDetail = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                    // values.image = { name: filename, objectKey: fileid, contentType: 'image/*' };
                    values.image = imgDetail?.fileDetails;
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            const dataToSubmit: any = {
                name: values.name,
                slug: values.slug,
                uuid: uuid()
            };
            if (values.metaTitle) {
                dataToSubmit.metaTitle = values.metaTitle;
            }
            if (values.metaDescription) {
                dataToSubmit.metaDescription = values.metaDescription;
            }
            if (values.metaKeywords) {
                dataToSubmit.metaKeywords = values.metaKeywords;
            }
            if (values.nestedUnder) {
                dataToSubmit.nestedUnder = values.nestedUnder;
            }
            // if (image1) {
            //     dataToSubmit.image = { name: image1.name, objectKey: image1.objectKey, contentType: image1.contentType };
            // }
            if (values.image) {
                dataToSubmit.image = { name: values.image.name, objectKey: values.image.objectKey, contentType: values.image.contentType };
            }
            if (editorState && editorState?.editor?.getContent()?.length > 0) {
                dataToSubmit.description = editorState?.editor.getContent();
            }
            if (dataToSubmit.nestedUnder) {
                const dataIfNestedUnder = taxonFromState.data.map((item) => {
                    item = { ...item };
                    if (item.uuid == dataToSubmit.nestedUnder) {
                        item.children = item.children ? item.children : [];
                        return { ...item, children: [...item.children, dataToSubmit] };
                    }

                    if (item?.children) {
                        const childArray = item?.children.map((child) => {
                            child = { ...child };
                            if (child.uuid == dataToSubmit.nestedUnder) {
                                child.children = child.children ? child.children : [];
                                return { ...child, children: [...child.children, dataToSubmit] };
                            }
                            return child;
                        });
                        return { ...item, children: childArray };
                    }

                    return item;
                });
                dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: dataIfNestedUnder });
            } else {
                dispatch({ type: 'SET_DATA', payload: dataToSubmit });
            }
            const dataToSubmit1 = {
                name: taxonomyData.listTaxonomy.taxonomy.name,
                taxons: store.getState().taxon?.data
            };

            handleOpenSnackbar({ message: 'Taxon successfully created', alertType: 'success' });
            handleUpdateTaxonomy({ variables: { id: taxonomyId, input: dataToSubmit1 } })
                .then((success: any) => {
                    handleOpenSnackbar({ message: success.data.updateTaxonomy.message, alertType: 'success' });
                    sessionStorage.clear();
                    dispatch({ type: 'SET_TAXON_ROUTE', payload: '' });
                    navigate(`/taxonomy/view/${taxonomyId}`);
                })
                .catch((err: any) => {
                    handleOpenSnackbar({ message: err.message, alertType: 'error' });
                });

            sessionStorage.clear();
        }
        setSubmitting(false);
    };

    const handleUploadImage = async (event) => {
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

    if (loading) {
        return <CustomLoader  />;
    }

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={defaultValue}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <MainCard title="Add Taxon">
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        placeholder="Name"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            setFieldValue('slug', slugify(event.target.value).toLowerCase());
                                            handleChange(event);
                                        }}
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="title-error">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Slug</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="slug"
                                        placeholder="Enter Slug"
                                        value={values.slug}
                                        name="slug"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        disabled
                                    />
                                    {touched.slug && errors.slug && (
                                        <FormHelperText error id="slug-error">
                                            {errors.slug}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Meta title</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="metaTitle"
                                        placeholder="Meta Title"
                                        value={values.metaTitle}
                                        name="metaTitle"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.metaTitle && errors.metaTitle && (
                                        <FormHelperText error id="metaTitle-error">
                                            {errors.metaTitle}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Metal description</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="metaDescription"
                                        placeholder="Meta Description"
                                        value={values.metaDescription}
                                        name="metaDescription"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                    />
                                    {touched.metaDescription && errors.metaDescription && (
                                        <FormHelperText error id="metaDescription-error">
                                            {errors.metaDescription}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Meta keywords</InputLabel>
                                    <TextField
                                        fullWidth
                                        id="metaKeywords"
                                        placeholder="Meta Keywords"
                                        value={values.metaKeywords}
                                        name="metaKeywords"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.metaKeywords && errors.metaKeywords && (
                                        <FormHelperText error id="metaKeywords-error">
                                            {errors.metaKeywords}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="nested-label">Nested Under</InputLabel>
                                        <Select
                                            native
                                            labelId="nested-label"
                                            id="nested"
                                            value={values.nestedUnder}
                                            name="nestedUnder"
                                            onChange={handleChange}
                                        >
                                            <option aria-label="None" value="" />
                                            {taxonomyData?.listTaxonomy?.taxonomy?.taxons?.map((parentItem) => (
                                                <>
                                                    <option value={parentItem.uuid} label={parentItem.name} />
                                                    {parentItem?.children &&
                                                        parentItem?.children.map((childItem) => (
                                                            <>
                                                                <option value={childItem.uuid} label={`--${childItem.name}`}></option>
                                                            </>
                                                        ))}
                                                </>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {touched.nestedUnder && errors.nestedUnder && (
                                        <FormHelperText error id="nestedUnder-error">
                                            {errors.nestedUnder}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={6}>
                                    <FormLabel>Image:</FormLabel>
                                    <ImageWrapper>
                                        {imageLoading ? (
                                            <CircularProgress />
                                        ) : (
                                            <img src={croppedImage || imageUrl} style={{ height: '100%' }} />
                                        )}
                                    </ImageWrapper>
                                    <input
                                        type="file"
                                        id="taxon-image"
                                        name="image"
                                        onBlur={handleBlur}
                                        onChange={handleUploadImage}
                                        hidden
                                    />
                                    <Button variant="outlined" component={FormLabel} htmlFor="taxon-image">
                                        Change
                                    </Button>
                                </Grid>
                                <GridDivider />
                                <Grid item xs={12} lg={8}>
                                    <TinyMCE initialValue={editorDefault} height={250} setEditorState={setEditorState} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button disabled={isSubmitting} variant="contained" type="submit">
                                        Add Taxon
                                    </Button>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </form>
                )}
            </Formik>
            {openCropper && (
                <ImageCropperModal
                    open={openCropper}
                    setOpen={setOpenCropper}
                    base64Image={base64Image}
                    setCroppedImage={setCroppedImage}
                    title="Crop logo"
                />
            )}
        </>
    );
};

export default AddTaxon;
