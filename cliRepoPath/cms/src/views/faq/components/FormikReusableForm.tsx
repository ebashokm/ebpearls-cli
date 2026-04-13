import { Dispatch, FC, forwardRef, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Grid, IconButton } from '@mui/material';
import { Formik, FormikProps, useFormikContext } from 'formik';
import { PersistFormikValues } from 'formik-persist-values';
import { useDispatch } from 'react-redux';
import lodash, { set } from 'lodash';
import MainCard from 'ui-component/cards/MainCard';
import CustomFieldArray from './formik/CustomFieldArray';
import CollapsibleContent from './collapsible';
import ExpandMoreComponent from './collapsible/iconButton';
import CollapsibleProvider from 'contexts/CollapsibleContext';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { GridContainer, MainWrapper } from './form.styles';
import DragDrop from './dnd/DragDrop';
import { Props, WrapperProps } from '../types';
import { setErrors } from 'store/slices/form';
import { useCollapsible } from 'hooks/common/useCollapsible';

const CollapsibleContentWrapper = ({ expand, children }: WrapperProps) => {
    const { setExpanded } = useCollapsible();
    useEffect(() => {
        setExpanded(expand);
    }, []);

    return <CollapsibleContent>{children}</CollapsibleContent>;
};

const BubbleErrors = () => {
    const dispatch = useDispatch();
    const { errors } = useFormikContext();
    useEffect(() => {
        if (lodash.isEmpty(errors)) {
            dispatch(setErrors(false));
            return;
        }
        dispatch(setErrors(true));
    }, [errors]);
    return null;
};

const ReusableFormikForm = <T extends Object, U extends Object>(
    {
        keyName,
        defaultValue,
        fields,
        validationSchema,
        sectionTitle,
        button,
        iconButtonVisible,
        draggable,
        collapsible,
        handleSubmit,
        handleAdd,
        handleRemove,
        mainCardSx,
        isLoaderShow
    }: Props<T, U>,
    ref: any
) => {
    const [initialState, setInitialState] = useState(defaultValue);
    useEffect(() => {
        setInitialState(defaultValue);
    }, [defaultValue]);

    /* main form fields */
    const genMainFormFields = (props) => {
        return initialState?.main?.map((subField, index) => (
            <MainWrapper key={`main-wrapper-${index}`}>
                <Grid container sx={{ maxWidth: '50%' }}>
                    <CustomFieldArray<T, U> accessKey="main" formFields={fields[0].main} formikProps={props} controlIndex={index} />
                </Grid>
            </MainWrapper>
        ));
    };

    /* sub form fields listinsg */
    const genSubFormFields = (props) => {
        return initialState.sub?.map((subField, index) => {
            /* sub form fields */
            const formFields = (
                <Grid container sx={{ maxWidth: '50%' }}>
                    <CustomFieldArray<T, U>
                        accessKey="sub"
                        formFields={fields[0].sub}
                        formikProps={props}
                        controlIndex={index}
                        controls={{ id: subField.id, handleAdd, handleRemove, setInitialState }}
                    />
                </Grid>
            );

            return (
                <CollapsibleProvider key={`container-${index}`}>
                    <Grid item xs={12} sx={{ padding: '0 !important' }}>
                        <MainCard
                            title={sectionTitle}
                            sx={{ position: 'relative', border: 'none', '&>div': { padding: '0px !important' }, ...mainCardSx }}
                        >
                            {/* icon buttons */}
                            <GridContainer container>
                                {iconButtonVisible && (
                                    <Grid item xs={4} sm={3} md={2.1} lg={2} xl={1.2}>
                                        <IconButton onClick={() => handleAdd?.(props.values, setInitialState)}>
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                handleRemove?.(subField.id, props.values, setInitialState);
                                            }}
                                            disabled={initialState.sub?.length === 1}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Grid>
                                )}

                                {collapsible && (
                                    <Grid item>
                                        <ExpandMoreComponent />
                                    </Grid>
                                )}
                            </GridContainer>

                            {/* form fields */}
                            {collapsible ? <CollapsibleContentWrapper expand={false}>{formFields}</CollapsibleContentWrapper> : formFields}
                        </MainCard>
                    </Grid>
                </CollapsibleProvider>
            );
        });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, setSubmitting);
            }}
        >
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <>
                        <Grid container maxWidth="100%" spacing={3} sx={{ margin: 'auto' }}>
                            {genMainFormFields(props)}
                            {draggable ? <DragDrop>{genSubFormFields(props)}</DragDrop> : genSubFormFields(props)}

                            <Grid item xs={12} textAlign="left" sx={{ display: button.show ? '' : 'none' }}>
                                <Button disabled={props.isSubmitting} ref={ref} type="submit" variant="contained">
                                    {button.buttonLabel}
                                </Button>
                                {isLoaderShow && <CircularProgress size={25} />}
                            </Grid>
                        </Grid>
                    </>

                    <BubbleErrors />
                    {keyName && <PersistFormikValues name={keyName} storage="sessionStorage" debounce={100} />}
                </form>
            )}
        </Formik>
    );
};

export default forwardRef(ReusableFormikForm) as <T extends Object, U extends Object>(
    {
        keyName,
        defaultValue,
        fields,
        validationSchema,
        sectionTitle,
        button,
        iconButtonVisible,
        draggable,
        collapsible,
        handleSubmit,
        handleAdd,
        handleRemove,
        mainCardSx,
        isLoaderShow
    }: Props<T, U>,
    ref: any
) => JSX.Element;
