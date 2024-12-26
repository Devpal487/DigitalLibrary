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
  Modal,
  Autocomplete,
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
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import ToastApp from "../ToastApp";
import nopdf from "../assets/images/imagepreview.jpg";
import dayjs from "dayjs";
import ReactQuill from "react-quill";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function DepartmentMaster2() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [lang, setLang] = useState<Language>("en");

  const { menuId, menuName } = getMenuData();

 

  const { t } = useTranslation();

 

  useEffect(() => {
    fetchZonesData();
    getInstitute();
  }, []);



  const getInstitute = () => {
    const collectData = {
      name: "",
      all: true,
    };
    api.post(`api/Basic/GetInstitutes`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["instituteName"],
          value: res.data.data[index]["instituteCode"],
        });
      }
      setInstOption(arr);
    });
  };

  const [InstOption, setInstOption] = useState([
    { value: "-1", label: t("text.SelectInstitute") },
  ]);


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);

    
    formik.setFieldValue("departmentname", row.departmentname);
    formik.setFieldValue("institutecode", row.institutecode);
    formik.setFieldValue("institutename", row.institutename);
    // formik.setFieldValue("isActive", row.isActive);
    formik.setFieldValue("shortname", row.shortname);
   
   
   

   
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
    api.post(`api/Basic/DeleteDeptmaster`, collectData).then((response: any) => {
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
        //       "dept_id": -1,
        // "dept_name": "",
        // "user_id": "",
        // "inst_ID": -1
      };
      const response = await api.get(`api/Basic/GetDeptmaster`, {
        params: { collectData },
      });
      const data = response.data.data;
      const deptWithIds = data.map((dept: any, index: any) => ({
        ...dept,
        serialNo: index + 1,
        id:dept.departmentcode,
      }));
      setZones(deptWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
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
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "departmentname",
            headerName: t("text.DepartmentName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "shortname",
            headerName: t("text.ShortName"),
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


  const instId: any = getinstId();

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: true,
      update: false,
      delete: false,
      read: false,
      instId:parseInt(instId),

      departmentcode: -1,
      departmentname: "",
      departmentname2: "",
      shortname: "",
      institutecode: 0,
      institutename: "",
      currentPosition: 0,
      currJrnlPosition: 0,
      userid: "",
    },

    onSubmit: async (values: any) => {
      values.departmentcode = editId;

      
      console.log("before submitting value check", values);
      const response = await api.post(`api/Basic/AddUpdateDepartment`, values);

      if (response.data.isSuccess) {
        formik.setFieldValue("departmentname", "");
        formik.setFieldValue("institutename", "");
        formik.setFieldValue("institutecode", "");
        formik.setFieldValue("shortname", "");
       
      
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
                {t("text.deptMaster")}
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
            <Grid xs={12} lg={3} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={InstOption}
                  value={
                    InstOption.find(
                      (option: any) => option.value === formik.values.institutecode
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("institutecode", newValue?.value);
                    formik.setFieldValue("institutename", newValue?.label);

                    formik.setFieldTouched("institutecode", true);
                    formik.setFieldTouched("institutecode", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectInstitute")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={3} xs={12}>
                <TranslateTextField
                  label={t("text.DepartmentName")}
                  value={formik.values.departmentname}
                  onChangeText={(text: string) =>
                    handleConversionChange("departmentname", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.departmentname &&
                formik.errors.departmentname ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.departmentname)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={3} xs={12}>
                <TextField

                id="shortname"
                name="shortname"
                value={formik.values.shortname}
                  label={
                    <CustomLabel text={t("text.ShortName")} required={false} />
                  }

                  placeholder={t("text.ShortName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}

                  inputProps={{ maxLength: 5 }} 
                />
              </Grid>

              

             

              

              <Grid item xs={3} sx={{ m: -1 }}>
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

