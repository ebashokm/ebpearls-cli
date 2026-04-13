import { useState, useEffect, useRef } from 'react';
// material-ui
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    Box,
    InputLabel,
    CircularProgress
} from '@mui/material';
import { IconButtonWrapper, ImageWrapper } from './components/formik/formik.styles';

// project imports
import FailureLoad from 'components/spinner/fail';

import useGQL from './hooks/useGQL';

import MainCard from 'ui-component/cards/MainCard';
import { defaultValue, defaultImageConfig, s3bucketPath } from './constants';
import { FieldArray, Formik } from 'formik';
import { setSettings } from 'store/slices/settings';
import { useDispatch } from 'react-redux';
import ConfirmModal from 'components/modal/ConfirmModal';
import { closeModal, openModal } from 'store/slices/modal';
import { openSnackbar } from 'store/slices/snackbar';
import CustomLoader from 'components/loader';
import useSnackbar from 'hooks/common/useSnackbar';
import ImageCropperModal from 'components/modal/ImageCropModal';

import { base64ToBlob } from 'utils/base64ToBlob';
import blobUploadHelper from 'utils/blogUploader';
import { v4 as uuid } from 'uuid';
import { ThemeMode } from 'types/config';
import useConfig from 'hooks/useConfig';

const SettingsList = () => {
    const dispatch = useDispatch();
    const { mode, onChangeMode } = useConfig();
    const { handleOpenSnackbar } = useSnackbar();
    const [iconValue, setIconValue] = useState<any>();
    const [imgConfig, setImgConfig] = useState<typeof defaultImageConfig>(defaultImageConfig);
    const [initialData, setInitialData] = useState({ isLoading: true, data: defaultValue });

    const [openCropper, setOpenCropper] = useState(false);
    const [base64Image, setBase64Image] = useState<any>('');
    const [croppedImage, setCroppedImage] = useState();
    const [imageType, setImageType] = useState('');
    const [imageLoading, setImageLoading] = useState(false);

    const { GET_ALL_SETTINGS_LIST, UPDATE_SETTINGS, IMAGE_UPLOAD } = useGQL();
    const { error, loading, data, refetch } = GET_ALL_SETTINGS_LIST();
    const [handleUpdate, { loading: updateLoading }] = UPDATE_SETTINGS();

    const [handleImageUpload] = IMAGE_UPLOAD();

    useEffect(() => {
        if (data?.listSettings) {
            setInitialData({ isLoading: false, data: data?.listSettings.settings });
            for (let field of data?.listSettings.settings) {
                if (field.fieldType === 'image') {
                    setIconValue(field.value);
                }
            }
        }
    }, [data]);

    useEffect(() => {
        handleRefetch();
    }, []);

    const handleRefetch = () => {
        refetch({});
    };
    const Image = ({ imagePlaceholder, imageSet, handleReset }) => (
        <ImageWrapper>
            <IconButtonWrapper imageSet={imageSet} onClick={handleReset}></IconButtonWrapper>
            <img src={imagePlaceholder} style={{ height: '100%' }} />
        </ImageWrapper>
    );

    const handleOpenModal = () => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const formRef = useRef<any>();
    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current?.handleSubmit();
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

    const handleUpdateSettings = async (values, setSubmitting) => {
        let input = { ...values };
        setSubmitting(true);
        let fieldsData: Array<any> = [];
        for (let field of input.data) {
            let newField = { ...field };
            if (croppedImage && field.fieldType === 'image') {
                try {
                    const blob = base64ToBlob(croppedImage, imageType);
                    const imageExt = imageType.split('/').pop();
                    const filename = `${uuid()}.${imageExt}`;
                    const filenameUrl = await blobUploadHelper(blob, handleImageUpload, filename, imageType);
                    newField.value = filenameUrl?.fileDetails?.objectKey;
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
            if (field.fieldType === 'number') {
                newField.value = newField.value.toString();
            }
            if (field.fieldType === 'switch') {
                newField.value = newField.value.toString();
            }
            fieldsData.push(newField);
        }
        try {
            const updatedSettings = await handleUpdate({ variables: { input: { input: fieldsData } } });
            if (updatedSettings?.data) {
                dispatch(
                    setSettings({
                        settings: fieldsData
                    })
                );

                if (updatedSettings?.data?.updateSettings?.settings) {
                    const themeSetting = updatedSettings?.data?.updateSettings?.settings.find((setting) => setting.slug == 'theme-mode');
                    if (themeSetting) {
                        onChangeMode(themeSetting.value as ThemeMode)
                    }
                }
            }
            dispatch(
                openSnackbar({
                    open: true,
                    message: `Settings updated successfully`,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    }
                })
            );
            dispatch(closeModal());
        } catch (err: any) {
            setSubmitting(false);
        }
    }

    return (
        <MainCard title="Edit Settings">
            {loading ? (
                <CustomLoader />
            ) : error ? (
                <FailureLoad />
            ) : (
                <>
                    <Formik
                        innerRef={formRef}
                        enableReinitialize
                        initialValues={initialData}
                        onSubmit={(values, { setSubmitting }) => handleUpdateSettings(values, setSubmitting)}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
                            const handleImageReset = (name: string) => {
                                setImgConfig(defaultImageConfig);
                                setIconValue('');
                            };
                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid container item md={6} spacing={3}>
                                        <FieldArray name="data">
                                            {() =>
                                                values.data.map((rowData, key: number) => {
                                                    const rowDataError: any = (errors.data?.length && errors.data[key]) || {};
                                                    return (
                                                        <Grid item xs={12} key={key}>
                                                            {rowData.fieldType === 'text' && (
                                                                <Grid item>
                                                                    <InputLabel>{rowData.title}</InputLabel>
                                                                    <TextField
                                                                        fullWidth
                                                                        placeholder={rowData.title}
                                                                        value={values.data[key].value}
                                                                        name={`data.${key}.value`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                    />
                                                                    {rowDataError.value && touched?.data?.[key]?.title && (
                                                                        <FormHelperText error id="values-error">
                                                                            {rowDataError.value}
                                                                        </FormHelperText>
                                                                    )}
                                                                </Grid>
                                                            )}
                                                            {rowData.fieldType === 'dropdown' && (
                                                                <Grid item>
                                                                    <InputLabel>{rowData.title}</InputLabel>
                                                                    <TextField
                                                                        id="values"
                                                                        name={`data.${key}.value`}
                                                                        select
                                                                        value={values.data[key].value}
                                                                        fullWidth
                                                                        onChange={handleChange}
                                                                    >
                                                                        {rowData.options.map((option) => (
                                                                            <MenuItem key={option.label} value={option.value}>
                                                                                {option.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </TextField>

                                                                    {rowDataError.value && touched?.data?.[key]?.title && (
                                                                        <FormHelperText error id="values-error">
                                                                            {rowDataError.value}
                                                                        </FormHelperText>
                                                                    )}
                                                                </Grid>
                                                            )}
                                                            {rowData.fieldType === 'checkbox' && (
                                                                <Grid item>
                                                                    <FormLabel component="legend">{rowData.title}</FormLabel>
                                                                    <FormGroup>
                                                                        {rowData.options.map((option, index) => (
                                                                            <FormControlLabel
                                                                                control={
                                                                                    <Checkbox
                                                                                        checked={rowData.values?.includes(option.value)}
                                                                                        onChange={handleChange}
                                                                                        name={`data.${option.value}.values`}
                                                                                        value={option.value}
                                                                                    />
                                                                                }
                                                                                label={option.label}
                                                                                key={index + option.value}
                                                                            />
                                                                        ))}
                                                                    </FormGroup>
                                                                </Grid>
                                                            )}
                                                            {rowData.fieldType === 'radio' && (
                                                                <Grid item>
                                                                    <FormLabel id="demo-radio-buttons-group-label">
                                                                        {rowData.title}
                                                                    </FormLabel>
                                                                    <RadioGroup
                                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                                        defaultValue="female"
                                                                        name={`data.${key}.value`}
                                                                        onChange={handleChange}
                                                                    >
                                                                        {rowData.options.map((option, index) => (
                                                                            <FormControlLabel
                                                                                checked={rowData.value === option.value ? true : false}
                                                                                value={option.value}
                                                                                control={<Radio />}
                                                                                label={option.label}
                                                                                key={index + option.value}
                                                                            />
                                                                        ))}
                                                                    </RadioGroup>
                                                                </Grid>
                                                            )}
                                                            {rowData.fieldType === 'switch' && (
                                                                <Grid item>
                                                                    <FormLabel component="legend">{rowData.title}</FormLabel>
                                                                    <Switch
                                                                        checked={values.data[key].value.toString() == 'true' ? true : false}
                                                                        onChange={handleChange}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                        name={`data.${key}.value`}
                                                                        value={values.data[key].value}
                                                                    />
                                                                </Grid>
                                                            )}
                                                            {rowData.fieldType === 'image' && (
                                                                <FormControl fullWidth>
                                                                    <FormLabel>{rowData.title}</FormLabel>
                                                                    <Grid item>
                                                                        <ImageWrapper>
                                                                            {imageLoading ? (
                                                                                <CircularProgress />
                                                                            ) : (
                                                                                <img
                                                                                    src={
                                                                                        croppedImage ||
                                                                                        rowData?.value ||
                                                                                        imgConfig.imagePlaceholder
                                                                                    }
                                                                                    style={{ height: '100%' }}
                                                                                />
                                                                            )}
                                                                        </ImageWrapper>
                                                                        <input
                                                                            accept="image/*"
                                                                            id="upload-logo"
                                                                            onChange={handleSelectProfileImage}
                                                                            type="file"
                                                                            hidden
                                                                        />
                                                                        <Button
                                                                            variant="outlined"
                                                                            component={FormLabel}
                                                                            sx={{ px: 8 }}
                                                                            htmlFor="upload-logo"
                                                                        >
                                                                            Change
                                                                        </Button>
                                                                    </Grid>
                                                                    {rowDataError.value && touched?.data?.[key]?.title && (
                                                                        <FormHelperText error id="values-error">
                                                                            {rowDataError.value}
                                                                        </FormHelperText>
                                                                    )}
                                                                </FormControl>
                                                            )}
                                                            {rowData.fieldType === 'number' && (
                                                                <Grid item>
                                                                    <InputLabel>{rowData.title}</InputLabel>
                                                                    <TextField
                                                                        fullWidth
                                                                        placeholder="Value"
                                                                        value={values.data[key].value}
                                                                        name={`data.${key}.value`}
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        type="number"
                                                                        InputProps={{
                                                                            inputProps: {
                                                                                min: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    );
                                                })
                                            }
                                        </FieldArray>
                                    </Grid>
                                    <Box mt={'1rem'}>
                                        <Button disabled={isSubmitting} onClick={handleOpenModal} variant="outlined" color="primary">
                                            Update settings
                                        </Button>
                                    </Box>
                                </form>
                            );
                        }}
                    </Formik>
                </>
            )}

            {openCropper && (
                <ImageCropperModal
                    open={openCropper}
                    setOpen={setOpenCropper}
                    base64Image={base64Image}
                    setCroppedImage={setCroppedImage}
                    title="Crop logo"
                />
            )}

            <ConfirmModal
                title="Update Settings"
                content="Are you sure you want to update the settings ?"
                yes={handleSubmit}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
                loader={updateLoading && true}
            />
        </MainCard>
    );
};

export default SettingsList;
