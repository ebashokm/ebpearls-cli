import { useReducer } from 'react';
import invariant from 'tiny-invariant';
import { RootState, ActionPayload, Promises, Actions } from 'views/advance-page-management/types/pages/advancedPage';
import { getComponent } from 'utils/getComponent';

export const reducer = (state: RootState, payload: ActionPayload) => {
    switch (payload.action) {
        case Actions.LOAD: {
            invariant(payload.type, 'Not null on load');
            const Element = getComponent(payload.type);
            console.log(Element, 'element');
            /* mount components */
            return {
                ...state,
                components: [
                    ...state.components,
                    {
                        id: payload.id,
                        element: <Element {...{ id: payload.id, dispatch: payload.dispatch, keyName: payload.key }} />
                    }
                ],
                promises: []
            };
        }

        case Actions.DROP: {
            if (payload.key) {
                sessionStorage.removeItem(payload.key);
            }
            const filteredList = state.components.length > 0 ? state.components.filter((element) => element.id !== payload.id) : [];
            return { ...state, components: filteredList };
        }

        case Actions.DROP_ALL: {
            sessionStorage.clear();
            return { ...state, components: [] };
        }

        case Actions.PUSH_PROMISE: {
            invariant(payload.promise, 'Not null on push-promise');
            return { ...state, promises: [...state.promises, payload.promise] };
        }

        case Actions.RESET_PROMISE: {
            return { ...state, promises: [] };
        }

        default:
            return state;
    }
};

export const useAdvancedPageReducer = () => {
    const [state, dispatch] = useReducer(reducer, {
        components: [],
        linkedComponents: [],
        promises: []
    });

    return { state, dispatch };
};
