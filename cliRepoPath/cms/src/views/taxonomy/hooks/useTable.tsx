import { TableCell, TableContainer as MuiTableContainer, TableHead as MuiTableHead, TableRow } from '@mui/material';
import { HeadCell } from '../types/taxanomy';

type Children = {
    children: React.ReactElement;
};

type TableHeadProps = {
    headCells: HeadCell[];
};

const useTable = () => {
    const TableContainer = ({ children }: Children) => {
        return (
            <MuiTableContainer>
                {children}
            </MuiTableContainer>
        );
    };

    const TableHead = ({ headCells }: TableHeadProps) => {
        return (
            <MuiTableHead sx={{ height: '50px' }}>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell key={headCell.id} id={headCell.id} align={headCell.align} padding={headCell.padding}>
                            {headCell.label}
                        </TableCell>
                    ))}
                </TableRow>
            </MuiTableHead>
        );
    };

    return { TableContainer, TableHead };
};

export default useTable;
