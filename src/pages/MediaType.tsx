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
  FormControlLabel,
  Checkbox,
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
import CustomLabel from "../utils/CustomLabel";

export default function MediaType() {
  const { t } = useTranslation();
  const Userid = getId();
  const instId: any = getinstId();
  const { menuId, menuName } = getMenuData();
  const [editId, setEditId] = useState<any>(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [ZoneOption, setZoneOption] = useState([
    { label: t("text.selectGenre") },
  ]);
  const [programsubOption, setProgramSubjectOption] = useState([
    { value: "-1", label: t("text.language_Name") },
  ]);
  // const [subjectOption, setSubjectOption] = useState([
  //   { value: "-1", label: t("text.subject") },
  // ]);
  const [years, setYears] = useState("");
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getSession();
    getlang();
   // getSubject();

  }, []);

  const showhide = async () => {
    setShow(!show);
  };

  const getSession = () => {
    api.get(`api/Admin/GetSessionInformation`).then((res: any) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      if (res.data.isSuccess && res.data.data.length > 0) {
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
//======================Basic/GetMedia Api================
  const getlang = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: false,
      update: false,
      delete: false,
      read: false,
      instId: 0,
      prog: true,
      categ: false,
      lang: false,
      inst: false,
      // media: false,
      // currency: false,
      // castCateg: false,
      // itemStatus: false,
      // sess: false,
    };

    api.get(`api/Basic/GetMedia`).then((res: any) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data.lisProg));

      for (let index = 0; index < res.data.data.lisProg.length; index++) {
        arr.push({
          label: res.data.data.lisProg[index]["currencyName"],
          value: res.data.data.lisProg[index]["currencyCode"],
        });
      }
      console.log("🚀 ~ .then ~ arr:", arr);
      setProgramSubjectOption(arr);
    });
  };
  
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };
// ==========Edit==============================
  const routeChangeEdit = (row: any) => {
    console.log(row);
    setIsEdit(true);
    formik.setFieldValue("media_name", row.media_name);
    formik.setFieldValue("short_name", row.short_name);
    setEditId(row.media_id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      appId: menuId,
      id: delete_id.toString(),
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/Basic/DeleteExchangemaster`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        if (!years) {
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

  const fetchZonesData = async (year: any) => {
    // const collectData = {
    //   appId: menuId,
    //   sess: year,
    //   isActive: true,
     //};
    try {
      const response = await api.get(
        `api/Basic/GetMedia`,
        //`api/Academic/GetProgramSubject`,
        
        //collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.media_id,
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
            field: "media_name",
            headerName: t("text.Media Name"),
            flex: 1,
          },
          {
            field: "short_name",
            headerName: t("text.Short Name"),
            flex: 1,
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

  const validationSchema = Yup.object({
    subject: Yup.string().test(
      "required",
      t("text.reqZoneName"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const instid: any = getinstId();

  //==============AddUpdateMediaType Api===================
  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: true,
      update: false,
      delete: false,
      read: false,
      instId: 0,
      media_id: 0,
      media_name: "",
      short_name: "",
      userid: ""
    },
    onSubmit: async (values: any) => {
        if (isEdit === false) {
          values = Object.keys(values)
            .filter((objKey: any) => objKey !== "media_id")
            .reduce((newObj: any, key: any) => {
              newObj[key] = values[key];
              return newObj;
            }, {});
        }
  
        console.log("before submitting value check", values);
        const response = await api.post(`api/Basic/AddUpdateMediaType`, values);
        if (response.data.isSuccess) {
          // setToaster(true);
          toast.success(response.data.mesg);
         
  
          // setTimeout(() => {
          //   navigate("/DepartmentMaster2");
            
          // }, 900);
  
  
  
        } else {
          // setToaster(true);
          toast.error(response.data.mesg);
        }
      },
    });


  const requiredFields = ["subjectId", "prgId", "sess"];

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

//=========================Form=======================
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
                {t("text.Media Type")}
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
              <Grid item xs={12} sm={3} lg={3}>
              <TranslateTextField
                  label={t("text.Media Name")}
                  value={formik.values.media_name}
                  onChangeText={(text: string) =>
                    handleConversionChange("media_name", text)
                  }
                  required={true}
                  lang={lang}
                />
                  {formik.touched.media_name && formik.errors.media_name ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.media_name)}
                      </div>
                    ) : null}
             
              </Grid>
              <Grid item xs={12} sm={3} lg={3}>
              <TranslateTextField
                  label={t("text.Short Name")}
                  value={formik.values.short_name}
                  onChangeText={(text: string) =>
                    handleConversionChange("short_name", text)
                  }
                  required={true}
                  lang={lang}
                />
                  {formik.touched.short_name && formik.errors.short_name ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.short_name)}
                      </div>
                    ) : null}
                
              </Grid>
             
              <Grid item xs={1.5} sx={{ m: -1 }}>
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

              <Grid item xs={1.5} sx={{ m: -1 }}>
                <ButtonWithLoader
                  buttonText={show === false ? t("text.show") : "hide"}
                  onClickHandler={showhide}
                  fullWidth={true}
                />
              </Grid>

              {show === true ? (
                <Grid item xs={12} sm={3} lg={3}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={ZoneOption}
                    fullWidth
                    size="small"
                    onChange={(event, newValue) => {
                      if (newValue) {
                        fetchZonesData(newValue?.label);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label={t("text.session")} />
                    )}
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </form>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 5,
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
}
