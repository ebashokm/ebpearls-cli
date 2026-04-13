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

const PageManagementWithVersionListPath = '/page-management-with-versions/list';
const PageManagementWithVersionAddPath = '/page-management-with-versions/add';
const PageManagementWithVersionEditPath = '/page-management-with-versions/edit';

/* Page management */
const PageManagementWithVersionList = Loadable(lazyReactNaiveRetry(() => import('views/page-management-versions')));
const PageManagementWithVersionAddEdit = Loadable(lazyReactNaiveRetry(() => import('views/page-management-versions/form/AddEditPage')));

// ==============================|| MAIN ROUTING ||============================== //

const PageManagementWithVersionsRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: PageManagementWithVersionListPath,
            element: <PageManagementWithVersionList />
        },
        {
            path: PageManagementWithVersionAddPath,
            element: <PageManagementWithVersionAddEdit />
        },
        {
            path: `${PageManagementWithVersionEditPath}/:id`,
            element: <PageManagementWithVersionAddEdit />
        },
    ]
};

export default PageManagementWithVersionsRoutes;
