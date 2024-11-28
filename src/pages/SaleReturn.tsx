import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
} from "@mui/x-data-grid";
import api from "../utils/Url";
import DataGrids from "../utils/Datagrids";
import dayjs from "dayjs";
import ToastApp from "../ToastApp";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function SaleReturn() {
    const [item, setItem] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);


    let navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchZonesData();
    }, [isLoading]);


    const routeChangeEdit = (row: any) => {
        console.log("row " + row);

        let path = `/EditSaleReturnInvoice`;
        navigate(path, {
            state: row,
        });
    };

    const routeChangeAdd = () => {
        let path = `/CreateSaleReturnInvoice`;
        navigate(path);
    };

    let delete_id = "";

    const accept = () => {
        const collectData = {
            id: delete_id,
        };
        console.log("collectData " + JSON.stringify(collectData));
        api
            .post(`api/SaleReturn/DeleteSaleReturn`, collectData )
            .then((response) => {
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                } else {
                    toast.error(response.data.mesg);
                }
                fetchZonesData();
            });
    };

    const reject = () => {
        // toast.warn({summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        toast.warn("Rejected: You have rejected", { autoClose: 3000 });
    };

    const handledeleteClick = (del_id: any) => {
        // console.log(del_id + " del_id ");
        delete_id = del_id;
        confirmDialog({
            message: "Do you want to delete this record ?",
            header: "Delete Confirmation",
            icon: "pi pi-info-circle",
            acceptClassName: "p=-button-danger",
            accept,
            reject,
        });
    };

    const fetchZonesData = async () => {
        try {
            const collectData = {
                "id": -1
            };
            const response = await api.post(
                `api/SaleReturn/GetSaleReturn`,
                collectData
            );
            const data = response.data.data;
            const IndentWithIds = data.map((Item: any, index: any) => ({
                ...Item,
                serialNo: index + 1,
                id: Item.id,
            }));
            setItem(IndentWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width:90,

                        renderCell: (params) => {
                            return [
                                <Stack
                                    spacing={1}
                                    direction="row"
                                    sx={{ alignItems: "center", marginTop: "5px" }}
                                >
                                    {/* {permissionData?.isEdit ? ( */}
                                    <EditIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "blue",
                                            cursor: "pointer",
                                        }}
                                        className="cursor-pointer"
                                        onClick={() => routeChangeEdit(params.row)}
                                    />
                                    {/* ) : ( */}
                                    {/* "" */}
                                    {/* )} */}
                                    {/* {permissionData?.isDel ? ( */}
                                    <DeleteIcon
                                        style={{
                                            fontSize: "20px",
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            handledeleteClick(params.row.id);
                                        }}
                                    />
                                </Stack>,
                            ];
                        },
                    },

                    // {
                    //     field: "serialNo",
                    //     headerName: t("text.SrNo"),
                    //     flex: 1,
                    //     headerClassName: "MuiDataGrid-colCell",
                    // },
                    {
                        field: "supplierName",
                        headerName: t("text.supplierNames"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "document_No",
                        headerName: t("text.document_Nos"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "s_InvoiceNo",
                        headerName: t("text.s_InvoiceNos"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "doc_Date",
                        headerName: t("text.doc_Dates"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell(params) {
                            return dayjs(params.row.doc_Date).format("DD-MMM-YYYY")
                        },
                    },
                    {
                        field: "s_InvoiceDate",
                        headerName: t("text.s_InvoiceDates"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                        renderCell(params) {
                            return dayjs(params.row.p_InvoiceDate).format("DD-MMM-YYYY")
                        },
                    },
                   
                    {
                        field: "amount",
                        headerName: t("text.amounts"),
                        flex: 1,
                        headerClassName: "MuiDataGrid-colCell",
                    },

                ];
                setColumns(columns as any);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // setLoading(false);
        }
    };

    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));


    return (
        <>
            <Card
                style={{
                    width: "100%",
                    // height: "100%",
                    backgroundColor: "#E9FDEE",
                    border: ".5px solid #FF7722 ",
                    marginTop: "3vh"
                }}
            >
                <Paper
                    sx={{
                        width: "100%",
                        overflow: "hidden",
                        "& .MuiDataGrid-colCell": {
                            backgroundColor: `var(--grid-headerBackground)`,
                            color: `var(--grid-headerColor)`,
                            fontSize: 17,
                            fontWeight: 900
                        },
                    }}
                    style={{ padding: "10px", }}
                >
                    <ConfirmDialog />

                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ padding: "20px" }}
                        align="left"
                    >
                      {t("text.saleReturn")}
                    </Typography>
                    <Divider />

                    <Box height={10} />

                    <Stack direction="row" spacing={2} classes="my-2 mb-2">
                        {/* {permissionData?.isAdd == true && ( */}
                        <Button
                            onClick={routeChangeAdd}
                            variant="contained"
                            endIcon={<AddCircleIcon />}
                            size="large"
                            style={{ backgroundColor: `var(--header-background)` }}
                        >
                            {t("text.add")}
                        </Button>
                        {/* ) } */}

                        {/* {permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
                    </Stack>


                    <DataGrids
                        isLoading={isLoading}
                        rows={item}
                        columns={adjustedColumns}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        initialPageSize={5}
                    />
                </Paper>
            </Card>
            <ToastApp />

        </>
    );
}
