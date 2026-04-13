import { Grid, FormHelperText, MenuItem, Button, TextField, InputLabel } from '@mui/material'
import { FormikErrors, FormikTouched, getIn } from 'formik';

/* mui icons */
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

/* types */
import { ActiveStatus, FormInputType } from '../../types';

type PropTypes = {
    index: number;
    length: number;
    values: FormInputType;
    errors: FormikErrors<FormInputType>;
    touched: FormikTouched<FormInputType>;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any, Element>) => void;
    handleRemovePrice: (index: number, values: FormInputType) => void;
};

const ErrorMessage = ({ errors, touched, name }) => {
    return <FormHelperText error>{getIn(touched, name) && getIn(errors, name) && getIn(errors, name)}</FormHelperText>;
};

const PricesForm = ({ index, length, values, errors, touched, handleChange, handleBlur, handleRemovePrice }: PropTypes) => {
    return (
        <Grid container key={index} spacing={2}>
            <Grid item xs={12} md={2}>
                <InputLabel>Price *</InputLabel>
                <TextField
                    placeholder="Enter Price"
                    name={`prices[${index}].price`}
                    value={values.prices[index]?.price ?? 0}
                    size="medium"
                    type="number"
                    onBlur={handleBlur}
                    onChange={(e: any) => e.target.value >= 0 && handleChange(e)}
                />
                <ErrorMessage {...{ errors, touched, name: `prices[${index}].price` }} />
            </Grid>
            <Grid item xs={12} md={4}>
                <InputLabel>Name *</InputLabel>
                <TextField
                    placeholder="Enter Name"
                    name={`prices[${index}].name`}
                    value={values.prices[index]?.name || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                />
                <ErrorMessage {...{ errors, touched, name: `prices[${index}].name` }} />
            </Grid>
            <Grid item xs={12} md={4}>
                <InputLabel>Status</InputLabel>
                <TextField
                    id="price-status"
                    name={`prices[${index}].status`}
                    select
                    value={values.prices[index]?.status || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth
                >
                    {ActiveStatus.map((option, i) => (
                        <MenuItem key={`price-${i}`} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <ErrorMessage {...{ errors, touched, name: `prices[${index}].status` }} />
            </Grid>

            {length > 1 && (
                <Grid item xs={12} lg={2} alignSelf={'center'}>
                    <Button onClick={() => handleRemovePrice(index, values)}>
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

export default PricesForm;
