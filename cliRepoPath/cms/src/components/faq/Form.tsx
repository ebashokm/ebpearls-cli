import {
    Grid,
    FormHelperText,
    TextField,
    InputLabel,
    Box,
    Button,
    CardProps,
    InputLabelProps
} from '@mui/material';
import { Formik } from 'formik';
import styled from 'styled-components';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';

type PropTypes = {
    title: string;
    formFields: { name: string; label: string }[];
    initialValues: any;
    validationSchema: Object;
    buttonLabel: string;
    handleFormSubmit: (value: any, setSubmitting: (isSubmitting: boolean) => void) => void;
    cardSx?: CardProps['sx'];
    textFieldSx?: InputLabelProps['sx'];
};

const ReusableForm = ({
    title,
    formFields,
    initialValues,
    validationSchema,
    buttonLabel,
    handleFormSubmit,
    cardSx = {},
    textFieldSx = {}
}: PropTypes) => {
    return (
        <MainCard title={title} sx={cardSx}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values, setSubmitting);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container>
                            {formFields.map(({ name, label }) => (
                                <Grid key={name} item xs={12}>
                                    <Label>{label}</Label>
                                    <TextField
                                        fullWidth
                                        placeholder={`Enter ${name}`}
                                        value={values.name}
                                        name={name}
                                        size="medium"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        sx={textFieldSx}
                                    />
                                    {touched.section && errors.section && (
                                        <FormHelperText error id={`${name}-error`}>
                                            {errors.section as any}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: '1rem' }}>
                            <AnimateButton>
                                <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                                    {buttonLabel}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </MainCard>
    );
};

export const CustomTextField = styled(({ ...props }) => <TextField {...props} />)`
    width: 400px;
    @media (max-width: 520px) {
        width: 100%;
    }
`;

export const Label = styled(({ ...props }) => <InputLabel {...props} />)`
    color: rgba(0, 0, 0, 0.6);
    padding: 0.4em;
`;

export default ReusableForm;
