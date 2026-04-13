// third-party
import { FormattedMessage } from 'react-intl';

// assets

import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
// type
import { NavItemType } from 'types';
import Setting from 'components/icons/Setting';

const icons = {
    Setting
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const taxonomy: NavItemType = {
    id: 'taxonomy',
    title: <FormattedMessage id="taxonomy" />,
    icon: icons.Setting,
    type: 'group',
    children: [
        {
            id: 'taxonomy',
            title: 'Taxonomy',
            type: 'item',
            icon: CategoryOutlinedIcon,
            url: '/taxonomy/list',
            breadcrumbs: false
        },
    ]
};

export default taxonomy;
