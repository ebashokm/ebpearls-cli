import {
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    OutlinedInput,
    Button,
    Typography
} from '@mui/material';
import useGQL from './hooks/useGQL';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import useSnackbar from 'hooks/common/useSnackbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import Nestable from 'react-nestable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { RootState } from 'store';
import ConfirmModal from 'components/modal/ConfirmModal';
import { closeModal, openModal } from 'store/slices/modal';
import { gridSpacing } from 'store/constant';
import { ThemeMode } from 'types/config';

interface MyFormValues {
    name: string;
}

const TaxonList = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    const { taxonomyId } = useParams();
    const navigate = useNavigate();
    const [deleteTaxon, setDeleteTaxon] = useState('');
    const { handleOpenSnackbar } = useSnackbar();
    const { UPDATE_TAXONOMY, LIST_TAXONOMY } = useGQL();
    const {data: taxonomyData} = LIST_TAXONOMY(taxonomyId);
    const [handleUpdateTaxonomy] = UPDATE_TAXONOMY();

    const [initialValues, setInitialValues] = useState<MyFormValues>({ name: taxonomyData?.listTaxonomy?.taxonomy?.name });
    const taxonFromState: any = useSelector((state: RootState) => state.taxon);
    // const taxonomyRoute: any = useSelector((state: RootState) => state.taxonomyRoute);
    const dispatch = useDispatch();
    const store: any = useStore();

    useEffect(() => {
        if (taxonomyData) {
            //  sessionStorage.clear();
            setInitialValues({ name: taxonomyData.listTaxonomy.taxonomy.name });
            // if (taxonomyRoute == 'editForm') return;
            taxonomyData?.listTaxonomy?.taxonomy?.taxons?.map((taxon) => {
                const index = store.getState().taxon?.data.findIndex((item) => taxon.uuid == item.uuid);
                if (index < 0) {
                    dispatch({ type: 'SET_DATA', payload: taxon });
                }
            });
        }
    }, [taxonomyData]);

    const handleEdit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, id: string) => {
        navigate(`/taxon/edit/${taxonomyId}/${id}`);
    };

    const handleDelete = async () => {
        try {
            const dataAfterDelete = taxonFromState.data
                .map((taxon) => {
                    if (taxon.uuid === deleteTaxon) {
                        // If the current taxon matches the id, return null to delete it and its descendants.
                        return null;
                    }

                    if (taxon?.children && taxon.children.length > 0) {
                        const childArray = taxon.children
                            .map((child) => {
                                if (child.uuid === deleteTaxon) {
                                    // If a child matches the id, return null to delete it and its descendants.
                                    return null;
                                }

                                if (child?.children && child.children.length > 0) {
                                    const grandChildArray = child.children
                                        .map((grandChild) => {
                                            if (grandChild.uuid === deleteTaxon) {
                                                // If a grandchild matches the id, return null to delete it and its descendants.
                                                return null;
                                            }
                                            return grandChild; // Return unchanged if not matching.
                                        })
                                        .filter((e) => e !== null);

                                    return { ...child, children: grandChildArray };
                                }

                                return child; // Return unchanged if no match or no grandchildren.
                            })
                            .filter((e) => e !== null);

                        return { ...taxon, children: childArray };
                    }

                    return taxon; // Return unchanged if no match or no children.
                })
                .filter((e) => e !== null); // Filter out any null values.

            dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: dataAfterDelete });
            const dataToSubmit = {
                name: initialValues.name,
                taxons: store.getState().taxon.data
            };
            handleUpdateTaxonomy({ variables: { id: taxonomyId, input: dataToSubmit } })
                .then((success: any) => {
                    handleOpenSnackbar({ message: 'taxon deleted successfully', alertType: 'success' });
                    sessionStorage.clear();
                    dispatch({ type: 'SET_TAXON_ROUTE', payload: '' });
                    navigate(`/taxonomy/view/${taxonomyId}`);
                })
                .catch((err: any) => {
                    handleOpenSnackbar({ message: err.message, alertType: 'error' });
                });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = (id: string) => {
        setDeleteTaxon(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const changeDragItem = (items) => {
        try {
            const changedTaxons = items.items.map((taxon) => {
                if (taxon.uuid == items.dragItem.uuid) {
                    return { ...taxon, nestedUnder: null };
                }
                if (taxon.children && taxon.children.length > 0) {
                    const childArray = taxon?.children?.map((child) => {
                        if (child.uuid == items.dragItem.uuid) {
                            return { ...child, nestedUnder: taxon.uuid };
                        }

                        if (child.children && child.children.length > 0) {
                            const grandchildArray = child?.children?.map((grandchild) => {
                                if (grandchild.uuid == items.dragItem.uuid) {
                                    return { ...grandchild, nestedUnder: child.uuid };
                                }

                                return grandchild;
                            });

                            return { ...child, children: grandchildArray };
                        }

                        return child;
                    });

                    return { ...taxon, children: childArray };
                }

                return taxon;
            });

            dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: changedTaxons });
            const dataToSubmit = {
                name: initialValues.name,
                taxons: store.getState().taxon.data
            };
            handleUpdateTaxonomy({ variables: { id: taxonomyId, input: dataToSubmit } })
                .then((success: any) => {
                    handleOpenSnackbar({ message: 'taxon dragged successfully', alertType: 'success' });
                    sessionStorage.clear();
                    dispatch({ type: 'SET_TAXON_ROUTE', payload: '' });
                    navigate(`/taxonomy/view/${taxonomyId}`);
                })
                .catch((err: any) => {
                    handleOpenSnackbar({ message: err.message, alertType: 'error' });
                });
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleTaxonomySubmit = (values) => {
        const dataToSubmit = {
            name: values.name,
            taxons: store.getState().taxon?.data
        };
        handleUpdateTaxonomy({ variables: { id: taxonomyId, input: dataToSubmit } })
            .then((success: any) => {
                handleOpenSnackbar({ message: success.data.updateTaxonomy.message, alertType: 'success' });
                sessionStorage.clear();
                dispatch({ type: 'SET_TAXON_ROUTE', payload: '' });
                navigate(`/taxonomy/list`);
            })
            .catch((err: any) => {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            });
    };

    const renderItem = ({ item }) => {
        return (
            <Grid container key={item._id} mb={1}>
                <Grid
                    sx={{
                        paddingTop: '5px',
                        pl: '2px',
                        backgroundColor: theme.palette.secondary.light,
                        color: mode === ThemeMode.DARK ? theme.palette.background.default : theme.palette.text.dark
                    }}
                    item
                    xs={6}
                >
                    {item.name}
                </Grid>
                <Grid item xs={6} sx={{ backgroundColor: theme.palette.secondary.light }} container justifyContent="flex-end">
                    <Grid item>
                        <IconButton color="primary" size="small" onClick={(event) => handleEdit(event, item.uuid)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton color="secondary" size="small" sx={{ color: 'red' }} onClick={(event) => handleOpenModal(item.uuid)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">{taxonomyData?.listTaxonomy?.taxonomy?.name}</Typography>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to={`/taxon/add/${taxonomyId}`} variant="outlined">
                            Add a new taxon
                        </Button>
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Nestable
                        className="taxon-items"
                        items={taxonFromState?.data}
                        renderItem={renderItem}
                        maxDepth={3}
                        idProp="uuid"
                        onChange={changeDragItem}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().trim().min(3).max(30).required().label('Name')
                        })}
                        onSubmit={handleTaxonomySubmit}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-email-login">Name *</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email-login"
                                        type="text"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            setFieldValue('name', e.target.value);
                                        }}
                                        label="Name"
                                        fullWidth
                                    />
                                    {touched.name && errors.name && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <Button size="large" type="submit" variant="contained">
                                    Save
                                </Button>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
            <ConfirmModal
                title="Delete Taxon"
                content="All the child taxon also will be deleted. Are you sure?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

export default TaxonList;
