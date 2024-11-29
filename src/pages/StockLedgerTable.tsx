import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Grid,
  TableFooter,
} from "@mui/material";
import dayjs from "dayjs";
import api from "../utils/Url";

const StockLedgerTable = ({ data }: { data: any[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
  
    const filtered = data.filter((row) => {
      return (
        (row.voucherType?.toLowerCase() || "").includes(lowerCaseQuery) || 
        dayjs(row.voucherDate || "").format("DD-MMM-YYYY").includes(lowerCaseQuery) || 
        (row.inQty?.toString() || "0").includes(lowerCaseQuery) || 
        (row.outQty?.toString() || "0").includes(lowerCaseQuery) || 
        (row.rate?.toString() || "0").includes(lowerCaseQuery) || 
        (row.totalInAmount?.toString() || "0").includes(lowerCaseQuery) || 
        (row.totalOutAmount?.toString() || "0").includes(lowerCaseQuery) ||
        (row.bal?.toString() || "0").includes(lowerCaseQuery) 
      );
    });
    setFilteredData(filtered)
  }, [searchQuery, data]);


  const totalInQty = filteredData.reduce((acc, row) => acc + (row.inQty || 0), 0);
  const totalOutQty = filteredData.reduce((acc, row) => acc + (row.outQty || 0), 0);
  const totalBalQty = filteredData.reduce((acc, row) => acc + (row.balQty || 0), 0);


  const fetchApiData = async (name: string, id:any) => {
    try {
      let endpoint = "";
      let collectData={id:id}
      switch (name) {
        case "PurchaseInvoice":
          endpoint = "/api/PurchaseInvoice/GetPurchaseInvoice";
          break;
        case "Sale":
          endpoint = "/api/SaleInvoice/GetSaleInvoice";
          break;
        case "SaleReturn":
          endpoint = "/api/SaleReturn/GetSaleReturn";
          break;
        case "PurchaseReturn":
          endpoint = "/api/PurchaseReturn/GetPurchaseReturn";
          break;
        default:
          break;
      }
      const response = await api.post(endpoint, collectData);
      console.log("response", response.data.data)
    //   setApiData(response.data);
    } catch (error) {
      console.error("API error: ", error);
    }
  };




  return (
    <div>
        <Grid
                      item
                      xs={12}
                      container
                      spacing={2}
                    //   sx={{ marginTop: "2%" }}
                    >
                      <Grid item sm={4} lg={4} xs={12}>
      <TextField
        label="Search Records"
        variant="outlined"
        fullWidth
        size="small"
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "1rem" }}
      />
  </Grid> 
  </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}}>
            <TableRow>
            <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Sr. No</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Voucher Type</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Voucher Date</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Rate</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">In Quantity</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Out Quantity</TableCell>
              <TableCell style={{backgroundColor:"#2B4593", color:"white" , fontWeight:600}} align="center">Balance Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.serialNo}</TableCell>
                  <TableCell 
                  onMouseEnter={(e:any) => {
                    e.target.style.textDecoration = "underline";  // Add underline on hover
                    e.target.style.color = "blue";  // Change text color to blue on hover
                  }}
                  onMouseLeave={(e:any) => {
                    e.target.style.textDecoration = "none";  // Remove underline when hover ends
                    e.target.style.color = "inherit";  // Revert to original text color
                  }}
                  
                  ><a onClick={(e)=>fetchApiData(row.voucherType, row.voucherId)} 
                //   style={{cursor:"pointer",}}
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",  // Removes underline by default
                    color: "inherit",  // Inherits default text color
                  }}
                  >{row.voucherType}</a></TableCell>
                  <TableCell>
                    {dayjs(row.voucherDate).format("DD-MMM-YYYY")}
                  </TableCell>
                  <TableCell align="right">{row.rate}</TableCell>
                  <TableCell align="right">{row.inQty}</TableCell>
                  <TableCell align="right">{row.outQty}</TableCell>
                  <TableCell align="right">{row.balQty}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow style={{ backgroundColor: "#f3f3f3", fontWeight: "bold" }}>
              <TableCell style={{color:"black", fontWeight:600, fontSize:"14px"}} align="center" colSpan={4}>
                Total
              </TableCell>
              <TableCell style={{color:"black", fontWeight:600, fontSize:"14px"}} align="right">{totalInQty.toFixed(2)}</TableCell>
              <TableCell style={{color:"black", fontWeight:600, fontSize:"14px"}} align="right">{totalOutQty.toFixed(2)}</TableCell>
              <TableCell style={{color:"black", fontWeight:600, fontSize:"14px"}} align="right">{totalBalQty.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockLedgerTable;
