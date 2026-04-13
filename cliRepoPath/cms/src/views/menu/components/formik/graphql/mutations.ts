import { gql } from "@apollo/client";

export const UPLOAD_PAGE_IMAGE = gql`
    mutation ($input: uploadImageDTO!) {
        uploadPageImage(input: $input) {
            url
        }
    }
`;