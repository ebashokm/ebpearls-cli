/* eslint-disable consistent-return */
/*  eslint jsx-a11y/label-has-associated-control: 0 */

import React, { useState } from 'react';
import {
    Grid,
    TextField,
    FormHelperText,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    MenuItem,
    Button,
    IconButton,
    Typography,
    InputLabel
} from '@mui/material';
import { FieldArray, getIn } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ImageWrapper } from './formik.styles';

const ErrorMessage = ({ errors, touched, name }) => {
    return <FormHelperText error>{getIn(touched, name) && getIn(errors, name) && getIn(errors, name)}</FormHelperText>;
};

const FormFields = ({ formFields, formikProps, ...otherProps }): any => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikProps;
    const { handleAdd, handleRemove } = otherProps;

    // console.log(process.env.REACT_APP_IMAGE_PLACEHOLDER);
    const [img, setImg] = useState<string>(process.env.REACT_APP_IMAGE_PLACEHOLDER || '');

    return (
        <>
            {formFields.map((field, index) => {
                switch (field.type) {
                    case 'generic':
                        return (
                            <Grid key={index} item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder={`Enter ${field.name}`}
                                    value={values[field.name]}
                                    name={field.name}
                                    label={field.name}
                                    type={field.element}
                                    size="medium"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                <ErrorMessage
                                    {...{
                                        errors,
                                        touched,
                                        name: field.name
                                    }}
                                />
                            </Grid>
                        );

                    case 'textarea':
                        return (
                            <Grid key={index} item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder={`Enter ${field.name}`}
                                    value={values[field.name]}
                                    name={field.name}
                                    label={field.name}
                                    type={field.element}
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
                                        name: field.name
                                    }}
                                />
                            </Grid>
                        );

                    case 'radiogroup':
                        return (
                            <Grid key={index} item xs={12}>
                                <FormControl>
                                    <FormLabel id={`${field.name}-label`}>Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby={`${field.name}-group-label`}
                                        name={`${field.name}`}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        {field.choice.map(({ label, value }, innerIndex) => (
                                            <FormControlLabel
                                                key={innerIndex}
                                                name={field.name}
                                                value={value}
                                                control={<Radio />}
                                                label={label}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <ErrorMessage
                                    {...{
                                        errors,
                                        touched,
                                        name: field.name
                                    }}
                                />
                            </Grid>
                        );

                    case 'inputgroup':
                        return (
                            <Grid key={index} item xs={12}>
                                <TextField
                                    id={`${field.name}-input-group`}
                                    name={field.name}
                                    label={field.name}
                                    select
                                    value={values[field.name]}
                                    fullWidth
                                    onChange={handleChange}
                                >
                                    {field.choice.map(({ label, value }) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <ErrorMessage
                                    {...{
                                        errors,
                                        touched,
                                        name: field.name
                                    }}
                                />
                            </Grid>
                        );

                    case 'file':
                        return (
                            <Grid key={index} item xs={12}>
                                <ImageWrapper>
                                    <img src={img} style={{ height: '100%' }} />
                                </ImageWrapper>
                                <FormLabel sx={{ px: '0.2em' }}>{field.meta?.title}:</FormLabel>
                                <Button variant="contained" component={FormLabel} startIcon={field.meta?.icon}>
                                    <input
                                        type="file"
                                        name={field.name}
                                        onBlur={handleBlur}
                                        onChange={(event) => {
                                            if (event.currentTarget.files![0]) {
                                                const { 0: file } = event.currentTarget.files!;
                                                setImg(URL.createObjectURL(file));
                                                setFieldValue('file', file);
                                            }
                                        }}
                                        hidden
                                    />
                                    {field.meta?.buttonLabel}
                                </Button>
                                <ErrorMessage
                                    {...{
                                        errors,
                                        touched,
                                        name: field.name
                                    }}
                                />
                            </Grid>
                        );

                    case 'fieldArray':
                        return (
                            <Grid key={index} item xs={12}>
                                <Typography
                                    variant={field.mainHeading.variant || 'h4'}
                                    component="h1"
                                    textAlign={field.mainHeading.align}
                                    sx={{ p: 2 }}
                                >
                                    {field.mainHeading.title}
                                </Typography>
                                <FieldArray name={field.name}>
                                    {({ push, remove }) => {
                                        return (
                                            <Grid container gap={3} maxWidth="100%">
                                                {values[field.name].map((eachField, fieldIndex) => {
                                                    const IconButtonList = !field.iconButtonDisable && (
                                                        <Grid key={`container-${fieldIndex}`} container>
                                                            <Grid item xs={10}>
                                                                <Typography variant="h4">{`${field.subHeading} ${
                                                                    fieldIndex + 1
                                                                }`}</Typography>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={2}
                                                                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                                                            >
                                                                <IconButton onClick={() => handleAdd(push)}>
                                                                    <AddIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => {
                                                                        handleRemove(eachField.id, values, remove);
                                                                    }}
                                                                    disabled={values[field.name].length === 1}
                                                                >
                                                                    <DeleteOutlineIcon />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    );

                                                    const QuestionList = field.choice.map((eachChoice, choiceIndex) => {
                                                        switch (eachChoice.type) {
                                                            case 'text':
                                                                return (
                                                                    <Grid key={`question-${choiceIndex}`} item xs={12}>
                                                                        <InputLabel>{eachChoice.label}</InputLabel>
                                                                        <TextField
                                                                            fullWidth
                                                                            placeholder={eachChoice.placeholder}
                                                                            name={`${field.name}[${fieldIndex}].${eachChoice.name}`}
                                                                            label={eachChoice.innerLabel}
                                                                            type={eachChoice.type}
                                                                            size="medium"
                                                                            onBlur={handleBlur}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <ErrorMessage
                                                                            {...{
                                                                                errors,
                                                                                touched,
                                                                                name: `${field.name}[${fieldIndex}].${eachChoice.name}`
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                );

                                                            case 'file':
                                                                return (
                                                                    <Grid key={`file-${choiceIndex}`} item xs={12}>
                                                                        <InputLabel>{eachChoice.label}</InputLabel>
                                                                        <Grid key={index} item xs={12}>
                                                                            <ImageWrapper>
                                                                                <img src={img} style={{ height: '100%' }} />
                                                                            </ImageWrapper>
                                                                            <Button variant="contained" component={FormLabel}>
                                                                                <input
                                                                                    type="file"
                                                                                    name={`${field.name}[${fieldIndex}].${eachChoice.name}`}
                                                                                    onBlur={handleBlur}
                                                                                    onChange={(event) => {
                                                                                        if (event.currentTarget.files![0]) {
                                                                                            const { 0: file } = event.currentTarget.files!;
                                                                                            setImg(URL.createObjectURL(file));
                                                                                            setFieldValue(
                                                                                                `${field.name}[${fieldIndex}].${eachChoice.name}`,
                                                                                                file
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    hidden
                                                                                />
                                                                                {eachChoice.meta?.buttonLabel}
                                                                            </Button>
                                                                        </Grid>
                                                                        <ErrorMessage
                                                                            {...{
                                                                                errors,
                                                                                touched,
                                                                                name: `${field.name}[${fieldIndex}].${eachChoice.name}`
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                );
                                                        }
                                                    });

                                                    return [IconButtonList, QuestionList];
                                                })}
                                            </Grid>
                                        );
                                    }}
                                </FieldArray>
                            </Grid>
                        );
                }
            })}
        </>
    );
};

export default FormFields;
