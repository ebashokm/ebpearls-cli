/* eslint no-return-assign: 0 */

import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { TextField, Autocomplete, Typography, Button, Box, InputLabel, useTheme } from '@mui/material';
import { v4 as uuid } from 'uuid';
import MainCard from 'ui-component/cards/MainCard';
import { useAdvancedPageReducer } from 'hooks/reducers/usePageReducer';
import { availableSections, Section } from './constants/advancedPage';
import DragDrop from './components/dnd/DragDrop';
import { Actions } from './types/pages/advancedPage';
import { PageWrapper, SearchContainer } from './advancedPage.styles';
import MainForm from './forms/advanced/main';
import { useDispatch, useSelector } from 'react-redux';
import { resetForm, setLoading } from 'store/slices/form';
import { RootState } from 'store';
import { groupBy, imageUploads } from 'utils/flatten';
import { useGQL } from './hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { useNavigate } from 'react-router-dom';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomLoader from 'components/loader';

const AdvancePageAdd = () => {
    const theme = useTheme();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const { state, dispatch } = useAdvancedPageReducer();
    const globalState = useSelector((rootState: RootState) => rootState.form);
    const refs = useRef<HTMLButtonElement[]>([]);
    const rootDispatch = useDispatch();

    const navigate = useNavigate();
    const { CREATE_ADV_PAGE, UPLOAD_PAGE_IMAGE } = useGQL();
    const [handleImageUpload, { data: uploadData }] = UPLOAD_PAGE_IMAGE();
    const [isSubmitting, setisSubmitting] = useState<boolean>(false);
    const [handleCreatePage, { loading, data }] = CREATE_ADV_PAGE();
    const [expandAllFlag, setExpandAllFlag] = useState<boolean>(true);
    const pageDragArray: any = useSelector((rootState: RootState) => rootState.pageDragIndex);

    const { handleOpenSnackbar } = useSnackbar();

    const collapseAll = () => {
        setExpandAllFlag(false);
    };

    const expandAll = () => {
        setExpandAllFlag(true);
    };

    const validateShowMesageAndReset = (message) => {
        handleOpenSnackbar({ message, alertType: 'error' });
        rootDispatch(resetForm());
        dispatch({ id: '', key: '', action: Actions.RESET_PROMISE });
        setIsSubmit(false);
        setisSubmitting(false);
    };

    useEffect(() => {
        if (globalState.loading === false) {
            setisSubmitting(true);
            const header: any = globalState.values.find((item: any) => item.key == 'header');

            if (pageDragArray?.data.length == 0) {
                pageDragArray.data = state.components?.map((component: any, index: number) => {
                    return {
                        id: component.id,
                        key: component.element.key,
                        keyName: component.element.props.keyName,
                        index
                    };
                });
            }

            for (let i = 0; i < globalState.values.length; i += 1) {
                const product: any = { ...globalState.values[i] };
                if (
                    product.key == 'featuredProducts' &&
                    product?.data.main.productType == 'item' &&
                    product?.data.main.selectedProducts.length !== 4
                ) {
                    validateShowMesageAndReset('You can only select 4 featured products items');
                    return;
                }
                if (
                    header?.data.slug == 'home-page' &&
                    product.key == 'featuredProducts' &&
                    product?.data.main.productType == 'occasion' &&
                    product?.data.main.selectedProducts.length !== 3
                ) {
                    validateShowMesageAndReset('You can only select 3 featured products occasions');
                    return;
                }
                if (product.key == 'steps' && product?.data.meta.length > 3) {
                    validateShowMesageAndReset('You can only select 3 how it work steps');
                    return;
                }
            }

            Promise.all(imageUploads(globalState.values)).then((resolvedValues) => {
                const results = groupBy('key')(resolvedValues);

                const mappedData = {
                    title: results.header[0].title,
                    slug: results.header[0].slug,
                    status: results.header[0].status,
                    content: results.header[0].body ? results.header[0].body : '<p></p>',
                    seoTags: {
                        title: results.header[0].seoTitle,
                        tags: results.header[0].seoTags,
                        description: results.header[0].seoDescription
                    },
                    banner: [],
                    homePage: [],
                    featuredProducts: [],
                    imageColumn: [],
                    howItWorks: [],
                    faq: {
                        index: -1,
                        showFaqs: false,
                        selectedFaqs: [],
                        uuid: '',
                        disabled: false
                    },
                    testimonials: {
                        index: -1,
                        showTestimonials: false,
                        selectedTestimonials: [],
                        heading: '',
                        uuid: '',
                        disabled: false
                    }
                };
                if (results.banner) {
                    const banner = results.banner.map((item) => {
                        const i = pageDragArray?.data.findIndex((x) => x?.id == item.id);
                        return {
                            index: i,
                            uuid: item.id,
                            altText: item.alt,
                            content: item.description,
                            image: item.image,
                            disabled: item.disabled,
                            button: {
                                heading: item.label,
                                destinationUrl: item.url
                            }
                        };
                    });
                    mappedData.banner = banner;
                }
                if (results.homeBanner) {
                    const homePage = results.homeBanner.map((item) => {
                        const i = pageDragArray?.data.findIndex((x) => x?.id == item.id);
                        return {
                            index: i,
                            uuid: item.id,
                            altText: item.alt,
                            content: item.heading,
                            image: item.image,
                            disabled: item.disabled,
                            button: {
                                heading: item.label,
                                destinationUrl: item.url
                            }
                        };
                    });
                    mappedData.homePage = homePage;
                }
                if (results.featuredProduct) {
                    const featuredProduct1 = results.featuredProduct.map((item) => {
                        const i = pageDragArray?.data.findIndex((x) => x?.id == item.id);
                        return {
                            index: i,
                            uuid: item.id,
                            disabled: item.disabled,
                            heading: item.text,
                            productType: item.meta[0].type,
                            sections: item.meta.map((e) => {
                                return {
                                    id: e.id,
                                    image: e.image,
                                    name: e.name,
                                    productType: e.type
                                };
                            })
                        };
                    });
                    mappedData.featuredProducts = featuredProduct1;
                }
                if (results.imageColumn) {
                    const imageColumn = results.imageColumn.map((item) => {
                        const i = pageDragArray?.data.findIndex((x) => x?.id == item.id);

                        return {
                            index: i,
                            uuid: item.id,
                            heading: item.text,
                            columnType: item.columnType ? item.columType : '',
                            disabled: item.disabled,
                            sections: item.meta.map((e) => {
                                return {
                                    id: e.id,
                                    image: e.image,
                                    alignment: e.align,
                                    iconHeading: e.main,
                                    subHeading: e.main,
                                    subText: e.sub
                                };
                            })
                        };
                    });

                    mappedData.imageColumn = imageColumn;
                }
                if (results.steps) {
                    const howItWorks = results.steps.map((item) => {
                        const i = pageDragArray?.data.findIndex((x) => x?.id == item.id);
                        return {
                            index: i,
                            uuid: item.id,
                            heading: item.text,
                            disabled: item.disabled,
                            sections: item.meta.map((e) => {
                                return {
                                    id: e.id,
                                    image: e.image,
                                    title: e.title,
                                    description: e.description
                                };
                            })
                        };
                    });
                    mappedData.howItWorks = howItWorks;
                }

                const isFaqPresent = state.components.find((component) => component.element.props.keyName.split('-')[0] == 'FAQ');

                if (isFaqPresent && results.faq && results.faq.length > 0) {
                    const i = pageDragArray?.data.findIndex((x) => x?.id == isFaqPresent.id);
                    mappedData.faq = {
                        index: i,
                        showFaqs: true,
                        selectedFaqs: results.faq[0].selectedFaqs,
                        uuid: isFaqPresent.id,
                        disabled: results.faq[0].disabled
                    };
                }

                if (results.testimonials && results.testimonials.length > 0) {
                    const i = pageDragArray?.data.findIndex((x) => x?.id == results.testimonials[0].id);

                    mappedData.testimonials = {
                        index: i,
                        showTestimonials: true,
                        heading: results.testimonials[0].heading,
                        selectedTestimonials: results.testimonials[0].selectedTestimonials,
                        uuid: results.testimonials[0].id,
                        disabled: results.testimonials[0].disabled
                    };
                }

                handleCreatePage({ variables: { input: mappedData } })
                    .then((success: any) => {
                        handleOpenSnackbar({ message: success?.data.createAdvancePage.message, alertType: 'success' });
                        setisSubmitting(false);
                        navigate('/advance-page/list');
                    })
                    .catch((err: any) => {
                        handleOpenSnackbar({ message: err.message, alertType: 'error' });
                        setisSubmitting(false);
                        setIsSubmit(false);
                    });
            });
            // rootDispatch(resetForm());
            dispatch({ id: '', key: '', action: Actions.RESET_PROMISE });
            setIsSubmit(false);
        }
    }, [globalState.loading]);

    useEffect(() => {
        if (searchText) {
            for (let i = 0; i < state.components.length; i += 1) {
                const component = state.components[i];
                if (
                    (component.element.props.keyName.split('-')[0] == 'Testimonials' && searchText == 'Testimonials') ||
                    (component.element.props.keyName.split('-')[0] == 'FAQ' && searchText == 'FAQ')
                ) {
                    return;
                }
            }
            dispatch({ action: Actions.LOAD, type: searchText, id: uuid(), dispatch, key: `${searchText}-${uuid()}` });
        }
    }, [searchText]);

    useEffect(() => {
        refs.current.map((ref, index) => {
            if (!ref) delete refs.current[index];
        });
        return () => {
            refs.current.map((ref, index) => {
                if (!ref) delete refs.current[index];
            });
        };
    }, [state.components]);

    useEffect(() => {
        if (refs.current.length === state.promises.length) {
            Promise.all(state.promises).then((values) => {
                rootDispatch(setLoading(false));
            });
        }
        dispatch({ id: '', key: '', type: Actions.RESET_PROMISE });
    }, [state.promises]);

    const handleChange = (event: React.SyntheticEvent<Element, Event>, capture: Section | null) => {
        if (capture) {
            setSearchText(capture.value);
        }
    };

    const handleBulkSubmit = async () => {
        setIsSubmit(true);

        if (isSubmit) {
            rootDispatch(resetForm());
        }
        refs.current = refs.current.filter((item) => item !== null);
        refs.current.map((button) => button && button.click());
    };

    if (loading || isSubmitting) {
        return <CustomLoader  />;
    }

    return (
        <MainCard content={false}>
            <PageWrapper>
                <SearchContainer>
                    <Typography variant="h2">
                        Advanced Page Management
                    </Typography>
                    <Autocomplete
                        className="dropdown"
                        disablePortal
                        options={availableSections}
                        sx={{ width: 300, backgroundColor: theme.palette.background.paper, position: 'fixed', right: 60, zIndex: 10}}
                        onChange={handleChange}
                        renderInput={(params) => <><InputLabel>Section</InputLabel><TextField {...params} /></>}
                    />
                </SearchContainer>

                {/* render childrens */}
                <MainForm
                    ref={(node: HTMLButtonElement) => (refs.current[0] = node)}
                    id={uuid()}
                    keyName={`main-${uuid()}`}
                    dispatch={dispatch}
                />
                {state.components.length > 0 && (
                    <PageWrapper>
                        <Box sx={{ marginTop: '30px', justifyContent: 'flex-end' }}>
                            {expandAllFlag && (
                                <Button type="button" onClick={collapseAll}>
                                    collapse all <ArrowDropUpIcon />
                                </Button>
                            )}
                            {!expandAllFlag && (
                                <Button type="button" onClick={expandAll}>
                                    expand all <ArrowDropDownIcon />
                                </Button>
                            )}
                        </Box>
                    </PageWrapper>
                )}
                {/* mount components */}
                <DragDrop>
                    {state.components.map((target, index) => {
                        return (
                            <div key={`child-${index}`}>
                                {cloneElement(target.element, {
                                    expandAllFlag,
                                    ref: (ref) => (refs.current[index + 1] = ref)
                                })}
                            </div>
                        );
                    })}
                </DragDrop>

                <Button type="button" variant="contained" onClick={handleBulkSubmit}>
                    Save page
                </Button>
            </PageWrapper>
        </MainCard>
    );
};

export default AdvancePageAdd;
