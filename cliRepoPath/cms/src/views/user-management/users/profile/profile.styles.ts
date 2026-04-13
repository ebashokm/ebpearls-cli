import { Grid } from '@mui/material';
import styled from 'styled-components';

export const TextArea = styled.textarea`
    width: 100%;
    border-radius: 8px;
    padding: 1em;
    &:focus {
        border: 1px solid #1cb1f5;
        background-color: transparent;
        resize: none;
        outline: none;
    }
`;

export const GridContainer = styled(Grid)`
    display: flex;
    align-items: center;
    justify-content: center;
`;
