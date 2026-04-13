// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { GridContainer } from './profile.styles';

// ==============================|| PROFILE 3 - SECURITY ||============================== //

const Security = () => {
    const theme = useTheme();
    return (
        <GridContainer container spacing={gridSpacing}>
            <Grid item sm={6} md={8}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Change Password">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <TextField id="outlined-basic9" fullWidth label="Current password" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="outlined-basic10" fullWidth label="New Password" />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField id="outlined-basic11" fullWidth label="Re-enter New Password" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row">
                                        <AnimateButton>
                                            <Button variant="contained">Change Password</Button>
                                        </AnimateButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
        </GridContainer>
    );
};

export default Security;
