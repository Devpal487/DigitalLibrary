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
import { getId, getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Program_Master() {
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

  useEffect(() => {
    getDepartment();
  }, []);

  const getDepartment = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetDeptmaster`, { params: { collectData } })
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.departmentname,
          value: item.departmentcode,
        }));
        setZoneOption(arr);
      });
  };

  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  // const handleSwitchChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   value: any
  // ) => {
  //   const collectData = {
  //     zoneID: value.id,
  //     zoneName: value.zoneName,
  //     zoneCode: value.zoneCode,
  //     isActive: event.target.checked,
  //     user_ID: Userid,
  //     sortOrder: value.sortOrder,
  //   };
  //   api.post(`Zone/AddUpdateZonemaster`, collectData).then((response) => {
  //     if (response.data.isSuccess) {
  //       toast.success(response.data.mesg);
  //       fetchZonesData();
  //     } else {
  //       toast.error(response.data.mesg);
  //     }
  //   });
  // };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    setisEdit(true);
    formik.setFieldValue("program_id", row.program_id);
    formik.setFieldValue("program_name", row.program_name);
    formik.setFieldValue("short_name", row.short_name);
    formik.setFieldValue("deptcode", row.deptcode);
    formik.setFieldValue("department", row.department);
    formik.setFieldValue("instId", row.instId);
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
      read: true,
      instId: 0,
      id: delete_id.toString(),
    };
    console.log("collectData " + JSON.stringify(collectData));
    api.post(`api/Basic/DeleteProgramMaster`, collectData).then((response) => {
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
      const collectData = {};
      const response = await api.get(`api/Basic/GetProgramMasterByName`, {
        params: { collectData },
      });
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.program_id,
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
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "program_name",
            headerName: t("text.Course"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "short_name",
            headerName: t("text.ShortName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "department",
            headerName: t("text.DepartmentName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          // {
          //   field: "isActive",
          //   headerName: t("text.Status"),
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  const { menuId, menuName } = getMenuData();

  const validationSchema = Yup.object({
    deptcode: Yup.string().test(
      "required",
      t("text.DepartmentRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    program_name: Yup.string().test(
      "required",
      t("text.ProgramNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    short_name: Yup.string().test(
      "required",
      t("text.ShortNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  // interface FormValues {
  //   appId: string;
  //   appName: any;
  //   add: boolean;
  //   update: boolean;
  //   delete: boolean;
  //   read: boolean;
  //   program_id: any;
  //   program_name: string;
  //   short_name: string;
  //   deptcode: number;
  //   userid: string;
  //   department: string;
  //   instId: number;
  // }

  const instId:any = getinstId();

  const [isEdit, setisEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
     
      program_id:0,
      program_name: "",
      short_name: "",
      deptcode: -1,
      userid: "",
      department: "",
      instId:parseInt(instId),
    },
    validationSchema: validationSchema,
    onSubmit: async (values:any) => {
      //values.program_id = editId;
      // if (editId !== undefined) {
      //   values.program_id = editId;
      // }

      if(isEdit === false)
        { values = Object.keys(values).filter((objKey:any) =>
           objKey !== 'program_id').reduce((newObj:any, key:any) =>
           {
               newObj[key] = values[key];
               return newObj;
           }, {}
       );}

      console.log("before submitting value check", values);
      const response = await api.post(
        `api/Basic/AddUpdateProgramMaster`,
        values
      );
      if (response.data.isSuccess) {
        formik.setFieldValue("program_name", "");
        formik.setFieldValue("short_name", "");
        formik.setFieldValue("deptcode", -1);
        formik.setFieldValue("department", "");
        fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = ["deptcode",'short_name'];

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
                {t("text.ProgramCourses")}
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
              <Grid xs={12} sm={3} lg={3} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  value={
                    ZoneOption.find(
                      (option: any) => option.value === formik.values.deptcode
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("deptcode", newValue?.value);
                    formik.setFieldValue("department", newValue?.label);

                    formik.setFieldTouched("deptcode", true);
                    formik.setFieldTouched("deptcode", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDepartment")}
                          required={requiredFields.includes("deptcode")}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.deptcode && formik.errors.deptcode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.deptcode)}
                  </div>
                ) : null}
              </Grid>
              <Grid xs={12} sm={3} lg={3} item>
                <TranslateTextField
                  label={t("text.CourseName")}
                  value={formik.values.program_name}
                  onChangeText={(text: string) =>
                    handleConversionChange("program_name", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.program_name && formik.errors.program_name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.program_name)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={3} lg={3}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.ShortName")}
                      required={requiredFields.includes("short_name")}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="short_name"
                  id="short_name"
                  value={formik.values.short_name}
                  placeholder={t("text.ShortName")}
                  onChange={formik.handleChange}
                />

                {formik.touched.short_name && formik.errors.short_name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.short_name)}
                  </div>
                ) : null}
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
