import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { flatten, genResults } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';
import Controls from '../../../components/pages/Controls';
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../constants/advancedPage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setValues } from 'store/slices/form';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { defaultValue, fields, MainFields, validationSchema } from 'views/advance-page-management/constants/seo';

const SEO = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState(defaultValue);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    const handleSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!form.errors) {
            const results = genResults(values);
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'seo', values: { ...results.main } })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    return (
        <MainCard title="SEO Tags">
            <Controls {...{ ...props, type: 'SEO' }}>
                <ReusableFormikForm<MainFields, never[]>
                    {...{
                        defaultValue: initialValues,
                        keyName: props.keyName,
                        fields,
                        validationSchema,
                        title: 'Testimonials',
                        sectionTitle: 'Testimonials Section',
                        button: {
                            show: false,
                            buttonLabel: 'Save Testimonials'
                        },
                        iconButtonVisible: false,
                        draggable: false,
                        collapsible: false,
                        handleSubmit,
                        ref
                    }}
                />
            </Controls>
        </MainCard>
    );
});

export default SEO;
