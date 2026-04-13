// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard } from '@tabler/icons-react';

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

// type
import { NavItemType } from 'types';

const icons = {
    IconDashboard: IconDashboard,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const faq: NavItemType = {
    id: 'Faq',
    title: <FormattedMessage id="faqs" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'faq-list',
            title: 'FAQs',
            type: 'item',
            icon: QuestionMarkIcon,
            url: '/faq/list',
            breadcrumbs: false
        },
    ]
};

export default faq;
