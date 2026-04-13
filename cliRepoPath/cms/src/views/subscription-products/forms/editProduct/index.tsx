import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';

import { Grid, TextField, FormHelperText, MenuItem, Button, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import useSnackbar from 'hooks/common/useSnackbar';
import useGQL from '../../hooks/useGQL';

import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

import { defaultValue, validationSchema } from 'views/subscription-products/constants';
import { ActiveStatus, BillingCycleMap, BillingCycles, FormInputType, ProductStatus } from '../../types';
import PricesForm from './prices-form';
import { GridDivider } from 'components/divider/Divider';

const EditSubscriptionProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { UPDATE_PRODUCT, SUBSCRIPTION_PRODUCT } = useGQL();
    const { handleOpenSnackbar } = useSnackbar();
    const [handleUpdateProduct, { data }] = UPDATE_PRODUCT();
    const { loading, data: editData } = SUBSCRIPTION_PRODUCT(id!);
    const [billingCycleValue, setBillingCycleValue] = useState('');

    const [initialValues, setInitialValues] = useState<FormInputType>(defaultValue);

    useEffect(() => {
        if (editData) {
            const bc = editData?.findSubscriptionProduct?.billingCycle;

            setInitialValues({
                productName: editData?.findSubscriptionProduct?.name,
                description: editData?.findSubscriptionProduct?.description,
                status: editData?.findSubscriptionProduct?.isActive ? 'Active' : 'Inactive',
                //   billingCycle: editData?.findSubscriptionProduct?.billingCycle || 0,
                prices: editData?.findSubscriptionProduct?.prices
            });
            if (bc == 0) {
                setBillingCycleValue('MONTHLY');
            } else if (bc == 1) {
                setBillingCycleValue('QUATERLY');
            } else if (bc == 2) {
                setBillingCycleValue('BI_YEARLY');
            } else {
                setBillingCycleValue('YEARLY');
            }
        }
    }, [editData]);

    useEffect(() => {
        if (data?.updateSubscriptionProduct) {
            handleOpenSnackbar({ message: `${data?.updateSubscriptionProduct?.message!}. Redirecting...`, alertType: 'success' });
            setTimeout(() => {
                navigate('/subscription-products/list');
            }, 2000);
        }
    }, [data]);

    const handleFormSubmit = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
        const { status, ...rest } = values;

        try {
            setSubmitting(true);
            await handleUpdateProduct({
                variables: {
                    input: {
                        id,

                        ...rest,
                        isActive: status === ProductStatus.Active,
                        prices: rest.prices?.map((priceEl) => {
                            return {
                                price: priceEl.price || 0,
                                name: priceEl?.name || '',
                                currency: priceEl?.currency || 'aud',
                                isActive: priceEl.status === ProductStatus.Active
                            };
                        })
                    }
                }
            });
            setSubmitting(false);
        } catch (error) {
            handleOpenSnackbar({ message: data?.updateSubscriptionProduct?.message!, alertType: 'error' });
        }

        setSubmitting(false);
    };

    const handleAddPrice = (values: FormInputType) => {
        setInitialValues({
            ...values,
            prices: [...values.prices, { price: 0, currency: 'aud', name: '', status: ProductStatus.Active }]
        });
    };

    const handleRemovePrice = (index: number, values: FormInputType) => {
        const filterList = values.prices.filter((value, i) => i !== index);
        setInitialValues({ ...values, prices: filterList });
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleFormSubmit(values, setSubmitting);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldValue, handleBlur, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                    <MainCard title="Edit Product">
                        <Grid container spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Product Name *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="product-name"
                                    placeholder="Enter Product Name"
                                    value={values.productName}
                                    name="productName"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                                {touched.productName && errors.productName && (
                                    <FormHelperText error id="product-name-error">
                                        {errors.productName}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Description *</InputLabel>
                                <TextField
                                    fullWidth
                                    id="description"
                                    placeholder="Enter Description"
                                    value={values.description}
                                    name="description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    multiline
                                    minRows={2}
                                />
                                {touched.description && errors.description && (
                                    <FormHelperText error id="description-error">
                                        {errors.description}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Product Status</InputLabel>
                                <TextField
                                    id="status"
                                    name="status"
                                    select
                                    value={values.status}
                                    fullWidth
                                    onChange={handleChange}
                                >
                                    {ActiveStatus.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {errors.status && (
                                    <FormHelperText error id="role-error">
                                        {errors.status}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12} lg={6}>
                                <InputLabel>Billing cycle</InputLabel>
                                <TextField
                                    id="billing-cycle"
                                    name="billingCycle"
                                    select
                                    value={billingCycleValue}
                                    fullWidth
                                    onChange={(e) => {
                                        setBillingCycleValue(e.target.value);
                                        setFieldValue('billingCycle', e.target.value);
                                    }}
                                >
                                    {BillingCycles.map((option, index) => (
                                        <MenuItem key={index} value={option.value}>
                                            {BillingCycleMap[option.label]}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {errors.billingCycle && (
                                    <FormHelperText error id="role-error">
                                        {errors.billingCycle}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <GridDivider />
                            <Grid item xs={12}>
                                <SubCard title="Prices">
                                    {initialValues?.prices?.map((value, index) => (
                                        <PricesForm
                                            key={index}
                                            {...{
                                                index,
                                                length: initialValues?.prices?.length,
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleRemovePrice
                                            }}
                                        />
                                    ))}
                                    <Button onClick={() => handleAddPrice(values)} variant="outlined" sx={{ mt: 2 }}>
                                        <AddIcon />
                                        Add price
                                    </Button>
                                </SubCard>
                            </Grid>
                            <Grid item xs={12}>
                                <Button disabled={isSubmitting} variant="contained" type="submit">
                                    Update Product
                                </Button>
                            </Grid>
                        </Grid>
                    </MainCard>
                </form>
            )}
        </Formik>
    );
};
export default EditSubscriptionProduct;
