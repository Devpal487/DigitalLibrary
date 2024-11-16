import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";

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
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import api from "../utils/Url";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function DivisionMasterpage() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { t } = useTranslation();

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
    //           console.log("data", pathrow);
    //           setPermissionData(pathrow);
    //           fetchZonesData();
    //         }
    //       }
    //     }
    //   }
    // }

    fetchZonesData();
  }, []);

  // }, [isLoading]);

  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);

  useEffect(() => {
    getVehicleZone();
  }, []);

  const getVehicleZone = () => {
    const collectData = {
      stateId: -1,
      countryId: -1,
    };
    api.post(`api/StateMaster/GetStateMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["stateName"],
          value: res.data.data[index]["stateId"],
        });
      }
      setZoneOption(arr);
    });
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const collectData = {
      zoneID: value.id,
      zoneName: value.zoneName,
      zoneCode: value.zoneCode,
      isActive: event.target.checked,
      user_ID: Userid,
      sortOrder: value.sortOrder,
    };
    api.post(`Zone/AddUpdateZonemaster`, collectData).then((response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        fetchZonesData();
      } else {
        toast.error(response.data.mesg);
      }
    });
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("divisionId", row.divisionId);
    formik.setFieldValue("divisionName", row.divisionName);
    formik.setFieldValue("stateId", row.stateId);
    formik.setFieldValue("stateName", row.stateName);
    formik.setFieldValue("createdBy", row.createdBy);
    formik.setFieldValue("updatedBy", row.updatedBy);
    formik.setFieldValue("createdOn", row.createdOn);
    formik.setFieldValue("updatedOn", row.updatedOn);

    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      divisionId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/DivisionMaster/DeleteDivisionMaster`, collectData )
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
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
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
        divisionId: -1,
        stateId: -1,
      };
      const response = await api.post(
        `api/DivisionMaster/GetDivisionMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.divisionId,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            // headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
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
                  {/* ) : (
                    ""
                  )} */}
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
                 
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "stateName",
            headerName: t("text.StateName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "divisionName",
            headerName: t("text.DivisionName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
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

  const requiredFields = [""];

  const formik = useFormik({
    initialValues: {
      divisionId: -1,
      divisionName: "",
      stateId: 0,
      createdBy: "",
      updatedBy: "",
      createdOn: "2024-08-02T10:12:38.049Z",
      updatedOn: "2024-08-02T10:12:38.049Z",
      stateName: "",
    },

    onSubmit: async (values) => {
      values.divisionId = editId;

      console.log("before submitting value check", values);
      const response = await api.post(
        `api/DivisionMaster/AddUpdateDivisionMaster`,
        values
      );
      if (response.data.isSuccess) {
        formik.setFieldValue("divisionName", "");
        formik.setFieldValue("stateName", "");
        formik.setFieldValue("stateId", "");
        fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

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
                {t("text.DivisionMaster")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={5} lg={5} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  value={
                    ZoneOption.find(
                      (option: any) => option.value === formik.values.stateId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("stateId", newValue?.value);
                    formik.setFieldValue("stateName", newValue?.label);

                    formik.setFieldTouched("stateId", true);
                    formik.setFieldTouched("stateId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectState")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} sm={5} lg={5} item>
                <TranslateTextField
                  label={t("text.DivisionName")}
                  value={formik.values.divisionName}
                  onChangeText={(text: string) =>
                    handleConversionChange("divisionName", text)
                  }
                  required={true}
                  lang={lang}
                />
              </Grid>

              <Grid item xs={2} sx={{ m: -1 }}>
                {/* {editId === -1 && permissionData?.isAdd && ( */}
                {editId === -1 && (
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}

                {editId !== -1 && (
                  <ButtonWithLoader
                    buttonText={t("text.update")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}
              </Grid>
            </Grid>
          </form>

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
