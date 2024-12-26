import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  TextField,
  Autocomplete,
  Button,
  FormControlLabel,
  Checkbox,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import "react-transliterate/dist/index.css";
import CustomLabel from "../utils/CustomLabel";
import { getId } from "../utils/Constant";
import OrderComponent from "../utils/OrderComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function OrderItemList() {
  const userId = getId();
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [openComp, setOpenComp] = useState(false);


  const [Item, setItem] = useState<any>([]);

  console.log("selected", selectedRow);

  const [orderId, setOrderId] = useState<any>();
  const [orderSt, setOrderSt] = useState<any>("");

  const [isRemark, setRemark] = useState<any>("");

  const { t } = useTranslation();

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.Status") },
  ]);

  const closeStatus = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchZonesData();

    getProgram();
  }, []);

  const UpdateOrder = (row: any) => {
    const collectData = {
      orderId: row.orderId,
      userId: "",
    };

    api.post(`api/OrderItem/GetOrderItem`, collectData).then((res) => {
      const data = res?.data?.data;

      setItem(data);
    });
  };

  const saveData = () => {
    const saveCollectData = {
      orderId: Item[0]?.orderId,
      serviceId: Item[0]?.serviceId || 0,
      orderNo: Item[0]?.orderNo || "",
      rate: Item[0]?.rate || 0,
      dispatchFees: Item[0]?.dispatchFees || 0,
      paymentModeId: Item[0]?.paymentModeId || 0,
      paymentModeName: Item[0]?.paymentModeName || "",
      paymentDate: Item[0]?.paymentDate || "",
      transactionId: Item[0]?.transactionId || "",
      transactionIdName: Item[0]?.transactionIdName || "",
      paymentBy: Item[0]?.paymentBy || "",
      transactionDate: Item[0]?.transactionDate || "",
      paymentStatus: Item[0]?.paymentStatus || 0,
      orderStatus: orderId,
      status: orderSt,
      createdBy: Item[0]?.createdBy,
      updatedBy: Item[0]?.updatedBy,
      remark: isRemark,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      ordeItemDetails: Item[0]?.ordeItemDetails,
    };

    // Post the collected data
    api
      .post(`api/OrderItem/AddUpdateOrderItem`, saveCollectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
          fetchZonesData();
        } else {
          toast.error(res.data.mesg);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while saving data.");
        console.error(error);
      });
  };

  const getProgram = () => {
    const collectData = {
      id: -1,
      userTypeId: -1,
      userId: userId,
    };
    api.post(`api/statusmaster/GetStatusMaster`, collectData).then((res) => {
      //console.log("checkMemb", res?.data);

      const arr: any = [];

      for (let index = 0; index < res?.data?.data?.length; index++) {
        arr.push({
          value: res?.data?.data[index]["statusId"],
          label: res?.data?.data[index]["statusName"],
        });
      }
      setProgram(arr);
    });
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        orderId: -1,
        userId: "",
      };
      const response = await api.post(
        `api/OrderItem/GetOrderItem`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.orderId,
      }));
      setZones(zonesWithIds);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.3,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "updatedBy",
            headerName: t("text.Username"),
            flex: 0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "status",
            headerName: t("text.OrderStatus"),
            flex: 0.6,
            // headerClassName: "MuiDataGrid-colCell",
          },

          // {
          //   field: "rate",
          //   headerName: t("text.Rate"),
          //   flex: 1,
          //   // headerClassName: "MuiDataGrid-colCell",
          // },

          {
            field: "paymentModeName",
            headerName: t("text.PaymentMode"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "paymentDate",
            headerName: t("text.PaymentDate"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
            valueFormatter: (params) => {
              const date = new Date(params.value);
              const day = ("0" + date.getDate()).slice(-2);
              const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-indexed
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            },
          },

          {
            field: "transactionDate",
            headerName: t("text.TransactionDate"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
            valueFormatter: (params) => {
              const date = new Date(params.value);
              const day = ("0" + date.getDate()).slice(-2);
              const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-indexed
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            },
          },

          {
            field: "Status",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Status"),
            width: 100,

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
                    //onClick={() => updateStatus(params.row)}
                    onClick={() => {
                      setOpen(true);

                      UpdateOrder(params.row);
                    }}
                  />


                  <VisibilityIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenComp(true);
                      UpdateOrder(params.row);
                    }}
                  />
                </Stack>,
              ];
            },
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            // backgroundColor:"lightseagreen"
          }}
          style={{ padding: "10px" }}
        >
          <ConfirmDialog />

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.OrderItemList")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />

          <Grid item xs={12} container spacing={2}>
            <Grid item sm={12} lg={12} xs={12}>
              <Dialog
                open={open}
                onClose={closeStatus}
                fullWidth
                sx={{
                  "& .MuiDialogContent-root": {
                    padding: "20px",
                    height: "350px",
                  },
                }}
              >
                <DialogTitle
                  style={{
                    padding: "10px",
                    backgroundColor: `var(--grid-headerBackground)`,
                    color: `var(--grid-headerColor)`,
                  }}
                >
                  Update Status
                </DialogTitle>
                <DialogContent>
                  <Grid
                    item
                    xs={12}
                    container
                    spacing={2}
                    sx={{ marginTop: "2%" }}
                  >
                    <Grid item sm={12} lg={12} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={Program}
                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                          if (newValue) {
                            setOrderId(newValue?.value);
                            setOrderSt(newValue?.label);
                          } else {
                            setOrderId(null);
                            setOrderSt("");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text="status" required={false} />
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid item sm={12} lg={12} xs={12}>
                      <TextField
                        id="remark"
                        name="remark"
                        label={
                          <CustomLabel
                            text={t("text.Remark")}
                            required={false}
                          />
                        }
                        // value={formik.values.circUser.userid}
                        placeholder={t("text.Remark")}
                        size="small"
                        type="text"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={(e) => {
                          setRemark(e.target.value);

                        }}
                      />
                    </Grid>
                    <Grid item sm={4} lg={4} xs={12}>
                      {" "}
                    </Grid>
                    <Grid item sm={4} lg={4} xs={12}>
                      <Button
                        onClick={() => {
                          saveData(); // Call saveData function
                          closeStatus();
                        }}
                        fullWidth
                        style={{
                          backgroundColor: `var(--grid-headerBackground)`,
                          color: `var(--grid-headerColor)`,
                        }}
                      >
                        Save
                      </Button>
                    </Grid>

                    <Grid item sm={4} lg={4} xs={12}>
                      {" "}
                    </Grid>
                  </Grid>
                </DialogContent>
              </Dialog>
            </Grid>

            <Grid item sm={12} lg={12} xs={12}>
              <DataGrid
                rows={zones}
                columns={adjustedColumns}
                rowSpacingType="border"
                autoHeight
                // checkboxSelection
                pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                  value: size,
                  label: `${size}`,
                }))}
                // onRowSelectionModelChange={handleRowSelection}
                // rowSelectionModel={selectedRows} // Default selected rows
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                sx={{
                  border: 0,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: `var(--grid-headerBackground)`,
                    color: `var(--grid-headerColor)`,
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "white",
                  },
                }}
              />
            </Grid>


            <Grid item sm={12} lg={12} xs={12}>
              <OrderComponent

                open={openComp}
                onClose={() => { setOpenComp(false) }}
                orderData={Item}

              />
            </Grid>
          </Grid>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
