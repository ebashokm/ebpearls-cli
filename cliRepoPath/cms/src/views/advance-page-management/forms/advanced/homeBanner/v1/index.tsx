import { v4 as uuid } from 'uuid';
import { flatten, genResults } from 'utils/flatten';
import ReusableFormikForm from '../../../../components/form/FormikReusableForm';
import { fields, defaultValue, validationSchema } from '../../../../constants/homeBanner';
import { SubFields } from 'views/advance-page-management/types/pages/homeBanner';
import MainCard from 'ui-component/cards/MainCard';
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../../constants/advancedPage';
import Controls from '../../../../components/pages/Controls';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setValues } from 'store/slices/form';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { SignedUrlMethod } from '../../../../types/taxanomy';
import { useGQL } from '../../../../hooks/useGQL';

const HomeBannerV1 = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);
    const [disabled, setDisabled] = useState<Boolean>(false);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();
    const [homePageImage, setHomePageImage] = useState('');
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    const handleSubmit = async (values: typeof defaultValue, setSubmitting: (isSubmitting: boolean) => void) => {
        const genRes = genResults(values);
        genRes.id = props.id;
        genRes.disabled = disabled;
        if (!form.errors) {
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'homeBanner', values: genRes })));
            });

            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            sub: [
                ...values.sub,
                { id: uuid(), image: [{ image: '', alt: '' }], content: [{ heading: '' }], button: [{ label: '', url: '' }] }
            ]
        }));
    };

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ sub: filteredList });
    };

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (props.data?.homePage?.length > 0 && !data) {
            const matchedHomePage = props.data?.homePage.find((e) => props.id == e.uuid);

            const initialData = props?.initialData;
            if (matchedHomePage) {
                if (matchedHomePage.image) {
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

                        setHomePageImage(imageUrl1?.data?.uploadPageImage.url);
                    };
                    getImageUrl(matchedHomePage.image);
                }

                const mappedHomePage = {
                    main: [],
                    sub: [
                        {
                            id: matchedHomePage.uuid,
                            image: [{ image: homePageImage, alt: matchedHomePage.altText }],
                            content: [{ heading: matchedHomePage.content }],
                            button: [{ label: matchedHomePage.button.heading, url: matchedHomePage.button.destinationUrl }]
                        }
                    ]
                };
                setInitialValues(mappedHomePage as any);

                setDisabled(matchedHomePage.disabled);
            }

            if (initialData && Object.keys(initialData).length > 0) {
                setDisabled(false);
                setInitialValues({
                    main: [],
                    sub: [
                        {
                            ...initialData
                        }
                    ]
                });
            }
        }
    }, [props.data, homePageImage]);

    return (
        <MainCard title="Home Page Frame">
            <Controls {...{ ...props, type: 'HomeBannerV1', disabled, setDisabled, initialState: initialValues.sub[0] }}>
                <ReusableFormikForm<never, SubFields>
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
            </Controls>
        </MainCard>
    );
});

export default HomeBannerV1;
