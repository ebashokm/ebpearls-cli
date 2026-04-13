// third-party
import { FormattedMessage } from 'react-intl';
import { lazy } from 'react';

// assets
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';

// type
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const icons = {
    ReviewsOutlinedIcon,
};
const testimonail: NavItemType = {
    id: 'testimonial-list',
    title: <FormattedMessage id="testimonial-list" />,
    icon: icons.ReviewsOutlinedIcon,
    type: 'group',
    children: [
        {
            id: 'Testimonials',
            title: 'Testimonials',
            type: 'item',
            url: '/testimonials/list',
            icon: ReviewsOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default testimonail;
