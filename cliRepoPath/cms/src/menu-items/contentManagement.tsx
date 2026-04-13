// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
    IconDeviceAnalytics: IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const contentManagement: NavItemType = {
    id: 'Content Management',
    title: <FormattedMessage id="Content Management" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'menu',
            title: 'Menus',
            type: 'item',
            icon: LayersOutlinedIcon,
            url: '/menu/list',
            breadcrumbs: false
        },
    ]
};

export default contentManagement;
