import { Button, Typography } from '@mui/material';
import styled from 'styled-components';
import MainCard from 'ui-component/cards/MainCard';

export const EditorWrap = styled('div')`
    height: 420px;
    margin-top: 1rem;
    border: 1px solid #eee;
    border-radius: 0.5em;
    display: grid;
    background: #fff;
    overflow: hidden;
`;
export const MetaText = styled('div')`
    color: rgba(0, 0, 0, 0.4);
    padding: 2px 3px;
    text-transform: capitalize;
    margin: 3px 0;
`;

// export const TextArea = styled(({ theme, ...otherProps }) => <textarea {...otherProps} />)`
//   display: ${(props) => (props.show ? '' : 'none')};
// `;

export const TextArea = styled.textarea<{ show: boolean }>`
    padding: 0.8em;
    display: ${(prop) => (prop.show ? '' : 'none')};
    // background: #eee;
    width: inherit;
    // height: 500px;
    border: none;
    flex-grow: 1;
    &:focus {
        outline: 0;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`;

export const SubmitButton = styled(({ props }) => <Button {...props} />)`
    margin-top: 2rem !important;
`;

export const ToolbarWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const CustomMainCard = styled(({ ...otherProps }) => <MainCard {...otherProps} />)`
    background: #e3f2fd;
    border: none;

    .MuiCardHeader-title {
        background-color: #fff;
        padding: 1rem;
        border-radius: 0.5em;
    }
`;
