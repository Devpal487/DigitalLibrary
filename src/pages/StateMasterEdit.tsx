import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { HOST_URL } from "../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import { getISTDate } from "../utils/Constant";

type Props = {};

const StateMasterEdit = (props: Props) => {
  const location = useLocation();
  console.log("location", location.state);

  let navigate = useNavigate();
  const { t } = useTranslation();
  const [toaster, setToaster] = useState(false);
  const [option, setOption] = useState([
    { value: "-1", label: "Select Country Name" },
  ]);

  const [lang, setLang] = useState<Language>("en");

  const defaultTime = getISTDate();
  const defaultValuesTime = defaultTime.defaultValuestime;

  useEffect(() => {
    getCountryName();
  }, []);

  const getCountryName = () => {
    const collectData = {
      countryId: -1,
    };
    api.post(`api/Country/GetCountryMaster`, collectData).then((res) => {
      const arr = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["countryName"],
          value: res.data.data[index]["countryId"],
        });
      }
      setOption(arr);
    });
  };

  const validationSchema = Yup.object({
    stateName: Yup.string().test(
      "required",
      "State Name  is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      stateId: location.state.stateId,
      stateName: location.state.stateName,
      stateCode: location.state.stateCode,
      countryId: location.state.countryId,
      createdBy: location.state.createdBy,
      updatedBy: location.state.updatedBy,
      createdOn: defaultValuesTime,
      updatedOn: defaultValuesTime,
      countryName: location.state.countryName,
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const response = await api.post(
        `api/StateMaster/AddUpdateStateMaster`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/StateMaster");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [""];
  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };
  const back = useNavigate();

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          border: ".5px solid #2B4593",
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
                {t("text.EditStateMaster")}
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
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  value={
                    option.find(
                      (option) => option.value === formik.values.countryId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("countryId", newValue?.value);
                    formik.setFieldValue("countryName", newValue?.label);

                    formik.setFieldTouched("countryId", true);
                    formik.setFieldTouched("countryId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCountryName")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.EnterStateName")}
                  value={formik.values.stateName}
                  onChangeText={(text: string) =>
                    handleConversionChange("stateName", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.stateName && formik.errors.stateName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.stateName)}
                  </div>
                ) : null}
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.ShortName")}
                  value={formik.values.stateCode}
                  onChangeText={(text: string) =>
                    handleConversionChange("stateCode", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  {/* <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.update")}
                  </Button> */}
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
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
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    formik.resetForm();
                  }}
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

export default StateMasterEdit;
