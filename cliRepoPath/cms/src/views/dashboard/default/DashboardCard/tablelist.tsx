import { Link, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function List({rows, columns, more, linkTo}: any) {
    const theme = useTheme();
  return (
      <Box sx={{ width: '100%' }}>
          <DataGrid
              rows={rows}
              columns={columns}
              columnHeaderHeight={26}
              rowHeight={33}
              disableRowSelectionOnClick
              hideFooter
              columnVisibilityModel={{
                  id: false
              }}
              sx={{
                '.MuiDataGrid': {
                    '&-columnHeader, &-cell': {
                        '&:first-child': {
                            paddingLeft: 0
                        },
                        '&:nth-last-child(2)': {
                            paddingRight: 0
                        },
                        '&:focus': {
                            outline: 'none'
                        }
                    },
                    '&-cell': {
                        '&:focus-within': {
                            outline: 'none'
                        }
                    },
                    '&-columnHeaderTitle': {
                        fontWeight: 400
                    }
                }
              }}
          />
          {more && (
              <Box textAlign="center" mt={2}>
                  <Link href={linkTo} sx={{ color: 'text.primary', fontSize: theme.typography.body2.fontSize, textDecoration: 'none' }}>
                      +{more} more
                  </Link>
              </Box>
          )}
      </Box>
  );
}