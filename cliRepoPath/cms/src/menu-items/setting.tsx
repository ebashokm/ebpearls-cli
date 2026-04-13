// third-party
import { FormattedMessage } from 'react-intl';

import Setting from 'components/icons/Setting';
// type
import { NavItemType } from 'types';

const icons = {
    Setting
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const setting: NavItemType = {
    id: 'setting',
    title: <FormattedMessage id="Setting" />,
    icon: icons.Setting,
    type: 'group',
    children: [
        {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            icon: Setting,
            url: 'settings/edit'
        },
    ]
};

export default setting;
