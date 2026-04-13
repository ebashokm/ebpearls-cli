import { gql } from '@apollo/client';

export const CREATE_MENU = gql`
    mutation ($input: CreateMenuDTO!) {
        createMenu(input: $input) {
            message
            menu {
                _id
                title
                logo {
                    url
                    name
                    contentType
                    objectKey
                }
                imageAltText
                status
                menuPosition
            }
        }
    }
`;

export const DELETE_MENU = gql`
    mutation ($id: String!) {
        deleteMenu(id: $id) {
            message
        }
    }
`;

export const UPDATE_MENU = gql`
    mutation ($id: String!, $input: CreateMenuDTO!) {
        updateMenu(id: $id, input: $input) {
            message
            menu {
                _id
                title
                logo {
                    name
                    contentType
                    url
                    objectKey
                }
                imageAltText
                status
                menuPosition
            }
        }
    }
`;

export const UPLOAD_MENU_IMAGE = gql`
    mutation ($input: uploadImageDTO!) {
        uploadMenuImage(input: $input) {
            url
        }
    }
`;

export const UPDATE_MENU_STATUS = gql`
    mutation ($id: String!, $input: UpdateMenuStatusDTO!) {
        updateMenuStatus(id: $id, input: $input) {
            message
            menu {
                _id
                status
            }
        }
    }
`;