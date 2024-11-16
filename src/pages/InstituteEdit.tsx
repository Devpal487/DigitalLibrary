import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import { getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";

type Props = {};

const InstituteEdit = (props: Props) => {
  const { t } = useTranslation();
  const [option, setOption] = useState([
    { value: "-1", label: t("text.selectDivision") },
  ]);
  const [lang, setLang] = useState<Language>("en");

  let navigate = useNavigate();
  const [toaster, setToaster] = useState(false);
  const location = useLocation();
  console.log("Checklocation", location.state);

  const [DivOption, setDivOption] = useState([
    { value: "-1", label: t("text.SelectState") },
  ]);

  const [DistOption, setDistOption] = useState([
    { value: "-1", label: t("text.SelectDistrict") },
  ]);
  const [BlockOption, setBlockOption] = useState([
    { value: "-1", label: t("text.SelectBlock") },
  ]);

  const [ClustOption, setClustOption] = useState([
    { value: "-1", label: t("text.SelectCluster") },
  ]);

  useEffect(() => {
    getstate();
    //getDivision();
    //getDistrict();
    //getCluster();
    //getBlock();
    getPageSetUp();
  }, []);

  const [showState, setShowState] = useState();

  const getPageSetUp = () => {
    api
      .get(`api/Basic/GetPageSetupData?Pageid=${menuName}.aspx`)
      .then((res) => {
        const arr: any = [];

        const setupIdToFind = 11;
        const setupItem = res.data.data.find(
          (item: any) => item.setupId === setupIdToFind
        );
        if (setupItem) {
          setShowState(setupItem.showHide);
        }
        console.log("resultSetUpPage" + JSON.stringify(res.data.data));
      });
  };

  const getstate = () => {
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
      setDivOption(arr);
    });
  };

  const getDistrict = (DivId: any) => {
    const collectData = {
      districtId: -1,
      stateId: -1,
      divisionId: DivId,
    };
    api
      .post(`api/DistrictMaster/GetDistrictMaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["districtName"],
            value: res.data.data[index]["districtId"],
          });
        }
        setDistOption(arr);
      });
  };

  const getCluster = (BlockId: any) => {
    const collectData = {
      clusterId: -1,
      stateId: -1,
      divisionId: -1,
      districtId: -1,
      blockId: BlockId,
    };
    api.post(`api/ClusterMaster/GetClusterMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["clusterName"],
          value: res.data.data[index]["clusterId"],
        });
      }
      setClustOption(arr);
    });
  };

  const getBlock = (DistId: any) => {
    const collectData = {
      blockId: -1,
      stateId: -1,
      divisionId: -1,
      districtId: DistId,
      instId: -1,
    };
    api.post(`api/BlockMaster/GetBlockMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["blockName"],
          value: res.data.data[index]["blockId"],
        });
      }
      setBlockOption(arr);
    });
  };

  const getDivision = (stateID: any) => {
    const collectData = {
      divisionId: -1,
      stateId: stateID,
    };
    api
      .post(`api/DivisionMaster/GetDivisionMaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["divisionName"],
            value: res.data.data[index]["divisionId"],
          });
        }
        setOption(arr);
      });
  };

  const { menuId, menuName } = getMenuData();

  // console.log(location.state.zoneID);

  const validationSchema = Yup.object({
    stateId: Yup.number().test(
      "required",
      "State  is required",
      function (value: any) {
        return value > 0;
      }
    ),

    divisionId: Yup.number().test(
      "required",
      "Division is required",
      function (value: any) {
        return value > 0;
      }
    ),

    districtId: Yup.number().test(
      "required",
      "District is required",
      function (value: any) {
        return value > 0;
      }
    ),

    blockId: Yup.number().test(
      "required",
      "Block is required",
      function (value: any) {
        return value > 0;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: location.state.instId,

      instituteCode: location.state.instituteCode,
      libId: location.state.libId,
      instituteName: location.state.instituteName,
      shortName: location.state.shortName,
      userid: location.state.userid,
      active: location.state.active,
      stateId: location.state.stateId,
      divisionId: location.state.divisionId,
      id: location.state.id.toString(),

      districtId: location.state.districtId,
      blockId: location.state.blockId,
      clusterId: location.state.clusterId,
      instAddress: location.state.instAddress,
      email: location.state.email,
      phone: location.state.phone,
      city: location.state.city,

      libNos: location.state.libNos,
      memberName: location.state.memberName,
      departmentname: location.state.departmentname,
      departmentcode: location.state.departmentcode,
      stateName: location.state.stateName,
      divisionName: location.state.divisionName,
      districtName: location.state.districtName,
      blockName: location.state.blockName,

      clusterName: location.state.clusterName,
      userName: location.state.userName,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(`api/Basic/AddUpdateInst`, values);

      if (response.data.isSuccess) {
        // setToaster(false);
        toast.success(response.data.mesg);
        setTimeout(() => {
          navigate("/Institutemaster");
        }, 900);
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }

      // try {
      //       // console.log("API Response:", response.data);
      //       alert(response.data.mesg);
      //       navigate("/master/WardMaster");
      //     } catch (error) {
      //       // console.error("API Error:", error);
      //       alert(response.data.mesg);
      //     }
    },
  });

  const requiredFields = ["stateId", "divisionId", "districtId", "blockId"];

  const back = useNavigate();

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          marginTop: "3vh",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
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
                {t("text.EditInstitute")}
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
            {/* <ToastContainer />
            {toaster === false ? "" : <ToastApp />} */}
            <Grid container spacing={1}>
              <Grid xs={12} sm={4} item>
                <TranslateTextField
                  label={t("text.EnterInstituteName")}
                  value={formik.values.instituteName}
                  onChangeText={(text: string) =>
                    handleConversionChange("instituteName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TranslateTextField
                  label={t("text.ShortName")}
                  value={formik.values.shortName}
                  onChangeText={(text: string) =>
                    handleConversionChange("shortName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              {showState && (
                <>
                  <Grid xs={12} sm={4} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={DivOption}
                      value={
                        DivOption.find(
                          (option: any) =>
                            option.value === formik.values.stateId
                        ) || null
                      }
                      fullWidth
                      size="small"
                      onChange={(event, newValue) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("stateId", newValue?.value);
                        formik.setFieldValue("stateName", newValue?.label);
                        getDivision(newValue?.value);

                        formik.setFieldTouched("stateId", true);
                        formik.setFieldTouched("stateId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel
                              text={t("text.SelectState")}
                              required={requiredFields.includes("stateId")}
                            />
                          }
                        />
                      )}
                    />

                    {formik.touched.stateId && formik.errors.stateId ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.stateId)}
                      </div>
                    ) : null}
                  </Grid>
                </>
              )}

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  value={
                    option.find(
                      (option: any) => option.value === formik.values.divisionId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("divisionId", newValue?.value);
                    formik.setFieldValue("divisionName", newValue?.label);
                    getDistrict(newValue?.value);

                    formik.setFieldTouched("divisionId", true);
                    formik.setFieldTouched("divisionId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDivision")}
                          required={requiredFields.includes("divisionId")}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.divisionId && formik.errors.divisionId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.divisionId)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DistOption}
                  value={
                    DistOption.find(
                      (option: any) => option.value === formik.values.districtId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("districtId", newValue?.value);
                    formik.setFieldValue("districtName", newValue?.label);
                    getBlock(newValue?.value);

                    formik.setFieldTouched("districtId", true);
                    formik.setFieldTouched("districtId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDistrict")}
                          required={requiredFields.includes("districtId")}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.districtId && formik.errors.districtId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.districtId)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={BlockOption}
                  value={
                    BlockOption.find(
                      (option: any) => option.value === formik.values.blockId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("blockId", newValue?.value);
                    formik.setFieldValue("blockName", newValue?.label);
                    getCluster(newValue?.value);

                    formik.setFieldTouched("blockId", true);
                    formik.setFieldTouched("blockId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectBlock")}
                          required={requiredFields.includes("blockId")}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.blockId && formik.errors.blockId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.blockId)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ClustOption}
                  value={
                    ClustOption.find(
                      (option: any) => option.value === formik.values.clusterId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("clusterId", newValue?.value);
                    formik.setFieldValue("clusterName", newValue?.label);

                    formik.setFieldTouched("clusterId", true);
                    formik.setFieldTouched("clusterId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectCluster")}
                          required={requiredFields.includes("clusterId")}
                        />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  <ButtonWithLoader
                    buttonText={t("text.update")}
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
                  onClick={(e: any) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
                {/* <ButtonWithLoader
                    buttonText={t("text.reset")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                    
                  /> */}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default InstituteEdit;
