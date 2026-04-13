import { useState } from 'react';
import { Button, Link, Typography } from '@mui/material';
import styled from 'styled-components';

type PropTypes = {
    text: string;
};
const ShowMore = ({ text }: PropTypes) => {
    const [show, setShow] = useState(false);
    return (
        <Typography variant="body2">
            {show ? text : `${text.slice(0, 150)}...`}
            <Link component={Button} onClick={() => setShow(!show)}>
                {show ? `show less` : 'show more'}
            </Link>
        </Typography>
    );
};

export const ShowMoreBtn = styled(({ ...otherProps }) => <Button {...otherProps} />)`
    display: inline;
    text-decoration: underline;
    text-transform: capitalize;

    :hover {
        text-decoration: underline;
    }
`;
export default ShowMore;
