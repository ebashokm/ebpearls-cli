import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import ReusableFormikForm from '../../../components/FormikReusableForm';
import { genResults } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';

import useSnackbar from 'hooks/common/useSnackbar';
import { useGQL } from '../../../hooks/useGQL';

import { defaultValue, fields, validationSchema } from '../../../constants';
import { mainFields, subFields } from '../../../types';

const FAQ = () => {
    const { CREATE_FAQ_LIST } = useGQL();
    const [handleCreateFAQ, { data }] = CREATE_FAQ_LIST();
    const { handleOpenSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        if (data?.createFAQ) {
            handleOpenSnackbar({ message: data.createFAQ.message, alertType: 'success' });
            navigate('/faq/list');
        }
    }, [data]);

    const handleSubmit = async (values, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const res = genResults(values);
            /* replace ids with _id */
            const content = res.sub.map((field) => ({ _id: field.id, question: field.question, answer: field.answer }));

            const variables = { ...res.main, content };
            setSubmitting(true);
            await handleCreateFAQ({ variables: { input: { ...variables } } });
        } catch (error: any) {
            handleOpenSnackbar({ message: error.message, alertType: 'error' });
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
        <MainCard title="FAQ's">
            <ReusableFormikForm<mainFields, subFields>
                {...{
                    defaultValue,
                    fields,
                    validationSchema,
                    sectionTitle: '',
                    button: {
                        show: true,
                        buttonLabel: 'Add Question'
                    },
                    iconButtonVisible: false,
                    draggable: false,
                    collapsible: false,
                    handleSubmit,
                    handleAdd,
                    handleRemove
                }}
            />
        </MainCard>
    );
};

export default FAQ;
