import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";

import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import ToastApp from "../ToastApp";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function HourlyTransactionDetails() {
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

  const [isEdit, setisEdit] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    fetchZonesData();
  }, []);

  // }, [isLoading]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  

  const routeChangeEdit = (row: any) => {
    console.log(row);

    setisEdit(true);
    formik.setFieldValue("circClassId", row.circClassId);
    formik.setFieldValue("hrClassName", row.hrClassName);
    formik.setFieldValue("issuedMinutes", row.issuedMinutes);
    formik.setFieldValue("lateFinePerMinute", row.lateFinePerMinute);
    formik.setFieldValue("dayFinePerDay", row.dayFinePerDay);
    // formik.setFieldValue("isActive", row.isActive);
    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: false,
      update: false,
      delete: true,
      read: false,
      instId: 0,
      id: delete_id.toString(),
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/Transaction/DeleteHourlyTransaction`, collectData)
      .then((response: any) => {
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
        // zoneID: -1,
        // user_ID: Userid,
        // // isActive: true
      };
      const response = await api.get(`api/Search/GetHourlyTransactions`);
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.circClassId,
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

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "hrClassName",
            headerName: t("text.ClassName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "issuedMinutes",
            headerName: t("text.IssuedMinutes"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "lateFinePerMinute",
            headerName: t("text.lateFinePerMinute"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "dayFinePerDay",
            headerName: t("text.DayFinePerDay"),
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

  const { menuId, menuName } = getMenuData();

  // interface FormValues {
  //   appId: string;
  //   appName: any;
  //   add: boolean;
  //   update: boolean;
  //   delete: boolean;
  //   read: boolean;
  //   //designationId: any;
  //   designation: string;
  //   shortName: string;
  //   instId: number;
  // }

  const validationSchema = Yup.object({
    hrClassName: Yup.string().test(
      "required",
      "Class Name Is Required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const instId: any = getinstId();

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,

      circClassId: 0,
      hrClassName: "",
      issuedMinutes: 0,
      lateFinePerMinute: 0,
      dayFinePerDay: 0,

      instId: parseInt(instId),
    },

    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      //values.designationId = editId;
      // if (editId !== undefined) {
      //   values.designationId = editId;
      // }

      if (isEdit === false) {
        values = Object.keys(values)
          .filter((objKey: any) => objKey !== "circClassId")
          .reduce((newObj: any, key: any) => {
            newObj[key] = values[key];
            return newObj;
          }, {});
      }

      console.log("before submitting value check", values);
      const response = await api.post(
        `api/Transaction/AddUpdateHourlyTransRule`,
        values
      );

      if (response.data.isSuccess) {
        formik.setFieldValue("hrClassName", "");
        formik.setFieldValue("issuedMinutes", "");
        formik.setFieldValue("dayFinePerDay", "");
        formik.setFieldValue("lateFinePerMinute", "");
        fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  // const requiredFields = ["designation"];

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
                {t("text.HourlyTransaction")}
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
              <Grid xs={12} sm={6} lg={6} item>
                <TranslateTextField
                  label={t("text.ClassName")}
                  value={formik.values.hrClassName}
                  onChangeText={(text: string) =>
                    handleConversionChange("hrClassName", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.hrClassName && formik.errors.hrClassName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.hrClassName)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  type="number"
                  label={
                    <CustomLabel
                      text={t("text.IssuedMinutes")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="issuedMinutes"
                  id="issuedMinutes"
                  value={formik.values.issuedMinutes}
                  placeholder={t("text.IssuedMinutes")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  type="number"
                  label={
                    <CustomLabel
                      text={t("text.LateFinePerMinut")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="lateFinePerMinute"
                  id="lateFinePerMinute"
                  value={formik.values.lateFinePerMinute}
                  placeholder={t("text.LateFinePerMinut")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  type="number"
                  label={
                    <CustomLabel
                      text={t("text.DayFinePerDay")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="dayFinePerDay"
                  id="dayFinePerDay"
                  value={formik.values.dayFinePerDay}
                  placeholder={t("text.DayFinePerDay")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
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
