/* eslint no-nested-ternary: 0 */
/* eslint  no-underscore-dangle: 0 */
import { forwardRef, useEffect, useState } from 'react';
import { PageProps } from '../../../constants/advancedPage';
import { useGQL } from '../../../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import invariant from 'tiny-invariant';
import FailureLoad from 'components/spinner/fail';
import MainCard from 'ui-component/cards/MainCard';
import { Autocomplete, Button, Card, CardContent, Grid, TextField, Typography, useTheme } from '@mui/material';
import { setValues } from 'store/slices/form';
import Controls from '../../../components/pages/Controls';
import { v4 as uuid } from 'uuid';

import { RootState } from 'store';
import DragDrop from 'views/advance-page-management/components/dnd/DragDrop';
import { genResults } from 'utils/flatten';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { mainFieldsForPage, mainFieldsForPage1 } from 'views/advance-page-management/types/pages/testimonials';
import {
    defaultValueForPage,
    defaultValueForPage1,
    fieldsForPage,
    fieldsForPage1,
    validationSchemaForPage,
    validationSchemaForPage1
} from 'views/advance-page-management/constants/testimonials';
import CustomLoader from 'components/loader';
interface FaqOptions {
    label: string;
    value: string;
}

const LinkFAQ = forwardRef((props: PageProps, ref: any) => {
    let globalList = [];

    const dispatch = useDispatch();
    const theme = useTheme();
    const { FIND_ALL_FAQS } = useGQL();
    const [initialValues, setInitialValues] = useState(defaultValueForPage1);
    const [disabled, setDisabled] = useState<Boolean>(false);
    const form = useSelector((state: RootState) => state.form);
    const [itemsDropDown, setItemsDropDown] = useState<FaqOptions[]>([]);
    const [itemsList, setItemsList] = useState<any>([]);
    const [selectedOptions, setSelectedOptions] = useState<any>();
    const [allItems, setAllItems] = useState<any>([]);
    const { error, loading, data, refetch } = FIND_ALL_FAQS();
    console.log(data, 'faqs');

    // useEffect(() => {

    //     if (data) {
    //         setInitialValues(JSON.parse(data));
    //     }
    // }, []);
    useEffect(() => {
        if (props.data?.faq?.showFaqs) {
            setDisabled(props.data?.faq.disabled);
        }
    }, [props.data]);

    const getDragDropList = (list) => {
        if (Array.isArray(list.children)) {
            globalList = list.children.map((el) => el.key);
        }
    };

    useEffect(() => {
        const data1 = sessionStorage.getItem(props.keyName) || '';
        if (data?.findAllFAQ?.faqs && !data1) {
            invariant(data?.findAllFAQ?.faqs, 'Not null after fetch');
            setAllItems(data?.findAllFAQ?.faqs);
            const options: FaqOptions[] = data?.findAllFAQ?.faqs.map((item: any) => {
                return {
                    label: item.section,
                    value: item._id
                };
            });
            setItemsDropDown(options);
            const matchingItems: any = [];
            for (let i = 0; i < props?.data?.faq?.selectedFaqs.length; i += 1) {
                const selectedFaq = props?.data?.faq?.selectedFaqs[i];
                for (let j = 0; j < data?.findAllFAQ?.faqs.length; j += 1) {
                    const oneFaq = JSON.parse(JSON.stringify(data?.findAllFAQ.faqs[j]));
                    if (selectedFaq == oneFaq._id) {
                        matchingItems.push(oneFaq);
                    }
                }
            }
            setItemsList(matchingItems);

            const selectedOptionsArray = matchingItems.map((item: any) => {
                return {
                    label: item.section,
                    value: item._id
                };
            });
            setSelectedOptions(selectedOptionsArray);
        }
    }, [data]);

    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const genRes = genResults(values);

        if (!form.errors) {
            //   const newHeading = heading == '' ? initialValues.main?.text : heading;
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(
                    dispatch(
                        setValues({
                            type: 'faq',
                            values: {
                                id: props.id,
                                linked: true,
                                disabled,
                                selectedFaqs: globalList
                            }
                        })
                    )
                );
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    // const handleSubmit = () => {
    //     const promise = new Promise((resolve: (value: unknown) => void) => {
    //         return resolve(
    //             dispatch(
    //                 setValues({
    //                     type: 'faq',
    //                     values: {
    //                         id: props.id,
    //                         linked: true,
    //                         disabled,
    //                         selectedFaqs: globalList
    //                     }
    //                 })
    //             )
    //         );
    //     });
    //     props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
    // };

    return (
        <>
            <MainCard title="FAQs">
                <Controls {...{ ...props, type: 'FAQ', disabled, setDisabled }}>
                    <br />
                    <ReusableFormikForm<mainFieldsForPage1, never>
                        {...{
                            keyName: props.keyName,
                            defaultValue: initialValues,
                            fields: fieldsForPage1,
                            validationSchema: validationSchemaForPage1,
                            sectionTitle: '',
                            button: {
                                show: false,
                                buttonLabel: 'Save Faqs'
                            },
                            iconButtonVisible: false,
                            draggable: false,
                            collapsible: false,
                            handleSubmit,
                            ref
                        }}
                    />
                    {selectedOptions && (
                        <Autocomplete
                            multiple
                            id="tags-outlined"
                            options={itemsDropDown}
                            getOptionLabel={(option) => option.label}
                            defaultValue={selectedOptions}
                            filterSelectedOptions
                            getOptionDisabled={(option) => {
                                if (itemsList.length >= 4) {
                                    return true;
                                }
                                if (itemsList?.some((item) => item._id === option.value)) {
                                    return true;
                                }
                                return false;
                            }}
                            renderInput={(params) => <TextField {...params} label="Select Items" />}
                            sx={{
                                width: '50%',
                                marginTop: '25px'
                            }}
                            onChange={(event, newValue) => {
                                const valueArray = newValue.map((item) => item.value);
                                const matchingItems: any = [];
                                for (let i = 0; i < allItems.length; i += 1) {
                                    if (valueArray.includes(allItems[i]._id)) {
                                        matchingItems.push(allItems[i]);
                                    }
                                }
                                setItemsList(matchingItems);
                            }}
                        />
                    )}
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            marginTop: '24px',
                            '&>div>div div div.MuiGrid-item:first-child': {
                                right: '1%'
                            }
                        }}
                    >
                        {itemsList.length > 0 && (
                            <DragDrop route="menu">
                                {itemsList?.map((faq, index) => {
                                    return (
                                        <Grid item xs={12} key={faq._id}>
                                            <Card
                                                sx={{
                                                    p: 0,
                                                    bgcolor:
                                                        theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                                    border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
                                                    borderColor: theme.palette.grey[100]
                                                }}
                                            >
                                                <CardContent sx={{ textOverflow: 'ellipsis', display: 'flex', flexDirection: 'row' }}>
                                                    <CardContent sx={{ width: '100%', marginLeft: '2%' }}>
                                                        <Grid container spacing={2} mb={3}>
                                                            <Grid item md={4}>
                                                                <Typography gutterBottom variant="h4" component="div">
                                                                    Section heading :
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={8}>
                                                                <Typography>{faq.section}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </DragDrop>
                        )}
                    </Grid>
                </Controls>
            </MainCard>

            {loading ? <CustomLoader  /> : error ? <FailureLoad /> : null}
        </>
    );
});

export default LinkFAQ;
