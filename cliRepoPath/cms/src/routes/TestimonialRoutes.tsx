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

/* testimonials */
const TestimonialsList = Loadable(lazyReactNaiveRetry(() => import('views/testimonials')));
const AddTestimonials = Loadable(lazyReactNaiveRetry(() => import('views/testimonials/forms/AddTestimonials')));
const EditTestimonials = Loadable(lazyReactNaiveRetry(() => import('views/testimonials/forms/EditTestimonials')));

// ==============================|| MAIN ROUTING ||============================== //

const TestimonialRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/testimonials/list',
            element: <TestimonialsList />
        },
        {
            path: 'testimonials/add',
            element: <AddTestimonials />
        },
        {
            path: 'testimonials/edit/:id',
            element: <EditTestimonials />
        },
    ]
};

export default TestimonialRoutes;
