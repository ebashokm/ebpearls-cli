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

const businessUser: NavItemType = {
    id: 'Business Users',
    title: <FormattedMessage id="business-users" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'business-user',
            title: 'Business Users',
            type: 'item',
            icon: NewspaperIcon,
            url: '/business-user/list',
            breadcrumbs: false
        },
    ]
};

export default businessUser;
