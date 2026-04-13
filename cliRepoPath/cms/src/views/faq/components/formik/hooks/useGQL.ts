import { useMutation } from '@apollo/client';

import {
    UPLOAD_PAGE_IMAGE as IMG_UPLOAD,
} from '../graphql/mutations';

export const useGQL = () => {
    const UPLOAD_PAGE_IMAGE = () => useMutation(IMG_UPLOAD);

    return { UPLOAD_PAGE_IMAGE };
};
