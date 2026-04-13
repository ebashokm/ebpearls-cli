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

/* subscription list */
const SubscriptionProductsList = Loadable(lazyReactNaiveRetry(() => import('views/subscription-products')));
const AddSubscriptionProduct = Loadable(lazyReactNaiveRetry(() => import('views/subscription-products/forms/addProduct')));
const EditSubscriptionProduct = Loadable(lazyReactNaiveRetry(() => import('views/subscription-products/forms/editProduct')));

// ==============================|| MAIN ROUTING ||============================== //

const SubscriptionRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'subscription-products/list',
            element: <SubscriptionProductsList />
        },
        {
            path: 'subscription-products/add',
            element: <AddSubscriptionProduct />
        },
        {
            path: 'subscription-products/edit/:id',
            element: <EditSubscriptionProduct />
        }
    ]
};

export default SubscriptionRoutes;
