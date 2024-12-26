import React, { useRef, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableFooter,
  Divider,
  IconButton,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import api from "../utils/Url";
import CloseIcon from "@mui/icons-material/Close";
import StockLedgerTable from "./StockLedgerTable";

interface HTMLTemplateProps {
  zones: any[];
  itemName: string;
  showHide: boolean;
  fromdate:any;
  todate:any;
}

const PrintReportFormat: React.FC<HTMLTemplateProps> = ({
  zones,
  itemName,
  showHide,
  fromdate,
  todate
}) => {
  console.log("showhide", showHide);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [zones1, setZones1] = useState([]);
  const [isTitle, setTitle] = useState<any>("");
  const [open, setOpen] = useState(false);

  const totalInQty = zones.reduce((sum, zone) => sum + (zone.inQty || 0), 0);
  const totalOutQty = zones.reduce((sum, zone) => sum + (zone.outQty || 0), 0);
  const totalInAmount = zones.reduce(
    (sum, zone) => sum + (zone.totalInAmount || 0),
    0
  );
  const totalOutAmount = zones.reduce(
    (sum, zone) => sum + (zone.totalOutAmount || 0),
    0
  );
  const totalBalQty = zones.reduce((sum, zone) => sum + (zone.balQty || 0), 0);

  const closeStatus = () => {
    setOpen(false);
  };

  const ModalData = async (Row: any) => {
    setTitle(Row.titleName);
    try {
      const collectData = {
        voucherId: -1,
        stockBinId: -1,
        itemId: Row.itemId,
        fromDate:fromdate,
        toDate:todate,
      };
      const response = await api.post(
        `/api/StockLedger/GetStockLedgerReport_Opns`,
        collectData
      );
      const data = response.data.data;

      console.log("LedgerReport", data);
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: index + 1,
        balQty: parseInt(zone.inQty) - parseInt(zone.outQty),
      }));
      setZones1(zonesWithIds);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div ref={pdfRef}>
        {/* Header */}
        {showHide && (
          <>
            <div
              style={{
                backgroundColor: "#2a3d66",
                color: "white",
                textAlign: "center",
                padding: "15px",
                width: "full",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "18px" }}>
                Stock Summary Report
              </h1>
            </div>

            <Divider color="#f3f3f3" style={{ marginTop: "5px" }} />
            {/* Heading */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "5px",
                fontWeight: "bold",
              }}
            >
              <h2
                style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}
              >
                Stock Ledger Details
              </h2>
              <h2
                style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}
              >
                {itemName}
              </h2>
            </div>
            <Divider color="#ccc" style={{ marginBottom: "5px" }} />
          </>
        )}
        {/* Table */}
        <TableContainer component={Paper}>
          <Table style={{ width: "full" }}>
            <TableHead>
              <TableRow style={{ backgroundColor: "#0056b3" }}>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Serial No.
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Title Name
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Rate
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Total In Amount
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  In Quantity
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Out Quantity
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Balance Quantity
                </TableCell>
                <TableCell
                  style={{ color: "white", fontWeight: 600, padding: "5px" }}
                  align="center"
                >
                  Total Out Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zones.map((zone, index) => (
                <TableRow
                  key={zone.id}
                  style={{
                    // borderTop: index === 0 ? "none" : "1px solid #000",
                    borderBottom: "1px solid #000",
                    backgroundColor: "#fff",
                  }}
                >
                  <TableCell align="right">{index + 1}</TableCell>
                  <TableCell
                    onMouseEnter={(e: any) => {
                      e.target.style.textDecoration = "underline";
                      e.target.style.color = "blue";
                    }}
                  >
                    <a
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                      onClick={() => {
                        ModalData(zone);
                      }}
                    >
                      {" "}
                      {zone.titleName}
                    </a>
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    &#8377; {zone.rate.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    &#8377; {zone.totalInAmount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    {zone.inQty}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    {zone.outQty}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    {zone.balQty}
                  </TableCell>
                  <TableCell align="right" style={{ backgroundColor: "#fff" }}>
                    &#8377; {zone.totalOutAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
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
                  &#8377; {totalInAmount.toFixed(2)}
                </TableCell>
                <TableCell
                  style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                  align="right"
                >
                  {totalInQty.toFixed(2)}
                </TableCell>
                <TableCell
                  style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                  align="right"
                >
                  {totalOutQty.toFixed(2)}
                </TableCell>
                <TableCell
                  style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                  align="right"
                >
                  {totalBalQty.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{ color: "black", fontWeight: 600, fontSize: "14px" }}
                >
                  &#8377; {totalOutAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>

      <Grid item xs={12} container spacing={2}>
        <Grid item sm={12} lg={12} xs={12}>
          <Dialog
            open={open}
            onClose={closeStatus}
            fullWidth
            maxWidth="lg"
            sx={{
              "& .MuiDialogContent-root": {
                padding: "20px",
                height: "400px",
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                backgroundColor: `var(--grid-headerBackground)`,
                color: `var(--grid-headerColor)`,
              }}
            >
              {isTitle} {""} Details
              <IconButton
                edge="end"
                color="inherit"
                onClick={closeStatus}
                sx={{
                  color: `var(--grid-headerColor)`,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Grid item xs={12} container spacing={2} sx={{ marginTop: "2%" }}>
                <Grid item sm={12} lg={12} xs={12}>
                  <StockLedgerTable data={zones1} title={isTitle} />
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default PrintReportFormat;
