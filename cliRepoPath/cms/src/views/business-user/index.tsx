import React, { useState, useEffect } from 'react';
// material-ui
import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import date from 'date-and-time';
// project imports

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Chip from 'ui-component/extended/Chip';

/* queries */
import CustomLoader from 'components/loader';
import useTable from 'hooks/common/useTable';
import { headCells, PaginationSortEnum, AdminRolesTypeEnum, ADD_BUSSINESS_USER_URL } from './constants';
import MainCard from 'ui-component/cards/MainCard';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { ArrangementOrder, BusinessUserListType } from './types';
// import { PageStatusEnum } from './constants/page-management-enum';
// import { PageManagementEditPath, PageManagementAddPath } from './constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useDebouncedSearch from './hooks/useDebounceSearch';
import { useGQL } from './hooks/useGQL';
import { SearchIcon } from 'components/icons';
import useSnackbar from './hooks/useSnackbar';
import ConfirmationDialog from './components/ConfirmationDialog';
import Noitems from 'components/no-items';
import CustomPagination from 'components/pagination/Pagination';


// ==============================|| CUSTOMER LIST ||============================== //

const BusinessUserList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { TableContainer, EnhancedTableHead } = useTable();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });
    
    const [order, setOrder] = useState<ArrangementOrder>(PaginationSortEnum.DESC);
    const [orderBy, setOrderBy] = useState<string>('id');
    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<BusinessUserListType[]>([]);
    const [selectedBusinessUserId, setSelectedBusinessUserId] = useState(null);
    const { handleOpenSnackbar } = useSnackbar();
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [count, setCount] = useState<number>(0);
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });

    const { GET_BUSINESS_USERS, DELETE_BUSINESS_USER } = useGQL();
    // const { loading: adminProfileLoading, data: adminProfileData } = GET_ADMIN_PROFILE();
    const { loading, data, refetch } = GET_BUSINESS_USERS();
    const [handleDeleteBusinessUser] = DELETE_BUSINESS_USER();

    // Refetch pages if redirected from add page
    useEffect(() => {
        if (location.state?.refetch) {
            refetch();
        }
    }, [location.state]);

    useEffect(() => {
        if (data?.listBusiness?.data) {
            setRows(data.listBusiness.data);
            setCount(data.listBusiness.pagination.total);
        }
    }, [data?.listBusiness?.data]);

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

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, search]);

    // const canEditOrDelete = () =>
    //     ![AdminRolesTypeEnum.SUPER_ADMIN, AdminRolesTypeEnum.ADMIN].includes(adminProfileData?.getUserProfile?.role);

    const handleRemoveBusinessUser = async () => {
        try {
            const response = await handleDeleteBusinessUser({
                variables: { deleteBusinessUserId: selectedBusinessUserId }
            });
            refetch();
            handleOpenSnackbar({ message: response?.data?.deleteBusinessUser?.message, alertType: 'success' });
            handleCloseModal();
        } catch (error: any) {
            handleOpenSnackbar({ message: error?.message, alertType: 'error' });
            handleCloseModal();
        }
    };

    const handleOpenModal = (id) => {
        setSelectedBusinessUserId(id);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        if(newPage === 0) {
            setPage(0)
        }else {
            setPage(newPage - 1);
        }
    };

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Business Users</Typography>
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
                                placeholder="Search Page"
                                size="small"
                            />
                            <Button component={Link} to={ADD_BUSSINESS_USER_URL} variant="outlined">
                                Add Business User
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            {/* table */}
            <TableContainer>
                <>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                        {!loading && (
                            <TableBody>
                                {rows.length != 0 && (
                                    <>
                                        {rows.map((row, index) => (
                                            <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                {/* table cells render data */}
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{date.format(new Date(row.createdAt!), 'ddd, MMM DD YYYY')}</TableCell>
                                                {/* table cells icon buttons */}
                                                <TableCell align="right">
                                                    <PopupState variant="popover" popupId="action-menu">
                                                        {(popupState) => (
                                                            <>
                                                                <IconButton className="action-button" {...bindTrigger(popupState)}>
                                                                    <MoreHorizOutlinedIcon
                                                                        fontSize="small"
                                                                        aria-controls="menu-popular-card-1"
                                                                        aria-haspopup="true"
                                                                    />
                                                                </IconButton>
                                                                <Menu {...bindMenu(popupState)}>
                                                                    <MenuItem
                                                                        // disabled={canEditOrDelete()}
                                                                        onClick={() => {
                                                                            navigate(`/business-user/edit/${row._id}`);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        // disabled={canEditOrDelete()}
                                                                        onClick={() => {
                                                                            handleOpenModal(row?._id);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </MenuItem>
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
                    {rows.length === 0 && !loading && <Noitems />}
                </>
            </TableContainer>
            {loading ? (
                <Stack alignItems={'center'}>
                    <CustomLoader />
                </Stack>
            ) : null}

            {/* table pagination */}
            <CustomPagination
                count={count}
                onPageChange={handleChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                onItemClick={handlePageMenuItemClick}
                rowsPerPageOptions={[5, 10, 15]}
            />
            {openModal ? (
                <ConfirmationDialog
                    open={openModal}
                    handleClose={handleCloseModal}
                    title={'Delete business user'}
                    content={'Are you sure you want to delete business user ?'}
                    yes={handleRemoveBusinessUser}
                    buttonLabelYes={'Yes'}
                    buttonLabelNo={'No'}
                />
            ) : null}
        </MainCard>
    );
};
export default BusinessUserList;
