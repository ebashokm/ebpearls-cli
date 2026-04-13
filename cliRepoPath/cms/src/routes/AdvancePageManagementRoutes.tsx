import React from 'react';

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

// page management routing
const AdvancePageList = Loadable(lazyReactNaiveRetry(() => import('views/advance-page-management')));
const AdvancePageAdd = Loadable(lazyReactNaiveRetry(() => import('views/advance-page-management/advancedPageAdd')));
// const AddPage = Loadable(lazyReactNaiveRetry(() => import('views/page-management/forms/addPage')));
const AdvancePageEdit = Loadable(lazyReactNaiveRetry(() => import('views/advance-page-management/advancedPageEdit')));

// ==============================|| MAIN ROUTING ||============================== //

const PageManagementRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // {
        //     path: 'advance-page/add',
        //     element: <AddPage />
        // },
        {
            path: 'advance-page/edit/:id',
            element: <AdvancePageEdit />
        },
        {
            path: 'advance-page/list',
            element: <AdvancePageList />
        },
        {
            path: 'advance-page/add',
            element: <AdvancePageAdd />
        },
    ]
};

export default PageManagementRoutes;
