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

/* email template */
const EmailTemplateList = Loadable(lazyReactNaiveRetry(() => import('views/email-template')));
const AddEmailTemplate = Loadable(lazyReactNaiveRetry(() => import('views/email-template/forms/add-template')));
const EditEmailTemplate = Loadable(lazyReactNaiveRetry(() => import('views/email-template/forms/edit-template')));

// ==============================|| MAIN ROUTING ||============================== //

const EmailTemplateRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'email-template/list',
            element: <EmailTemplateList />
        },
        {
            path: 'email-template/add',
            element: <AddEmailTemplate />
        },
        {
            path: 'email-template/edit/:id',
            element: <EditEmailTemplate />
        },
    ]
};

export default EmailTemplateRoutes;
