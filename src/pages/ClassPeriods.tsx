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
import ToastApp from "../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getinstId } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import Autocomplete from "@mui/material/Autocomplete";
import { getMenuData } from "../utils/Constant";
import { Button } from "primereact/button";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ClassPeriods() {
    const { t } = useTranslation();
    const Userid = getId();
    const instId:any = getinstId();
    const {menuId, menuName} = getMenuData();
    const [editId, setEditId] = useState<any>(-1);
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
    const [ZoneOption, setZoneOption] = useState([{ label:t("text.selectGenre") }]);
    const [years, setYears] = useState("");
    const [isEdit, setIsEdit]= useState(false);
  useEffect(() => {
    // fetchZonesData();
    getSession();
  }, []);

  const getSession = () => {
    api
      .get(`api/Admin/GetSessionInformation`)
      .then((res:any) => {
        const arr:any = [];
        console.log("result" + JSON.stringify(res.data.data));
        if(res.data.isSuccess && res.data.data.length>0){
            let result = res.data.data[0]["academicSession"];
            setYears(result);
            fetchZonesData(result);
        }
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["academicSession"],
          });
        }
        setZoneOption(arr);
      });
  };


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    setIsEdit(true);
    formik.setFieldValue("periodName", row.periodName);
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("sess", row.sess);
    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      zoneID: delete_id,
      user_ID: Userid,
      isActive: true,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete(`Zone/DeleteZonemaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        if(!years){
            fetchZonesData(years);
        }
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

  const fetchZonesData = async (year:any) => {
    try {
      
      const response = await api.get(`api/Academic/GetClassPeriodBySess`,{params:{sess:year}});
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
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
            field: "periodName",
            headerName: t("text.period"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "sess",
            headerName: t("text.session"),
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

  const validationSchema = Yup.object({
    subject: Yup.string().test(
      "required",
      t("text.reqZoneName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const requiredFields = ["subject"];

  const formik = useFormik({
    initialValues: {
      "appId": menuId,
      "appName": menuName,
      "instId": instId,
      "id": -1,
      "periodName": "",
      "sess": ""
    },
    // validationSchema: validationSchema,
    onSubmit: async (values:any) => {
      if(isEdit === false)
        { values = Object.keys(values).filter((objKey:any) =>
           objKey !== 'id').reduce((newObj:any, key:any) =>
           {
               newObj[key] = values[key];
               return newObj;
           }, {}
       );
      setEditId(-1)
      }


      console.log("before submitting value check", values);
      const response = await api.post(`api/Academic/AddUpdateClassPeriod`, values);
      if (response.data.isSuccess) {
        formik.setFieldValue("periodName", "");
        formik.setFieldValue("sess", "");
        if(years != null || years == ""){
            fetchZonesData(years);
        }
        toast.success(response.data.mesg);
        // setEditId(-1);
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
                {t("text.timeTable")}
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
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.periodname")}
                  value={formik.values.periodName}
                  onChangeText={(text: string) => handleConversionChange('periodName', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.periodName && formik.errors.periodName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.periodName)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                         value={
                          ZoneOption.find(
                      (option:any) => option.label === formik.values.sess
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    if(newValue){
                        setYears(newValue?.label);
                    }
                    formik.setFieldValue("sess", newValue?.label);
                    formik.setFieldTouched("sess", true); 
                    formik.setFieldTouched("sess", false); 
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.session")} />
                  )}
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
              <Grid item xs={2} sx={{ m: -1 }}>
                  <ButtonWithLoader
                    buttonText={t("text.show")}
                   onClickHandler={()=>fetchZonesData(years)}
                    fullWidth={true}
                  />
                </Grid>
            </Grid>
          </form>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin:5
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <DataGrids
              isLoading={isLoading}
              rows={zones}
              columns={adjustedColumns}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialPageSize={5}
            />
          )}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
};