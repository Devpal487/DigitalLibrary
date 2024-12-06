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
  TextareaAutosize,
  Modal,
  Table,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../ToastApp";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { getId, getinstId } from "../utils/Constant";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { styled } from "@mui/system";
import UploadIcon from "@mui/icons-material/Upload";
import nopdf from "../../src/assets/images/imagepreview.jpg";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  cautionDigitalContent,
  cautionDigitalContentHeading,
  confirmationbody,
  confirmationHeader,
  msg0,
  msg1,
} from "../utils/Data";
import { getMenuData } from "../utils/Constant";
import UploadFilesDigitalContent from "../UploadFilesDigitalContent";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import * as Yup from "yup";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

export default function CreateDigitalContent() {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const Userid = getId();
  const instId = getinstId();
  const location = useLocation();
  const back = useNavigate();
  const [lang, setLang] = useState<Language>("en");
  const [open, setOpen] = React.useState(false);
  const { menuId, menuName } = getMenuData();
  const [cautionFile, setCautionFile] = useState(0);
  const [digId, setDigId] = useState<any | number>(0);
  const [modal, setModal] = useState(false);
  const [showState, setShowState] = useState();
  const [showAccesion, setShowAccesion] = useState();
  const [showApMember, setShowApMember] = useState();
  const [showContent, setShowContent] = useState();
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [userTypeData, setUserTypeData] = useState([]);
  const [digiUserType, setdigiUserType] = useState([]);
  console.log("🚀 ~ CreateDigitalContent ~ userTypeData:", userTypeData);
  const [contentListOption, setContentListOption] = useState([
    { value: "-1", label: t("text.contentgrp") },
  ]);
  const [audianceListOption, setAudianceListOption] = useState([
    { value: "-1", label: t("text.memberGroup") },
  ]);
  const [digitalListOption, setDigitalListOption] = useState([
    { value: "-1", label: t("text.typeOfContent") },
  ]);
  const [memberListOption, setMemberListOption] = useState([
    { value: "-1", label: t("text.Audience") },
  ]);
  const [programsubOption, setProgramSubOption] = useState([
    { value: "-1", label: t("text.ProgramSub") },
  ]);
  const [subjectOption, setSubjectOption] = useState([
    { value: "-1", label: t("text.Subject") },
  ]);

  const [adminOption, setAdminOption] = useState([
    { value: "-1", label: t("text.AdminType") },
  ]);

  const [isTax, setTax] = useState([
    { value: "-1", label: t("text.SelectTax") },
  ]);

  const [memberGroup, setMemberGroup] = useState([
    { value: "-1", label: t("text.SelectMemberGroup") },
  ]);

  const [currCode, setCurrCode] = useState([
    { value: "-1", label: t("text.SelectCurrency") },
  ]);

  const [contentGroup, setContentGroup] = useState([
    { value: "-1", label: t("text.SelectContentGroup") },
  ]);

  const [isCategory, setCategory] = useState([
    { value: "-1", label: t("text.SelectCategory") },
  ]);

  const [taxOptions, setTaxOptions] = useState<any>([
    { value: "-1", label: t("text.SelectTax"), pcent: 0 },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const InstituteName = sessionStorage.getItem("institutename");

  useEffect(() => {
    setOpen(true);
    getDigitalDDl();
    getProgramSubject();
    getAdmin();
    getPageSetUp();
    getMemberGroup();
    getContentGroup();
    getCurrCode();
    getCategory();
    GetTaxData();
    GetUnitData();
  }, []);

  const GetTaxData = async () => {
    const collectData = {
      taxId: -1,
    };
    const response = await api.post(`api/TaxMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr: any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxName"],
        value: data[index]["taxId"],
        pcent: data[index]["taxPercentage"],
      });
    }
    setTaxOptions(arr);
  };

  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(
      `api/UnitMaster/GetUnitMaster`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions(arr);
  };

  const getMemberGroup = () => {
    api.get(`api/Basic/GetMemberGroup`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["groupName"],
          value: res.data.data[index]["id"],
        });
      }
      setMemberGroup(arr);
    });
  };

  const getCurrCode = () => {
    api.get(`api/Basic/GetExchange?curcode=-1`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["currencyName"],
          value: res.data.data[index]["currencyCode"],
        });
      }
      setCurrCode(arr);
    });
  };

  const getContentGroup = () => {
    api.get(`api/DigitalOperate/GetDigitalDDl`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (
        let index = 0;
        index < res.data.data.digitalGroupList.length;
        index++
      ) {
        arr.push({
          label: res.data.data.digitalGroupList[index]["groupName"],
          value: res.data.data.digitalGroupList[index]["id"],
        });
      }
      setContentGroup(arr);
    });
  };

  // const getCategory = () => {
  //   api.get(`api/Basic/GetBookAccMasterAndCategoryLoadstatus`).then((res) => {
  //     const arr: any = [];
  //     console.log("resultCategory" + JSON.stringify(res.data.data));
  //     for (
  //       let index = 0;
  //       index < res.data.data.digitalGroupList.length;
  //       index++
  //     ) {
  //       arr.push({
  //         label: res.data.data.,
  //         value: res.data.data.digitalGroupList[index]["value"],
  //       });
  //     }
  //     setCategory(arr);
  //   });
  // };

  const getCategory = () => {
    api.get(`api/E_CommDigitalContent/GetReactCategory?id=-1`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["category_LoadingStatus"],
          value: res.data.data[index]["id"],
        });
      }
      setCategory(arr);
    });
  };

  const getPageSetUp = () => {
    api
      .get(`api/Basic/GetPageSetupData?Pageid=${menuName}.aspx`)
      .then((res) => {
        const arr: any = [];
        const AccesionId = 10;
        const ApMemberId = 9;
        const setupIdToFind = 7;
        const ContentId = 8;
        const setupItem = res.data.data.find(
          (item: any) => item.setupId === setupIdToFind
        );
        if (setupItem) {
          setShowState(setupItem.showHide);
        }

        const setupAccesion = res.data.data.find(
          (item: any) => item.setupId === AccesionId
        );
        if (setupAccesion) {
          setShowApMember(setupAccesion.showHide);
        }

        const setupApl = res.data.data.find(
          (item: any) => item.setupId === ApMemberId
        );
        if (setupApl) {
          setShowAccesion(setupApl.showHide);
        }

        const Contentgrp = res.data.data.find(
          (item: any) => item.setupId === ContentId
        );
        if (Contentgrp) {
          setShowContent(Contentgrp.showHide);
        }

        //console.log("resultSetUpPage" + JSON.stringify(res.data.data));
      });
  };

  const handleClose = () => {
    setOpen(false);
    setCautionFile(1);
  };

  const handlefileconfirmation = () => {
    setModal(true);
  };

  const handleBack = () => {
    back(-1);
    // toast.error{cautionFile === 0 ? msg0:<></>}
  };

  const getDigitalDDl = () => {
    api.get(`api/DigitalOperate/GetDigitalDDl`).then((res) => {
      let arr: any = [];
      let memberGroupListarr: any = [];
      let audienceModListarr: any = [];
      let digitalGroupListarr: any = [];

      console.log("result" + JSON.stringify(res.data.data.contentModList));
      for (
        let index = 0;
        index < res.data.data.contentModList.length;
        index++
      ) {
        arr.push({
          label: res.data.data.contentModList[index]["contentType"],
          value: res.data.data.contentModList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.audienceModList.length;
        index++
      ) {
        audienceModListarr.push({
          label: res.data.data.audienceModList[index]["audience"],
          value: res.data.data.audienceModList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.digitalGroupList.length;
        index++
      ) {
        digitalGroupListarr.push({
          label:
            res.data.data.digitalGroupList[index]["groupName"] +
            "-" +
            res.data.data.digitalGroupList[index]["groupDescr"],
          value: res.data.data.digitalGroupList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.memberGroupList.length;
        index++
      ) {
        memberGroupListarr.push({
          label: res.data.data.memberGroupList[index]["groupName"],
          value: res.data.data.memberGroupList[index]["id"],
        });
      }
      setMemberListOption(memberGroupListarr);
      setContentListOption(arr);
      setAudianceListOption(audienceModListarr);
      setDigitalListOption(digitalGroupListarr);

      //setZoneOption(arr);
      console.log(arr);
      console.log(audienceModListarr);
      console.log(digitalGroupListarr);
      console.log(memberGroupListarr);
    });
  };
  const getProgramSubject = () => {
    api
      .post(`api/Academic/GetProgramSubject`, { isActive: true })
      .then((res) => {
        let arr: any = [];
        let subjectarr: any = [];

        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label:
              res.data.data[index]["prgName"] +
              "-" +
              res.data.data[index]["subjectName"],
            value: res.data.data[index]["id"],
          });
        }
        for (let index = 0; index < res.data.data.length; index++) {
          subjectarr.push({
            label: res.data.data[index]["subjectName"],
            value: res.data.data[index]["id"],
          });
        }

        setProgramSubOption(arr);
        setSubjectOption(subjectarr);

        //setZoneOption(arr);
        console.log(arr);
        console.log(subjectarr);
      });
  };

  const getAdmin = () => {
    api.get(`api/Admin/getUsertype`).then((res) => {
      let arr: any = [];

      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["userTypeName"],
          value: res.data.data[index]["userTypeId"],
        });
      }

      setAdminOption(arr);

      //setZoneOption(arr);
      console.log(arr);
    });
  };

  const validationSchema = Yup.object({
    title: Yup.string().test(
      "required",
      "Title is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    contentTypeId: Yup.number().test(
      "required",
      "Content type is required",
      function (value: any) {
        return value > 0;
      }
    ),

    audienceId: Yup.number().test(
      "required",
      "Audience is required",
      function (value: any) {
        return value > 0;
      }
    ),

    progSubjId: Yup.number().test(
      "required",
      "class/Program  is required",
      function (value: any) {
        return value > 0;
      }
    ),

    subjectId: Yup.number().test(
      "required",
      "Subject is required",
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
      update: false,
      delete: false,
      read: false,
      instId: instId,
      id: null,
      title: "",
      descr: "",
      urlIfAny: "",
      givenFileName: "",
      storedFileName: "",
      appliedMembCodes: "",
      appliedAccnos: "",
      contentTypeId: 0,
      contentType: "",
      audienceId: 0,
      memberGroupId: null,
      audience: "",
      dateSaved: new Date().toISOString().slice(0, 10),
      validTill: new Date().toISOString().slice(0, 10),
      forAllUsers: "",
      forMember: "",
      noOfFiles: 0,
      files: "",
      groupId: null,
      groupName: "",
      progSubjId: 0,
      libraryName: "",
      district: "",
      subjectId: 0,
      currencyCode: 0,
      exRate: 0,
      thumbnail: "",
      categoryId: 0,
      categoryLoadStatus: "",
      accessionNo: "",
      unitId: 0,
      taxId: 0,
      unitname: "",
      taxName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      values.libraryName = InstituteName;
      // if(values.memberGroupId == 0){
      //  values.memberGroupId = null}
      console.log(values);
      const response = await api.post(
        `api/DigitalOperate/SaveDigitalContent`,
        values
      );

      if (response.data.isSuccess) {
        //setToaster(false);
        // handleFileId();
        setDigId(parseInt(response.data.data));
        sub(parseInt(response.data.data));
        setOpen(true);
        toast.success(response.data.mesg);
      } else {
        //setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const sub = async (id: any) => {
    let initialValues = {
      appId: menuId,
      appName: menuName,
      digitalContId: id,
      usertypeid: userTypeData,
    };
    const response = await api.post(
      `api/UserInstituteMapping/AddUpdateDigiUserType`,
      initialValues
    );
    if (response.data.isSuccess) {
      //setToaster(false);
      setOpen(true);
      toast.success(response.data.mesg);
    } else {
      //setToaster(true);
      toast.error(response.data.mesg);
    }
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const GradientDivider = styled(Divider)({
    height: "1px",
    background: "linear-gradient(to right, #ff7e5f, #feb47b)", // Gradient colors
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", // Shadow
    border: "none",
  });

  return (
    <>
      <UploadFilesDigitalContent modalOpen={modal} fileId={digId} />
      <Card
        style={{
          width: "100%",
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
          padding: "5px",
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
                {t("text.createdigital")}
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
          <GradientDivider />
          {/* <Divider sx={{ borderColor: '#7C0902' }} /> */}
          <br />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            {/* //{toaster === false ? "" : <ToastApp />} */}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.Title")}
                  value={formik.values.title}
                  onChangeText={(text: string) =>
                    handleConversionChange("title", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.title)}
                  </div>
                ) : null}
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.filecollectionname")}
                  value={formik.values.givenFileName}
                  onChangeText={(text: string) =>
                    handleConversionChange("givenFileName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              {/* {showState && (
                <> */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={contentListOption}
                  value={
                    contentListOption.find(
                      (option: any) =>
                        option.value === formik.values.contentTypeId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("contentTypeId", newValue?.value);
                    formik.setFieldValue("contentType", newValue?.label);
                    formik.setFieldTouched("contentTypeId", true);
                    formik.setFieldTouched("contentTypeId", false);
                  }}
                  renderInput={(params) => (
                    // <TextField {...params} label={t("text.typeOfContent")} />
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.typeOfContent")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  )}
                />

                {formik.touched.contentTypeId && formik.errors.contentTypeId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.contentTypeId)}
                  </div>
                ) : null}
              </Grid>
              {/* </>
              )} */}
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={audianceListOption}
                  value={
                    audianceListOption.find(
                      (option: any) => option.value === formik.values.audienceId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("audienceId", newValue?.value);
                    formik.setFieldValue("audience", newValue?.label);
                    formik.setFieldTouched("audienceId", true);
                    formik.setFieldTouched("audienceId", false);
                  }}
                  renderInput={(params) => (
                    // <TextField {...params} label={t("text.Audience")} />
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.Audience")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  )}
                />

                {formik.touched.audienceId && formik.errors.audienceId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.audienceId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={programsubOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("progSubjId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("progSubjId", true);
                    formik.setFieldTouched("progSubjId", false);
                  }}
                  renderInput={(params) => (
                    // <TextField {...params} label={t("text.classprogramsub")} />
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.classprogramsub")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  )}
                />

                {formik.touched.progSubjId && formik.errors.progSubjId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.progSubjId)}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subjectOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("subjectId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("subjectId", true);
                    formik.setFieldTouched("subjectId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.sub")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  )}
                />

                {formik.touched.subjectId &&
                formik.errors.subjectId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.subjectId)}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  multiple
                  id="combo-box-demo"
                  options={adminOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue);
                    let result: any = [];
                    for (let i = 0; i < newValue.length; i++) {
                      result.push(newValue[i]["value"]);
                    }
                    console.log("result", result);
                    setUserTypeData(result);
                  }}
                  renderInput={(params) => (
                    // <TextField {...params} label={t("text.adminuser")} />
                    <TextField
                      {...params}
                      label={<span>{t("text.adminuser")} </span>}
                    />
                  )}
                />
              </Grid>

              {showState && (
                <>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={memberGroup}
                      fullWidth
                      size="small"
                      onChange={(event, newValue: any) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("memberGroupId", newValue?.value);
                        //formik.setFieldValue("zoneName", newValue?.label);
                        formik.setFieldTouched("memberGroupId", true);
                        formik.setFieldTouched("memberGroupId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("text.SelectMemberGroup")}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={currCode}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("currencyCode", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("currencyCode", true);
                    formik.setFieldTouched("currencyCode", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectCurrency")} />
                    //   <TextField
                    //   {...params}
                    //   label={
                    //     <span>
                    //       {t("text.SelectCurrency")}{" "}
                    //       <span style={{ color: "red" }}>*</span>
                    //     </span>
                    //   }
                    // />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="exRate"
                  name="exRate"
                  type="number"
                  label={<CustomLabel text={t("text.Rate")} required={false} />}
                  value={formik.values.exRate}
                  placeholder={t("text.Rate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {showContent && (
                <>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={contentGroup}
                      fullWidth
                      size="small"
                      onChange={(event, newValue: any) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("groupId", newValue?.value);
                        //formik.setFieldValue("zoneName", newValue?.label);
                        formik.setFieldTouched("groupId", true);
                        formik.setFieldTouched("groupId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("text.SelectContentGroup")}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {showApMember && (
                <>
                  <Grid lg={4} md={4} xs={12} item>
                    <TextField
                      label={
                        <CustomLabel
                          text="Aplicable Members (if any)"
                          required={false}
                        />
                      }
                      value={formik.values.appliedMembCodes}
                      name="appliedMembCodes"
                      id="appliedMembCodes"
                      placeholder="Aplicable Members (if any)"
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </>
              )}

              {showAccesion && (
                <>
                  <Grid lg={4} md={4} xs={12} item>
                    <TextField
                      label={
                        <CustomLabel
                          text="Aplicable Accession (if any)"
                          required={false}
                        />
                      }
                      value={formik.values.appliedAccnos}
                      name="appliedAccnos"
                      id="appliedAccnos"
                      placeholder="Aplicable Accession (if any)"
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={isCategory}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("categoryId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("categoryId", true);
                    formik.setFieldTouched("categoryId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectCategory")} />
                  )}
                />
              </Grid>

              <Grid lg={4} md={4} xs={12} item>
                <TextField
                  type="date"
                  label={
                    <CustomLabel text={t("text.validupto")} required={true} />
                  }
                  value={formik.values.validTill}
                  name="validTill"
                  id="validTill"
                  placeholder={t("text.validupto")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* <Grid lg={4} md={4} xs={12} item>
                <TextField
                  label={
                    <CustomLabel text={t("text.AccnNo")} required={false} />
                  }
                  value={formik.values.accessionNo}
                  name="accessionNo"
                  id="accessionNo"
                  placeholder={t("text.AccnNo")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("taxId", newValue?.value);
                  }}
                  // value={
                  //   taxOptions.find(
                  //     (opt: any) => opt.value === formik.values.gstid
                  //   ) || null
                  // }
                  // value={}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectTax")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={unitOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("unitId", newValue?.value);
                    formik.setFieldValue('unitname',newValue?.label)
                  }}
                  // value={
                  //   unitOptions.find(
                  //     (opt: any) => opt.value === formik.values.unitID
                  //   ) || null
                  // }
                  // value={}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.enterunit")} />}
                    />
                  )}
                />
              </Grid>

              <Grid
                xs={12}
                sm={4}
                lg={4}
                item
                alignItems="center"
                justifyContent="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id="forAllUsers"
                      name="forAllUsers"
                      //checked={formik.values.forAllUsers === 'Y'}
                      onChange={(e) => {
                        console.log("🚀 ~ CreateDigitalContent ~ e:", e);
                        const newValue = e.target.checked ? true : false;
                        console.log(
                          "🚀 ~ CreateDigitalContent ~ newValue:",
                          newValue
                        );
                        formik.setFieldValue("forAllUsers", newValue);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    <span>
                      Check If Public for All{" "}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  labelPlacement="end"
                  // label="Check If Public for All"
                  // labelPlacement="end"
                />
              </Grid>

              <Grid xs={12} sm={12} lg={12} item>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder={t("text.Description")}
                  name="descr"
                  id="descr"
                  style={{
                    width: "100%",
                    fontSize: " 1.075rem",
                    fontWeight: "400",
                    // lineHeight: "5",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                  value={formik.values.descr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/****************Caution Dialog Start**************** */}
              <BootstrapDialog
                onClose={() => {}}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  style={{ font: "bold" }}
                  id="customized-dialog-title"
                >
                  {cautionFile === 0
                    ? cautionDigitalContentHeading
                    : confirmationHeader}
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleBack}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                  {cautionFile === 0 ? cautionDigitalContent : confirmationbody}
                </DialogContent>
                <DialogActions>
                  <Button
                    autoFocus
                    onClick={
                      cautionFile === 0 ? handleClose : handlefileconfirmation
                    }
                  >
                    Yes
                  </Button>
                  <Button autoFocus onClick={handleBack}>
                    No
                  </Button>
                </DialogActions>
              </BootstrapDialog>
              {/****************Caution Dialog End**************** */}

              {/****************Save And Reset Button Start**************** */}
              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
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
                  onClick={(e: any) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
              {/****************Save And Reset Button End**************** */}
            </Grid>
          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
