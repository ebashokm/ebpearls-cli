const initialState = {
    data: []
};

const initialStateForRoute = '';

// eslint-disable-next-line
export const taxonomyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        }
        case 'UPDATE_WHOLE_ARRAY': {
            return {
                data: action.payload
            };
        }
        case 'DELETE_DATA':
            return {
                ...state,
                data: state.data.filter((item: any) => item.uuid !== action.payload)
            };

        default:
            return state;
    }
};

// eslint-disable-next-line
export const taxonomyRouteReducer = (state = initialStateForRoute, action) => {
    switch (action.type) {
        case 'SET_TAXON_ROUTE': {
            return action.payload;
        }

        default:
            return state;
    }
};
