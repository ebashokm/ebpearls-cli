import React, { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

//solution to failed to fetch data dynamically
const lazyReactNaiveRetry: typeof React.lazy = (importer) => {
    const retryImport = async () => {
        try {
            return await importer();
        } catch (error) {
            // retry 5 times with 1 second delay
            for (let i = 0; i < 5; i++) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                try {
                    return await importer();
                } catch (e) {
                    console.log('retrying import');
                }
            }
            throw error;
        }
    };
    return React.lazy(retryImport);
};

// User managemenet routing
const AdminList = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins')));
const AdminAdd = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins/forms/AddAdmin')));
const AdminProfile = Loadable(lazyReactNaiveRetry(() => import('views/profile')));
const AdminProfileView = Loadable(lazyReactNaiveRetry(() => import('views/user-management/admins/view')));
const AdminAccountProfile = Loadable(lazyReactNaiveRetry(() => import('views/profile/UserProfile')));
const AdminChangePassword = Loadable(lazyReactNaiveRetry(() => import('views/profile/ChangePassword')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/admin/list',
            element: <AdminList />
        },
        {
            path: '/admin/add',
            element: <AdminAdd />
        },
        {
            path: 'admin/profile',
            element: <AdminProfile />
        },
        {
            path: '/admin/edit/:id',
            element: <AdminProfileView />
        },
        {
            path: '/admin/view/:id',
            element: <AdminProfileView />
        },
        {
            path: 'admin/account-profile',
            element: <AdminAccountProfile />
        },
        {
            path: 'admin/change-password',
            element: <AdminChangePassword />
        },
    ]
};

export default MainRoutes;
