import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
    debouncedSearch: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => void;
};

export const FilterList = ({ debouncedSearch }: Props) => {
    return (
        <TextField
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                )
            }}
            onChange={debouncedSearch}
            placeholder="Search Testimonials"
            size="small"
        />
    );
};
