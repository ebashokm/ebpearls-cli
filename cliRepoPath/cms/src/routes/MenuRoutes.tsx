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

// menu routing
const MenuList = Loadable(lazyReactNaiveRetry(() => import('views/menu/menusList')));
const AddMenu = Loadable(lazyReactNaiveRetry(() => import('views/menu/forms/addMenu')));
const EditMenu = Loadable(lazyReactNaiveRetry(() => import('views/menu/forms/editMenu')));

// ==============================|| MAIN ROUTING ||============================== //

const MenuRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'menu/list',
            element: <MenuList />,
            allowedRoles: ['superAdmin', 'admin', 'editor']
        },
        {
            path: 'menu/add',
            element: <AddMenu />
        },
        {
            path: 'menu/edit/:id',
            element: <EditMenu />
        },
    ]
};

export default MenuRoutes;
