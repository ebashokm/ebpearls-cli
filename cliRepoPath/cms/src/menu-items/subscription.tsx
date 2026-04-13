// third-party
import { FormattedMessage } from 'react-intl';

// assets
import SubscriptionOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
// type
import { NavItemType } from 'types';
import { SettingIcon } from 'components/icons';

const icons = {
    SettingIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const subscription: NavItemType = {
    id: 'subscription',
    title: <FormattedMessage id="Subscription" />,
    icon: icons.SettingIcon,
    type: 'group',
    children: [
        {
            id: 'subscription-products',
            title: 'Subscription Settings',
            type: 'item',
            url: '/subscription-products/list',
            icon: SubscriptionOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default subscription;
