import { useEffect, useRef, useState } from 'react';
import { Button, FormHelperText, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import MainCard from 'ui-component/cards/MainCard';
import FormQuestion from 'components/faq/QuestionForm';
import FailureLoad from 'components/spinner/fail';

import { useGQL } from '../../hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';

import { FormInputTypeV1, QuestionV1 } from '../../types';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import { useDispatch } from 'react-redux';
import { GridDivider } from 'components/divider/Divider';
import CustomLoader from 'components/loader';
import { validationSchemaFaq } from 'views/faq/constants';

const EditForm = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { GET_FAQ, UPDATE_ON_FAQ_ID } = useGQL();
    const navigate = useNavigate();

    const { error, loading, data, refetch } = GET_FAQ(params.id!);
    const [handleFAQUpdate, { data: updateFAQ }] = UPDATE_ON_FAQ_ID();
    const { handleOpenSnackbar } = useSnackbar();
    const [initialValues, setInitialValues] = useState<FormInputTypeV1>();
    useEffect(() => {
        if (data?.getFAQ) {
            setInitialValues(data?.getFAQ.faq);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [data]);

    useEffect(() => {
        if (updateFAQ?.updateFAQ) {
            handleOpenSnackbar({ message: updateFAQ.updateFAQ.message, alertType: 'success' });
            setTimeout(() => {
                navigate('/faq/list');
            }, 2000);
        }
    }, [updateFAQ]);

    const addQuestion = (values: FormInputTypeV1) => {
        setInitialValues({ ...values, content: [...values.content, { _id: uuid(), question: '', answer: '' }] });
    };

    const removeQuestion = (id: string, values: FormInputTypeV1) => {
        const filterList = values.content.filter((value) => value._id !== id);
        setInitialValues({ ...values, content: filterList });
    };

    const handleOpenModal = () => {
        dispatch(openModal({
            isOpen: true
        }));
    }

    const formRef = useRef<any>();

    const handleSubmitExternally = () => {
        if(formRef.current) {
            formRef.current.handleSubmit();
        }
    }

    const handleEditFaq = async (values, setSubmitting) => {
        const { _id, section, description, content } = values;
        const genContent = content.map((value) => ({ _id: value._id!, question: value.question, answer: value.answer }));

        try {
            await handleFAQUpdate({
                variables: { docId: _id!, input: { section, description, content: genContent } }
            });
            setSubmitting(false);
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
            setSubmitting(false);
        }
    };

    return (
        <>
            {loading || !initialValues ? (
                <CustomLoader />
            ) : error ? (
                <FailureLoad />
            ) : (
                <Formik
                    innerRef={formRef}
                    enableReinitialize
                    initialValues={initialValues!}
                    validationSchema={validationSchemaFaq}
                    onSubmit={(values, { setSubmitting }) => handleEditFaq(values, setSubmitting)}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid item xs={12} lg={6}>
                                <MainCard title="Update FAQs">
                                    <Grid container spacing={2}>
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
                                            <Button disabled={isSubmitting} onClick={handleOpenModal} variant="contained" color="primary">
                                                Update Question
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            </Grid>
                        </form>
                    )}
                </Formik>
            )}
            <ConfirmModal
                title="Update FAQ"
                content="Are you sure you want to bulk update FAQs ?"
                yes={handleSubmitExternally}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </>
    );
};

export default EditForm;
