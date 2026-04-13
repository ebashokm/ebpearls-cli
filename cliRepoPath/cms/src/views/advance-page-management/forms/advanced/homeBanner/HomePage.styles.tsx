import { Grid } from '@mui/material';
import styled from 'styled-components';

export const GridContainer = styled(({ ...props }) => <Grid {...props} />)`
    position: absolute;
    right: 0;
    top: 12px;
    display: flex;
    justify-content: flex-end;
`;
