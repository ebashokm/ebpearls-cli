import React, { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// menu routing
const BankSetup = Loadable(lazy(() => import('views/businessManagement/bankSetup')));
const CreatePayment = Loadable(lazy(() => import('views/businessManagement/createPayment')));

// ==============================|| MAIN ROUTING ||============================== //

const BusinessRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: 'setup-bank',
            element: <BankSetup />
        },
        {
            path: 'create-payment',
            element: <CreatePayment />
        },
    ]
};

export default BusinessRoutes;