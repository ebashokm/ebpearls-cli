import { v4 as uuid } from 'uuid';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';

import MainCard from 'ui-component/cards/MainCard';
import { mainFields, subFields } from 'views/advance-page-management/types/pages/heading';
import { defaultValue, fields, validationSchema } from 'views/advance-page-management/constants/heading';
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../constants/advancedPage';

const ImageAndHeading = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        console.log(values);
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState({
            main: values.main,
            sub: [...values.sub, { id: uuid(), listings: [{ image: '', alt: '', title: '', url: '' }] }]
        });
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    return (
        <MainCard title="Image and Heading" sx={{ position: 'relative' }}>
            <ReusableFormikForm<mainFields, subFields>
                {...{
                    defaultValue: initialValues,
                    keyName: props.keyName,
                    fields,
                    validationSchema,
                    sectionTitle: '',
                    button: {
                        show: false,
                        buttonLabel: 'Add Section'
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

export default ImageAndHeading;
