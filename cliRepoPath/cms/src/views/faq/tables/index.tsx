import React, { useState, useEffect, useMemo } from 'react';
import { IconButton, Table, TableBody, TableCell, TablePagination, TableRow, Link as MuiLink, Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import date from 'date-and-time';

import FailureLoad from 'components/spinner/fail';
import { FilterList } from './Filter';

import useTable from 'hooks/common/useTable';
import useSnackbar from 'hooks/common/useSnackbar';
import { useGQL } from '../hooks/useGQL';
import useDebouncedSearch from 'hooks/common/useDebounceSearch';
import useAlertDialog from 'hooks/common/useAlertDialog';

import { FAQ } from '../types';
import { headCells } from '../constants';
import { ArrangementOrder } from 'types';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'ui-component/cards/MainCard';
import { TableCellCenter } from 'components/table/table.styles';
import CustomLoader from 'components/loader';

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerList = () => {
    const [textConfig, setTextConfig] = useState<{ id: string; show: boolean }>({ id: '', show: false });
    const { TableContainer, EnhancedTableHead } = useTable();
    const navigate = useNavigate();
    const { handleOpenSnackbar } = useSnackbar();
    const { getConfirmation } = useAlertDialog();

    const [debouncedSearch] = useDebouncedSearch((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        if (event) {
            setSearch(event?.target.value);
        }
    });

    /* graphql API calls */
    const { GET_ALL_FAQS, DELETE_ON_FAQ_ID } = useGQL();
    const { error, loading, data, refetch } = GET_ALL_FAQS({
        searchText: '',
        order: 'asc',
        orderBy: 'section',
        limit: 5,
        skip: 0
    });
    const [handleDeleteFAQ, { data: deleteData }] = DELETE_ON_FAQ_ID();

    const [order, setOrder] = useState<ArrangementOrder>('asc');
    const [orderBy, setOrderBy] = useState<string>('_id');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [search, setSearch] = useState<string>('');
    const [rows, setRows] = useState<FAQ[]>([]);
    const [count, setCount] = useState<number>(1);
    const [pageMeta, setPageMeta] = useState<{ limit: number; skip: number }>({ limit: 5, skip: 0 });

    useEffect(() => {
        if (data?.getAllFAQ) {
            setRows(data.getAllFAQ.faqs!);
            setCount(data.getAllFAQ.pagination?.total!);
        }
    }, [data]);

    useEffect(() => {
        if (deleteData?.deleteFAQById) {
            handleRefetch();
            handleOpenSnackbar({ message: deleteData.deleteFAQById.message, alertType: 'success' });
        }
    }, [deleteData]);

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page > 0 ? limit * page : 0;
        setPageMeta({ limit, skip });
        refetch({ input: { searchText: search, limit, skip, order, orderBy } });
    }, [rowsPerPage, page]);

    useEffect(() => {
        /* handle refetch here */
        handleRefetch();
    }, [orderBy, order, search]);

    /* handle refetch  */
    const handleRefetch = () => {
        refetch({ input: { searchText: search, limit: pageMeta.limit, skip: pageMeta.skip, order, orderBy } });
    };

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

    const handleDelete = async (id: string) => {
        const isConfirm = await getConfirmation({
            title: 'Delete FAQ',
            message: 'Are you sure you want to delete the FAQ ?'
        });

        if (isConfirm) {
            try {
                await handleDeleteFAQ({ variables: { docId: id } });
            } catch (err: any) {
                handleOpenSnackbar({ message: err.message, alertType: 'error' });
            }
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/faq/edit/${id}`);
    };

    const handleShowText = (id: string) => {
        if (textConfig.id === id) {
            setTextConfig({ id, show: !textConfig.show });
        } else {
            setTextConfig({ id, show: true });
        }
    };

    return (
        <MainCard title="Manage FAQ" content={false}>
            <>
                <FilterList debouncedSearch={debouncedSearch} />
                {/* table */}
                {loading ? (
                    <CustomLoader  />
                ) : error ? (
                    <FailureLoad />
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
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            {/* table cells render data */}
                                            <TableCellCenter>{page === 0 ? index + 1 : index + pageMeta.skip + 1}</TableCellCenter>
                                            <TableCellCenter>{row.section}</TableCellCenter>
                                            <TableCellCenter width={400}>
                                                {row.description}
                                            </TableCellCenter>
                                            <TableCellCenter>{date.format(new Date(row.createdAt), 'ddd, MMM DD YYYY')}</TableCellCenter>
                                            <TableCellCenter>{date.format(new Date(row.updatedAt), 'ddd, MMM DD YYYY')}</TableCellCenter>

                                            {/* table cells icon buttons */}
                                            <TableCellCenter sx={{ pr: 3 }}>
                                                <IconButton onClick={() => handleEdit(row._id)} color="primary" size="large">
                                                    <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>

                                                <IconButton onClick={() => handleDelete(row._id)} color="error" size="large">
                                                    <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                                                </IconButton>
                                            </TableCellCenter>
                                        </TableRow>
                                    ))}
                                </TableBody>
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
        </MainCard>
    );
};

export default CustomerList;
