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
    id: 'Advance Pages',
    title: <FormattedMessage id="Advance Pages Management" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'advance-page',
            title: 'Advance Pages',
            type: 'item',
            icon: NewspaperIcon,
            url: '/advance-page/list',
            breadcrumbs: false
        },
    ]
};

export default pageManagement;
