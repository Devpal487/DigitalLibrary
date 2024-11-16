import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import HOST_URL from "../utils/Url";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast ,ToastContainer} from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import DataGrids from "../utils/Datagrids";
import { getMenuData } from "../utils/Constant";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Institutemaster() {
  const [rows, setRows] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );
    //         if (pathrow) {
    //           setPermissionData(pathrow);
    //         }
    //       }
    //     }
    //   }
    // }
    getList();
  }, []);

  // const handleSwitchChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   value: any
  // ) => {
  //   const collectData = {
  //     wardID: value.id,
  //     wardName: value.wardName,
  //     zoneID: value.zoneID,
  //     wardCode: value.wardCode,
  //     isActive: event.target.checked,
  //     user_ID: -1,
  //     sortOrder: 0,
  //   };
  //   api.post(`Ward/AddUpdateWardmaster`, collectData).then((response) => {
  //     if (response.data.isSuccess) {
  //       toast.success(response.data.mesg);
  //       getList();
  //     } else {
  //       toast.error(response.data.mesg);
  //     }
  //   });
  // };

  // Delete Action Option

  const {menuId, menuName} = getMenuData();

  let delete_id = "";

  const accept = () => {
    const collectData = {
     
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: 0,
      id:delete_id.toString()
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/Basic/DeleteInstmaster`, collectData )
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        getList();
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

  const getList = () => {
    const collectData = {
      // id: -1,
      name: "",
      all: true,
    };
    try {
      api.post(`api/Basic/GetInstitutes`, collectData).then((res) => {
        console.log("result" + JSON.stringify(res.data.data));
        const data = res.data.data;
        const arr = data.map((item: any, index: any) => ({
          ...item,
          serialNo: index + 1,
          id:item.instituteCode,
        }));
        // console.log(arr);
        setRows(arr);
        setIsLoading(false);

        if (data.length > 0) {
          const columns: GridColDef[] = [
            {
              field: "actions",
              headerName: t("text.Action"),
              headerClassName: "MuiDataGrid-colCell",
              width: 150,
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
                    {/* // ) : (
                      //   ""
                      // )} */}

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
                    {/* ) : (
                        ""
                      )} */}
{/* 
                    <Switch
                      checked={Boolean(params.row.isActive)}
                      style={{
                        color: params.row.isActive ? "green" : "#FE0000",
                      }}
                      onChange={(value: any) =>
                        handleSwitchChange(value, params.row)
                      }
                      inputProps={{
                        "aria-label": "Toggle Switch",
                      }}
                    /> */}
                  </Stack>,
                ];
              },
            },

            {
              field: "serialNo",
              headerName: t("text.SrNo"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "instituteName",
              headerName: t("text.InstituteName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },
            {
              field: "shortName",
              headerName: t("text.ShortName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "stateName",
              headerName: t("text.StateName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "divisionName",
              headerName: t("text.DivisionName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "districtName",
              headerName: t("text.DistrictName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "blockName",
              headerName: t("text.BlockName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            {
              field: "clusterName",
              headerName: t("text.ClusterName"),
              flex: 1,
              headerClassName: "MuiDataGrid-colCell",
            },

            // {
            //   field: "isActive",
            //   headerName: t("text.DivisionName"),
            //   flex: 1,
            //   headerClassName: "MuiDataGrid-colCell",

            //   renderCell: (params) => [
            //     <Stack direction="row" spacing={1}>
            //       {params.row.isActive ? (
            //         <Chip
            //           label={t("text.Active")}
            //           color="success"
            //           style={{ fontSize: "14px" }}
            //         />
            //       ) : (
            //         <Chip
            //           // label="InActive"
            //           label={t("text.InActive")}
            //           color="error"
            //           style={{ fontSize: "14px" }}
            //         />
            //       )}
            //     </Stack>,
            //   ],
            // },
          ];
          setColumns(columns as any);
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      // setIsLoading(false);
    }
  };

  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/InstituteEdit`;
    navigate(path, {
      state: row,
    });
  };

  /// NEXT PAGE

  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/InstituteAdd`;
    navigate(path);
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
             
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
              {t("text.InstituteMaster")}
            </Typography>
            <Divider />

            {/* Search and ADD buttone Start */}
            <Box height={10} />
            <Stack direction="row" spacing={2} classes="my-2 mb-2">
              {/* {permissionData?.isAdd == true ? ( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
                style={{backgroundColor:`var(--header-background)`}}
              >
                {t("text.add")}
              </Button>
              {/* // ) : (
              //   ""
              // )} */}
              {/* {permissionData?.isPrint == true ? (
                <Button variant="contained" 
                endIcon={<PrintIcon />}
                size="large">
                  {t("text.print")}
                </Button>
              ) : (
                ""
              )} */}
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1 }}
              ></Typography>
            </Stack>

            <DataGrids
              isLoading={isLoading}
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
