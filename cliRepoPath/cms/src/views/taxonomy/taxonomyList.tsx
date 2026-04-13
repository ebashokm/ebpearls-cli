import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    OutlinedInput,
    Paper,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TableSortLabel,
    TableHead,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Button,
    Typography,
    Stack
} from '@mui/material';
import useGQL from './hooks/useGQL';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';

import useSnackbar from 'hooks/common/useSnackbar';
import useTable from './hooks/useTable';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { headCells } from './constants/taxanomy';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { setSort, setPage, setRowsPerPage } from 'store/slices/table';
import { visuallyHidden } from '@mui/utils';
import { gridSpacing } from 'store/constant';
import { useDialog } from './hooks/useDialogs';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import { TableCellCenter } from 'components/table/table.styles';
import CustomLoader from 'components/loader';
import CustomPagination from 'components/pagination/Pagination';

interface MyFormValues {
    name: string;
}

const TaxonomyList = () => {
    const {
        sort: { order, orderBy }
    } = useSelector((state: RootState) => state.table);
    const dispatch = useDispatch();
    const theme = useTheme();
    const { TableContainer } = useTable();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();

    const { LIST_TAXONOMIES, DELETE_TAXONOMY, CREATE_TAXONOMY } = useGQL();
    const { error, loading, data, refetch } = LIST_TAXONOMIES();
    const [deleteTaxonomy, { loading: deleteLoading, data: deleteData }] = DELETE_TAXONOMY();
    const [handleCreateTaxonomy, { loading: createLoading, data: creadtedData }] = CREATE_TAXONOMY();

    const [meta, setMeta] = useState<any>();
    const [open, setOpen] = useState(false);
    const { searchText, page, rowsPerPage, sort } = useSelector((state: RootState) => state.table);
    const { openDialog, handleDialogClose, handleDialogOpen } = useDialog();
    const [deleteTaxonomyId, setDeleteTaxonomyId] = useState('');
    const [count, setCount] = useState<number>(0);

    const handleRefetch = () => {
        refetch({ input: { limit: meta?.limit, skip: meta?.skip, order: sort.order, orderBy: sort.orderBy, searchText } });
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        refetch();
        dispatch({ type: 'UPDATE_WHOLE_ARRAY', payload: [] });
    }, []);

    useEffect(() => {
        if (data?.listTaxonomies?.pagination) {
            setCount(data.listTaxonomies.pagination.total);
        }
    }, [data]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { limit, skip, order: sort.order, orderBy: sort.orderBy, searchText } });
    }, [page]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { limit, skip, order: sort.order, orderBy: sort.orderBy, searchText } });
    }, [rowsPerPage]);

    useEffect(() => {
        if (deleteData?.deleteTaxonomy) {
            handleOpenSnackbar({ message: deleteData.deleteTaxonomy.message, alertType: 'success' });
        }
        refetch();
    }, [deleteData]);

    const handleEdit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, id: string) => {
        navigate(`/taxonomy/view/${id}`);
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, id: string) => {
        try {
            await deleteTaxonomy({ variables: { id: deleteTaxonomyId } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = (id: string) => {
        setDeleteTaxonomyId(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        if(newPage === 0) {
            dispatch(setPage(0));
        }else {
            dispatch(setPage(newPage - 1));
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event?.target?.value) {
            dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
        }
        dispatch(setPage(0));
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        const setOrder = isAsc ? 'desc' : 'asc';
        dispatch(setSort({ order: setOrder, orderBy: property }));
    };

    if (loading) {
        return <CustomLoader  />;
    }

    const initialValues: MyFormValues = { name: '' };

    const handleTaxonomySubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
        handleCreateTaxonomy({ variables: { input: values } })
            .then((success: any) => {
                handleOpenSnackbar({ message: success.data.createTaxonomy.message, alertType: 'success' });
                sessionStorage.clear();
                refetch();
            })
            .catch((err: any) => {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            });
        handleDialogClose();
    };
    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Taxonomy List</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => handleDialogOpen()} variant="outlined">
                            Add Taxonomy
                        </Button>
                    </Grid>
                </Grid>
            }
        >
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => {
                                if (headCell.id === 'action') {
                                    return (
                                        <TableCell key={headCell.id} align={headCell.align} padding={headCell.padding}>
                                            {headCell.label}
                                        </TableCell>
                                    );
                                }
                                return (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.align}
                                        padding={headCell.padding}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={(event) => handleRequestSort(event, headCell.id)}
                                        >
                                            {headCell.label}
                                            {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.listTaxonomies?.taxonomies?.map((row: any, index: number) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton className="action-button" color="primary" size="large" onClick={(event) => handleEdit(event, row._id)}>
                                        <EditIcon />
                                    </IconButton>
                                    &nbsp;
                                    <IconButton className="action-button" color="error" size="large" onClick={() => handleOpenModal(row._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleDialogClose} className="taxons-dailog">
                {openDialog && (
                    <>
                        <DialogTitle>Add Taxonomy</DialogTitle>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().trim().min(4).max(20).required().label('Name')
                            })}
                            onSubmit={handleTaxonomySubmit}
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <DialogContent>
                                        <Grid container spacing={gridSpacing}>
                                            <Grid item xs={12}>
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
                                                        onChange={handleChange}
                                                        inputProps={{ minLength: 4, maxLength: 20 }}
                                                    />
                                                    {touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        <Stack>
                                            <Button type="submit" disabled={isSubmitting} fullWidth variant="outlined" color="primary">
                                                {isSubmitting ? <CircularProgress size={20} /> : 'Add'}
                                            </Button>
                                            <Button variant="text" onClick={handleDialogClose}>
                                                Close
                                            </Button>
                                        </Stack>
                                    </DialogActions>
                                </form>
                            )}
                        </Formik>
                    </>
                )}
            </Dialog>

            <CustomPagination
                count={count}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                onItemClick={handlePageMenuItemClick}
                rowsPerPageOptions={[5, 10, 15]}
            />

            <ConfirmModal
                title="Delete Taxonomy"
                content="Are you sure you want to delete this taxonomy ?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

export default TaxonomyList;
