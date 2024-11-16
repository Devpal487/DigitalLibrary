import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
//import "./ThemeStyle.css";
import "../components/common/ThemeStyle.css";

const themes = [
  "light-theme",
  "dark-theme",
  "ocean-theme",
  "sunset-theme",
  "forest-theme",
];

interface CustomDataGridProps {
  isLoading: boolean;
  rows: any[];
  columns: any[];
  pageSizeOptions?: number[];  // You can still provide this in case pagination is true
  initialPageSize?: number;    // This is only needed when pagination is true
  pagination?: any;        // A single boolean prop to control pagination
}

const DataGrids: React.FC<CustomDataGridProps> = ({
  isLoading,
  rows,
  columns,
  pageSizeOptions = [5, 10, 25, 50, 100],
  initialPageSize = 5,
  pagination = true,  // Default to true if not passed

  ...otherProps
}) => {
  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <Box>
      <br />
      <div
        style={{
          height: "50vh",
          width: "100%",
          backgroundColor: `var(--grid-background)`,
          overflowY: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          rowHeight={35}
          slots={{
            toolbar: GridToolbar,
          }}
          rowSpacingType="border"
          pagination={pagination}  // Use the pagination prop directly here
          pageSizeOptions={pagination ? pageSizeOptions : []}  // Only show pageSizeOptions if pagination is true
          initialState={pagination ? {
            pagination: { paginationModel: { pageSize: initialPageSize } },
          } : {}}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: `var(--grid-headerBackground)`,
              color: `var(--grid-headerColor)`,
              fontSize: "15px !important",
              fontWeight: 900,
              height: "37px",
              position: "sticky",
              minHeight: "37px",
              maxHeight: "37px",
              lineHeight: "37px",
            },
            "& .MuiDataGrid-columnHeader": {
              height: "37px !important",
              minHeight: "37px !important",
              maxHeight: "37px !important",
              lineHeight: "37px !important",
            },
            "& .MuiDataGrid-columnHeader--sortable": {
              height: "37px !important",
              minHeight: "37px !important",
              maxHeight: "37px !important",
              lineHeight: "37px !important",
            },
            "& .MuiDataGrid-withBorderColor": {
              height: "37px !important",
              minHeight: "37px !important",
              maxHeight: "37px !important",
              lineHeight: "37px !important",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              overflow: "visible",
              // whiteSpace: 'normal',
            },
            "& .MuiDataGrid-colCell": {
              fontSize: "15px !important",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default DataGrids;
