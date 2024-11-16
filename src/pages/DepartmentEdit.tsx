import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
//import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getMenuData } from "../utils/Constant";

type Props = {};

const DepartmentEdit = (props: Props) => {
  console.log("useLocation " + useLocation());
  const location = useLocation();
  console.log("location", location.state);

  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  // const validationSchema = Yup.object({
  //   // zoneName: Yup.string().required("* Enter Zone Name should be required"),
  //   dept_name: Yup.string().test(
  //     'required', // Unique name for the test
  //     t('text.req'), // Translation for "* Enter Zone Name required"
  //     function (value: any) {
  //       return value && value.trim() !== ''; // Your validation logic here
  //     }
  //   ),
  // });

  useEffect(() => {
    getVehicleZone();
  }, []);

  const getVehicleZone = () => {
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
      setZoneOption(arr);
    });
  };

  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectInstitute") },
  ]);

  const { menuId, menuName } = getMenuData();

  const validationSchema = Yup.object({
    departmentname: Yup.string().test(
      "required",
      "Department  is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: false,
      update: true,
      delete: false,
      read: true,
      instId: 0,
      departmentcode: location.state.departmentcode,

      departmentname: location.state.departmentname,
      shortname: location.state.shortname,
      institutecode: location.state.institutecode,
      institutename: location.state.institutename,
      departmentname2: location.state.departmentname2,
      currentPosition: location.state.currentPosition,
      currJrnlPosition: location.state.currJrnlPosition,
      userid: location.state.userid,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(`api/Basic/AddUpdateDepartment`, values);
      // console.log("API Response:", response.data);
      if (response.data.isSuccess) {
        // setToaster(false);
        toast.success(response.data.mesg);
        setTimeout(() => {
          navigate("/DepartmentMaster2");
        }, 900);
      } else {
        // setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [""];

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: `var(--header-background)`,
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.editdeptmaster")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
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
          <br />
          <form onSubmit={formik.handleSubmit}>
            {/* {toaster === false ? "" : <ToastApp />} */}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} lg={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  value={
                    ZoneOption.find(
                      (option: any) =>
                        option.value === formik.values.institutecode
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

              <Grid item lg={4} xs={12}>
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

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.ShortName")}
                  value={formik.values.shortname}
                  onChangeText={(text: string) =>
                    handleConversionChange("shortname", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.update")}
                  </Button>
                </Grid>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default DepartmentEdit;
