/* eslint-disable consistent-return */
/* eslint   no-unneeded-ternary: 0 */
/* eslint no-nested-ternary: 0 */
/* eslint jsx-a11y/label-has-associated-control: 0 */

import { useState } from 'react';
import { Grid, TextField, FormHelperText, FormLabel, Button, IconButton, Typography, InputLabel, MenuItem } from '@mui/material';
import { FieldArray, getIn } from 'formik';
import invariant from 'tiny-invariant';
import { v4 as uuid } from 'uuid';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

import { IconButtonWrapper, ImageWrapper } from './formik.styles';
import { Props } from '../../types/forms/customFields';
import ImageUploadHelper from 'utils/imageUploadHelper';
import { useGQL } from './hooks/useGQL';
import { FileUploadParams } from 'types/file-upload';

const defaultImageConfig = {
    imagePlaceholder: import.meta.env.VITE_APP_IMAGE_PLACEHOLDER || '',
    imageSet: false
};

const ErrorMessage = ({ errors, touched, name }) => {
    return <FormHelperText error>{getIn(touched, name) && getIn(errors, name) && getIn(errors, name)}</FormHelperText>;
};

const Image = ({ imagePlaceholder, imageSet, handleReset }) => (
    <ImageWrapper>
        <IconButtonWrapper imageSet={imageSet} onClick={handleReset}>
            <CloseIcon />
        </IconButtonWrapper>
        <img src={imagePlaceholder} style={{ height: '100%' }} />
    </ImageWrapper>
);

