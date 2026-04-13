import { TabsProps } from 'types';
import { Box } from '@mui/system';

export const useTabs = () => {
    // tabs
    const TabPanel = ({ children, value, index, ...other }: TabsProps) => {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
            </div>
        );
    };

    const allyProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    };

    return { TabPanel, allyProps };
};
