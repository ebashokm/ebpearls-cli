/* eslint no-underscore-dangle: 0 */
/* eslint no-nested-ternary: 0 */

import React, { useState, useEffect } from 'react';
import date from 'date-and-time';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Menu,
    MenuItem,
    FormControlLabel,
    Grid,
    Pagination,
    Stack,
    Button,
    Box,
    TableHead,
    TableSortLabel,
    RadioGroup,
    Radio,
    Typography
} from '@mui/material';

import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import FailureLoad from 'components/spinner/fail';
// import { Button as CustomButton } from './forms/addPage/page-add.styles';

import { useGQL } from './hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import useTable from './hooks/useTable';

import { headCells } from './constants/page';
import { RootState } from 'store';
import { visuallyHidden } from '@mui/utils';
import { setSort, setPage, setRowsPerPage } from 'store/slices/table';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Chip from 'ui-component/extended/Chip';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

import PaginationItem from '@mui/material/PaginationItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// assets
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CustomMainCard } from './customMainCard';
import { PageStatus } from './types/types';
import { FilterList } from './filter';
import { resetForm } from 'store/slices/form';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import CustomLoader from 'components/loader';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

const filterButtonStyles = {
    background: 'none',
    color: '#E1B8B2',
    border: '1px solid #E1B8B2',
    borderRadius: '0'
};

type pageManagementProps = {
    _id: string;
    status: string;
};

const statusMap = {
    active: 'ACTIVE',
    inactive: 'INACTIVE'
};

