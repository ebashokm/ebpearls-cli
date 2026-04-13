export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type BusinessUserListType = {
    _id: string;
    name: string;
    createdAt?: string;
    email: string;
};

export type ConfirmModalProps = {
    open: boolean;
    title: string;
    content: string;
    yes: any;
    no?: any;
    buttonLabelYes: string;
    buttonLabelNo?: string;
    loader?: boolean;
    size?: string;
    icon?: JSX.Element;
    handleClose: () => void;
};

type Point = {
    type: string;
    coordinates: [number];
};

type Address = {
    displayAddress: string;
    location: Point;
};

type Pagination = {
    total: number;
    hasNextPage: boolean;
};

export type AppUser = {
    _id: string;
    __typename: string;
    authProvider: string;
    authProviderId: string;
    password: string;
    firstName: string;
    lastName: string;
    address: Address;
    status: string;
    bio: string;
    lastLoggedInAt: Date;
    createdAt: Date;
    updatedAt: Date;
    profileImage: string;
    profileImageUrl: string;

};

interface IAppUser {
    message: string;
    user?: AppUser;
    users?: [AppUser];
    pagination?: Pagination;
}

export type UserResponse = {
    getAllAppUsers?: IAppUser;
    getAppUser?: IAppUser;
    createAppUser?: IAppUser;
    updateAppUser?: IAppUser;
    deleteAppUser?: IAppUser;
};

export type GetAppUsersDTO = {
    input: {
        searchText?: string;
        orderBy?: string;
        order?: string;
        limit?: number;
        skip?: number;
    };
};