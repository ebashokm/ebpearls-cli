import FeaturedProducts from 'views/advance-page-management/forms/advanced/featuredProducts/FeaturedProducts';
import HomeBannerV1 from 'views/advance-page-management/forms/advanced/homeBanner/v1';
import ImageColumn from 'views/advance-page-management/forms/advanced/imageColumn';
import Banner from 'views/advance-page-management/forms/advanced/banner/banner';
import Steps from 'views/advance-page-management/forms/advanced/steps/steps';
import FAQ from 'views/advance-page-management/forms/advanced/faq';
import Testimonials from 'views/advance-page-management/forms/advanced/testimonials';

import { PageDispatch } from 'views/advance-page-management/types/pages/advancedPage';

export type Section = {
    label: string;
    value: string;
};

export type PageProps = {
    id: string;
    keyName: string;
    dispatch: PageDispatch;
    data?: any;
    getData?: any;
    initialData?: any;
};

export const availableSections: Section[] = [
    { label: 'Banner', value: 'Banner' },
    { label: 'Home Banner', value: 'HomeBannerV1' },
    { label: 'Featured Products', value: 'FeaturedProducts' },
    { label: 'Image Column', value: 'ImageColumn' },
    { label: 'How it works', value: 'Steps' },
    { label: 'FAQ', value: 'FAQ' },
    { label: 'Testimonials', value: 'Testimonials' },
    { label: 'Testimonials123', value: 'Testimonials123' }
];

export const Component = {
    Banner,
    FeaturedProducts,
    HomeBannerV1,
    ImageColumn,
    FAQ,
    Steps,
    Testimonials
};
