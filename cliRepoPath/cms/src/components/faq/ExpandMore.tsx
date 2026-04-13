import { IconButton } from '@mui/material';
import styled from 'styled-components';


import { useCollapsible } from 'hooks/common/useCollapsible';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandMoreComponent = () => {
    const { expanded, handleExpandClick } = useCollapsible();
    return (
        <ExpandMore expand={expanded ? 'true' : 'false'} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <ExpandMoreIcon />
        </ExpandMore>
    );
};

export default ExpandMoreComponent;

export const ExpandMore = styled(({ ...props }) => <IconButton {...props} />)`
    position: relative;
    transform: ${(props) => (!JSON.parse(props.expand) ? 'rotate(0deg)' : 'rotate(180deg)')};
    transition: transform 0.2s ease-in-out;
`;
