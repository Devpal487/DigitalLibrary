import React, { useRef } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableFooter,
  Button,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";

interface HTMLTemplateProps {
  zones: any[]; 
  itemName: string; 
}

const PrintReportFormat: React.FC<HTMLTemplateProps> = ({ zones, itemName }) => {
  const pdfRef = useRef<HTMLDivElement>(null);

  // Calculate totals
  const totalInQty = zones.reduce((sum, zone) => sum + (zone.inQty || 0), 0);
  const totalOutQty = zones.reduce((sum, zone) => sum + (zone.outQty || 0), 0);
  const totalInAmount = zones.reduce((sum, zone) => sum + (zone.totalInAmount || 0), 0);
  const totalOutAmount = zones.reduce((sum, zone) => sum + (zone.totalOutAmount || 0), 0);
  const totalBalQty = zones.reduce((sum, zone) => sum + (zone.balQty || 0), 0);



  return (
    <div>
      <div ref={pdfRef}>
        {/* Header */}
        <div style={{ backgroundColor: "#2a3d66", color: "white", textAlign: "center", padding: "15px", width: "full" }}>
          <h1 style={{ margin: 0, fontSize: "18px" }}>Stock Ledger Report</h1>
        </div>

        <Divider color="#f3f3f3" style={{marginTop:"5px"}}/>
        {/* Heading */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "5px", fontWeight: "bold" }}>
          <h2 style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>Stock Ledger Details</h2>
          <h2 style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>{itemName}</h2>
        </div>
        <Divider color="#ccc" style={{marginBottom:"5px"}}/>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table style={{width: "full"}}>
            <TableHead>
              <TableRow style={{ backgroundColor: "#0056b3" }}>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Serial No.
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Title Name
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Rate
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Total In Amount
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  In Quantity
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Out Quantity
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Balance Quantity
                </TableCell>
                <TableCell style={{ color: "white", fontWeight: 600, padding: "5px" }} align="center">
                  Total Out Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.map((zone, index) => (
                <TableRow key={zone.id} style={{
                  // borderTop: index === 0 ? "none" : "1px solid #000", 
                  borderBottom: "1px solid #000",
                }}>
                  <TableCell align="right">{index + 1}</TableCell>
                  <TableCell align="left">{zone.titleName}</TableCell>
                  <TableCell align="right">&#8377; {zone.rate.toFixed(2)}</TableCell>
                  <TableCell align="right">&#8377; {zone.totalInAmount.toFixed(2)}</TableCell>
                  <TableCell align="right">{zone.inQty}</TableCell>
                  <TableCell align="right">{zone.outQty}</TableCell>
                  <TableCell align="right">{zone.balQty}</TableCell>
                  <TableCell align="right">&#8377; {zone.totalOutAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} align="center" style={{ fontWeight: 600 }}>
                  Totals
                </TableCell>
                <TableCell align="right" style={{ fontWeight: 600 }}>{totalInQty}</TableCell>
                <TableCell align="right" style={{ fontWeight: 600 }}>{totalOutQty}</TableCell>
                <TableCell align="right" style={{ fontWeight: 600 }}>{totalBalQty}</TableCell>
                <TableCell align="right" style={{ fontWeight: 600 }}>&#8377; {totalOutAmount.toFixed(2)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>


    </div>
  );
};

export default PrintReportFormat;