import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { useAccordion } from 'hooks/common/useAccordion';

type PropTypes = {
    _id: string;
    question: string;
    answer: string;
};
export default function ControlledAccordions({ _id, question, answer }: Partial<PropTypes>) {
    const { expanded, handleChange } = useAccordion();
    return (
        <>
            <Accordion expanded={expanded === _id} onChange={handleChange(_id!)}>
                <AccordionSummary sx={{alignItems: 'flex-start', '.MuiAccordionSummary-expandIconWrapper': {marginTop: '12px'}}} expandIcon={<ExpandMoreIcon />} aria-controls={`panel-content-${_id}`} id={`panel-header-${_id}`}>
                    <Typography sx={{flexShrink: 1, fontWeight: 400 }} variant="h4">
                        {question}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Answer variant="body1">{answer}</Answer>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

const Answer = styled(({ ...props }) => <Typography {...props} />)`
    font-size: 0.9rem;
    padding: 0.3em 0.5em;
    box-sizing: border-box;
`;
