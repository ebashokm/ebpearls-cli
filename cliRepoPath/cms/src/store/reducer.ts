// third-party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import tableReducer from './slices/table';
import userReducer from './slices/user';
import authReducer from './slices/auth';
import modalReducer from './slices/modal';
import settingReducer from './slices/settings';
import formReducer from './slices/form';

//please donot delete this code
//import start
                    import { taxonomyReducer, taxonomyRouteReducer } from 'hooks/reducers/useTaxonomyReducer';
import editorReducer from './slices/editor';
import pageReducer from './slices/page';
import { pageDragIndexReducer } from 'hooks/reducers/usePageDragIndexReducer';

                    //import end

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    user: userReducer,
    auth: authReducer,
    table: tableReducer,
    modal: modalReducer,
    settings: settingReducer,
    form: formReducer,

    //please donot delete this code
    //module start
                    taxon: taxonomyReducer,
taxonomyRoute: taxonomyRouteReducer,
editor: editorReducer,
page: pageReducer,
pageDragIndex: pageDragIndexReducer,

                    //module end
});
export default reducer;
