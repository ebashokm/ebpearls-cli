import React, { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// menu routing
const BusinessUserList = Loadable(lazy(() => import('views/business-user')));
const AddEditBusinessUser = Loadable(lazy(() => import('views/business-user/forms/AddEditBusinessUser')));

// ==============================|| MAIN ROUTING ||============================== //

const BusinessUsersRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'business-user/list',
            element: <BusinessUserList />
        },
        {
            path: 'business-user/add',
            element: <AddEditBusinessUser />
        },
        {
            path: `business-user/edit/:id`,
            element: <AddEditBusinessUser />
        },
    ]
};

export default BusinessUsersRoutes;