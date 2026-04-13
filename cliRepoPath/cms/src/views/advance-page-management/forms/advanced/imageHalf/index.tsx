import { v4 as uuid } from 'uuid';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { genResults } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';
import { defaultValue, fields, validationSchema } from '../../../constants/imageHalf';
import { mainFields, subFields } from 'views/advance-page-management/types/pages/imageHalf';
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../constants/advancedPage';

const ImageHalf = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);
    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const res = genResults(values);
        console.log(res);
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [
                ...values.sub,
                {
                    id: uuid(),
                    image: [{ image: '', url: '' }],
                    content: [{ main: '', sub: '', text: '' }],
                    button: [{ label: '', url: '' }]
                }
            ]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    return (
        <MainCard title="Half Image Half Text" sx={{ position: 'relative' }}>
            <ReusableFormikForm<mainFields, subFields>
                {...{
                    defaultValue: initialValues,
                    keyName: props.keyName,
                    fields,
                    validationSchema,
                    sectionTitle: '',
                    button: {
                        show: false,
                        buttonLabel: 'Save Page'
                    },
                    iconButtonVisible: false,
                    draggable: false,
                    collapsible: false,
                    handleSubmit,
                    handleAdd,
                    handleRemove,
                    ref
                }}
            />
        </MainCard>
    );
});

export default ImageHalf;
