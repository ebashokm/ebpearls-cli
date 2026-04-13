import { Box, Chip, Stack, Typography, alpha, useTheme } from '@mui/material';
import { IconBorderRadius } from '@tabler/icons-react';
import SortDropdown from 'components/sort-button';

type sortHeaderProps = {
  title: string;
  sort?: boolean;
  total: number | undefined;
}


function Header({title, sort, total} : sortHeaderProps) {
  const theme = useTheme();
  const totalSx = {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    padding: '11px 12px',
    borderRadius: '6px',
    fontSize: 17,
    lineHeight: 'calc(22/17)',
    letterSpacing: '-0.43px',
    color: '#000',
    marginBottom: '24px'
  }

  return (
      <>
          {!sort && <Typography variant="h3" sx={{ mb: total ? 2 : 3 }}>{title}</Typography>}
          {sort && (
              <Stack
                  flexDirection={{ sm: 'row' }}
                  justifyContent={{ sm: 'space-between' }}
                  alignItems={{ sm: 'center' }}
                  sx={{ mb: total ? 2 : 4 }}
                  spacing={{xs: 2, sm: 0}}
              >
                  <Typography variant="h3">{title}</Typography>
                  {sort && <SortDropdown />}
              </Stack>
          )}

          {total && <Box sx={totalSx}>{`Total: ${total}`}</Box>}
      </>
  );
}

export default Header