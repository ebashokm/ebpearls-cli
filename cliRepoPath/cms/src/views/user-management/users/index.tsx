/* eslint no-underscore-dangle: 0 */

import React, { useState, useEffect, useMemo } from 'react';
// material-ui
import {
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TextField
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import { useDispatch, useSelector } from 'store';
import useAlertDialog from 'hooks/common/useAlertDialog';

// assets
import SearchIcon from '@mui/icons-material/Search';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import CloseIcon from '@mui/icons-material/Close';

import { ArrangementOrder, Users } from './constants/types';
import useTable from './hooks/useTable';
import { headCells } from './constants/variables';

/* queries */
// import { GET_ALL_USERS } from '../../../grapqhl/user/queries';
import FailureLoad from 'components/spinner/fail';
import useDebouncedSearch from './hooks/useDebounceSearch';
import { useNavigate } from 'react-router-dom';
import useGQL from './hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import CustomLoader from 'components/loader';

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerList = () => {
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const { getConfirmation } = useAlertDialog();
    const { handleOpenSnackbar } = useSnackbar();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    const { GET_USERS, DELETE_USER } = useGQL();
    const { error, loading, data, refetch } = GET_USERS();
    const [handleUserDelete, { data: deleteUserData }] = DELETE_USER();

    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<Users>([]);
    const [count, setCount] = useState<number>(1);
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>();

    useEffect(() => {
        if (data?.getAllUsers?.users && data?.getAllUsers?.pagination) {
            setRows(data.getAllUsers.users);
            setCount(data.getAllUsers.pagination.total);
        }
    }, [data]);

    const handleRefetch = () => {
        refetch({ input: { searchText: search, limit: pageMeta?.limit, skip: pageMeta?.skip, order, orderBy } });
    };

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setPageMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip, order, orderBy } });
    }, [rowsPerPage, page]);

    useEffect(() => {
        if (deleteUserData?.deleteUser) {
            handleOpenSnackbar({ message: deleteUserData.deleteUser.message, alertType: 'success' });
            handleRefetch();
        }
    }, [deleteUserData]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, search]);

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
    };

    const handleView = (id: string) => {
        navigate(`/user/profile/${id}`);
    };

    const handleDelete = async (id: string) => {
        const isConfirm = await getConfirmation({ title: 'Delete User', message: 'Are you sure you want to delete user ?' });
        if (isConfirm) {
            try {
                await handleUserDelete({ variables: { id } });
            } catch (err: any) {
                console.log(err);
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            }
        }
    };

    return (
        <MainCard title="User List" content={false}>
            {/* loading and error */}
            {error ? (
                <FailureLoad />
            ) : (
                <>
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={debouncedSearch}
                                    placeholder="Search User"
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>

                    {/* table */}

                    {loading ? (
                        <CustomLoader  />
                    ) : (
                        <>
                            <TableContainer>
                                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                    <EnhancedTableHead
                                        headCells={headCells}
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    {error ? (
                                        <FailureLoad />
                                    ) : (
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell align="center">{row.name}</TableCell>
                                                    <TableCell align="center">{row.email}</TableCell>
                                                    <TableCell align="center">{row.phone}</TableCell>
                                                    <TableCell align="center">{row.admin?.name}</TableCell>
                                                    <TableCell align="center" sx={{ pr: 3 }}>
                                                        <IconButton onClick={() => handleView(row._id)} color="primary" size="large">
                                                            <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDelete(row._id)} color="error" size="large">
                                                            <CloseIcon sx={{ fontSize: '1.3rem' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>

                            {/* table pagination */}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 15]}
                                component="div"
                                count={count}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </>
            )}
        </MainCard>
    );
};

export default CustomerList;
