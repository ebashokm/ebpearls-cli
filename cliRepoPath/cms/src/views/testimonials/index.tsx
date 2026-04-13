import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import date from 'date-and-time';
// material-ui
import { Button, Grid, IconButton, Stack, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from '@mui/material';

// project imports
import FailureLoad from 'components/spinner/fail';
import { FilterList } from './helper/Filter';

import useTable from 'hooks/common/useTable';

import useSnackbar from 'hooks/common/useSnackbar';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';

import { Order } from 'types';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import { Testimonial } from './types/testimonials';
import { headCells } from './constants/testimonials';
import useGQL from './hooks/useGQL';
import { closeModal, openModal } from 'store/slices/modal';
import { useDispatch } from 'react-redux';
import ConfirmModal from 'components/modal/ConfirmModal';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import CustomLoader from 'components/loader';
import CustomPagination from 'components/pagination/Pagination';
import Noitems from 'components/no-items';

const TestimonialsList = () => {
    const { TableContainer, EnhancedTableHead } = useTable();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();

    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<Testimonial[]>([]);
    const [orderMeta, setOrderMeta] = useState<Order>({ order: 'asc', orderBy: '_id' });
    const [meta, setMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });
    
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [count, setCount] = useState<number>(0);

    const { GET_TESTIMONIALS_LIST, REMOVE_TESTIMONIAL } = useGQL();
    const { error, loading, data, refetch } = GET_TESTIMONIALS_LIST({ searchText: '', limit: 5, skip: 0, order: 'asc', orderBy: '_id' });
    const [triggerDelete, { data: deleteData }] = REMOVE_TESTIMONIAL();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setPage(0);
            setSearch(event?.target.value);
        }
    });

    const [deleteTestimonial, setDeleteTestimonial] = useState('');

    useEffect(() => {
        if (data?.GetAllTestimonials) {
            setRows(data?.GetAllTestimonials.testimonials);
            setCount(data.GetAllTestimonials.pagination.total);
        }
    }, [data]);

    useEffect(() => {
        if (deleteData?.removeTestimonial) {
            handleOpenSnackbar({ message: deleteData.removeTestimonial.message, alertType: 'success' });
            handleRefetch();
        }
    }, [deleteData]);

    useEffect(() => {
        const { order, orderBy } = orderMeta;
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy } });
    }, [rowsPerPage]);

    useEffect(() => {
        const { order, orderBy } = orderMeta;
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        /* handle refetch here */
        handleRefetch();
    }, [orderMeta.orderBy, orderMeta.order, search]);

    const handleRefetch = () => {
        refetch({
            input: { searchText: search, limit: meta?.limit, skip: search.length > 0 ? 0 : meta?.skip, order: orderMeta.order, orderBy: orderMeta.orderBy }
        });
    };

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderMeta.orderBy === property && orderMeta.order === 'asc';
        setOrderMeta({ ...orderMeta, order: isAsc ? 'desc' : 'asc', orderBy: property });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        if(newPage === 0) {
            setPage(0)
        }else {
            setPage(newPage - 1);
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event?.target?.value) {
            setRowsPerPage(parseInt(event.target.value, 10));
        }
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleDelete = async () => {
        triggerDelete({ variables: { id: deleteTestimonial } }).catch((err: any) => handleOpenSnackbar({ message: err.message, alertType: 'error' }));
        dispatch(closeModal());
    };

    const handleEdit = (id: string) => {
        navigate(`/testimonials/edit/${id}`);
    };

    const handleOpenModal = (id: string) => {
        setDeleteTestimonial(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Testimonial List</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={gridSpacing}>
                            <Button component={Link} to="/testimonials/add" variant="outlined">
                                Add Testimonials
                            </Button>
                            <FilterList debouncedSearch={debouncedSearch} />
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <>
                {/* table */}
                {loading ? (
                    <CustomLoader />
                ) : error ? (
                    <FailureLoad />
                ) : (
                    <>
                        <TableContainer>
                            <>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                    <EnhancedTableHead
                                        headCells={headCells}
                                        order={orderMeta.order}
                                        orderBy={orderMeta.orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>{row.text}</TableCell>
                                                <TableCell>
                                                    {date.format(new Date(row.createdAt), 'ddd, MMM DD YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    {date.format(new Date(row.updatedAt), 'ddd, MMM DD YYYY')}
                                                </TableCell>

                                                {/* table cells icon buttons */}
                                                <TableCell align="right">
                                                    <IconButton className="action-button" onClick={() => handleEdit(row._id)} color="primary" size="large">
                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                    &nbsp;
                                                    <IconButton className="action-button" onClick={() => handleOpenModal(row._id)} color="error" size="large">
                                                        <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {rows.length === 0 && (
                                    <Noitems />
                                )}
                            </>
                        </TableContainer>

                        {/* table pagination */}
                        {/* <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={pageMeta.count}
                            rowsPerPage={pageMeta.rowsPerPage}
                            page={pageMeta.page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        /> */}
                        <CustomPagination
                            count={count}
                            onPageChange={handleChangePage}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onItemClick={handlePageMenuItemClick}
                            rowsPerPageOptions={[5, 10, 15]}
                        />
                    </>
                )}
            </>
            <ConfirmModal
                title="Delete Testimonial"
                content="Are you sure you want to delete testimonial ?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

export default TestimonialsList;
