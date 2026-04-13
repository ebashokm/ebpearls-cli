export enum Actions {
    LOAD = 'load',
    DROP = 'drop',
    DROP_ALL = 'drop-all',
    PUSH_PROMISE = 'push-promise',
    RESET_PROMISE = 'reset-promise'
}

interface BasicActionPayload {
    id: string;
    key: string;
}

export interface ActionPayload extends BasicActionPayload {
    type?: string;
    action?: Actions;
    promise?: Promise<unknown>;
    dispatch?: React.Dispatch<ActionPayload>;
    initialState?: any;
}

export type RootState = {
    components: { id: string; element: JSX.Element }[] | [];
    linkedComponents: JSX.Element[] | [];
    promises: Promise<unknown>[] | [];
};

export type Promises = {
    promises: Promise<boolean>[];
};

export type PageDispatch = React.Dispatch<ActionPayload>;
