import React, { useEffect, useState } from "react";
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
import dayjs, { Dayjs } from "dayjs";

import Chip from "@mui/material/Chip";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";
import api from "./Url";

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
    orderData: any

}

function OrderComponent({ open, onClose, orderData }: Props) {


    console.log('orderData', orderData)





    const handleClose = () => {
        onClose();
    };

    const { t } = useTranslation();

    return (
        <div>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
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
                        {" "}
                        <CloseIcon />
                    </IconButton>
                    <p
                        style={{
                            paddingTop: "2vh",
                            paddingBottom: "2vh",
                            paddingLeft: "10vh",
                            //   textAlign: "center",
                            fontSize: "20px",
                        }}
                    >
                        {orderData[0]?.createdBy}

                    </p>

                    <Divider />
                </Box>

                <Box sx={{ p: 2 }}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: "60vh", backgroundColor: "#fff", boxShadow: 1 }}
                            aria-label="customized table"
                        >
                            <TableBody>

                                <React.Fragment >
                                    <StyledTableRow>
                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.OrderItem")} :
                                            </span>{" "}
                                            {orderData[0]?.ordeItemDetails[0]?.itemNames}
                                        </StyledTableCell>

                                        <StyledTableCell
                                            colSpan={2}
                                            align="left"
                                            style={{
                                                whiteSpace: "pre-wrap",
                                                wordWrap: "break-word",
                                            }}
                                        >
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.NetAmmount")} :{" "}
                                            </span>
                                            {orderData[0]?.ordeItemDetails[0]?.netAmount}
                                        </StyledTableCell>
                                    </StyledTableRow>

                                    <StyledTableRow>
                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.OrderNo")} :
                                            </span>{" "}
                                            {orderData[0]?.orderNo}
                                        </StyledTableCell>

                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.OrderStatus")} :{" "}
                                            </span>
                                            {orderData[0]?.status}{" "}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.PaymentMode")} :
                                            </span>{" "}
                                            {orderData[0]?.paymentModeName}
                                        </StyledTableCell>

                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.TransactionId")} :
                                            </span>{" "}
                                            {orderData[0]?.transactionId}
                                        </StyledTableCell>
                                    </StyledTableRow>

                                    <StyledTableRow>
                                        <StyledTableCell align="left">
                                            {" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.Address")} :
                                            </span>{" "}
                                            {orderData[0]?.address}
                                        </StyledTableCell>

                                        <StyledTableCell align="left">
                                            <span style={{ fontWeight: 600 }}>
                                                {t("text.PinCode")}:
                                            </span>{" "}
                                            {orderData[0]?.pincode}
                                            {/* {(row.status === "2" ? <>Issue</> : <>N/A</>)} */}
                                        </StyledTableCell>
                                    </StyledTableRow>

                                    <StyledTableRow>
                                        
                                        <StyledTableCell align="left">
                                            <span style={{ fontWeight: 600 }}>
                                                {" "}
                                                {t("text.PaymentDate")} :
                                            </span>{" "}
                                            {dayjs(orderData[0]?.paymentDate).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </StyledTableCell>

                                        <StyledTableCell align="left">
                                            <span style={{ fontWeight: 600 }}>
                                                {" "}
                                                {t("text.TransactionDate")} :
                                            </span>{" "}
                                            {dayjs(orderData[0]?.transactionDate).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                  

                                    
                                </React.Fragment>

                            </TableBody>
                        </Table>
                    </TableContainer>


                </Box>
            </SwipeableDrawer>
        </div>
    );
}

export default OrderComponent;
