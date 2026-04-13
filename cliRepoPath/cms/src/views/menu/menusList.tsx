import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableSortLabel,
    TableHead,
    Grid,
    Typography,
    Stack,
    Button
} from '@mui/material';
import Chip from 'ui-component/extended/Chip';
import useGQL from './hooks/useGQL';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';
import useSnackbar from 'hooks/common/useSnackbar';
import useTable from './hooks/useTable';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';

import { currentStatusProps, headCells } from './constants/menu';
import { ArrangementOrder } from 'types';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import { gridSpacing } from 'store/constant';
import { firstLetterUppercase } from 'utils/commonHelpers';
import CustomLoader from 'components/loader';
import CustomPagination from 'components/pagination/Pagination';

type ConfirmModalProps = {
    title: string;
    content: string;
    yes: any;
    no?: any;
    buttonLabelYes: string;
    buttonLabelNo?: string;
};

const PageList = () => {
    const dispatch = useDispatch();

    const { TableContainer } = useTable();
    const navigate = useNavigate();

    const { handleOpenSnackbar } = useSnackbar();

    const { LIST_MENUS, UPDATE_MENU_STATUS, DELETE_MENU } = useGQL();
    const { loading, data, refetch } = LIST_MENUS();
    const [deleteMenu, { data: deleteData }] = DELETE_MENU();
    const [handleUpdateMenuStatus] = UPDATE_MENU_STATUS();

    const [order, setOrder] = useState<ArrangementOrder>('desc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [searchText, setSearchText] = useState<string>('');
    const [modalObject, setModalObject] = useState<ConfirmModalProps>();
    const [count, setCount] = useState<number>(0);

    const [removeMenu, setRemoveMenu] = useState<string>('');
    const [currentStatus, setCurrentStatus] = useState({
        status: '',
        _id: ''
    });

    const handleRefetch = () => {
        refetch({ input: { limit: rowsPerPage, skip: searchText.length > 0 ? 0 : page * rowsPerPage, order, orderBy, searchText } });
    };

    useEffect(() => {
        const skip = page > 0 ? rowsPerPage * page : 0;
        refetch({ input: { searchText, limit: rowsPerPage, skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        handleRefetch();
    }, [order, orderBy, searchText, rowsPerPage]);

    useEffect(() => {
        if (deleteData?.deleteMenu) {
            handleOpenSnackbar({ message: deleteData.deleteMenu.message, alertType: 'success' });
        }
        handleRefetch();
    }, [deleteData]);

    useEffect(() => {
        if(data?.listMenus) {
            setCount(data?.listMenus?.pagination?.total);
        }
    },[data?.listMenus]);

    const handleEdit = (id: string) => {
        navigate(`/menu/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await deleteMenu({ variables: { id: removeMenu } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
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

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    if (loading) {
        return <CustomLoader  />;
    }

    const handleYes = () => {
        switch (modalObject?.yes) {
            case 'update':
                handleChangeStatus();
                break;
            case 'delete':
                handleDelete();
                break;
        }
    };

    const handleChangeStatus = () => {
        handleUpdateMenuStatus({
            variables: { id: currentStatus?._id, input: { status: currentStatus?.status === 'active' ? 'inactive' : 'active' } }
        })
            .then((success: any) => {
                handleOpenSnackbar({ message: success.data.updateMenuStatus.message, alertType: 'success' });
                handleRefetch();
                dispatch(closeModal());
            })
            .catch((err: any) => {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            });
    };

    const handleOpenModal = (id: string) => {
        setRemoveMenu(id);
        setModalObject({
            title: 'Delete Menu',
            content: 'Are you sure you want to delete this menu ?',
            yes: 'delete',
            buttonLabelYes: 'Yes',
            buttonLabelNo: 'No'
        });
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleStatusModal = (row: currentStatusProps) => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
        setCurrentStatus({ status: row?.status, _id: row?._id });
        setModalObject({
            title: 'Update Status',
            content: 'Are you sure you want to update status ?',
            yes: 'update',
            buttonLabelYes: 'Yes',
            buttonLabelNo: 'No'
        });
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Menu List</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={gridSpacing}>
                            <Button component={Link} to="/menu/add" variant="outlined">
                                Add Menu
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <TableContainer>
                <>
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
                            {data?.listMenus?.menus?.map((row: any, index: number) => (
                                <TableRow key={row._id}>
                                    <TableCell>{row.title}</TableCell>
                                    <TableCell>{row.menuPosition}</TableCell>
                                    <TableCell
                                        onClick={() => {
                                            handleStatusModal(row);
                                        }}
                                    >
                                        <Chip
                                            label={firstLetterUppercase(row.status)}
                                            size="medium"
                                            chipcolor={row.status === 'active' ? 'success' : 'error'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            className="action-button"
                                            color="primary"
                                            size="large"
                                            onClick={(event) => handleEdit(row._id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        &nbsp;
                                        <IconButton
                                            className="action-button"
                                            size="large"
                                            color="error"
                                            onClick={() => handleOpenModal(row._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <CustomPagination
                        count={count}
                        onPageChange={handleChangePage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onItemClick={handlePageMenuItemClick}
                        rowsPerPageOptions={[5, 10, 15]}
                    />
                </>
            </TableContainer>

            {modalObject && (
                <ConfirmModal
                    title={modalObject.title}
                    content={modalObject.content}
                    yes={handleYes}
                    buttonLabelYes="Yes"
                    buttonLabelNo="No"
                />
            )}
        </MainCard>
    );
};

export default PageList;
