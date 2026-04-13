import { useEffect, useState } from 'react';
import { Button, FormHelperText, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { v4 as uuid } from 'uuid';

import MainCard from 'ui-component/cards/MainCard';
import FormQuestion from 'components/faq/QuestionForm';
import { FormInputTypeV1 } from '../../types';
import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
import { GridDivider } from 'components/divider/Divider';
import { validationSchemaFaq } from 'views/faq/constants';

const AddForm = () => {
    const { CREATE_FAQ_LIST } = useGQL();
    const [handleCreateFAQ, { data }] = CREATE_FAQ_LIST();
    const { handleOpenSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState<FormInputTypeV1>({
        section: '',
        description: '',
        content: [
            {
                _id: uuid(),
                question: '',
                answer: ''
            }
        ]
    });

    useEffect(() => {
        if (data?.createFAQ) {
            handleOpenSnackbar({ message: data.createFAQ.message, alertType: 'success' });
            setTimeout(() => {
                navigate('/faq/list');
            }, 2000);
        }
    }, [data]);

    const addQuestion = (values: FormInputTypeV1) => {
        setInitialValues({ ...values, content: [...values.content, { _id: uuid(), question: '', answer: '' }] });
    };

    const removeQuestion = (id: string, values: FormInputTypeV1) => {
        const filterList = values.content.filter((value) => value._id !== id);
        setInitialValues({ ...values, content: filterList });
    };

    const handleAddFaq = async(values, setSubmitting) => {
        try {
            setSubmitting(true);
            const genContent = values.content.map((value) => ({ _id: uuid(), ...value }));
            await handleCreateFAQ({ variables: { input: { ...values, content: genContent } } });
        } catch (error: any) {
            handleOpenSnackbar({ message: error.message, alertType: 'error' });
            setSubmitting(false);
        }
    }

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchemaFaq}
            onSubmit={(values, { setSubmitting }) => handleAddFaq(values, setSubmitting)}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <MainCard title="Add FAQs">
                        <Grid container spacing={2} alignItems="right">
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Section heading *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="section"
                                    placeholder="Section heading"
                                    value={values.section}
                                    name="section"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched.section && errors.section && (
                                    <FormHelperText error id="section-error">
                                        {errors.section}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <GridDivider />

                            <Grid item xs={12} lg={6}>
                                <InputLabel>Section description *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="description"
                                    placeholder="Section description"
                                    value={values.description}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    multiline
                                    rows={5}
                                />
                                {touched.description && errors.description && (
                                    <FormHelperText error id="description-error">
                                        {errors.description}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12}>
                                <Typography variant="h5">FAQ List</Typography>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                {initialValues.content.map((value, index) => (
                                    <FormQuestion
                                        key={value._id!}
                                        {...{
                                            id: value._id!,
                                            len: initialValues.content.length,
                                            index,
                                            values,
                                            errors,
                                            touched,
                                            iconButtonVisible: true,
                                            handleChange,
                                            handleBlur,
                                            addQuestion,
                                            removeQuestion,
                                            visibleButton: true
                                        }}
                                    />
                                ))}
                            </Grid>
                            <Grid item xs={12}>
                                <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                                    Add Question
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </form>
            )}
        </Formik>
    );
};

export default AddForm;
