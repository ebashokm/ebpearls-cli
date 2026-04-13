import React, { useEffect, useState } from 'react';
import { Button, Collapse, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';

import { useGQL } from './hooks/useGQL';
import useSnackbar from 'hooks/common/useSnackbar';
import { Link, useNavigate } from 'react-router-dom';

import AccordionProvider from 'contexts/AccordionContext';
import CollapsibleProvider from 'contexts/CollapsibleContext';

import FailureLoad from 'components/spinner/fail';
import ControlledAccordions from 'components/faq/Accordion';
import MainCard from 'ui-component/cards/MainCard';
import ExpandMoreComponent from 'components/faq/ExpandMore';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import { FAQ } from './types';
import { dispatch } from 'store';
import { closeModal, openModal } from 'store/slices/modal';
import ConfirmModal from 'components/modal/ConfirmModal';
import { gridSpacing } from 'store/constant';
import CustomLoader from 'components/loader';
import { useCollapsible } from 'hooks/common/useCollapsible';

const FAQAccordionList = () => {
    const { handleOpenSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [list, setList] = useState<FAQ[]>();

    const { FIND_ALL_FAQS, DELETE_ON_FAQ_ID } = useGQL();
    /* default groups with _id = section */
    const { error, loading, data, refetch } = FIND_ALL_FAQS();

    const [handleDeleteFAQ, { data: deleteData }] = DELETE_ON_FAQ_ID();

    const [removeFaq, setRemoveFaq] = useState('');

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (data?.findAllFAQ) {
            setList(data.findAllFAQ.faqs);
        }
    }, [data]);

    useEffect(() => {
        if (deleteData?.deleteFAQById) {
            refetch();
            handleOpenSnackbar({ message: deleteData.deleteFAQById.message, alertType: 'success' });
        }
    }, [deleteData]);

    const handleDelete = async () => {
        try {
            await handleDeleteFAQ({ variables: { docId: removeFaq } });
            dispatch(closeModal());
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
        }
    };

    const handleOpenModal = (removeFaq: string) => {
        setRemoveFaq(removeFaq);
        dispatch(
            openModal({
                isOpen: true
            })
        );
    }

    const handleEdit = (id: string) => {
        navigate(`/faq/edit/${id}`);
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">FAQ List</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={gridSpacing}>
                            <Button component={Link} to="/faq/add" variant="outlined">
                                Add FAQ
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            }
        >
            {loading ? (
                <CustomLoader  />
            ) : error ? (
                <FailureLoad />
            ) : (
                list?.map(({ _id, section, description, content }) => (
                    <React.Fragment key={_id}>
                        <CollapsibleProvider>
                            <Stack direction={'row'} alignItems={'flex-start'}>
                                <Typography variant="h5" flex="1" textTransform={'capitalize'} pt={2}>{section}</Typography>
                                <Stack direction="row">
                                    <IconButton onClick={() => handleEdit(_id)} color="primary" size="large">
                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenModal(_id)} color="error" size="large">
                                        <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                                    </IconButton>
                                    <ExpandMoreComponent />
                                </Stack>
                            </Stack>
                            <CollapsibleContent {...{ description, content }} />
                        </CollapsibleProvider>
                    </React.Fragment>
                ))
            )}
            <ConfirmModal
                title="Delete FAQ"
                content="Are you sure you want to delete the FAQ ?"
                yes={handleDelete}
                buttonLabelYes="Yes"
                buttonLabelNo="No"
            />
        </MainCard>
    );
};

const CollapsibleContent = ({ description, content }: any) => {
    const { expanded } = useCollapsible();
    return (
        <Collapse in={expanded}>
            <Typography variant="subtitle2">{description}</Typography>
            <Divider />
            <AccordionProvider>
                {content.map((values: any, index: number) => (
                    <ControlledAccordions key={values._id + index} {...values} />
                ))}
            </AccordionProvider>
        </Collapse>
    );
};

export default FAQAccordionList;
