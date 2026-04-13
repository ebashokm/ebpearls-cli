import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

/* faq */
const FAQList = Loadable(lazy(() => import('views/faq')));
const AddFAQV1 = Loadable(lazy(() => import('views/faq/forms/addForm')));
const EditFAQV1 = Loadable(lazy(() => import('views/faq/forms/editForm')));
const ManageFAQ = Loadable(lazy(() => import('views/faq/tables')));

// ==============================|| MAIN ROUTING ||============================== //

const FaqRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'faq/list',
            element: <FAQList />
        },
        {
            path: 'faq/add',
            element: <AddFAQV1 />
        },
        {
            path: 'faq/edit/:id',
            element: <EditFAQV1 />
        },
        {
            path: 'faq/manage-faq',
            element: <ManageFAQ />
        },
    ]
};

export default FaqRoutes;
