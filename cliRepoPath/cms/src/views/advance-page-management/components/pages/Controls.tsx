import { Grid, IconButton } from '@mui/material';
import { v4 as uuid } from 'uuid';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreComponent, { ExpandMore } from '../collapsible/iconButton';
import CollapsibleProvider from 'contexts/CollapsibleContext';
import CollapsibleContent from '../collapsible';
import { FC, useEffect } from 'react';
import { Actions, PageDispatch } from '../../types/pages/advancedPage';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useCollapsible } from '../../hooks/useCollapsible';

type Props = {
    id: string;
    type: string;
    keyName: string;
    dispatch: PageDispatch;
    children: React.ReactElement;
    expandAllFlag: boolean;
    disabled?: boolean;
    setDisabled?: any;
    initialState?: any;
};

const ProviderWrapper = (Component) => (props) =>
    (
        <CollapsibleProvider>
            <Component {...props} />
        </CollapsibleProvider>
    );

const Controls: FC<Props> = ({ id, type, keyName, dispatch, children, expandAllFlag, disabled, setDisabled, initialState }) => {
    const { setExpanded } = useCollapsible();
    useEffect(() => {
        setExpanded(expandAllFlag);
    }, []);

    useEffect(() => {
        setExpanded(() => expandAllFlag);
    }, [expandAllFlag]);

    return (
        <Grid container>
            <Grid container sx={{ position: 'absolute', top: '1rem', p: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                <Grid xs={3.3} sm={3} md={3} lg={3} xl={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => dispatch({ id, action: Actions.DROP, key: keyName })}>
                        <DeleteOutlineIcon />
                    </IconButton>
                    {!['Testimonials', 'Faq'].includes(type) && (
                        <IconButton
                            sx={{ ml: '1rem' }}
                            onClick={() =>
                                dispatch({
                                    id: uuid(),
                                    action: Actions.LOAD,
                                    key: `${type}-${uuid()}`,
                                    type,
                                    dispatch,
                                    initialState
                                })
                            }
                        >
                            <AddIcon />
                        </IconButton>
                    )}
                    {disabled ? (
                        <IconButton sx={{ ml: '1rem' }} onClick={() => setDisabled((currentState) => !currentState)}>
                            <VisibilityOffIcon />
                        </IconButton>
                    ) : (
                        <IconButton sx={{ ml: '1rem' }} onClick={() => setDisabled((currentState) => !currentState)}>
                            <VisibilityIcon />
                        </IconButton>
                    )}
                </Grid>
                <Grid item xs={0.7}>
                    <ExpandMoreComponent />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {/* render your children here wrapped with collapsible contennt */}
                <CollapsibleContent>{children}</CollapsibleContent>
                {/* {children} */}
            </Grid>
        </Grid>
    );
};

export default ProviderWrapper(Controls);