const AdvancePageList = () => {
    const {
        sort: { order, orderBy }
    } = useSelector((state: RootState) => state.table);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { TableContainer } = useTable();
    const { handleOpenSnackbar } = useSnackbar();
    const rootDispatch = useDispatch();

    const rowsPerPageOptions = [
        { value: 5, label: 5 },
        { value: 10, label: 10 },
        { value: 25, label: 25 }
    ];

    const { LIST_PAGES, UPDATE_PAGE } = useGQL();
    const { error, loading, data, refetch } = LIST_PAGES();
    const [updatePage, { loading: updateLoading, data: updateData }] = UPDATE_PAGE();
    const { searchText, page, rowsPerPage, sort } = useSelector((state: RootState) => state.table);
    const [search, setSearch] = useState<string>('');
    const [valueLabel, setValueLabel] = useState('');
    const [meta, setMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });
    const [count, setCount] = useState<number>(1);
    const [pages, setPages] = useState<any>();

    const [filter, setFilter] = useState({
        search: '',
        sort: 'asc'
    });

    const FilterOptions = [
        {
            value: '',
            label: 'All'
        },
        {
            value: 'active',
            label: 'Active'
        },
        {
            value: 'inactive',
            label: 'Disabled'
        }
    ];

    const filterLabel = FilterOptions.filter((items) => items.value === filter.sort);

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            dispatch(setPage(0));
            setSearch(event?.target.value);
        }
    });

    const handleRefetch = () => {
        refetch({
            input: {
                limit: meta?.limit,
                skip: searchText.length > 0 ? 0 : page * rowsPerPage,
                order: sort.order,
                orderBy: sort.orderBy,
                searchText: search,
                ...(valueLabel && { status: statusMap[valueLabel] })
            }
        });
    };

    useEffect(() => {
        sessionStorage.clear();
        rootDispatch(resetForm());
    }, []);

    useEffect(() => {
        if (data?.listAdvancePages) {
            setPages(data?.listAdvancePages.pages);
            setCount(data.listAdvancePages.pagination.total);
        }
    }, [data]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setMeta({ limit, skip });
        refetch({
            input: {
                limit,
                skip,
                order: sort.order,
                orderBy: sort.orderBy,
                searchText: search,
                ...(valueLabel && { status: statusMap[valueLabel] })
            }
        });
    }, [rowsPerPage, page]);

    useEffect(() => {
        handleRefetch();
    }, [order, orderBy, search, valueLabel]);

    const handleEdit = async (event: any | null, id: string) => {
        navigate(`/advance-page/edit/${id}`);
    };

    const [currentStatus, setCurrentStatus] = useState({ _id: '', status: '' });

    const handleStatus = async () => {
        setAnchorEl(null);
        const selection = data?.listPages?.pages.find((pageElem) => pageElem._id === currentStatus._id);

        try {
            const updatedStatus = await updatePage({
                variables: {
                    id: currentStatus._id,
                    input: {
                        status: selection?.status === 'ACTIVE' ? 'inactive' : 'active'
                    }
                }
            });
            if (updatedStatus) {
                handleOpenSnackbar({ message: 'Status updated successfully', alertType: 'success' });
                dispatch(closeModal());
                handleRefetch();
            }
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = (page: pageManagementProps) => {
        setCurrentStatus({
            _id: page._id,
            status: page.status
        });
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        const setOrder = isAsc ? 'desc' : 'asc';
        dispatch(setSort({ order: setOrder, orderBy: property }));
    };

    const handleChangePage = (event, newPage) => {
        dispatch(setPage(newPage - 1));
    };

    const handleChangeRowsPerPage = (event) => {
        if (event?.target?.value) {
            dispatch(setRowsPerPage(parseInt(event.target.value, 10)));
            dispatch(setPage(0));
        }
    };

    // sort options
    const [anchorEl, setAnchorEl] = useState(null);
    const openSort = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Pagination

    const [anchor, setAnchor] = useState(null);

    const handleClickPage = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleClosePage = () => {
        setAnchor(null);
    };
    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
        setAnchor(null);
    };

    const handleFilterMenuItemClick = (event, index) => {
        // this is to show active radio button

        if (index === '') {
            setValueLabel(index);
        }
        if (index === 'active') {
            setValueLabel(PageStatus.ACTIVE);
        }
        if (index === 'inactive') {
            setValueLabel(PageStatus.INACTIVE);
        }
        setFilter({ ...filter, sort: index });
        dispatch(setPage(0));
        setAnchorEl(null);
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Page Management</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={gridSpacing}>
                            <Button component={Link} to="/advance-page/add" variant="outlined">
                                Add Page
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <Stack direction="row" alignItems="center" sx={{ mb: 0 }}>
                <FilterList debouncedSearch={debouncedSearch} />
                <Stack direction="row" spacing={3} pr={4}>
                    <Button
                        aria-expanded={openSort ? 'true' : undefined}
                        sx={filterButtonStyles}
                        onClick={handleClickListItem}
                        startIcon={<FilterAltIcon />}
                    >
                        Filter:&nbsp;
                        {filterLabel.length > 0 ? filterLabel[0].label : 'All'}
                    </Button>
                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={openSort}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                    >
                        {FilterOptions.map((option, index) => (
                            <RadioGroup
                                sx={{ pl: 1.5 }}
                                key={index}
                                value={valueLabel}
                                defaultValue="all"
                                onClick={(event) => handleFilterMenuItemClick(event, option.value)}
                            >
                                <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
                            </RadioGroup>
                        ))}
                    </Menu>
                </Stack>
            </Stack>
            {/* table */}
            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => {
                                if (headCell.id === '6' || headCell.id === '1') {
                                    return (
                                        <TableCell key={headCell.id} align={headCell.align} padding={headCell.padding}>
                                            {headCell.label}
                                        </TableCell>
                                    );
                                }
                                if (headCell.id !== '6' && headCell.id !== '1') {
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
                                }
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && !error && (
                            <>
                                {pages &&
                                    pages.map((row: any, index: number) => (
                                        <TableRow key={row._id}>
                                            <TableCell align="center" sx={{ pr: 3 }}>
                                                {page === 0 ? index + 1 : index + page * rowsPerPage + 1}
                                            </TableCell>
                                            <TableCell align="center" sx={{ pr: 4 }}>
                                                {row.title || ''}
                                            </TableCell>
                                            <TableCell align="center" sx={{ pr: 5 }}>
                                                {row.createdBy || 'Admin'}
                                            </TableCell>
                                            <TableCell align="center" style={{ textTransform: 'capitalize' }} sx={{ pr: 3 }}>
                                                {PageStatus[row.status] === PageStatus.ACTIVE && (
                                                    <Chip label="active" size="medium" chipcolor="success" />
                                                )}
                                                {PageStatus[row.status] === PageStatus.INACTIVE && (
                                                    <Chip label="disabled" size="medium" chipcolor="error" />
                                                )}
                                            </TableCell>
                                            <TableCell align="center" sx={{ pr: 4 }}>
                                                {date.format(new Date(row.createdAt), 'DD/MM/YYYY')}
                                            </TableCell>
                                            <TableCell align="center" sx={{ pr: 3 }}>
                                                <PopupState variant="popover" popupId="demo-popup-menu">
                                                    {(popupState) => (
                                                        <span aria-hidden="true">
                                                            <IconButton size="large" {...bindTrigger(popupState)}>
                                                                <MoreHorizOutlinedIcon
                                                                    fontSize="small"
                                                                    aria-controls="menu-popular-card-1"
                                                                    aria-haspopup="true"
                                                                    sx={{ color: 'grey.500' }}
                                                                />
                                                            </IconButton>
                                                            <Menu {...bindMenu(popupState)}>
                                                                <MenuItem onClick={(event) => handleEdit(event, row._id)}>Edit</MenuItem>
                                                                <MenuItem onClick={() => handleOpenModal(row)}>
                                                                    {PageStatus[row.status] === PageStatus.ACTIVE ? 'Disable' : 'Activate'}
                                                                </MenuItem>
                                                            </Menu>
                                                        </span>
                                                    )}
                                                </PopupState>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {pages?.length === 0 && (
                                    <TableRow>
                                        <TableCell align="center" colSpan={6}>
                                            <Typography component="h1">{'No matching result found.'}</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {loading ? <CustomLoader /> : error ? <FailureLoad /> : null}
            {/* table pagination */}
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Pagination
                            count={Math.ceil(count / rowsPerPage)}
                            color="primary"
                            onChange={handleChangePage}
                            defaultPage={page + 1}
                            renderItem={(item) => (
                                <PaginationItem components={{ previous: KeyboardArrowLeftIcon, next: KeyboardArrowRightIcon }} {...item} />
                            )}
                            hidePrevButton={page === 0}
                        />
                    </Grid>
                    <Grid item>
                        <Button size="large" className="pagination-button" endIcon={<ExpandMoreIcon />} onClick={handleClickPage}>
                            <span>Show&nbsp;</span> {rowsPerPage} per page
                        </Button>
                        <Menu
                            id="menu-user-list-style1"
                            anchorEl={anchor}
                            keepMounted
                            open={Boolean(anchor)}
                            onClose={handleClosePage}
                            variant="selectedMenu"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                        >
                            {rowsPerPageOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} onClick={(event) => handlePageMenuItemClick(event)}>
                                    {option.label} rows
                                </MenuItem>
                            ))}
                        </Menu>
                    </Grid>
                </Grid>
            </Grid>
            <ConfirmModal
                title="Change Page Status"
                content={
                    currentStatus?.status === 'ACTIVE'
                        ? 'Are you sure you want to deactivate this page?'
                        : 'Are you sure you want to activate this page?'
                }
                yes={handleStatus}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

export default AdvancePageList;
