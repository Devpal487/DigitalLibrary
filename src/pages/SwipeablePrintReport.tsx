import React, { useRef } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
  Chip,
  tableCellClasses,
} from "@mui/material";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";

interface HTMLTemplateProps {
  zones: any[];
  itemName: string;
  showHide: boolean;
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

const InvoiceRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    // {console.log(label,value)}
  <StyledTableRow>
    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left"><strong>{label}</strong></StyledTableCell>
    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left">{value}</StyledTableCell>
  </StyledTableRow>
);

const SwipeablePrintReport: React.FC<HTMLTemplateProps> = ({ zones, itemName, showHide }) => {
    console.log("zones", zones)
    // console.log(Object.keys(zones))
    // const zone:any = zones ; 
    // const zone: any = zones ? [zones] : {};+
    // const zone = Array.isArray(zones) ? zones : [zones];
    const zone:any = Array.isArray(zones) ? [zones] :[ zones];
    const itemNames = itemName ? itemName :[];

    console.log("itemName", itemName);
    console.log("zone", zone)


//   const pdfRef = useRef<HTMLDivElement>(null);

  const renderSection = (label: string, data: string | number | undefined, formatDate: boolean = false) => {
    if (data) {
      return (
        <InvoiceRow label={label} value={formatDate ? dayjs(data).format("DD-MM-YYYY") : data.toString()} />
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
      <div >
        <div
          style={{
            backgroundColor: "#2a3d66",
            color: "white",
            textAlign: "center",
            marginTop:"5px",
            padding: "10px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "18px" }}>Stock Details Report</h1>
        </div>

            {zone[0] && (
                <>
                    <Divider color="#f3f3f3" style={{ marginTop: "5px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px", fontWeight: "bold" }}>
                    <h2 style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>Item Details</h2>
                    <h2 style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>{itemNames}</h2>
                    </div>
                    <Divider color="#ccc" style={{ marginBottom: "5px" }} />
                    </>
                )}
             {zone[0]?.itemName && <Root style={{ padding: "10px" }}>
          <Divider>
            {" "}
            <Chip
              label="Stock General Details"
              size="medium"
              sx={{ fontSize: "20px" }}
            />
          </Divider>
            </Root>}

            <Divider color="#ccc" style={{ marginBottom: "5px" }} />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
                <TableBody>
                  {/* {zone[0]?.p_InvoiceNo && renderSection("Invoice No:", zone[0]?.p_InvoiceNo)} */}
                  {zone[0]?.titleName && renderSection("Title Name:", zone[0]?.titleName)}
                  {zone[0]?.itemName && renderSection("Item Name:", zone[0]?.itemName)}
                  {zone[0]?.rate && renderSection("Rate:", zone[0]?.rate)}
                  {zone[0]?.inQty && renderSection("In Qty:", zone[0]?.inQty)}
                  {zone[0]?.outQty && renderSection("Out Qty:", zone[0]?.outQty)}
                  {zone[0]?.totalInAmount && renderSection("Total In Amount:", zone[0]?.totalInAmount)}
                  {zone[0]?.totalOutAmount && renderSection("Total Out Amount:", zone[0]?.totalOutAmount)}
                  {/* {zone[0]?.pR_InvoiceNo && renderSection("Invoice No:", zone[0]?.pR_InvoiceNo)} */}
                  {/* {zone[0]?.doc_Date && renderSection("Invoice Date:", zone[0]?.doc_Date, true)} */}
                  {zone[0]?.pR_InvoiceDate && renderSection("Invoice Date:", zone[0]?.pR_InvoiceDate, true)}
                  {zone[0]?.orderNo && renderSection("Order No:", zone[0]?.orderNo)}
                  {zone[0]?.supplierName && renderSection("Supplier Name:", zone[0]?.supplierName)}
                  {zone[0]?.amount && renderSection("Amount:", zone[0]?.amount)}
                  {zone[0]?.remark && renderSection("Remark:", zone[0]?.remark)}
                </TableBody>
              </Table>
            </TableContainer>
             


            {zone[0]?.purReturnChild?.length > 0 &&
                <>
            <br/>
                <br/>
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
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Sr. No.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Document Date</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Item Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Unit Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Return Qty</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Rate</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Dis. Amt.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Tax Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Net Amt</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {zone[0]?.purReturnChild?.map((row: any, index: number) => (
                                <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row" align="center" sx={{ backgroundColor: "#fff"}}>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left">{dayjs(row.documentDate).format("DD-MM-YYYY")}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.itemNames}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.unitName}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.qty}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.rate}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.amount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.discountAmount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.taxId1}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.netamount}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </>
            }

            {zone[0]?.purchaseinv?.length > 0 &&
                <>
            <br/>
                {/* <br/> */}
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
                            <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Sr. No.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Document Date</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Item Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Unit Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>In Qty</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Rate</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Dis. Amt.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Tax Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Net Amt</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {zone[0]?.purchaseinv?.map((row: any, index: number) => (
                                <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row" align="center" sx={{ backgroundColor: "#fff"}}>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left">{dayjs(row.documentDate).format("DD-MM-YYYY")}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.itemNames}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.unitName}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.qty}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.rate}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.amount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.discountAmount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.taxId1}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.netamount}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </>
            }

            {zone[0]?.saleinv?.length > 0 &&
                <>
            <br/>
                {/* <br/> */}
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
                        <Table sx={{ minWidth: "60vw", backgroundColor: "#fff", boxShadow: 1 }}>
                            <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Sr. No.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Document Date</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Item Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Unit Name</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Out Qty</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Rate</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Dis. Amt.</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Tax Amt</StyledTableCell>
                                <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Net Amt</StyledTableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {zone[0]?.saleinv?.map((row: any, index: number) => (
                                <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row" align="center" sx={{ backgroundColor: "#fff"}}>
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left">{dayjs(row.documentDate).format("DD-MM-YYYY")}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.itemNames}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.unitName}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.qty}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.rate}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.amount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.discountAmount}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.taxId1}</StyledTableCell>
                                <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.netamount}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </>
            }


            {zone[0]?.saleretnchild?.length > 0 &&
                <>
                <br/>
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
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Sr. No.</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Document Date</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Item Name</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Unit Name</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>In Qty</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Rate</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Amt</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Dis. Amt.</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Tax Amt</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ backgroundColor: "#fff"}}>Net Amt</StyledTableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {zone[0]?.saleretnchild?.map((row: any, index: number) => (
                                    <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row" align="center" sx={{ backgroundColor: "#fff"}}>
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="left">{dayjs(row.documentDate).format("DD-MM-YYYY")}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.itemNames}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.unitName}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">{row.qty}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.rate}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.amount}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.discountAmount}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.taxId1}</StyledTableCell>
                                    <StyledTableCell sx={{ backgroundColor: "#fff"}} align="center">&#8377; {row.netamount}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                </>
            }




        </div >
    </div>
    );
};

export default SwipeablePrintReport;