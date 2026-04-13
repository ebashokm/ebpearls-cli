import { gql } from '@apollo/client';

export const LIST_MENUS = gql`
    query ($input: GetMenusDTO!) {
        listMenus(input: $input) {
            message
            menus {
                _id
                title
                menuPosition
                status
                updatedAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const LIST_MENU = gql`
    query ($id: String!) {
        listMenu(id: $id) {
            message
            menu {
                _id
                title
                logo {
                    name
                    objectKey
                    contentType
                    url
                }
                imageAltText
                status
                menuPosition
                menuItems {
                    id
                    name
                    linkType
                    link
                    iconType
                    icon
                    index
                    children {
                        id
                        name
                        linkType
                        link
                        iconType
                        icon
                        index
                    }
                }
                updatedAt
            }
        }
    }
`;

export const LIST_TAXONOMIES = gql`
    query ($input: BasePaginationParams!) {
        listTaxonomies(input: $input) {
            message
            taxonomies {
                _id
                name
                createdAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;


export const LIST_PAGES = gql`
    query ($input: GetPagesDTO!) {
        listPages(input: $input) {
            message
            pages {
                _id
                title
                slug
                status
                content
                createdBy
                updatedAt
                createdAt
            }
            pagination {
                total
                hasNextPage
            }
        }
    }
`;

export const LIST_ALL_PAGES = gql`
    query ($input: GetAllPagesDTO!) {
        listAllPages(input: $input) {
            message
            pages {
                _id
                title
                slug
                status
            }
        }
    }
`;

export const GET_PRESIGNED_URL = gql`query GetPreSignedUrl($input: PreSignedUrlInput!) {
    getPreSignedUrl(input: $input) {
      message
      url
    }
  }`