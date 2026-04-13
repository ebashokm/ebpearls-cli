import { Dialog, styled } from "@mui/material"

export const EmailTemplatePreviewDialog = styled(Dialog)(({theme}) => ({
    '.MuiPaper-root': {
        boxShadow: '0 0 0 13px rgba(255,255,255,0.5)',
        backgroundColor: theme.palette.error[500]
    }
}));