const CustomFieldArray = <T, U>({ accessKey, formFields, formikProps, controlIndex, controls, ...otherProps }: Props<T, U>) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikProps;
    const [imageLoading, setImageLoading] = useState(false);
    const [imgConfig, setImgConfig] = useState<typeof defaultImageConfig>(defaultImageConfig);
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();

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
                const uploadDetails = await ImageUploadHelper(fileUploadParams);

                setImageLoading(false);
            }
        } else {
            handleOpenSnackbar({ message: 'Only jpg, jpeg and png  are allowed.', alertType: 'error' });
        }
    };

    const handleImageReset = (name: string) => {
        setImgConfig(defaultImageConfig);
        setFieldValue(name, '');
    };

    return (
        <>
            {formFields.map((field, index) => {
                return (
                    <Grid key={index} item xs={12}>
                        {/* render heading once | show flag holds true */}
                        {(controlIndex === 0 || field.mainHeading?.show) && (
                            <Typography
                                variant={field.mainHeading.variant || 'h4'}
                                component="h1"
                                textAlign={field.mainHeading.align}
                                sx={{ p: '1rem 0', letterSpacing: 1.5 }}
                            >
                                {field.mainHeading.title}
                            </Typography>
                        )}
                        <FieldArray name={field.name}>
                            {() => {
                                return (
                                    <Grid container gap={3} maxWidth="100%">
                                        {values?.[accessKey]?.[controlIndex]?.[field.name]?.map((eachField, fieldIndex) => {
                                            /* Icon button list */
                                            const IconButtonList = !field.iconButtonDisable && (
                                                <Grid key={`container-${fieldIndex}`} container>
                                                    <Grid item xs={10}>
                                                        <Typography
                                                            variant={field.subHeading.variant || 'h4'}
                                                            component="h1"
                                                            textAlign={field.subHeading.align}
                                                            sx={{ letterSpacing: 2 }}
                                                        >{`${field?.subHeading?.title || ''} ${controlIndex + 1}`}</Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={2}
                                                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                                                    >
                                                        <IconButton
                                                            onClick={() => controls?.handleAdd?.(values, controls?.setInitialState!)}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => {
                                                                controls?.handleRemove?.(controls?.id, values, controls?.setInitialState!);
                                                            }}
                                                            disabled={values[accessKey].length === 1}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            );

                                            /* form fields */
                                            const FormFieldsList = field.choice.map((eachChoice, choiceIndex) => {
                                                const name = `${accessKey}[${controlIndex}].${field.name}[${fieldIndex}].${eachChoice.name}`;
                                                const fieldValue = values[accessKey][controlIndex][field.name][fieldIndex][eachChoice.name];

                                                switch (eachChoice.type) {
                                                    case 'text':
                                                        return (
                                                            <Grid key={`question-${choiceIndex}`} item xs={12}>
                                                                <InputLabel>{eachChoice.label}</InputLabel>
                                                                <TextField
                                                                    disabled={eachChoice.disabled && true}
                                                                    fullWidth
                                                                    placeholder={eachChoice.placeholder}
                                                                    name={name}
                                                                    value={fieldValue}
                                                                    type={eachChoice.type}
                                                                    size="medium"
                                                                    onBlur={handleBlur}
                                                                    // inputProps={{
                                                                    //     maxLength: eachChoice.maxLength ? eachChoice.maxLength : 30
                                                                    // }}
                                                                    onChange={(event) => {
                                                                        if (typeof eachChoice?.customHandleChange === 'function') {
                                                                            eachChoice.customHandleChange(
                                                                                name,
                                                                                event,
                                                                                setFieldValue,
                                                                                handleChange
                                                                            );
                                                                        } else {
                                                                            handleChange(event);
                                                                        }
                                                                    }}
                                                                />
                                                                <ErrorMessage
                                                                    {...{
                                                                        errors,
                                                                        touched,
                                                                        name
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );

                                                    case 'textarea':
                                                        return (
                                                            <Grid key={`question-${choiceIndex}`} item xs={12}>
                                                                <InputLabel>{eachChoice.label}</InputLabel>
                                                                <TextField
                                                                    fullWidth
                                                                    placeholder={eachChoice.placeholder}
                                                                    name={name}
                                                                    value={fieldValue}
                                                                    type={eachChoice.type}
                                                                    size="medium"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    multiline
                                                                    rows={4}
                                                                />
                                                                <ErrorMessage
                                                                    {...{
                                                                        errors,
                                                                        touched,
                                                                        name
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );

                                                    case 'select':
                                                        return (
                                                            <Grid key={index} item xs={12}>
                                                                <InputLabel>{eachChoice.label}</InputLabel>
                                                                <TextField
                                                                    fullWidth
                                                                    name={name}
                                                                    value={fieldValue}
                                                                    select
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                >
                                                                    {eachChoice.options.map(({ label, value }) => (
                                                                        <MenuItem key={value} value={value}>
                                                                            {label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </TextField>
                                                                <ErrorMessage
                                                                    {...{
                                                                        errors,
                                                                        touched,
                                                                        name
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );

                                                    case 'file':
                                                        return (
                                                            <Grid key={`file-${choiceIndex}`} item xs={12}>
                                                                <InputLabel>{eachChoice.label}</InputLabel>
                                                                <Grid key={index} item xs={12}>
                                                                    {/* check if fieldValue is a link; else check if file type exists  */}
                                                                    <Image
                                                                        imagePlaceholder={
                                                                            (fieldValue &&
                                                                                (typeof fieldValue === 'string'
                                                                                    ? fieldValue
                                                                                    : fieldValue.type
                                                                                      ? URL.createObjectURL(fieldValue)
                                                                                      : imgConfig.imagePlaceholder)) ||
                                                                            imgConfig.imagePlaceholder
                                                                        }
                                                                        imageSet={fieldValue ? true : false}
                                                                        handleReset={() => handleImageReset(name)}
                                                                    />
                                                                    <Button variant="outlined" component={FormLabel} sx={{ px: 8 }}>
                                                                        <input
                                                                            type="file"
                                                                            name={name}
                                                                            onBlur={handleBlur}
                                                                            onChange={(event) => {
                                                                                invariant(event.target.files, 'file not empty');
                                                                                if (event.target.files[0]) {
                                                                                    const file = event.target.files[0];
                                                                                    // setImgConfig({
                                                                                    //     imagePlaceholder: URL.createObjectURL(file),
                                                                                    //     imageSet: true
                                                                                    // });
                                                                                    handleUploadImage(event);
                                                                                    setFieldValue(name, file);
                                                                                }
                                                                            }}
                                                                            accept="image/png, image/jpeg, image/jpg, image/svg"
                                                                            hidden
                                                                        />
                                                                        {eachChoice.meta?.buttonLabel}
                                                                    </Button>
                                                                </Grid>
                                                                <ErrorMessage
                                                                    {...{
                                                                        errors,
                                                                        touched,
                                                                        name
                                                                    }}
                                                                />
                                                            </Grid>
                                                        );
                                                }
                                            });

                                            return [IconButtonList, FormFieldsList];
                                        })}
                                    </Grid>
                                );
                            }}
                        </FieldArray>
                    </Grid>
                );
            })}
        </>
    );
};

export default CustomFieldArray;
function handleOpenSnackbar(arg0: { message: string; alertType: string }) {
    throw new Error('Function not implemented.');
}
