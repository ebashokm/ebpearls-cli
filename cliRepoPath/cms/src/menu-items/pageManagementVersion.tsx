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

const pageManagementVersion: NavItemType = {
    id: 'Page Management Version',
    title: <FormattedMessage id="Page with versions" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'page-with-versions',
            title: <FormattedMessage id="page-with-versions" />,
            type: 'item',
            icon: NewspaperIcon,
            url: '/page-management-with-versions/list',
            breadcrumbs: false
        },
    ]
};

export default pageManagementVersion;
