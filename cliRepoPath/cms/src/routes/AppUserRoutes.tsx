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

//App user
const UserList = Loadable(lazyReactNaiveRetry(() => import('views/user-management/users')));
const UserProfile = Loadable(lazyReactNaiveRetry(() => import('views/user-management/users/profile')));
const AppUserList = Loadable(lazyReactNaiveRetry(() => import('views/user-management/app-users')));
const AppUserProfile = Loadable(lazyReactNaiveRetry(() => import('views/user-management/app-users/profile')));
const AddAppUser = Loadable(lazyReactNaiveRetry(() => import('views/user-management/app-users/forms/AddAppUser')));

// ==============================|| MAIN ROUTING ||============================== //

const AppUserRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        //App user
        {
            path: 'user/list',
            element: <UserList />
        },
        {
            path: 'user/profile/:id',
            element: <UserProfile />
        },
        {
            path: 'app-user/list',
            element: <AppUserList />,
            allowedRoles: ['superAdmin', 'admin', 'editor']
        },
        {
            path: 'app-user/add',
            element: <AddAppUser />
        },
        {
            path: 'app-user/profile/:id',
            element: <AppUserProfile />
        },
    ]
};

export default AppUserRoutes;
