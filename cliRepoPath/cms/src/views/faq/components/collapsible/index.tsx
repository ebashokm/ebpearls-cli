import { Collapse } from '@mui/material';
import { useCollapsible } from 'hooks/common/useCollapsible';

type Props = {
    children: React.ReactElement;
};
const CollapsibleContent = ({ children }: Props) => {
    const { expanded } = useCollapsible();
    return <Collapse in={expanded}>{children}</Collapse>;
};

export default CollapsibleContent;
