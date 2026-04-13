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
const TaxonomyList = Loadable(lazyReactNaiveRetry(() => import('views/taxonomy/taxonomyList')));
const ViewTaxonomy = Loadable(lazyReactNaiveRetry(() => import('views/taxonomy/taxonsList')));
const AddTaxon = Loadable(lazyReactNaiveRetry(() => import('views/taxonomy/forms/addTaxonForm')));
const EditTaxon = Loadable(lazyReactNaiveRetry(() => import('views/taxonomy/forms/editTaxonForm')));

// ==============================|| MAIN ROUTING ||============================== //

const TaxonomyRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'taxonomy/list',
            element: <TaxonomyList />
        },
        {
            path: 'taxonomy/view/:taxonomyId',
            element: <ViewTaxonomy />
        },
        {
            path: 'taxon/add/:taxonomyId',
            element: <AddTaxon />
        },
        {
            path: 'taxon/edit/:taxonomyId/:id',
            element: <EditTaxon />
        },
    ]
};

export default TaxonomyRoutes;
