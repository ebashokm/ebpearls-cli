import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { flatten, genResults } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';
import Controls from '../../../components/pages/Controls';

import { defaultValue, fields, validationSchema } from '../../../constants/steps';
import { mainFields, subFields } from 'views/advance-page-management/types/pages/steps';
import { Actions, PageDispatch } from 'views/advance-page-management/types/pages/advancedPage';
import { PageProps } from '../../../constants/advancedPage';
import { RootState } from 'store';
import { setValues } from 'store/slices/form';
import { SignedUrlMethod } from 'types/profile';
import { useGQL } from '../../../hooks/useGQL';

const Steps = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);
    const [disabled, setDisabled] = useState<Boolean>(false);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();
    const [howItWorksImage, setHowItWorksImage] = useState('');
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const results = genResults(values);
        const inputs = { ...results.main, meta: results.sub };
        inputs.id = props.id;
        inputs.disabled = disabled;
        if (!form.errors) {
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'steps', values: inputs })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [...values.sub, { id: uuid(), steps: [{ image: '', title: '', description: '' }] }]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (props.data?.howItWorks?.length > 0 && !data) {
            const matchedHowItWorks = props.data?.howItWorks.find((e) => props.id == e.uuid);
            if (matchedHowItWorks) {
                const mappedHowItWorks = {
                    main: [{ id: matchedHowItWorks.uuid, title: [{ text: matchedHowItWorks.heading }] }],
                    sub: matchedHowItWorks.sections.map((section) => {
                        if (section.image) {
                            const getImageUrl = async (x: any) => {
                                const imageUrl1 = await handleImageUpload({
                                    variables: {
                                        input: {
                                            objectKey: `images/pageManagement/${x}`,
                                            contentType: 'image/*',
                                            method: SignedUrlMethod.GET
                                        }
                                    }
                                });

                                setHowItWorksImage(imageUrl1?.data?.uploadPageImage.url);
                            };
                            getImageUrl(section.image);
                        }
                        return {
                            id: section.id,
                            steps: [
                                {
                                    image: howItWorksImage,
                                    title: section.title,
                                    description: section.description
                                }
                            ]
                        };
                    })
                };
                setInitialValues(mappedHowItWorks);
                setDisabled(matchedHowItWorks.disabled);
            }
        }
    }, [props.data, howItWorksImage]);

    return (
        <MainCard title="Column with Icon / Text">
            <Controls {...{ ...props, type: 'Steps', disabled, setDisabled }}>
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
            </Controls>
        </MainCard>
    );
});

export default Steps;
