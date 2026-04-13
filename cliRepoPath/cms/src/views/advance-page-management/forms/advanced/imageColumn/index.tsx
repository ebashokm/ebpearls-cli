import { v4 as uuid } from 'uuid';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import MainCard from 'ui-component/cards/MainCard';
import { mainFields, subFields } from 'views/advance-page-management/types/pages/imageColumn';
import { defaultValue, fields, validationSchema } from '../../../constants/imageColumn';
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../constants/advancedPage';
import Controls from '../../../components/pages/Controls';
import { genResults } from 'utils/flatten';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setValues } from 'store/slices/form';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { SignedUrlMethod } from 'types/profile';
import { useGQL } from '../../../hooks/useGQL';

const ImageColumn = forwardRef((props: PageProps, ref) => {
    const [initialValues, setInitialValues] = useState<typeof defaultValue>(defaultValue);
    const [columnTypeState, setColumnTypeState] = useState<string>('halfImageHalfText');
    const [fieldsLocal, setFieldsLocal] = useState<typeof fields>(fields);
    const [imageColumImage, setImageColumnImage] = useState('');
    const { UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    const [disabled, setDisabled] = useState<Boolean>(false);
    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (data) {
            setInitialValues(JSON.parse(data));
        }
    }, []);

    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const res = genResults(values);
        const validInputs = { ...res.main, meta: res.sub };
        validInputs.id = props.id;
        validInputs.disabled = disabled;
        if (!form.errors) {
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(dispatch(setValues({ type: 'imageColumn', values: validInputs })));
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    const handleAdd = (values, setInitialState) => {
        setInitialState(() => ({
            main: [...values.main],
            sub: [...values.sub, { id: uuid(), icons: [{ image: '', align: '', main: '', subHeading: '', sub: '' }] }]
        }));
    };

    useEffect(() => {
        const data = sessionStorage.getItem(props.keyName) || '';
        if (props.data?.imageColumn?.length > 0 && !data) {
            const matchedImageColumn = props.data?.imageColumn.find((e) => props.id == e.uuid);
            if (matchedImageColumn) {
                setColumnTypeState(matchedImageColumn.columnType);
                const mappedImageColumn = {
                    main: [
                        {
                            id: matchedImageColumn.uuid,
                            title: [{ text: matchedImageColumn.heading, columnType: matchedImageColumn.columnType }]
                        }
                    ],
                    sub: matchedImageColumn.sections.map((section) => {
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

                                setImageColumnImage(imageUrl1?.data?.uploadPageImage.url);
                            };
                            getImageUrl(section.image);
                        }
                        return {
                            id: section.id,
                            icons: [
                                {
                                    image: imageColumImage,
                                    align: section.alignment,
                                    main: section.iconHeading,
                                    subHeading: section.subHeading,
                                    sub: section.subText
                                }
                            ]
                        };
                    })
                };

                setInitialValues(mappedImageColumn);
                setDisabled(matchedImageColumn.disabled);
            }
        }
    }, [props.data, imageColumImage]);

    const handleRemove = (id, values, setInitialState) => {
        const filteredList = values.sub.filter((_) => _.id !== id);
        setInitialState({ main: values.main, sub: filteredList });
    };

    const handleSelectChange = (value) => {
        setColumnTypeState(value);
    };

    useEffect(() => {
        if (columnTypeState) {
            if (columnTypeState == 'imageWithHeading') {
                const filedsArray: any = JSON.parse(JSON.stringify(fields));
                filedsArray[0].sub[0].choice[4] = {
                    label: 'URL',
                    name: 'sub',
                    placeholder: 'URL',
                    type: 'text'
                };
                setFieldsLocal(filedsArray);
            } else {
                setFieldsLocal(fields);
            }
        }
    }, [columnTypeState]);

    return (
        <MainCard title="Image Column">
            <Controls {...{ ...props, type: 'ImageColumn', disabled, setDisabled }}>
                <ReusableFormikForm<mainFields, subFields>
                    {...{
                        defaultValue: initialValues,
                        keyName: props.keyName,
                        fields: fieldsLocal,
                        validationSchema,
                        sectionTitle: '',
                        button: {
                            show: false,
                            buttonLabel: 'Add Icon Section'
                        },
                        iconButtonVisible: false,
                        draggable: false,
                        collapsible: false,
                        handleSubmit,
                        handleAdd,
                        handleRemove,
                        ref,
                        handleSelectChange
                    }}
                />
            </Controls>
        </MainCard>
    );
});

export default ImageColumn;
