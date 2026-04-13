import React from 'react';
import { Grid, Stack, Tab, Tabs } from '@mui/material';
import { useParams } from 'react-router-dom';

import Profile from './Profile';
import Security from './Security';

import { useTabs } from '../hooks/useTabs';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import useGQL from '../hooks/useGQL';

// ==============================|| PROFILE 3 ||============================== //

const Profile3 = () => {
    const { id } = useParams();
    const [value, setValue] = React.useState(0);
    const { TabPanel, allyProps } = useTabs();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { GET_USER } = useGQL();
    const { error, loading, data, refetch } = GET_USER(id!);

    const appUserName = data?.getAppUser?.user?.firstName === null ? 'App user' : `${data?.getAppUser?.user?.firstName} ${data?.getAppUser?.user?.lastName}`;

    let breadcrumbLinks = [
        { title: 'User management', to: '/app-user/list' },
        { title: appUserName ? appUserName : 'App user' }
    ];

    return (
        <>
            <Stack className="custom-breadcrumb">
                <Breadcrumbs rightAlign={false} custom title={false} links={breadcrumbLinks} />
            </Stack>
            <MainCard className="user-setting" title="User profile">
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} lg={2.78} display={'flex'}>
                        <Tabs
                            className="profile-tab"
                            value={value}
                            indicatorColor="primary"
                            onChange={handleChange}
                            aria-label="user profile tabs"
                            variant="scrollable"
                            orientation="vertical"
                        >
                            <Tab label="User profile" {...allyProps(0)} />
                            {data?.getAppUser?.user?.authProvider === 'email' && <Tab label="Security" {...allyProps(1)} />}
                        </Tabs>
                    </Grid>
                    <Grid item xs={12} lg={8.55}>
                        <TabPanel value={value} index={0}>
                            <Profile userData={data} loading={loading} error={error} />
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Security userId={id!} />
                        </TabPanel>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default Profile3;
