// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome } from '@tabler/icons-react';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

// type
import { NavItemType } from 'types';
import { AdminUserIcon, PeopleIcon } from 'components/icons';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    IconBrandChrome,
    PhoneAndroidIcon,
    PersonOutlinedIcon,
    PeopleIcon,
    AdminUserIcon
};
const adminList: NavItemType = {
    id: 'admin-list',
    title: <FormattedMessage id="admin-list" />,
    icon: icons.PersonOutlinedIcon,
    type: 'group',
    children: [
        {
            id: 'admins',
            title: 'Admins',
            type: 'item',
            icon: icons.AdminUserIcon,
            url: '/admin/list',
            breadcrumbs: false,
            roles: ['admin', 'superAdmin']
        },
        {
            id: 'app-users',
            title: 'App Users',
            type: 'item',
            icon: icons.PeopleIcon,
            url: '/app-user/list',
            breadcrumbs: false
        }
    ]
};

export default adminList;
