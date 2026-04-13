
import { Box, Grid, MenuItem, Stack, TextField,} from '@mui/material';
import PageTitle from 'components/page-title/PageTitle';
import { useEffect, useState } from 'react';
import EarningCard from './EarningCard';
import TotalIncomeLightCard from '../components/TotalIncomeLightCard2';

import DashboardCard from './DashboardCard';
import { CalendarIcon, PeopleIcon, ScissorIcon } from 'components/icons';
import { serviceBookColumns, serviceBookRows, serviceProviderColumns, serviceProviderRows } from '../constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const selectTime = [
    { label: 'None', value: 'none' },
    {
        label: 'This week',
        value: 'week'
    },
    {
        label: 'This month',
        value: 'month'
    },
    {
        label: 'This year',
        value: 'year'
    }
];

const totalServiceProvider = 1234;
const totalCustomers = 2000;

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const Element = () => {
        return (
            <TextField className='update-date-button' size="small" select defaultValue="none" SelectProps={{ IconComponent: () => <Box className="icon-holder"><CalendarIcon /></Box> }}>
                {selectTime.map((option, index) => (
                    <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                ))}
            </TextField>
        );
    }

    return (
        <>
            <PageTitle title="Dashboard" element={<Element />} />
            <>
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={{xs: 2, lg: 3}}>
                                    <Grid item xs={12} sm={7.3} md={12} lg={7.3}>
                                        <EarningCard isLoading={isLoading} />
                                    </Grid>
                                    <Grid item xs={12} sm={4.7} md={12} lg={4.7}>
                                        <Stack spacing={1.5}>
                                            <TotalIncomeLightCard
                                                {...{
                                                    isLoading: isLoading,
                                                    total: 1234,
                                                    label: 'Total Service Providers',
                                                    icon: <ScissorIcon />
                                                }}
                                            />
                                            <TotalIncomeLightCard
                                                {...{
                                                    isLoading: isLoading,
                                                    total: 2000,
                                                    label: 'Total Customers',
                                                    icon: <PeopleIcon />
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <DashboardCard title="Services booked" sort={true} rows={serviceBookRows} columns={serviceBookColumns} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DashboardCard
                                    title="Hairdressers/Beauticians"
                                    total={totalServiceProvider}
                                    rows={serviceProviderRows}
                                    columns={serviceProviderColumns}
                                    more={1230}
                                    linkTo="hairdressers-beauticians/list"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DashboardCard
                                    title="Customers"
                                    total={totalCustomers}
                                    rows={serviceProviderRows}
                                    columns={serviceProviderColumns}
                                    more={1996}
                                    linkTo="/app-user/list"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        </>
    );
};

export default Dashboard;
