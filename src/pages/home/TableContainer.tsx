import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import SearchBar from "material-ui-search-bar";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

interface Props {
  rows: { [key: string]: any }[];
  columns: Column[];
}

export default function DynamicTable({ rows: initialRows, columns }: Props) {
  const [rows, setRows] = useState<any[]>(initialRows);
  const [searched, setSearched] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const requestSearch = (searchedVal: string) => {
    const filteredRows = initialRows.filter((row) => {
      const searchLower = searchedVal.toLowerCase();
      return columns.some((col) => {
        const cellValue = row[col.id]?.toString().toLowerCase();
        return cellValue?.includes(searchLower);
      });
    });
    setRows(filteredRows);
    setPage(0); // Reset to the first page when searching
  };

  const cancelSearch = () => {
    setSearched("");
    setRows(initialRows);
    setPage(0); // Reset to the first page when canceling search
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    const lastPage = Math.ceil(rows.length / rowsPerPage) - 1;
    setPage(lastPage);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(rows.length / rowsPerPage) - 1));
  };

  const isEmpty = rows.length === 0;

  return (
    <Paper sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">No Data Available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              <TransitionGroup>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <CSSTransition
                    key={index}
                    timeout={500}
                    classNames="fade"
                  >
                    <TableRow>
                      {columns.map((col) => (
                        <TableCell key={col.id} align={col.align || 'left'}>
                          {row[col.id] ?? "N/A"} {/* Default to "N/A" if no data */}
                        </TableCell>
                      ))}
                    </TableRow>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
