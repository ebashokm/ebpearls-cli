/* eslint no-underscore-dangle: 0 */
/* eslint no-nested-ternary: 0 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import date from 'date-and-time';
// material-ui
import { Button, Grid, IconButton, Stack, Table, TableBody, TableCell, TablePagination, TableRow, Typography } from '@mui/material';

// project imports
import FailureLoad from 'components/spinner/fail';

import useTable from 'hooks/common/useTable';
import useGQL from './hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';

// types and const
import { Order, Page } from 'types';
import { headCells } from 'views/subscription-products/constants';
import { SubscriptionProduct } from './types';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmModal from 'components/modal/ConfirmModal';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'store/slices/modal';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { TableCellCenter } from 'components/table/table.styles';
import CustomLoader from 'components/loader';
import CustomPagination from 'components/pagination/Pagination';
import Noitems from 'components/no-items';

const SubscriptionProductsList = () => {
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleOpenSnackbar } = useSnackbar();

    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<SubscriptionProduct[]>([]);
    const [orderMeta, setOrderMeta] = useState<Order>({ order: 'asc', orderBy: '_id' });
    const [pageMeta, setPageMeta] = useState<Page>({ page: 0, count: 1, rowsPerPage: 5 });
    const [meta, setMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [count, setCount] = useState<number>(0);

    const { SUBSCRIPTION_PRODUCT_LIST, REMOVE_SUBSCRIPTION_PRODUCT } = useGQL();
    const { error, loading, data, refetch } = SUBSCRIPTION_PRODUCT_LIST({
        searchText: '',
        limit: 5,
        skip: 0,
        order: 'asc',
        orderBy: '_id'
    });
    const [triggerDelete, { data: deleteData }] = REMOVE_SUBSCRIPTION_PRODUCT();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    const [subscriptionDeleteId, setSubscriptionDeleteId] = useState('');

    useEffect(() => {
        if (data) {
            setRows(data?.findSubscriptionProducts?.data);
            // setPageMeta({ ...pageMeta, count: data.findSubscriptionProducts.pagination.total });
            setCount(data.findSubscriptionProducts.pagination.total);
        }
    }, [data]);

    useEffect(() => {
        if (deleteData?.removeSubscriptionProduct.message) {
            handleOpenSnackbar({ message: deleteData?.removeSubscriptionProduct.message, alertType: 'success' });
            handleRefetch();
        }
    }, [deleteData]);

    useEffect(() => {
        /* set page meta */
        // const { page, rowsPerPage } = pageMeta;
        const { order, orderBy } = orderMeta;
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip, order, orderBy } });
    }, [rowsPerPage]);

    useEffect(() => {
        /* set page meta */
        // const { page, rowsPerPage } = pageMeta;
        const { order, orderBy } = orderMeta;
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        /* handle refetch here */
        handleRefetch();
    }, [orderMeta.orderBy, orderMeta.order, search]);

    const handleRefetch = () => {
        refetch({
            input: { searchText: search, limit: meta?.limit, skip: meta?.skip, order: orderMeta.order, orderBy: orderMeta.orderBy }
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
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleDelete = async () => {
        triggerDelete({ variables: { id: subscriptionDeleteId } }).catch((err: any) => handleOpenSnackbar({ message: err.message, alertType: 'error' }));
        dispatch(closeModal());
    };

    const handleOpenModal = (id: string) => {
        setSubscriptionDeleteId(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    }

    const handleEdit = (id: string) => {
        navigate(`/subscription-products/edit/${id}`);
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Subscription Products List</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={gridSpacing}>
                            <Button component={Link} to="/subscription-products/add" variant="outlined">
                                Add Subscription Products
                            </Button>
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
                                                {/* table cells render data */}
                                                {/* <TableCell>{pageMeta.page === 0 ? index + 1 : index + meta.skip + 1}</TableCell> */}
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>{row.isActive ? 'active' : 'inactive'}</TableCell>
                                                <TableCell>
                                                    {date.format(new Date(row.createdAt), 'ddd, MMM DD YYYY')}
                                                </TableCell>
                                                <TableCell>
                                                    {date.format(new Date(row.updatedAt), 'ddd, MMM DD YYYY')}
                                                </TableCell>

                                                {/* table cells icon buttons */}
                                                <TableCell align="right">
                                                    <IconButton className='action-button' onClick={() => handleEdit(row._id)} color="primary" size="large">
                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                    </IconButton>
                                                    &nbsp;
                                                    <IconButton className='action-button' onClick={() => handleOpenModal(row._id)} color="error" size="large">
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
                            rowsPerPageOptions={[1, 5, 10, 15]}
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
                title="Delete Subscription Product"
                content="Are you sure you want to delete the subscription product ?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

export default SubscriptionProductsList;
