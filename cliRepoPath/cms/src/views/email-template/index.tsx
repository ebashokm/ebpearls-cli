import React, { useState, useEffect } from 'react';
// material-ui
import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

/* queries */
import FailureLoad from 'components/spinner/fail';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import { Link, useNavigate } from 'react-router-dom';
import useSnackbar from 'hooks/common/useSnackbar';
import { EmailTemplate } from './types';
import { useGQL } from './hooks/useGQL';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { PlusIcon } from 'components/icons';

import { ArrangementOrder } from 'types';
import useTable from 'hooks/common/useTable';
import { headCells } from './constants';
import { useDispatch } from 'react-redux';
import ConfirmModal from 'components/modal/ConfirmModal';
import { closeModal, openModal } from 'store/slices/modal';
import MainCard from 'ui-component/cards/MainCard';
import CustomPagination from 'components/pagination/Pagination';
import CustomLoader from 'components/loader';
import Noitems from 'components/no-items';

// ==============================|| CUSTOMER LIST ||============================== //

const EmailTemplateList = () => {
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleOpenSnackbar } = useSnackbar();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setPage(0);
            setSearchText(event?.target.value);
        }
    });

    const { GET_TEMPLATES_LIST, REMOVE_TEMPLATE } = useGQL();
    const { error, loading, data, refetch } = GET_TEMPLATES_LIST();
    const [handleRemoveTemplate, { data: removeTemplateData }] = REMOVE_TEMPLATE();

    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [searchText, setSearchText] = useState<string>('');
    const [rows, setRows] = useState<EmailTemplate[]>([]);
    const [count, setCount] = useState<number>(1);
    const [deleteEmailTemplate, setDeleteEmailTemplate] = useState('');

    useEffect(() => {
        if (data?.getAllEmailTemplates) {
            setRows(data.getAllEmailTemplates.emailTemplates);
            setCount(data.getAllEmailTemplates?.pagination?.total!);
        }
    }, [data]);

    useEffect(() => {
        if (removeTemplateData?.removeEmailTemplate) {
            handleOpenSnackbar({ message: removeTemplateData.removeEmailTemplate.message, alertType: 'success' });
        }
        handleRefetch();
    }, [removeTemplateData]);

    useEffect(() => {
        const skip = page > 0 ? rowsPerPage * page : 0;
        refetch({ input: { searchText, limit: rowsPerPage, skip, order, orderBy } });
    }, [page]);

    useEffect(() => {
        handleRefetch();
    }, [orderBy, order, searchText, rowsPerPage]);

    /* handle refetch  */
    const handleRefetch = () => {
        refetch({ input: { limit: rowsPerPage, skip: searchText.length > 0 ? 0 : page * rowsPerPage, order, orderBy, searchText } });
    };

    const handleRequestSort = (event: React.SyntheticEvent<Element, Event>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage - 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const handlePageMenuItemClick = (event) => {
        handleChangeRowsPerPage(event);
    };

    const handleDelete = async (id: string) => {
        try {
            await handleRemoveTemplate({ variables: { id: deleteEmailTemplate } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: removeTemplateData?.removeEmailTemplate?.message!, alertType: 'error' });
        }
    };

    const handleOpenModal = (id: string) => {
        setDeleteEmailTemplate(id);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleEdit = (id: string) => {
        navigate(`/email-template/edit/${id}`);
    };

    return (
        <MainCard
            title={
                <Grid container justifyContent={{ md: 'space-between' }} alignItems={{ md: 'center' }} spacing={2}>
                    <Grid item xs={12} md={5}>
                        <Typography variant="h2">Email Template</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack>
                            <TextField
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    )
                                }}
                                onChange={debouncedSearch}
                                placeholder="Search template"
                                size="small"
                            />
                            <Button component={Link} to="/email-template/add" variant="outlined" startIcon={<PlusIcon />}>
                                Add Template
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            <>
                <>
                    <TableContainer>
                        <>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    headCells={headCells}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                                {!loading && (
                                    <TableBody>
                                        {rows.length != 0 && (
                                            <>
                                                {rows.map((row, index) => (
                                                    <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        {/* table cells render data */}
                                                        <TableCell>{row.title}</TableCell>
                                                        <TableCell>{row.slug}</TableCell>
                                                        <TableCell>{row.subject}</TableCell>
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
                                            </>
                                        )}
                                    </TableBody>
                                )}
                            </Table>
                            {rows.length === 0 && (
                                <Noitems />
                            )}
                        </>
                    </TableContainer>
                    {loading ? <CustomLoader  /> : error ? <FailureLoad /> : null}
                    {/* table pagination */}
                    <CustomPagination
                        count={count}
                        onPageChange={handleChangePage}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onItemClick={handlePageMenuItemClick}
                        rowsPerPageOptions={[5, 10, 15]}
                    />
                </>
            </>
            <ConfirmModal
                title="Delete Email Template"
                content="Are you sure you want to delete email template ?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};
export default EmailTemplateList;
