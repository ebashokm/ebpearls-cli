import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton, InputAdornment, Menu, MenuItem, Stack, Table, TableBody, TableCell, TableRow, TextField, Typography, alpha, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import _debounce from 'lodash.debounce';

import Chip from 'ui-component/extended/Chip';
import useGQL from './hooks/useGQL';

import useTable from './hooks/useTable';
import useSnackbar from 'hooks/common/useSnackbar';
import useDebouncedSearch from './hooks/useDebounceSearch';

import { IconAlertTriangle } from '@tabler/icons-react';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import { headCells } from './constants/variables';
import { AppUser, ArrangementOrder } from './constants/types';
import { dispatch } from 'store';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import CustomPagination from 'components/pagination/Pagination';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import CustomLoader from 'components/loader';
import { PlusIcon, SearchIcon } from 'components/icons';
import Noitems from 'components/no-items';

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerList = () => {
    const theme = useTheme();
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    const { GET_USERS, DELETE_USER } = useGQL();
    const { error, loading, data, refetch } = GET_USERS();
    const [handleDeleteUser, { error: deleteErr, loading: deleteLoading, data: deleteUser }] = DELETE_USER();

    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<AppUser[]>([]);
    const [count, setCount] = useState<number>(0);
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });

    const [selected, setSelected] = useState('');

    useEffect(() => {
        if (data?.getAllAppUsers?.users && data?.getAllAppUsers?.pagination) {
            setRows(data.getAllAppUsers.users);
            setCount(data.getAllAppUsers.pagination.total);
        }
    }, [data]);

    const handleRefetch = () => {
        refetch({ input: { searchText: search, limit: pageMeta?.limit, skip: search.length > 0 ? 0 : pageMeta?.skip, order, orderBy } });
    };

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setPageMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = 0;
        setPageMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip: search.length > 0 ? 0 : skip, order, orderBy } });
    }, [rowsPerPage]);

    useEffect(() => {
        if (deleteUser?.deleteAppUser) {
            handleOpenSnackbar({ message: deleteUser.deleteAppUser.message, alertType: 'success' });
            handleRefetch();
        }
    }, [deleteUser]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, search]);

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const handleView = (id: string) => {
        navigate(`/app-user/profile/${id}`, { replace: true });
    };

    const handleDelete = async (id: string) => {
        try {
            await handleDeleteUser({ variables: { id: selected } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = (id: string) => {
        setSelected(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const formStatus = (status: string) => {
        return status.replace(/_/g, " ");
    }

    const getChip = (status: string) => {
        status = formStatus(status);
        if (status === 'password set' || status === 'email verified') {
            return <Chip label={status} color="success" />;
        }
        if (status === 'password set pending') {
            return <Chip label={status} color="error" />;
        }

        return '';
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">App User List</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={debouncedSearch}
                                placeholder="Search"
                                size="small"
                            />
                            <Button component={Link} to="/app-user/add" variant="outlined" startIcon={<PlusIcon />}>
                                Add new
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <TableContainer>
                <>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        {!loading && (
                            <TableBody>
                                {rows.length != 0 && (
                                    <>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.firstName === null ? '' : row.firstName}</TableCell>
                                                <TableCell>{row.lastName === null ? '' : row.lastName}</TableCell>
                                                <TableCell>{row.authProvider === 'email' && row.authProviderId}</TableCell>
                                                <TableCell>{row.authProvider === 'phone' && row.authProviderId}</TableCell>
                                                <TableCell>{getChip(row.status)}</TableCell>
                                                <TableCell align="right">
                                                    <PopupState variant="popover" popupId="action-menu">
                                                        {(popupState) => (
                                                            <>
                                                                <IconButton
                                                                    className="action-button"
                                                                    size="large"
                                                                    {...bindTrigger(popupState)}
                                                                    sx={{
                                                                        border: `1px solid ${theme.palette.primary.main}`,
                                                                        color: theme.palette.primary.main,
                                                                        '&:hover': {
                                                                            borderColor: alpha(theme.palette.primary.main, 0.32),
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.32),
                                                                            '.MuiSvgIcon-root': {
                                                                                color: 'background.paper'
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    <MoreHorizOutlinedIcon
                                                                        fontSize="small"
                                                                        aria-controls="menu-popular-card-1"
                                                                        aria-haspopup="true"
                                                                    />
                                                                </IconButton>
                                                                <Menu
                                                                    {...bindMenu(popupState)}
                                                                    anchorOrigin={{
                                                                        vertical: 'bottom',
                                                                        horizontal: 'right'
                                                                    }}
                                                                    transformOrigin={{
                                                                        vertical: 'top',
                                                                        horizontal: 'right'
                                                                    }}
                                                                >
                                                                    <MenuItem onClick={() => handleView(row._id)}>View</MenuItem>
                                                                    <MenuItem onClick={() => handleOpenModal(row._id)}>Delete</MenuItem>
                                                                </Menu>
                                                            </>
                                                        )}
                                                    </PopupState>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        )}
                    </Table>
                    {rows.length === 0 && !loading && (
                        <Noitems />
                    )}
                </>
            </TableContainer>
            {loading ? <CustomLoader /> : null}

            {/* table pagination */}
            <CustomPagination
                count={count}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                onItemClick={handlePageMenuItemClick}
                rowsPerPageOptions={[5, 10, 15]}
            />

            <ConfirmModal
                title="Are you sure you want to delete user"
                content="This will remove user from the system."
                yes={handleDelete}
                buttonLabelYes="Delete user"
                buttonLabelNo="Cancel and keep user"
                size="large"
                icon={<IconAlertTriangle color={theme.palette.orange.dark} />}
            />
        </MainCard>
    );
};

export default CustomerList;
