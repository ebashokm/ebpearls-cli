import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { CustomFields } from 'types';
import { flatten, genResults, imageUploads } from 'utils/flatten';
import MainCard from 'ui-component/cards/MainCard';

import { defaultValue, fields, validationSchema } from '../../../constants/featuredProducts';
import { mainFields, subFields } from 'views/advance-page-management/types/pages/featuredProducts';
import { forwardRef, useEffect, useState } from 'react';
import { Actions, PageDispatch } from 'views/advance-page-management/types/pages/advancedPage';
import { PageProps } from '../../../constants/advancedPage';
import Controls from '../../../components/pages/Controls';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setValues } from 'store/slices/form';
import { SignedUrlMethod } from '../../../types/taxanomy';
import { useGQL } from '../../../hooks/useGQL';

const Testimonials = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    const [featuredImage, setFeaturedImage] = useState('');
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
        if (!form.errors) {
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'featuredProduct', values: inputs })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [...values.sub, { id: uuid(), product: [{ name: '', image: '', type: '' }] }]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (props.data?.featuredProducts?.length > 0 && !data) {
            const matchedFeaturedProduct = props.data?.featuredProducts.find((e) => props.id == e.uuid);
            if (matchedFeaturedProduct) {
                const mappedFeaturedProduct = {
                    main: [{ id: matchedFeaturedProduct.uuid, title: [{ text: matchedFeaturedProduct.heading }] }],
                    sub: matchedFeaturedProduct.sections.map((section) => {
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

                                setFeaturedImage(imageUrl1?.data?.uploadPageImage.url);
                            };
                            getImageUrl(section.image);
                        }
                        return {
                            id: section.id,
                            product: [
                                {
                                    image: featuredImage,
                                    name: section.name,
                                    type: section.productType
                                }
                            ]
                        };
                    })
                };
                setInitialValues(mappedFeaturedProduct);
            }
        }
    }, [props.data, featuredImage]);

    return (
        <MainCard title="Featured Products">
            <Controls {...{ ...props, type: 'FeaturedProducts' }}>
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

export default Testimonials;
