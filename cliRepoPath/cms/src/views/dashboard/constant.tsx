import { Button, IconButton, Menu, MenuItem, useMediaQuery } from "@mui/material";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { MoreIcon } from "components/icons";
import { useState } from "react";
import dayjs from "dayjs";

export const serviceBookColumns: GridColDef[] = [
    { field: 'id', headerName: '', sortable: false, disableColumnMenu: true },
    { 
        field: 'service',
        headerName: 'Service', 
        sortable: false, 
        disableColumnMenu: true,
        flex: 1, 
        // minWidth: 233 
    },
    {
        field: 'frequency',
        headerName: 'Frequency',
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        // maxWidth: 94
    },
    {
        field: 'commissionGenerated',
        headerName: 'Commission generated',
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        valueGetter: (params: GridValueGetterParams) => `$ ${params.row.commissionGenerated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
];

export const serviceProviderColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', sortable: false, disableColumnMenu: true },
    { field: 'name', headerName: 'Name', sortable: false, disableColumnMenu: true, 
        flex: 1 
    },
    {
        field: 'gender',
        headerName: 'Gender',
        sortable: false,
        disableColumnMenu: true,
        flex: 1
    },
    {
        field: 'joinedDate',
        headerName: 'Date joined',
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
        valueGetter: (params: GridValueGetterParams) => `${dayjs(params.row.joinedDate).format('DD MMM YYYY')}`
    },
    {
        field: 'booking',
        headerName: 'Bookings done',
        sortable: false,
        disableColumnMenu: true,
        flex: 1,
    },
    {
        field: 'action',
        headerName: '',
        sortable: false,
        disableColumnMenu: true,
        width: 20,
        align:'right',
        renderCell: (params) => {
                    const onClick = (e) => {
                          e.stopPropagation(); // don't select this row after clicking
                          //Reference purpose for future use
                        //   const api: GridApi = params.api;
                        //   const thisRow: Record<string, GridEditCellValueParams> = {};
                        //   api
                        //     .getAllColumns()
                        //     .filter((c) => c.field !== "__check__" && !!c)
                        //     .forEach(
                        //       (c) => (thisRow[c.field] = params.value(params.id, c.field))
                        //     );
                        //   return alert(JSON.stringify(thisRow, null, 4));
                    };
                    const moreOption = [
                        {
                            label: 'Edit',
                            handleOnClick: () => handleClose()
                          },
                          {
                            label: 'Disable',
                            handleOnClick: () => handleClose()
                          },
                          {
                            label: 'Delete',
                            handleOnClick: () => handleClose()
                          }
                    ]

                    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
                    const open = Boolean(anchorEl);
                    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
                    setAnchorEl(event.currentTarget);
                    };
                    const handleClose = () => {
                        setAnchorEl(null);
                    };
        
                    return (
                        <>
                            <IconButton
                                id="more-button"
                                aria-controls={open ? 'more-button' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <MoreIcon />
                            </IconButton>
                            <Menu
                                id="more-button"
                                MenuListProps={{
                                    'aria-labelledby': 'more-button'
                                }}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                  }}
                                open={open}
                                onClose={handleClose}
                            >
                                {moreOption.map((sortOption, index) => (
                                    <MenuItem key={index} onClick={sortOption.handleOnClick} disableRipple>
                                        {sortOption.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    );
                }
    }
];
  
  export const serviceProviderRows = [
      { id: 1, name: 'Joe Bloggs', gender: 'Male', joinedDate: '2023-06-01T13:59:59.999Z', booking: 222 },
      { id: 2, name: 'Sarah James', gender: 'Female', joinedDate: '2023-07-22T13:59:59.999Z', booking: 20 },
      { id: 3, name: 'John Doe', gender: 'Male', joinedDate: '2023-04-12T13:59:59.999Z', booking: 123 },
      { id: 4, name: 'Samy Sam', gender: 'Female', joinedDate: '2023-12-04T13:59:59.999Z', booking: 400 },
  ];
  
  export const serviceBookRows = [
    { id: 1, service: 'Men’s Hair - Hair Cut', frequency: '222', commissionGenerated: '2000' },
    { id: 2, service: 'Men’s Cut - Beard Cut', frequency: '150', commissionGenerated: '2000' },
    { id: 3, service: 'Unisex - Coloring', frequency: '144', commissionGenerated: '2000' },
    { id: 4, service: 'Beard Cut', frequency: '132', commissionGenerated: '2000' },
    { id: 5, service: 'Beard Cut', frequency: '122', commissionGenerated: '2000' },
    { id: 6, service: 'Beard Cut', frequency: '116', commissionGenerated: '2000' },
    { id: 7, service: 'Beard Cut', frequency: '100', commissionGenerated: '2000' },
    { id: 8, service: 'Beard Cut', frequency: '99', commissionGenerated: '2000' },
    { id: 9, service: 'Beard Cut', frequency: '97', commissionGenerated: '2000' },
    { id: 10, service: 'Beard Cut', frequency: '91', commissionGenerated: '2000' },
    { id: 11, service: 'Beard Cut', frequency: '85', commissionGenerated: '2000' },
    { id: 12, service: 'Beard Cut', frequency: '72', commissionGenerated: '2000' },

];