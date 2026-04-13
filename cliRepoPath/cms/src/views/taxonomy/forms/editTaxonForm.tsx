/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from 'store';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';
import { Button, CircularProgress, FormControl, FormHelperText, FormLabel, Grid, InputLabel, Select, TextField } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import useSnackbar from 'hooks/common/useSnackbar';
import TinyMCE from '../components/editors/TinyMCE';
import { ImageWrapper } from '../components/formik/formik.styles';
import { GridDivider } from 'components/divider/Divider';
import useGQL from '../hooks/useGQL';
import { EditorState } from 'types';
import { defaultValue, fields, taxonValue, validationSchema } from '../constants/taxanomy';
import { SignedUrlMethod } from '../types/taxanomy';
import { defaultFile } from '../constants/taxanomy';
import ImageCropperModal from 'components/modal/ImageCropModal';
import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';

const EditTaxon = () => {
    const [editorState, setEditorState] = useState<EditorState>();
    const { id, taxonomyId } = useParams();

    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const form = useSelector((state: RootState) => state.form);
    const taxonFromState: any = useSelector((state: RootState) => state.taxon);
    const dispatch = useDispatch();
    const defaultFields = { ...fields };
    const [defaultValueForEdit, setDefaultValueForEdit] = useState<taxonValue>(defaultValue);
    const [editorDefault, setEditorDefault] = useState<any>('');
    const { UPDATE_TAXONOMY, LIST_TAXONOMY, IMAGE_UPLOAD } = useGQL();
    const { data: taxonomyData, refetch: taxonomyRefetch } = LIST_TAXONOMY(taxonomyId);
    const [handleUpdateTaxonomy] = UPDATE_TAXONOMY();
    const [imageUrl, setImageUrl] = useState<any>(import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '');
    const [imageLoading, setImageLoading] = useState(false);

    //image cropper
    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [croppedImage, setCroppedImage] = useState();
    const [imageType, setImageType] = useState('');

    const [handleImageUpload] = IMAGE_UPLOAD();

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
    
    useEffect(() => {
        if (taxonomyData?.listTaxonomy) {
            const selectedTaxon1 = taxonomyData?.listTaxonomy?.taxonomy?.taxons
                .map((taxon) => {
                    if (taxon.uuid == id) {
                        return taxon;
                    }

                    if (taxon?.children && taxon?.children?.length > 0) {
                        const children = taxon?.children
                            ?.map((child) => {
                                if (child.uuid == id) {
                                    return child;
                                }
                                if (child?.children && child?.children?.length > 0) {
                                    const grandChildren = child?.children
                                        ?.map((grandchild) => {
                                            if (grandchild.uuid == id) {
                                                return grandchild;
                                            }
                                            return null;
                                        })
                                        .filter((e) => e !== null)
                                        .filter((e) => e !== undefined);
                                    return grandChildren[0];
                                }
                                return null;
                            })
                            .filter((e) => e !== null)
                            .filter((e) => e !== undefined);

                        return children[0];
                    }

                    return null;
                })
                .filter((e) => e !== null)
                .filter((e) => e !== undefined);
            const selectedTaxon = selectedTaxon1.filter((e) => e !== undefined).filter((e) => e !== null);

            if (taxonFromState && taxonFromState?.data.length > 0) {
                const optionsArray: any = [];
                taxonFromState?.data?.map((taxon) => {
                    optionsArray.push({
                        value: taxon.uuid,
                        label: taxon.name
                    });
                    taxon?.children?.map((child) => {
                        // child?.children?.map((grandChild) => {
                        //     optionsArray.push({
                        //         value: grandChild.uuid,
                        //         label: grandChild.name
                        //     });
                        // });
                        optionsArray.push({
                            value: child.uuid,
                            label: child.name
                        });
                    });
                });
            }

            if (selectedTaxon && selectedTaxon.length > 0) {
                setEditorDefault(selectedTaxon[0].description);
                setDefaultValueForEdit({
                    name: selectedTaxon[0].name,
                    slug: selectedTaxon[0].slug,
                    metaTitle: selectedTaxon[0].metaTitle,
                    metaDescription: selectedTaxon[0].metaDescription,
                    metaKeywords: selectedTaxon[0].metaKeywords,
                    image: selectedTaxon[0].image,
                    description: selectedTaxon[0].description,
                    nestedUnder: selectedTaxon[0].nestedUnder
                });

                if (selectedTaxon[0].image.objectKey) {
                    setImageLoading(true);
                    getImageUrl(selectedTaxon[0].image);
                }
                setImageLoading(false);
                setEditorDefault(selectedTaxon[0].description);
                setEditorState(selectedTaxon[0].description);
            }
        }
    }, [taxonomyData]);

    const getImageUrl = async (url: any) => {
        const imageUrl1 = await handleImageUpload({
            variables: {
                input: {
                    path: url.objectKey,
                    contentType: url.contentType,
                    method: SignedUrlMethod.GET
                }
            }
        });

        setImageUrl(imageUrl1.data?.getPreSignedUrl?.url);
    };

    useEffect(() => {
        sessionStorage.clear();
        taxonomyRefetch();
    }, [taxonomyData]);

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!form.errors) {
            if (croppedImage) {
                try {
                    const blob = base64ToBlob(croppedImage, imageType);
                    const imageExt = imageType.split('/').pop();
                    // const fileid = `${uuid()}`;
                    const filename = `${uuid()}.${imageExt}`;
                    const imgDetail = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                    // values.image = { name: filename, objectKey: filename, contentType: 'image/*' };
                    values.image = imgDetail?.fileDetails;
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            const dataToSubmit = {
                uuid: id,
                name: values.name,
                slug: values.slug,
                metaTitle: values.metaTitle,
                metaDescription: values.metaDescription,
                metaKeywords: values.metaKeywords,
                image: values.image,
                nestedUnder: values.nestedUnder,
                description: editorState?.editor ? editorState?.editor.getContent() : editorState,
                children: []
            };

            if (dataToSubmit.nestedUnder) {
                const dataAfterDelete = taxonFromState.data
                    .map((taxon) => {
                        if (taxon.uuid === id) {
                            // If the current taxon matches the id, return null to delete it and its descendants.
                            return null;
                        }
                        if (taxon?.children && taxon.children.length > 0) {
                            const childArray = taxon.children
                                .map((child) => {
                                    if (child.uuid === id) {
                                        if (child?.children?.length > 0) {
                                            // setChildItems(child.children);
                                            dataToSubmit.children = child.children;
                                        }

                                        // If a child matches the id, return null to delete it and its descendants.
                                        return null;
                                    }

                                    if (child?.children && child?.children?.length > 0) {
                                        const grandChildArray = child.children
                                            .map((grandChild) => {
                                                if (grandChild.uuid === id) {
                                                    // If a grandchild matches the id, return null to delete it and its descendants.
                                                    return null;
                                                }
                                                return grandChild; // Return unchanged if not matching.
                                            })
                                            .filter((e) => e !== null);

                                        return { ...child, children: grandChildArray };
                                    }

                                    return child; // Return unchanged if no match or no grandchildren.
                                })
                                .filter((e) => e !== null);

                            return { ...taxon, children: childArray };
                        }

                        return taxon; // Return unchanged if no match or no children.
                    })
                    .filter((e) => e !== null); // Filter out any null values.

                dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: dataAfterDelete });

                if (dataAfterDelete) {
                    const dataIfNestedUnder = dataAfterDelete.map((item) => {
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
                }
            }

            const stateAfterUpdate = taxonFromState.data.map((taxon) => {
                if (taxon.uuid == id) {
                    return { ...dataToSubmit, children: taxon.children, uuid: taxon.uuid };
                }
                if (taxon?.children && taxon?.children.length > 0) {
                    const childArray = taxon.children.map((child) => {
                        if (child.uuid == id) {
                            return { ...dataToSubmit, children: child.children, uuid: child.uuid };
                        }
                        if (child?.children && child?.children.length > 0) {
                            const grandChildrenArray = child.children.map((grandchild) => {
                                if (grandchild.uuid == id) {
                                    return { ...dataToSubmit, children: grandchild.children, uuid: grandchild.uuid };
                                }
                                return grandchild;
                            });
                            return { ...child, children: grandChildrenArray };
                        }
                        return child;
                    });
                    return { ...taxon, children: childArray };
                }
                return taxon;
            });
            dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: stateAfterUpdate });
            dispatch({ type: 'SET_TAXON_ROUTE', payload: 'editForm' });

            const dataToSubmit1 = {
                name: taxonomyData.listTaxonomy.taxonomy.name,
                taxons: store.getState().taxon?.data
            };
            handleUpdateTaxonomy({ variables: { id: taxonomyId, input: dataToSubmit1 } })
                .then((success: any) => {
                    handleOpenSnackbar({ message: 'taxon updated successfully', alertType: 'success' });
                    sessionStorage.clear();
                    //  defaultFields[0].main[0].choice.pop();
                    navigate(`/taxonomy/view/${taxonomyId}`);
                })
                .catch((err: any) => {
                    handleOpenSnackbar({ message: err.message, alertType: 'error' });
                });
        }
        setSubmitting(false);
    };

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={defaultValueForEdit}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid item xs={12} lg={6}>
                            <MainCard title="Edit Taxon">
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
                                            <InputLabel id="nested-under-select-label">Nested Under</InputLabel>
                                            <Select
                                                native
                                                labelId="nested-under-select-label"
                                                id="nested-under-select"
                                                value={values.nestedUnder || id}
                                                name="nestedUnder"
                                                onChange={handleChange}
                                            >
                                                <option aria-label="None" value="" />
                                                {taxonomyData?.listTaxonomy?.taxonomy?.taxons?.map((parentItem) => (
                                                    <React.Fragment key={parentItem.uuid}>
                                                        <option
                                                            disabled={parentItem.uuid === id}
                                                            value={parentItem.uuid}
                                                            label={parentItem.name}
                                                        />
                                                        {parentItem?.children &&
                                                            parentItem?.children.map((childItem) => (
                                                                <>
                                                                    <option
                                                                        disabled={
                                                                            childItem.uuid === id ||
                                                                            childItem.nestedUnder === id ||
                                                                            parentItem.nestedUnder === null
                                                                        }
                                                                        value={childItem.uuid}
                                                                        label={`--${childItem.name}`}
                                                                    ></option>
                                                                </>
                                                            ))}
                                                    </React.Fragment>
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
                                            Edit Taxon
                                        </Button>
                                    </Grid>
                                </Grid>
                            </MainCard>
                        </Grid>
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

export default EditTaxon;
