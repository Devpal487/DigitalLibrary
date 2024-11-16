import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
//import HOST_URL from "../../utils/Url";
import Card from "@mui/material/Card";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import DataGrids from "../utils/Datagrids";
import api from "../utils/Url";
import { getMenuData } from "../utils/Constant";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function MemberPetron() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  let navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const dataString = localStorage.getItem("userdata");
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
    //         console.log("data", pathrow);
    //         if (pathrow) {
    //           setPermissionData(pathrow);
    //         }
    //       }
    //     }
    //   }
    // }
    fetchZonesData();
  }, []);
  // }, [isLoading]);
  const routeChangeAdd = () => {
    let path = `/MemberPetronAdd`;
    navigate(path);
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    console.log(value);
    const collectData = {
      empid: value.id,
      empName: value.empName,
      empCode: value.empCode,
      isActive: event.target.checked,
      userID: -1,
      sortOrder: 0,
    };
    api.post(`EmpMaster/AddUpdateEmpMaster`, collectData).then((response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        fetchZonesData();
      } else {
        toast.error(response.data.mesg);
      }
    });
  };
  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/MemberPetronEdit`;
    navigate(path, {
      state: row,
    });
  };

  let delete_id = "";
  const { menuId, menuName } = getMenuData();

  const accept = () => {
    const collectData = {
      ids: delete_id.toString(),
      //id: "",
      //longId: 0,
      appName: menuName,
      request: "",
    };
    console.log("collectData " + JSON.stringify(collectData));
    api.post(`api/CircUser/DeleteCircUser`, collectData).then((response) => {
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
        // empid: -1,
        // userId: "-1",
        // empName: "",
        // empMobileNo: "",
        // empPincode: 0,
        // roleId: "-1",
        // empDesignationId: -1,
        // empDeptId: -1,
        // empStateId: -1,
        // empCountryID: -1,
        // empCityId: -1,
      };
      console.log("collectData", collectData);
      const response = await api.get(`api/Basic/GetCircUserManagement`, {
        params: { collectData },
      });
      console.log("result", response.data.data);
      const data = response.data.data;
      const zonesWithIds = data.map((emp: any, index: any) => ({
        ...emp,
        serialNo: index + 1,
        id: emp.userid,
      }));

      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 90,

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
                  {/*  "" */}
                  {/*)} */}
                  {/*{permissionData?.isDel ? ( */}
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
                  {/* ) : ( */}
                  {/*  "" */}
                  {/* )} */}
                  {/* <Switch
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

          // {
          //   field: "empid",
          //   headerName: "Emp Id",
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          // },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "firstname",
            headerName: t("text.Name"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "membName",
            headerName: t("text.MemberName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "remarks",
            headerName: t("text.Remark"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "email1",
            headerName:t('text.Email'),
            flex: 1.5,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "userid",
            headerName: t("text.UserId"),
            flex: 0.5,
            headerClassName: "MuiDataGrid-colCell",
          },

          // {
          //   field: "empStatus",
          //   headerName: "Emp status",
          //   flex: 1,
          //   headerClassName: "MuiDataGrid-colCell",
          //   renderCell: (params) => [
          //     <Stack direction="row" spacing={1}>
          //       {params.row.isActive ? (
          //         <Chip
          //           label={t("Active")}
          //           color="success"
          //           style={{ fontSize: "14px" }}
          //         />
          //       ) : (
          //         <Chip
          //           label={"InActive"}
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
          border: ".5px solid #2B4593 ",
          marginTop: "3vh",
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
            {t("text.MemberPatron")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/*permissionData?.isAdd == true && ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{backgroundColor:`var(--header-background)`}}
            >
              {t("text.Add")}
            </Button>
            {/*)} */}

            {/*{permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
          </Stack>

          <DataGrids
            isLoading={isLoading}
            rows={zones}
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
