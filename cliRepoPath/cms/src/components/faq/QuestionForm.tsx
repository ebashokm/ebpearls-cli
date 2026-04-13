import { FormHelperText, Typography, IconButton, TextField, Stack } from '@mui/material';
import { FormikErrors, FormikTouched, getIn } from 'formik';

/* assets */
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FormInputTypeV1 } from 'views/faq/types';

type PropTypes = {
    id: string;
    len: number;
    index: number;
    values: FormInputTypeV1;
    errors: FormikErrors<FormInputTypeV1>;
    touched: FormikTouched<FormInputTypeV1>;
    iconButtonVisible: boolean;
    handleChange: (e: React.ChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<any, Element>) => void;
    addQuestion?: (values) => void;
    removeQuestion?: (id: string, values) => void;
};

const ErrorMessage = ({ errors, touched, name }) => {
    return <FormHelperText error>{getIn(touched, name) && getIn(errors, name) && getIn(errors, name)}</FormHelperText>;
};

const FormQuestion = ({
    id,
    len,
    index,
    values,
    errors,
    touched,
    iconButtonVisible,
    handleChange,
    handleBlur,
    addQuestion,
    removeQuestion
}: PropTypes) => {
    return (
        <>
            <Stack direction="row" alignItems={'center'}>
                <Typography variant="h5" flex={1}>{`QUESTION ${index + 1}`}</Typography>
                {iconButtonVisible && (
                    <Stack direction="row" justifyContent={'flex-end'} flex={1}>
                        <IconButton onClick={() => addQuestion!(values)}>
                            <AddIcon />
                        </IconButton>
                        <IconButton onClick={() => removeQuestion!(id, values)} disabled={len === 1}>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Stack>
                )}
            </Stack>
            <Stack spacing={1}>
                <TextField
                    fullWidth
                    placeholder="Title"
                    name={`content[${index}].question`}
                    value={values?.content[index]?.question || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                <ErrorMessage {...{ errors, touched, name: `content[${index}].question` }} />

                <TextField
                    fullWidth
                    placeholder="Description"
                    name={`content[${index}].answer`}
                    value={values?.content[index]?.answer || ''}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    rows={5}
                />
                <ErrorMessage {...{ errors, touched, name: `content[${index}].answer` }} />
            </Stack>
        </>
    );
};

export default FormQuestion;
