// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard } from '@tabler/icons-react';
import NewspaperIcon from '@mui/icons-material/Newspaper';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const pageManagement: NavItemType = {
    id: 'Page Management',
    title: <FormattedMessage id="Page Management" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'page-management',
            title: 'Pages',
            type: 'item',
            icon: NewspaperIcon,
            url: '/page-management/list',
            breadcrumbs: false
        },
    ]
};

export default pageManagement;
