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
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";
import { toast } from "react-toastify";

import ToastApp from "../ToastApp";

const StockLedgerTable = ({ data, title }: { data: any[], title: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filtered = data.filter((row) => {
      const calculatedBal = (row.inQty || 0) - (row.outQty || 0);
      return (
        (row.voucherType?.toLowerCase() || "").includes(lowerCaseQuery) ||
        dayjs(row.voucherDate || "").format("DD-MMM-YYYY").includes(lowerCaseQuery) ||
        (row.inQty?.toString() || "0").includes(lowerCaseQuery) ||
        (row.outQty?.toString() || "0").includes(lowerCaseQuery) ||
        (row.rate?.toString() || "0").includes(lowerCaseQuery) ||
        (row.totalInAmount?.toString() || "0").includes(lowerCaseQuery) ||
        (row.totalOutAmount?.toString() || "0").includes(lowerCaseQuery) ||
        calculatedBal.toString().includes(lowerCaseQuery)
      );
    });
    setFilteredData(filtered)
  }, [searchQuery, data]);


  const totalInQty = filteredData.reduce((acc, row) => acc + (row.inQty || 0), 0);
  const totalOutQty = filteredData.reduce((acc, row) => acc + (row.outQty || 0), 0);
  const totalBalQty = filteredData.reduce((acc, row) => acc + (row.balQty || 0), 0);


  const fetchApiData = async (name: string, id: any) => {

    console.log("naem, id", name, id)
    try {
      let endpoint = "";
      let collectData;
      if (name === "StockGeneral") {
        collectData = {
          voucherId: -1,
          stockBinId: 5,
          itemId: id,
        };
      } else if (name === "PurchaseReturn") {
        collectData = {
          id: -1,
          documentNo:String(id)
        };
      } else if (name === "Sale") {
        collectData = {
          id: id,
          "isRequst": false,
          "s_InvoiceNo": ""
        };
      } else {
        collectData = { id: id };
      }

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
        case "StockGeneral":
          endpoint = "api/StockLedger/GetStockReport"
          break;
        default:
          toast.error("wait network problem");
          break;
      }

      const response = await api.post(endpoint, collectData);
      const result = response?.data?.data;

      console.log("response", result);

      if (result?.length > 0) {
        setDrawerData(result[0]);
        setOpenDrawer(true);
      } else {
        console.log("No data found.");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };




  return (
    <div>
      <ToastApp />
      {drawerData && (
        <SwipeableTemporaryDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          userData={drawerData}
          title={`${title} Details`}
        />
      )}
      <Grid
        item
        xs={12}
        container
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
      <TableContainer component={Paper} style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }}>
            <TableRow>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Sr. No</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Voucher Type</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Voucher Date</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Rate</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">In Quantity</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Out Quantity</TableCell>
              <TableCell style={{ backgroundColor: "#2B4593", color: "white", fontWeight: 600 }} align="center">Balance Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.serialNo}</TableCell>
                  <TableCell
                    onMouseEnter={(e: any) => {
                      e.target.style.textDecoration = "underline";
                      e.target.style.color = "blue";
                    }}
                  ><a onClick={() => fetchApiData(row.voucherType, row.voucherType == "StockGeneral" ? row.itemId : row.voucherId)}
                    //   style={{cursor:"pointer",}}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "blue",
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
              <TableCell style={{ color: "black", fontWeight: 600, fontSize: "14px" }} align="center" colSpan={4}>
                Total
              </TableCell>
              <TableCell style={{ color: "black", fontWeight: 600, fontSize: "14px" }} align="right">{totalInQty.toFixed(2)}</TableCell>
              <TableCell style={{ color: "black", fontWeight: 600, fontSize: "14px" }} align="right">{totalOutQty.toFixed(2)}</TableCell>
              <TableCell style={{ color: "black", fontWeight: 600, fontSize: "14px" }} align="right">{totalBalQty.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockLedgerTable;
