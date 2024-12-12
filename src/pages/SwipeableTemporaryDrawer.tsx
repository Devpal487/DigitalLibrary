import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  Box,
  Button,
  Divider,
  Stack,
  TableFooter,
  TableHead,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";
import * as ReactDOM from "react-dom/client";
import jsPDF from "jspdf";
import { getISTDate } from "../utils/Constant";
import SwipeablePrintReport from "./SwipeablePrintReport";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  open: boolean;
  onClose: () => void;
  userData: any;
  title: any;
  NavigationPage: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#007FFF",
    color: theme.palette.common.white,
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(5),
  },
}));

function SwipeableTemporaryDrawer({
  open,
  onClose,
  title,
  userData,
  NavigationPage,
}: Props) {
  console.log("userData", userData);
  const { defaultValuestime } = getISTDate();

  const handleClose = () => {
    onClose();
  };

  const totalQty: any = userData.saleretnchild?.reduce(
    (sum: any, zone: any) => sum + (zone.qty || 0),
    0
  );
  const totalAmmount: any = userData.saleretnchild?.reduce(
    (sum: any, zone: any) => sum + (zone.amount || 0),
    0
  );
  const totalDisAmount: any = userData.saleretnchild?.reduce(
    (sum: any, zone: any) => sum + (zone.discountAmount || 0),
    0
  );
  const TaxAmount: any = userData.saleretnchild?.reduce(
    (sum: any, zone: any) => Number(sum) + Number(zone.taxId1 || 0),
    0
  );
  const NetAmmount: any = userData.saleretnchild?.reduce(
    (sum: any, zone: any) => sum + (zone.netamount || 0),
    0
  );

  const totalQty1: any = userData.saleinv?.reduce(
    (sum: any, zone: any) => sum + (zone.qty || 0),
    0
  );
  const totalAmmount1: any = userData.saleinv?.reduce(
    (sum: any, zone: any) => sum + (zone.amount || 0),
    0
  );
  const totalDisAmount1: any = userData.saleinv?.reduce(
    (sum: any, zone: any) => sum + (zone.discountAmount || 0),
    0
  );
  const TaxAmount1: any = userData.saleinv?.reduce(
    (sum: any, zone: any) => Number(sum) + Number(zone.taxId1 || 0),
    0
  );
  const NetAmmount1: any = userData.saleinv?.reduce(
    (sum: any, zone: any) => sum + (zone.netamount || 0),
    0
  );

  const totalQty2: any = userData.purReturnChild?.reduce(
    (sum: any, zone: any) => Number(sum) + Number(zone.qty || 0),
    0
  );
  const totalAmmount2: any = userData.purReturnChild?.reduce(
    (sum: any, zone: any) => sum + (zone.amount || 0),
    0
  );
  const totalDisAmount2: any = userData.purReturnChild?.reduce(
    (sum: any, zone: any) => sum + (zone.discountAmount || 0),
    0
  );
  const TaxAmount2: any = userData.purReturnChild?.reduce(
    (sum: any, zone: any) => Number(sum) + Number(zone.taxId1 || 0),
    0
  );
  const NetAmmount2: any = userData.purReturnChild?.reduce(
    (sum: any, zone: any) => sum + (zone.netamount || 0),
    0
  );

  const totalQty3: any = userData.purchaseinv?.reduce(
    (sum: any, zone: any) => sum + (zone.qty || 0),
    0
  );
  const totalAmmount3: any = userData.purchaseinv?.reduce(
    (sum: any, zone: any) => sum + (zone.amount || 0),
    0
  );
  const totalDisAmount3: any = userData.purchaseinv?.reduce(
    (sum: any, zone: any) => sum + (zone.discountAmount || 0),
    0
  );
  const TaxAmount3: any = userData.purchaseinv?.reduce(
    (sum: any, zone: any) => Number(sum) + Number(zone.taxId1 || 0),
    0
  );
  const NetAmmount3: any = userData.purchaseinv?.reduce(
    (sum: any, zone: any) => sum + (zone.netamount || 0),
    0
  );

  console.log('totalQty2',TaxAmount3)


  const renderStockGeneralDetails = () => (
    <>
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Stock General Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableBody>
            {/* Displaying main invoice data */}
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Item Name:</strong> {userData.itemName}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Title Name:</strong> {userData.titleName}
              </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Rate:</strong> {userData.rate}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong> Qty. :</strong> {userData.inQty}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Out Qty. :</strong> {userData.outQty}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Total In Amount :</strong> {userData.totalInAmount}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Total Out Amount :</strong> {userData.totalOutAmount}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Remark:</strong> {userData.remark}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderSaleReturnDetails = () => (
    <>
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Sale Return Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "70vh", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableBody>
            {/* Displaying main invoice data */}
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Invoice No:</strong> {userData.sR_InvoiceNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Invoice Date:</strong>{" "}
                {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Order No:</strong> {userData.orderNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Supplier Name:</strong> {userData.supplierName}
              </StyledTableCell>
            </StyledTableRow>
           
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {/* <br/> */}
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Sale Return Goods Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Sr. No.</StyledTableCell>
              <StyledTableCell align="center">Document Date</StyledTableCell>
              <StyledTableCell align="center">Item Name</StyledTableCell>
              <StyledTableCell align="center">Unit Name</StyledTableCell>
              <StyledTableCell align="center">In Qty</StyledTableCell>
              <StyledTableCell align="center">Rate</StyledTableCell>
              <StyledTableCell align="center">Amt</StyledTableCell>
              {/* <StyledTableCell align="center" >Discount</StyledTableCell> */}
              <StyledTableCell align="center">Dis. Amt.</StyledTableCell>
              <StyledTableCell align="center">Tax Amt</StyledTableCell>
              <StyledTableCell align="center">Net Amt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.saleretnchild?.map((row: any, index: any) => (
              <React.Fragment key={row.id}>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" align="center">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {dayjs(userData.documentDate).format("DD-MM-YYYY")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.itemNames}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.unitName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.qty}</StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.rate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.amount}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">{row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }</StyledTableCell> */}
                  <StyledTableCell align="center">
                    &#8377; {row.discountAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.taxId1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.netamount}
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow
              style={{ backgroundColor: "#f3f3f3", fontWeight: "bold" }}
            >
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="center"
                colSpan={3}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                {totalQty ? (totalQty).toFixed(2) : 0}
              </TableCell>

              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              ></TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalAmmount ? (totalAmmount).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalDisAmount ? (totalDisAmount).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377;{" "}
                {typeof TaxAmount === "number" ? TaxAmount.toFixed(3) : 0}
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                &#8377;{" "}
                {typeof NetAmmount === "number" ? NetAmmount.toFixed(3) : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );

  const renderSaleInvoiceDetails = () => (
    <>
      {/* <Typography variant="h6"> #{userData?.s_InvoiceNo} Invoice Details</Typography> */}

      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Sale Item Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableBody>
            {/* Displaying main invoice data */}
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Invoice No:</strong> {userData.s_InvoiceNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Invoice Date:</strong>{" "}
                {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Order No:</strong> {userData.orderNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Supplier Name:</strong> {userData.supplierName}
              </StyledTableCell>
            </StyledTableRow>
           
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {/* <br/> */}
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Sale Item Goods Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Sr. No.</StyledTableCell>
              
              <StyledTableCell align="center">Item Name</StyledTableCell>
              <StyledTableCell align="center">Unit Name</StyledTableCell>
              <StyledTableCell align="center">Out Qty</StyledTableCell>
              <StyledTableCell align="center">Rate</StyledTableCell>
              <StyledTableCell align="center">Amt</StyledTableCell>
              {/* <StyledTableCell align="center" >Discount</StyledTableCell> */}
              <StyledTableCell align="center">Dis. Amt.</StyledTableCell>
              <StyledTableCell align="center">Tax Amt</StyledTableCell>
              <StyledTableCell align="center">Net Amt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.saleinv?.map((row: any, index: any) => (
              <React.Fragment key={row.id}>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" align="center">
                    {index + 1}
                  </StyledTableCell>
                 
                  <StyledTableCell align="center">
                    {row.itemNames}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.unitName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.qty}</StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.rate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.amount}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">{row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }</StyledTableCell> */}
                  <StyledTableCell align="center">
                    &#8377; {row.discountAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.taxId1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.netamount}
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow
              style={{ backgroundColor: "#f3f3f3", fontWeight: "bold" }}
            >
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="center"
                colSpan={3}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                {totalQty1 ? (totalQty1).toFixed(2) : 0}
              </TableCell>

              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              ></TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalAmmount1 ? (totalAmmount1).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalDisAmount1? (totalDisAmount1).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377;{" "}
                {typeof TaxAmount1 === "number" ? TaxAmount1.toFixed(3) : 0}
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                &#8377;{" "}
                {typeof NetAmmount1 === "number" ? NetAmmount1.toFixed(3) : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );

  const renderPurchaseReturnDetails = () => (
    <>
      {/* <Typography variant="h6"> #{userData?.s_InvoiceNo} Invoice Details</Typography> */}

      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Purchase Return Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableBody>
            {/* Displaying main invoice data */}
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Invoice No:</strong> {userData.pR_InvoiceNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Invoive Date:</strong>{" "}
                {dayjs(userData.pR_InvoiceDate).format("DD-MM-YYYY")}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Order No:</strong> {userData.orderNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Supplier Name:</strong> {userData.supplierName}
              </StyledTableCell>
            </StyledTableRow>
           
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {/* <br/> */}
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Purchase Return Goods Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Sr. No.</StyledTableCell>
              
              <StyledTableCell align="center">Item Name</StyledTableCell>
              <StyledTableCell align="center">Unit Name</StyledTableCell>
              <StyledTableCell align="center">Return Qty</StyledTableCell>
              <StyledTableCell align="center">Rate</StyledTableCell>
              <StyledTableCell align="center">Amt</StyledTableCell>
              {/* <StyledTableCell align="center" >Discount</StyledTableCell> */}
              <StyledTableCell align="center">Dis. Amt.</StyledTableCell>
              <StyledTableCell align="center">Tax Amt</StyledTableCell>
              <StyledTableCell align="center">Net Amt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.purReturnChild?.map((row: any, index: any) => (
              <React.Fragment key={row.id}>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" align="center">
                    {index + 1}
                  </StyledTableCell>
                 
                  <StyledTableCell align="center">
                    {row.itemNames}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.unitName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.qty}</StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.rate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.amount}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">{row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }</StyledTableCell> */}
                  <StyledTableCell align="center">
                    &#8377; {row.discountAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.taxId1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.netamount}
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow
              style={{ backgroundColor: "#f3f3f3", fontWeight: "bold" }}
            >
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="center"
                colSpan={3}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                {totalQty2 ? (totalQty2).toFixed(2) : 0}
              </TableCell>

              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              ></TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalAmmount2 ? (totalAmmount2).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalDisAmount2 ? (totalDisAmount2).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377;{" "}
                {typeof TaxAmount2 === "number" ? (TaxAmount2).toFixed(3) : 0}
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                &#8377;{" "}
                {typeof NetAmmount2 === "number" ? (NetAmmount2).toFixed(3) : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );

  const renderPurchaseDetails = () => (
    <>
      {/* <Typography variant="h6"> #{userData?.s_InvoiceNo} Invoice Details</Typography> */}

      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Purchase Item Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableBody>
            {/* Displaying main invoice data */}
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Invoice No:</strong> {userData.p_InvoiceNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Invoice Date:</strong>{" "}
                {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Order No:</strong> {userData.orderNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Supplier Name:</strong> {userData.supplierName}
              </StyledTableCell>
            </StyledTableRow>
            
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {/* <br/> */}
      <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Purchase Item Goods Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Sr. No.</StyledTableCell>
              
              <StyledTableCell align="center">Item Name</StyledTableCell>
              <StyledTableCell align="center">Unit Name</StyledTableCell>
              <StyledTableCell align="center"> Qty</StyledTableCell>
              <StyledTableCell align="center">Rate</StyledTableCell>
              <StyledTableCell align="center">Amt</StyledTableCell>
              {/* <StyledTableCell align="center" >Discount</StyledTableCell> */}
              <StyledTableCell align="center">Dis. Amt.</StyledTableCell>
              <StyledTableCell align="center">Tax Amt</StyledTableCell>
              <StyledTableCell align="center">Net Amt</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.purchaseinv?.map((row: any, index: any) => (
              <React.Fragment key={row.id}>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" align="center">
                    {index + 1}
                  </StyledTableCell>
                  
                  <StyledTableCell align="center">
                    {row.itemNames}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.unitName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.qty}</StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.rate}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.amount}
                  </StyledTableCell>
                  {/* <StyledTableCell align="center">{row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }</StyledTableCell> */}
                  <StyledTableCell align="center">
                    &#8377; {row.discountAmount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.taxId1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    &#8377; {row.netamount}
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow
              style={{ backgroundColor: "#f3f3f3", fontWeight: "bold" }}
            >
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="center"
                colSpan={3}
              >
                Total
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                {totalQty3 ? (totalQty3).toFixed(2) : 0}
              </TableCell>

              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              ></TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalAmmount3 ? (totalAmmount3).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377; {totalDisAmount3 ? (totalDisAmount3).toFixed(2) : 0}
              </TableCell>
              <TableCell
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                align="right"
              >
                &#8377;{" "}
                {typeof TaxAmount3 === "number" ? TaxAmount3.toFixed(3) : 0}
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
              >
                &#8377;{" "}
                {typeof NetAmmount3 === "number" ? NetAmmount3.toFixed(3) : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );

  const renderContent = () => {
    if (userData?.saleretnchild ) {
      return renderSaleReturnDetails();
    } else if (userData?.saleinv) { 
      return renderSaleInvoiceDetails();
    } else if (userData?.purReturnChild ) {
    return renderPurchaseReturnDetails();
  }else if (userData?.purchaseinv) {
      return renderPurchaseDetails();
    } else {
      return renderStockGeneralDetails();
    }
  };

  

  const exportToPDF = async () => {
    // Dynamically create a div to render the PrintReportFormatpdf component
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    const element = (
      <SwipeablePrintReport
        itemName={userData?.document_No}
        zones={userData}
        showHide={false}
      />
    );

    const root = ReactDOM.createRoot(container);
    root.render(element);

    setTimeout(async () => {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL("image/png");
      const fileName = `${userData?.document_No}_${defaultValuestime}.pdf`;
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(fileName);

      document.body.removeChild(container);
    }, 0);
  };

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        slotProps={{
          backdrop: {
            style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
          },
        }}
        PaperProps={{
          style: {
            boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
            backgroundColor: "white",
          },
        }}
        style={{
          zIndex: 1300,
        }}
      >
        <Box sx={{ backgroundColor: "whitesmoke" }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <p
            style={{
              paddingTop: "2vh",
              paddingBottom: "2vh",
              paddingLeft: "10vh",
              fontSize: "20px",
            }}
          >
            {title}
          </p>

          <EditIcon
            style={{
              position: "absolute",
              marginLeft: "85%",
              top: 13,

              color: "blueviolet",
              cursor: "pointer",
            }}
            onClick={NavigationPage}
          />

          <IconButton
            aria-label="close"
            sx={{
              position: "absolute",
              right: 8,
              top: 7,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={exportToPDF}
          >
            <DownloadIcon />
          </IconButton>
          <Divider />
        </Box>
        <Box sx={{ p: 2, backgroundColor: "#fff", boxShadow: 1 }}>
          {renderContent()}
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

export default SwipeableTemporaryDrawer;
