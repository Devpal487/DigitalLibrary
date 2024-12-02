import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import React from "react";
import Chip from "@mui/material/Chip";


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
  // hide last border
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

interface Props {
  open: boolean;
  onClose: () => void;
  userData: any;
  title: any;
}

function SwipeableTemporaryDrawer({ open, onClose, title, userData }: Props) {

  console.log("userData", userData)
  const handleClose = () => {
    onClose();
  };

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
              <strong>In Qty. :</strong> {userData.inQty}
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
    {/* <Typography variant="h6"> #{userData?.s_InvoiceNo} Invoice Details</Typography> */}

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
      <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
        <TableBody>
          {/* Displaying main invoice data */}
          <StyledTableRow>
            <StyledTableCell align="left">
              <strong>Invoice No:</strong> {userData.sR_InvoiceNo}
            </StyledTableCell>
            <StyledTableCell align="left">
              <strong>Document Date:</strong> {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
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
          <StyledTableRow>
            <StyledTableCell align="left">
              <strong>Amount:</strong> {userData.amount}
            </StyledTableCell>
            <StyledTableCell align="left">
              <strong>Remark:</strong> {userData.remark}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <br/>
    {/* <br/> */}
    <Root style={{ padding: "10px" }}>
          <Divider>
            {" "}
            <Chip
              label="Sale Return Child Details"
              size="medium"
              sx={{ fontSize: "20px" }}
            />
          </Divider>
        </Root>
    <TableContainer component={Paper}>

      <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
        <TableBody>
          {userData.saleretnchild?.map((row: any) => (
            <>
            <React.Fragment key={row.id}>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Invoice No:</strong> {row.invoiceNo}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {/* <strong>Item Name ID:</strong> {row.itemNameId} */}
                  <strong>Document Date:</strong> {dayjs(userData.documentDate).format("DD-MM-YYYY")}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Item Name:</strong> {row.itemNames}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Unit Name:</strong> {row.unitName}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>In Qty:</strong> {row.qty}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Rate:</strong> {row.rate}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Amount:</strong> {row.amount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Discount:</strong> {row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Discount Amount:</strong> {row.discountAmount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Tax Amount:</strong> {row.taxId1}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Net Amount:</strong> {row.netamount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {/* <strong>Net Amount:</strong> {row.netamount} */}
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
            <br/>
            </>
          ))}
        </TableBody>
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
              label="Sale Invoice Details"
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
              <strong>Document Date:</strong> {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
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
          <StyledTableRow>
            <StyledTableCell align="left">
              <strong>Amount:</strong> {userData.amount}
            </StyledTableCell>
            <StyledTableCell align="left">
              <strong>Remark:</strong> {userData.remark}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <br/>
    {/* <br/> */}
    <Root style={{ padding: "10px" }}>
          <Divider>
            {" "}
            <Chip
              label="Sale Invoice Child Details"
              size="medium"
              sx={{ fontSize: "20px" }}
            />
          </Divider>
        </Root>
    <TableContainer component={Paper}>

      <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
        <TableBody>
          {userData.saleinv?.map((row: any) => (
            <React.Fragment key={row.id}>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Invoice No:</strong> {row.invoiceNo}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {/* <strong>Item Name ID:</strong> {row.itemNameId} */}
                  <strong>Document Date:</strong> {dayjs(userData.documentDate).format("DD-MM-YYYY")}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Item Name:</strong> {row.itemNames}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Unit Name:</strong> {row.unitName}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Out Qty:</strong> {row.qty}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Rate:</strong> {row.rate}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Amount:</strong> {row.amount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Discount:</strong> {row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Discount Amount:</strong> {row.discountAmount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Tax Amount:</strong> {row.taxId1}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Net Amount:</strong> {row.netamount}
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
          ))}
        </TableBody>
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
              label="Purchase Invoice Return Details"
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
              <strong>Document Date:</strong> {dayjs(userData.pR_InvoiceDate).format("DD-MM-YYYY")}
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
          <StyledTableRow>
            <StyledTableCell align="left">
              <strong>Amount:</strong> {userData.amount}
            </StyledTableCell>
            <StyledTableCell align="left">
              <strong>Remark:</strong> {userData.remark}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <br/>
    {/* <br/> */}
    <Root style={{ padding: "10px" }}>
          <Divider>
            {" "}
            <Chip
              label="Purchase Invoice Return Child Details"
              size="medium"
              sx={{ fontSize: "20px" }}
            />
          </Divider>
        </Root>
    <TableContainer component={Paper}>
  
      <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
        <TableBody>
          {userData.purReturnChild?.map((row: any) => (
            <React.Fragment key={row.id}>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Invoice No:</strong> {row.invoiceNo}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {/* <strong>Item Name ID:</strong> {row.itemNameId} */}
                  <strong>Document Date:</strong> {dayjs(userData.documentDate).format("DD-MM-YYYY")}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Item Name:</strong> {row.itemNames}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Unit Name:</strong> {row.unitName}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Return Qty:</strong> {row.qty}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Rate:</strong> {row.rate}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Amount:</strong> {row.amount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Discount:</strong> {row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Discount Amount:</strong> {row.discountAmount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Tax Amount:</strong> {row.taxId1}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Net Amount:</strong> {row.netamount}
                </StyledTableCell>
              </StyledTableRow>
            </React.Fragment>
          ))}
        </TableBody>
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
            label="Purchase Invoice Details"
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
            <strong>Invoice No:</strong> {userData.p_InvoiceNo}
          </StyledTableCell>
          <StyledTableCell align="left">
            <strong>Document Date:</strong> {dayjs(userData.doc_Date).format("DD-MM-YYYY")}
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
        <StyledTableRow>
          <StyledTableCell align="left">
            <strong>Amount:</strong> {userData.amount}
          </StyledTableCell>
          <StyledTableCell align="left">
            <strong>Remark:</strong> {userData.remark}
          </StyledTableCell>
        </StyledTableRow>
      </TableBody>
    </Table>
  </TableContainer>
  <br/>
  {/* <br/> */}
  <Root style={{ padding: "10px" }}>
        <Divider>
          {" "}
          <Chip
            label="Purchase Invoice Child Details"
            size="medium"
            sx={{ fontSize: "20px" }}
          />
        </Divider>
      </Root>
  <TableContainer component={Paper}>

    <Table sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}>
      <TableBody>
        {userData.purchaseinv?.map((row: any) => (
          <React.Fragment key={row.id}>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Invoice No:</strong> {row.invoiceNo}
              </StyledTableCell>
              <StyledTableCell align="left">
                {/* <strong>Item Name ID:</strong> {row.itemNameId} */}
                <strong>Document Date:</strong> {dayjs(userData.documentDate).format("DD-MM-YYYY")}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Item Name:</strong> {row.itemNames}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Unit Name:</strong> {row.unitName}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>In Qty:</strong> {row.qty}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Rate:</strong> {row.rate}
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell align="left">
                <strong>Amount:</strong> {row.amount}
              </StyledTableCell>
              <StyledTableCell align="left">
                <strong>Discount:</strong> {row.tax2 === 'P' ? `${row.discount} %` : `${row.discount}` }
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Discount Amount:</strong> {row.discountAmount}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <strong>Tax Amount:</strong> {row.taxId1}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell align="left">
                  <strong>Net Amount:</strong> {row.netamount}
                </StyledTableCell>
              </StyledTableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  </>
  );

  const renderContent = () => {
    if (userData?.saleretnchild) {
      return renderSaleReturnDetails();
    } else if (userData?.saleinv) {
      return renderSaleInvoiceDetails();
    } else if (userData?.purReturnChild) {
      return renderPurchaseReturnDetails();
    }else if (userData?.purchaseinv) {
      return renderPurchaseDetails();
    } else {
      return renderStockGeneralDetails();
    }
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
          <Divider />
        </Box>

        <Box sx={{ p: 2 }}>
          {renderContent()}
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

export default SwipeableTemporaryDrawer;