import { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import MainCard from 'ui-component/cards/MainCard';
import Controls from '../../../components/pages/Controls';
import { flatten, genResults } from 'utils/flatten';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { SubFields } from 'views/advance-page-management/types/pages/banner';
import { PageProps } from '../../../constants/advancedPage';
import { defaultValue, fields, validationSchema } from '../../../constants/banner';
import { setValues } from 'store/slices/form';
import { RootState } from 'store';

import { SignedUrlMethod } from 'types/profile';
import { useGQL } from '../../../hooks/useGQL';
const Banner = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState(defaultValue);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();
    const fieldsLocal: any = fields;
    const [disabled, setDisabled] = useState<Boolean>(false);
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    const [bannerImage, setBannerImage] = useState('');
    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const genRes = genResults(values);
        genRes.id = props.id;
        genRes.disabled = disabled;

        if (!form.errors) {
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'banner', values: genRes })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || null;

        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || null;
        if (props.data?.banner?.length > 0 && !data) {
            const initialData = props?.initialData;

            const matchedBanner = props.data?.banner.find((e) => props.id === e.uuid);

            if (matchedBanner) {
                if (matchedBanner.image) {
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

                        setBannerImage(imageUrl1?.data?.uploadPageImage.url);
                    };
                    getImageUrl(matchedBanner.image);
                }

                const mappedBanner = {
                    main: [],
                    sub: [
                        {
                            id: matchedBanner.uuid,
                            image: [{ image: bannerImage, alt: matchedBanner.altText }],
                            content: [{ description: matchedBanner.content }],
                            button: [{ label: matchedBanner.button.heading, url: matchedBanner.button.destinationUrl }]
                        }
                    ]
                };
                setDisabled(matchedBanner.disabled);
                setInitialValues(mappedBanner);
            }
        }
    }, [props.data, bannerImage]);

    return (
        <MainCard title="Banner Promotion">
            <Controls {...{ ...props, type: 'Banner', disabled, setDisabled, initialState: initialValues.sub[0] }}>
                <ReusableFormikForm<never, SubFields>
                    {...{
                        keyName: props.keyName,
                        defaultValue: initialValues,
                        fields: fieldsLocal,
                        validationSchema,
                        sectionTitle: '',
                        button: {
                            show: false,
                            buttonLabel: 'Save Banner'
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

export default Banner;
