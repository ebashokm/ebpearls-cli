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

const PageManagementListPath = '/page-management/list';
const PageManagementAddPath = '/page-management/add';
const PageManagementEditPath = '/page-management/edit';

/* Page management */
const PageManagementList = Loadable(lazyReactNaiveRetry(() => import('views/page-management')));
const PageManagementAddEdit = Loadable(lazyReactNaiveRetry(() => import('views/page-management/form/AddEditPage')));
// const PageManagementEdit = Loadable(lazyReactNaiveRetry(() => import('views/page-management/form/EditPage')));

// ==============================|| MAIN ROUTING ||============================== //

const PageManagementNewRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: PageManagementListPath,
            element: <PageManagementList />
        },
        {
            path: PageManagementAddPath,
            element: <PageManagementAddEdit />
        },
        {
            path: `${PageManagementEditPath}/:id`,
            element: <PageManagementAddEdit />
        },
    ]
};

export default PageManagementNewRoutes;
