/* eslint no-nested-ternary: 0 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import ReusableFormikForm from '../../../components/FormikReusableForm';
import { genResults } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';

import useSnackbar from 'hooks/common/useSnackbar';
import { useGQL } from '../../../hooks/useGQL';

import { defaultValue, fields, validationSchema } from '../../../constants';
import { mainFields, subFields } from '../../../types';
import invariant from 'tiny-invariant';
import FailureLoad from 'components/spinner/fail';
import CustomLoader from 'components/loader';

const FAQ = () => {
    const params = useParams();
    const { GET_FAQ, UPDATE_ON_FAQ_ID } = useGQL();
    const navigate = useNavigate();
    // const { getConfirmation } = useAlertDialog();
    const { handleOpenSnackbar } = useSnackbar();

    const [initialValues, setInitialValues] = useState({ isLoading: true, data: defaultValue });

    invariant(params.id, 'target id not null');
    const { error, loading, data, refetch } = GET_FAQ(params.id);
    const [handleFAQUpdate, { data: updateFAQ }] = UPDATE_ON_FAQ_ID();

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (data?.getFAQ) {
            const { section, description, content } = data.getFAQ.faq!;
            const genSubFields = content.map(({ _id, ...others }) => ({ id: _id, content: [{ ...others }] }));
            setInitialValues({ isLoading: false, data: { main: [{ faq: [{ section, description }] }], sub: genSubFields } });
        }
    }, [data]);

    useEffect(() => {
        if (updateFAQ?.updateFAQ) {
            handleOpenSnackbar({ message: updateFAQ.updateFAQ.message, alertType: 'success' });
            navigate('/faq/list');
        }
    }, [updateFAQ]);

    const handleSubmit = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const res = genResults(values);
            /* replace ids with _id */
            const content = res.sub.map((field) => ({ _id: field.id, question: field.question, answer: field.answer }));

            const inputVariables = { ...res.main, content };
            setSubmitting(true);
            await handleFAQUpdate({
                variables: { docId: params.id!, input: inputVariables }
            });
            setSubmitting(false);
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
            setSubmitting(false);
        }

        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [...values.sub, { id: uuid(), content: [{ question: '', answer: '' }] }]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    return (
        <MainCard title="Edit FAQ's">
            {loading || initialValues.isLoading ? (
                <CustomLoader  />
            ) : error ? (
                <FailureLoad />
            ) : (
                <ReusableFormikForm<mainFields, subFields>
                    {...{
                        defaultValue: initialValues.data,
                        fields,
                        validationSchema,
                        sectionTitle: '',
                        button: {
                            show: true,
                            buttonLabel: 'Update Question'
                        },
                        iconButtonVisible: false,
                        draggable: false,
                        collapsible: false,
                        handleSubmit,
                        handleAdd,
                        handleRemove
                    }}
                />
            )}
        </MainCard>
    );
};

export default FAQ;
