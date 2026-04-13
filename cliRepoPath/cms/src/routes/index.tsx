import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

//please donot delete this code
//import start
//import end

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
    [
        LoginRoutes,
        MainRoutes,
        //please donot delete this code
        //module start
        //module end
    ], {
    basename: import.meta.env.VITE_APP_BASE_NAME
});
export default router;
