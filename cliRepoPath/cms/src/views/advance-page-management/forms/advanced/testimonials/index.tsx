import { forwardRef, useEffect, useRef, useState } from 'react';
import { PageProps } from 'views/advance-page-management/constants/advancedPage';
import { useGQL } from '../../../hooks/useGQL';
import { useDispatch, useSelector } from 'react-redux';
import invariant from 'tiny-invariant';
import FailureLoad from 'components/spinner/fail';
import MainCard from 'ui-component/cards/MainCard';
import { Autocomplete, Button, Card, CardContent, CardMedia, FormHelperText, Grid, TextField, Typography, useTheme } from '@mui/material';
import { setValues } from 'store/slices/form';
import Controls from '../../../components/pages/Controls';
import { truncateString } from 'utils/commonHelpers';
import ReusableFormikForm from '../../../components/form/FormikReusableForm';
import { mainFieldsForPage } from 'views/advance-page-management/types/pages/testimonials';
import { genResults } from 'utils/flatten';
import { RootState } from 'store';
import { Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { defaultValueForPage, fieldsForPage, validationSchemaForPage } from '../../../constants/testimonials';
import DragDrop from 'views/advance-page-management/components/dnd/DragDrop';
import CustomLoader from 'components/loader';

interface TestimonialsOptions {
    label: string;
    value: string;
}

const LinkTestimonials = forwardRef((props: PageProps, ref: any) => {
    let globalList = [];

    const [initialValues, setInitialValues] = useState(defaultValueForPage);
    const [heading, setHeading] = useState<string>('');

    const form = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();

    const [itemsDropDown, setItemsDropDown] = useState<TestimonialsOptions[]>([]);
    const [itemsList, setItemsList] = useState<any>([]);
    const [selectedOptions, setSelectedOptions] = useState<any>();
    const [allItems, setAllItems] = useState<any>([]);
    const theme = useTheme();
    const { GET_TESTIMONIALS_LIST } = useGQL();
    const [disabled, setDisabled] = useState<Boolean>(false);

    const { error, loading, data, refetch } = GET_TESTIMONIALS_LIST({
        searchText: '',
        order: 'asc',
        orderBy: 'section',
        limit: 20,
        skip: 0
    });

    useEffect(() => {
        if (props.data?.testimonials?.showTestimonials) {
            const testimonial = {
                main: [
                    {
                        id: props.data?.testimonials?.uuid,
                        heading: [{ text: props.data?.testimonials?.heading }]
                    }
                ],
                sub: []
            };
            console.log(testimonial, 'testimonials initial data');
            setInitialValues(testimonial);
            setDisabled(props.data?.testimonials.disabled);
        }
    }, [props.data]);

    useEffect(() => {
        if (data?.GetAllTestimonials) {
            invariant(data.GetAllTestimonials.testimonials, 'Not null after fetch');
            setAllItems(data?.GetAllTestimonials?.testimonials);
            const options: TestimonialsOptions[] = data?.GetAllTestimonials?.testimonials.map((item: any) => {
                return {
                    label: item.customer[0].name,
                    value: item._id
                };
            });
            setItemsDropDown(options);

            const matchingItems: any = [];

            for (let i = 0; i < props?.data?.testimonials?.selectedTestimonials.length; i += 1) {
                const selectedTestimonial = props?.data?.testimonials?.selectedTestimonials[i];
                for (let j = 0; j < data.GetAllTestimonials.testimonials.length; j += 1) {
                    const oneTestimonial = JSON.parse(JSON.stringify(data.GetAllTestimonials.testimonials[j]));
                    if (selectedTestimonial == oneTestimonial._id) {
                        matchingItems.push(oneTestimonial);
                    }
                }
            }

            setItemsList(matchingItems);

            const selectedOptionsArray = matchingItems.map((item: any) => {
                return {
                    label: item.customer[0].name,
                    value: item._id
                };
            });
            setSelectedOptions(selectedOptionsArray);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [data]);

    const handleSubmit = (values, setSubmitting: (isSubmitting: boolean) => void) => {
        const genRes = genResults(values);

        if (!form.errors) {
            //   const newHeading = heading == '' ? initialValues.main?.text : heading;
            const promise = new Promise((resolve: (value: unknown) => void) => {
                return resolve(
                    dispatch(
                        setValues({
                            type: 'testimonials',
                            values: {
                                heading: genRes.main.text,
                                id: props.id,
                                linked: true,
                                disabled,
                                selectedTestimonials: globalList
                            }
                        })
                    )
                );
            });
            props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
        }
        setSubmitting(false);
    };

    // const handleInvisibleButtonClick = () => {
    //     const newHeading = heading == '' ? initialValues.main[0].heading[0].text : heading;
    //     const promise = new Promise((resolve: (value: unknown) => void) => {
    //         return resolve(
    //             dispatch(
    //                 setValues({
    //                     type: 'testimonials',
    //                     values: {
    //                         heading: newHeading,
    //                         id: props.id,
    //                         linked: true,
    //                         disabled,
    //                         selectedTestimonials: globalList
    //                     }
    //                 })
    //             )
    //         );
    //     });
    //     props.dispatch({ id: '', key: '', action: Actions.PUSH_PROMISE, promise });
    // };

    const getDragDropList = (list) => {
        if (Array.isArray(list.children)) {
            globalList = list.children.map((el) => el.key);
        }
    };

    const getText = ({ label, value }) => {
        setHeading(value);
    };

    return (
        <>
            <MainCard title="Testimonials">
                <Controls {...{ ...props, type: 'Testimonials', disabled, setDisabled }}>
                    <br />
                    <ReusableFormikForm<mainFieldsForPage, never>
                        {...{
                            keyName: props.keyName,
                            defaultValue: initialValues,
                            fields: fieldsForPage,
                            validationSchema: validationSchemaForPage,
                            sectionTitle: '',
                            button: {
                                show: false,
                                buttonLabel: 'Save Testimonials'
                            },
                            iconButtonVisible: false,
                            draggable: false,
                            collapsible: false,
                            handleSubmit,
                            ref,
                            getText
                        }}
                    />
                    {true && selectedOptions && (
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
                                marginTop: '25px',
                                '@media (max-width:600px)': {
                                    width: '100%'
                                }
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
                                {itemsList.map((testimonial, index) => {
                                    return (
                                        <Grid item xs={12} key={testimonial._id}>
                                            <Card
                                                sx={{
                                                    p: 0,
                                                    bgcolor:
                                                        theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                                    border: theme.palette.mode === 'dark' ? 'none' : '1px solid',
                                                    borderColor: theme.palette.grey[100]
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        textOverflow: 'ellipsis',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        '@media (max-width:600px)': { flexDirection: 'column' }
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        image={testimonial.customer[0].image}
                                                        alt={testimonial.customer[0].name}
                                                        sx={{
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '70%',
                                                            height: 100,
                                                            width: 100,
                                                            maxWidth: 100,
                                                            minWidth: 100
                                                        }}
                                                    />
                                                    <CardContent
                                                        sx={{
                                                            width: '100%',
                                                            marginLeft: '2%',
                                                            '@media (max-width:600px)': { padding: '0', paddingTop: '20px' }
                                                        }}
                                                    >
                                                        <Grid container spacing={2} sx={{ flexDirection: 'row' }}>
                                                            <Grid item xs={4} key={`nameLabel-${index}`}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    Name
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={8} key={`name-${index}`}>
                                                                <Typography> {testimonial.customer[0].name}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2} sx={{ flexDirection: 'row' }}>
                                                            <Grid item xs={4} key={`locationLabel-${index}`}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    Location
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={8} key={`location-${index}`}>
                                                                <Typography>{testimonial.customer[0].location}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={2} sx={{ flexDirection: 'row' }}>
                                                            <Grid item xs={4} key={`commentLabel-${index}`}>
                                                                <Typography gutterBottom variant="h5" component="div">
                                                                    Comment
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={8} key={`comment-${index}`}>
                                                                <Typography>
                                                                    {truncateString(testimonial.customer[0].comment, 30)}
                                                                </Typography>
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
            {/* <Grid item xs={12} textAlign="left" sx={{ display: false ? '' : 'none' }}>
                <Button ref={ref} type="submit" variant="contained" onClick={handleInvisibleButtonClick}>
                    Add Testimonial
                </Button>
            </Grid> */}
            {loading ? <CustomLoader  /> : error ? <FailureLoad /> : null}
        </>
    );
});

export default LinkTestimonials;
