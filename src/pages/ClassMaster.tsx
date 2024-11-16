import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  Stack,
  Table,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import HOST_URL from "../utils/Url";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import { getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import DataGrids from "../utils/Datagrids";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const Membership = [
  { label: "Free", value: "Free" },
  { label: "Paid", value: "Paid" },
];

const SecurityFee = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" },
];

type Props = {};

const ClassMaster = (props: Props) => {
  const { t } = useTranslation();

  const [classTable, setClassTable] = useState([]);

  const [isVisible, setIsVisible] = useState(false);

  const [dept, setDept] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentTable();
  }, []);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const handleAccordionToggle = () => {
    setAccordionExpanded((prev) => !prev);
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const routeChangeEdit = (row: any) => {
    //console.log(row);
    formik.setFieldValue("classname", row.classname);
    formik.setFieldValue("totalissueddays", row.totalissueddays);
    formik.setFieldValue("noofbookstobeissued", row.noofbookstobeissued);
    formik.setFieldValue("finperday", row.finperday);
    formik.setFieldValue("reservedays", row.reservedays);
    formik.setFieldValue("totalissueddays_jour", row.totalissueddays_jour);
    formik.setFieldValue("noofjournaltobeissued", row.noofjournaltobeissued);
    formik.setFieldValue("fineperday_jour", row.fineperday_jour);
    formik.setFieldValue("reservedays_jour", row.reservedays_jour);
    formik.setFieldValue("status", row.status);
    formik.setFieldValue("canRequest", row.canRequest);
    formik.setFieldValue("valueLimit", row.valueLimit);
    formik.setFieldValue("days_1Phase", row.days_1Phase);
    formik.setFieldValue("amt_1Phase", row.amt_1Phase);

    formik.setFieldValue("days_2Phase", row.days_2Phase);
    formik.setFieldValue("amt_2Phase", row.amt_2Phase);
    formik.setFieldValue("days_1Phasej", row.days_1Phasej);
    formik.setFieldValue("amt_1Phasej", row.amt_1Phasej);
    formik.setFieldValue("days_2Phasej", row.days_2Phasej);
    formik.setFieldValue("amt_2Phasej", row.amt_2Phasej);
    formik.setFieldValue("shortname", row.shortname);
    formik.setFieldValue("userid", row.userid);
    formik.setFieldValue("policystatus", row.policystatus);
    formik.setFieldValue("membershipType", row.membershipType);
    formik.setFieldValue("security", row.security);
    formik.setFieldValue("isSecurity", row.isSecurity);
    formik.setFieldValue("securityAmount", row.securityAmount);
    formik.setFieldValue("daysAfterOverdue", row.daysAfterOverdue);

    setAccordionExpanded(true);

    //setEditId(row.id);
  };

  const getStudentTable = async () => {
    try {
      const response = await api.get(`api/CircUser/GetCircClass`);
      const data = response?.data?.data;

      //console.log('GetStudentTable',data);

      const formattedData = data?.map((student: any, index: number) => ({
        ...student,
        id: index + 1,
        serialNo: index + 1,
      }));
      setDept(formattedData);
      // console.log("CheckStudentTable", formattedData);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            // headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 80,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                </Stack>,
              ];
            },
          },
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "classname",
            headerName: t("text.MemberGroup"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "valueLimit",
            headerName: t("text.ValueLimit"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "canRequest",
            headerName: t("text.AllowedToRecommendForPurchase"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "status",
            headerName: t("text.DeactivationStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "policystatus",
            headerName: t("text.PolicyStatus"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "daysAfterOverdue",
            headerName: t("text.DaysAfterOvdStops"),
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

  const getClassTable = () => {
    api.get(`api/Basic/GetCategory`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          categoryStatus: res.data.data[index]["category_LoadingStatus"],
          id: res.data.data[index]["id"],
        });
      }
      setClassTable(arr);
    });
  };

  const instId: any = getinstId();

  const SaveClassMaster = () => {
    const collectData = {
      classMasterMod: {
        appId: menuId,
        appName: menuName,
        instId: parseInt(instId),
        classname: formik.values.classname || "",
        totalissueddays: formik.values.totalissueddays || 0,
        noofbookstobeissued: formik.values.noofbookstobeissued || 0,
        finperday: formik.values.finperday || 0,
        reservedays: formik.values.reservedays || 0,
        totalissueddays_jour: formik.values.totalissueddays_jour || 0,
        noofjournaltobeissued: formik.values.noofjournaltobeissued || 0,
        fineperday_jour: formik.values.fineperday_jour || 0,
        reservedays_jour: formik.values.reservedays_jour || 0,
        status: formik.values.status || "",
        canRequest: formik.values.canRequest || "",
        valueLimit: formik.values.valueLimit || 0,
        days_1Phase: formik.values.days_1Phase || 0,
        amt_1Phase: formik.values.amt_1Phase || 0,
        days_2Phase: formik.values.days_2Phase || 0,
        amt_2Phase: formik.values.amt_2Phase || 0,
        days_1Phasej: formik.values.days_1Phasej || 0,
        amt_1Phasej: formik.values.amt_1Phasej || 0,
        days_2Phasej: formik.values.days_2Phasej || 0,
        amt_2Phasej: formik.values.amt_2Phasej || 0,
        shortname: formik.values.shortname || "",
        userid: formik.values.userid || "",
        policystatus: formik.values.policystatus || "",
        membershipType: formik.values.membershipType || "",
        security: formik.values.security || "",
        isSecurity: true,
        securityAmount: formik.values.securityAmount || 0,
        daysAfterOverdue: formik.values.daysAfterOverdue || 0,
      },
      classMasterLoadingMod: {
        appId: menuId,
        appName: menuName,
        instId: parseInt(instId),
        classname: formik.values.classname || "",
        loadingStatus: 0,
        status: formik.values.status || "",
        totalissueddays: formik.values.totalissueddays || 0,
        noofbookstobeissued: formik.values.noofbookstobeissued || 0,
        finperday: formik.values.finperday || 0,
        reservedays: formik.values.reservedays || 0,
        totalissueddays_jour: formik.values.totalissueddays_jour || 0,
        noofjournaltobeissued: formik.values.noofjournaltobeissued || 0,
        fineperday_jour: formik.values.fineperday_jour || 0,
        reservedays_jour: formik.values.reservedays_jour || 0,
        valueLimit: formik.values.valueLimit || 0,
        days_1phase: formik.values.days_1Phase || 0,
        amt_1phase: formik.values.amt_1Phase || 0,
        days_2phase: formik.values.days_2Phase || 0,
        amt_2phase: formik.values.amt_2Phase || 0,
        days_1phasej: formik.values.days_1Phasej || 0,
        amt_1phasej: formik.values.amt_1Phasej || 0,
        days_2phasej: formik.values.days_2Phasej || 0,
        amt_2phasej: formik.values.amt_2Phasej || 0,
        shortname: formik.values.shortname || "",
        isSecurity: true,
        securityAmount: formik.values.securityAmount || 0,
        daysAfterOverDue: formik.values.daysAfterOverdue || 0,
      },
    };

    api
      .post(`api/CircUser/AddUpdCircClassMasterLoading`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
          formik.resetForm();
        } else {
          toast.error(res.data.mesg);
        }
      });
  };

  const handleCheckboxChange = (event: any) => {
    if (event.target.checked) {
      getClassTable();
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleDeactivate = (event: any) => {
    if (event.target.checked) {
      formik.setFieldValue("status", "Y");
    } else {
      formik.setFieldValue("status", "N");
    }
  };

  const handleRequest = (event: any) => {
    if (event.target.checked) {
      formik.setFieldValue("canRequest", "Y");
    } else {
      formik.setFieldValue("canRequest", "N");
    }
  };

  const [lang, setLang] = useState<Language>("en");

  let navigate = useNavigate();

  const back = useNavigate();
  const [toaster, setToaster] = useState(false);
  const { menuId, menuName } = getMenuData();

  const validationSchema = Yup.object({
    // totalissueddays: Yup.number().required("Issued Days Limit is required"),
    // noofbookstobeissued: Yup.number().required("Issued Item Limit is required"),
    // reservedays: Yup.number().required("Reservation Limit (Days) is required"),
    //finperday: Yup.number().required("Fine Per Day is required"),
    //days_1Phase: Yup.number().required("Days 1 Phase is required"),
    //days_2Phase: Yup.number().required("Days 2 Phase is required"),
    // amt_1Phase: Yup.number().required("Amount 1 Phase is required"),
    // amt_2Phase: Yup.number().required("Amount 2 Phase is required"),
    //classname: Yup.string().required("member group is required"),
    //shortname: Yup.string().required("ShortName  is required"),

    totalissueddays: Yup.number().test(
      "required",
      "Issued Days Limit is required",
      function (value: any) {
        return value > 0;
      }
    ),

    noofbookstobeissued: Yup.number().test(
      "required",
      "Issued Item Limit is required",
      function (value: any) {
        return value > 0;
      }
    ),

    reservedays: Yup.number().test(
      "required",
      "Reservation Limit (Days) is required",
      function (value: any) {
        return value > 0;
      }
    ),

    finperday: Yup.number().test(
      "required",
      "Fine Per Day is required",
      function (value: any) {
        return value > 0;
      }
    ),

    days_1Phase: Yup.number().test(
      "required",
      "Days 1 Phase is required",
      function (value: any) {
        return value > 0;
      }
    ),

    days_2Phase: Yup.number().test(
      "required",
      "Days 2 Phase is required",
      function (value: any) {
        return value > 0;
      }
    ),

    amt_1Phase: Yup.number().test(
      "required",
      "Amount 1 Phase is required",
      function (value: any) {
        return value > 0;
      }
    ),
    amt_2Phase: Yup.number().test(
      "required",
      "Amount 2 Phase is required",
      function (value: any) {
        return value > 0;
      }
    ),

    classname: Yup.string().test(
      "required",
      "Member group is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    shortname: Yup.string().test(
      "required",
      "Short name is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,

      instId: parseInt(instId),
      classname: "",
      totalissueddays: 0,
      noofbookstobeissued: 0,
      finperday: 0,
      reservedays: 0,
      totalissueddays_jour: 0,
      noofjournaltobeissued: 0,
      fineperday_jour: 0,
      reservedays_jour: 0,
      status: "",
      canRequest: "",
      valueLimit: 0,
      days_1Phase: 0,
      amt_1Phase: 0,
      days_2Phase: 0,
      amt_2Phase: 0,
      days_1Phasej: 0,
      amt_1Phasej: 0,
      days_2Phasej: 0,
      amt_2Phasej: 0,
      shortname: "",
      userid: "",
      policystatus: "",
      membershipType: "",
      security: "",
      isSecurity: true,
      securityAmount: 0,
      daysAfterOverdue: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `api/CircUser/InsertCircClassMaster`,
        values
      );

      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        formik.resetForm();
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [
    "totalissueddays",
    "noofbookstobeissued",
    "reservedays",
    "finperday",
    "days_1Phase",
    "days_2Phase",
    "amt_1Phase",
    "amt_2Phase",
  ];

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
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          border: ".5px solid #2B4593",
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
                {t("text.MemberGroupFacStudent")}
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
            <ToastContainer />

            <Grid container spacing={1}>
              <Grid xs={12} sm={4} item>
                <TranslateTextField
                  label={t("text.MemberGroup")}
                  value={formik.values.classname}
                  onChangeText={(text: string) =>
                    handleConversionChange("classname", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.classname && formik.errors.classname ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.classname)}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TranslateTextField
                  label={t("text.ShortName")}
                  value={formik.values.shortname}
                  onChangeText={(text: string) =>
                    handleConversionChange("shortname", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.shortname && formik.errors.shortname ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.shortname)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="valueLimit"
                  name="valueLimit"
                  inputProps={{ maxLength: 10 }}
                  label={
                    <CustomLabel
                      text={t("text.MaxValueLimit")}
                      required={false}
                    />
                  }
                  value={formik.values.valueLimit}
                  placeholder={t("text.MaxValueLimit")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Membership}
                  fullWidth
                  size="small"
                  value={
                    Membership.find(
                      (option) => option.value == formik.values.membershipType
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "membershipType",
                      newValue?.value + ""
                    );
                    formik.setFieldTouched("membershipType", true);
                    formik.setFieldTouched("membershipType", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.MembershipType")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={SecurityFee}
                  fullWidth
                  size="small"
                  // value={
                  //   option.find(
                  //     (option) => option.value === formik.values.RoleId
                  //   ) || null
                  // }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("security", newValue?.value + "");
                    formik.setFieldTouched("security", true);
                    formik.setFieldTouched("security", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SecurityMoneyRequired")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="securityAmount"
                  name="securityAmount"
                  type="number"
                  inputProps={{ maxLength: 10 }}
                  label={
                    <CustomLabel text={t("text.Ammount")} required={false} />
                  }
                  //value={formik.values.circUser.phone1}
                  placeholder={t("text.Ammount")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={formik.values.status === "Y"} onChange={handleDeactivate} />}
                  label={t("text.AllowedToBeDeactivated")}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.canRequest === "Y"}
                      onChange={handleRequest}
                    />
                  }
                  label={t("text.AllowedToRecommendForPurchase")}
                />
              </Grid>

              <Grid xs={12} sm={12} item style={{ marginBottom: "10px" }}>
                <Accordion
                  expanded={accordionExpanded}
                  onChange={handleAccordionToggle}
                >
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{ backgroundColor: "#2B4593", color: "#ffff" }}
                  >
                    <Typography style={{ fontWeight: 600, fontSize: "16px" }}>
                      Books Related
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2}
                      sx={{ marginTop: "5px" }}
                    >
                      <Grid item lg={4} xs={12}></Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="center"
                          style={{ textDecoration: "underline" }}
                        >
                          {t("text.Books")}
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="center"
                          style={{ textDecoration: "underline" }}
                        >
                          {t("text.Serials")}
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Issued Days Limit* :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="totalissueddays"
                          name="totalissueddays"
                          value={formik.values.totalissueddays}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.totalissueddays &&
                        formik.errors.totalissueddays ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.totalissueddays)}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="totalissueddays_jour"
                          name="totalissueddays_jour"
                          value={formik.values.totalissueddays_jour}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Issued Item Limit* :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="noofbookstobeissued"
                          name="noofbookstobeissued"
                          value={formik.values.noofbookstobeissued}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.noofbookstobeissued &&
                        formik.errors.noofbookstobeissued ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.noofbookstobeissued)}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="noofjournaltobeissued"
                          name="noofjournaltobeissued"
                          value={formik.values.noofjournaltobeissued}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Reservation Limit (Days) * :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="reservedays"
                          name="reservedays"
                          value={formik.values.reservedays}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.reservedays &&
                        formik.errors.reservedays ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.reservedays)}
                          </div>
                        ) : null}
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="reservedays_jour"
                          name="reservedays_jour"
                          value={formik.values.reservedays_jour}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Over Due Charges Per Day * :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="finperday"
                          name="finperday"
                          value={formik.values.finperday}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.finperday && formik.errors.finperday ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.finperday)}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="fineperday_jour"
                          name="fineperday_jour"
                          value={formik.values.fineperday_jour}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Phase - I Days Limit :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="days_1Phase"
                          name="days_1Phase"
                          value={formik.values.days_1Phase}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.days_1Phase &&
                        formik.errors.days_1Phase ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.days_1Phase)}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="days_1Phasej"
                          name="days_1Phasej"
                          value={formik.values.days_1Phasej}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Phase - I Over Due Charge Per Day * :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="days_2Phase"
                          name="days_2Phase"
                          value={formik.values.days_2Phase}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />

                        {formik.touched.days_2Phase &&
                        formik.errors.days_2Phase ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.days_2Phase)}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="days_2Phasej"
                          name="days_2Phasej"
                          value={formik.values.days_2Phasej}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Phase - II Days Limit* :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="amt_1Phase"
                          name="amt_1Phase"
                          value={formik.values.amt_1Phase}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                        {formik.touched.amt_1Phase &&
                        formik.errors.amt_1Phase ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.amt_1Phase)}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="amt_1Phasej"
                          name="amt_1Phasej"
                          value={formik.values.amt_1Phasej}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Phase - II Over Due Charge Per Day* :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="amt_2Phase"
                          name="amt_2Phase"
                          value={formik.values.amt_2Phase}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                        {formik.touched.amt_2Phase &&
                        formik.errors.amt_2Phase ? (
                          <div style={{ color: "red", margin: "5px" }}>
                            {String(formik.errors.amt_2Phase)}
                          </div>
                        ) : null}
                      </Grid>
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="amt_2Phasej"
                          name="amt_2Phasej"
                          value={formik.values.amt_2Phasej}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                        >
                          Days After Overdue* :
                        </Typography>
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="daysAfterOverdue"
                          name="daysAfterOverdue"
                          value={formik.values.daysAfterOverdue}
                          inputProps={{ maxLength: 10 }}
                          size="small"
                          fullWidth
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <br />
              </Grid>

              <Grid item lg={4} xs={12}>
                <FormControlLabel
                  control={<Checkbox onChange={handleCheckboxChange} />}
                  label="Category Based*"
                />
              </Grid>

              {isVisible && (
                <>
                  <Grid item lg={12} xs={12}>
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        border: "1px solid black",
                        borderRadius: "4px",
                        margin: "0 auto",
                      }}
                    >
                      <Table
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          border: "1px solid black",
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#3474eb",
                            color: "#f5f5f5",
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                padding: "5px",
                                width: "20%",
                              }}
                            ></th>

                            <th
                              style={{
                                borderLeft: "1px solid black",
                                padding: "5px",
                                width: "60%",
                              }}
                            >
                              Category
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                padding: "5px",
                                width: "30%",
                              }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody style={{ border: "1px solid black" }}>
                          {classTable.map((row: any, index: any) => (
                            <tr
                              key={row.id}
                              style={{ border: "1px solid black" }}
                            >
                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  borderBottom: "1px solid black",
                                  textAlign: "center",
                                  padding: "10px 2px",
                                  color: "#000",
                                  width: "20%",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  id={`checkbox-${row.id}`}
                                />
                              </td>

                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  borderBottom: "1px solid black",
                                  textAlign: "left",
                                  padding: "10px 2px",
                                  color: "#000",
                                  width: "60%",
                                }}
                              >
                                {row.categoryStatus}
                              </td>

                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  borderBottom: "1px solid black",
                                  textAlign: "center",
                                  padding: "10px 2px",
                                  color: "#000",
                                  width: "30%",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleModal();
                                  }}
                                  style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Policy
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container spacing={1}>
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
            </Grid>

            <br />
            <Divider sx={{ borderWidth: "1px", borderColor: "#524f4f" }} />
            <br />

            <Grid
              item
              xs={12}
              container
              spacing={2}
              //sx={{ marginTop: "2%" }}
            >
              <Grid item lg={12} xs={12}>
                <DataGrids
                  isLoading={isLoading}
                  rows={dept}
                  columns={adjustedColumns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialPageSize={5}
                />
              </Grid>
            </Grid>

            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              style={{ overflow: "hidden" }}
            >
              <Box
                sx={{
                  ...style,

                  overflow: "auto",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item lg={12} sm={12} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                      style={{ textDecoration: "underline" }}
                    >
                      For Class Name and Selected Category, set Items allowed
                      for transaction
                    </Typography>
                  </Grid>

                  <Grid xs={12} sm={4} item>
                    <TranslateTextField
                      label={t("text.MemberGroup")}
                      value={formik.values.classname}
                      onChangeText={(text: string) =>
                        handleConversionChange("classname", text)
                      }
                      required={false}
                      lang={lang}
                    />
                  </Grid>

                  <Grid xs={12} sm={4} item>
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

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="valueLimit"
                      name="valueLimit"
                      inputProps={{ maxLength: 10 }}
                      label={
                        <CustomLabel
                          text={t("text.MaxValueLimit")}
                          required={false}
                        />
                      }
                      value={formik.values.valueLimit}
                      placeholder={t("text.MaxValueLimit")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <FormControlLabel
                      control={<Checkbox onChange={handleDeactivate} />}
                      label={t("text.AllowedToBeDeactivated")}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <FormControlLabel
                      control={<Checkbox onChange={handleRequest} />}
                      label={t("text.AllowedToRecommendForPurchase")}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}></Grid>
                  <Grid item lg={4} xs={12}></Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="center"
                      style={{ textDecoration: "underline" }}
                    >
                      {t("text.Books")}
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="center"
                      style={{ textDecoration: "underline" }}
                    >
                      {t("text.Serials")}
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Issued Days Limit* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="totalissueddays"
                      name="totalissueddays"
                      value={formik.values.totalissueddays}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.totalissueddays &&
                    formik.errors.totalissueddays ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.totalissueddays)}
                      </div>
                    ) : null}
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="totalissueddays_jour"
                      name="totalissueddays_jour"
                      value={formik.values.totalissueddays_jour}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Issued Item Limit* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="noofbookstobeissued"
                      name="noofbookstobeissued"
                      value={formik.values.noofbookstobeissued}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.noofbookstobeissued &&
                    formik.errors.noofbookstobeissued ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.noofbookstobeissued)}
                      </div>
                    ) : null}
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="noofjournaltobeissued"
                      name="noofjournaltobeissued"
                      value={formik.values.noofjournaltobeissued}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Reservation Limit (Days) * :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="reservedays"
                      name="reservedays"
                      value={formik.values.reservedays}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.reservedays && formik.errors.reservedays ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.reservedays)}
                      </div>
                    ) : null}
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="reservedays_jour"
                      name="reservedays_jour"
                      value={formik.values.reservedays_jour}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Over Due Charges Per Day* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="finperday"
                      name="finperday"
                      value={formik.values.finperday}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.finperday && formik.errors.finperday ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.finperday)}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="fineperday_jour"
                      name="fineperday_jour"
                      value={formik.values.fineperday_jour}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Phase - I Days Limit* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="days_1Phase"
                      name="days_1Phase"
                      value={formik.values.days_1Phase}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.days_1Phase && formik.errors.days_1Phase ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.days_1Phase)}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="days_1Phasej"
                      name="days_1Phasej"
                      value={formik.values.days_1Phasej}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Phase - I Over Due Charge Per Day* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="days_2Phase"
                      name="days_2Phase"
                      value={formik.values.days_2Phase}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />

                    {formik.touched.days_2Phase && formik.errors.days_2Phase ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.days_2Phase)}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="days_2Phasej"
                      name="days_2Phasej"
                      value={formik.values.days_2Phasej}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Phase - II Days Limit* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="amt_1Phase"
                      name="amt_1Phase"
                      value={formik.values.amt_1Phase}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                    {formik.touched.amt_1Phase && formik.errors.amt_1Phase ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.amt_1Phase)}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="amt_1Phasej"
                      name="amt_1Phasej"
                      value={formik.values.amt_1Phasej}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Phase - II Over Due Charge Per Day*:
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="amt_2Phase"
                      name="amt_2Phase"
                      value={formik.values.amt_2Phase}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                    {formik.touched.amt_2Phase && formik.errors.amt_2Phase ? (
                      <div style={{ color: "red", margin: "5px" }}>
                        {String(formik.errors.amt_2Phase)}
                      </div>
                    ) : null}
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="amt_2Phasej"
                      name="amt_2Phasej"
                      value={formik.values.amt_2Phasej}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Days After Overdue* :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="daysAfterOverdue"
                      name="daysAfterOverdue"
                      value={formik.values.daysAfterOverdue}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      type="number"
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}></Grid>

                  <Grid item lg={4} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      Security Money (For All Categories) :
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="securityAmount"
                      name="securityAmount"
                      type="number"
                      inputProps={{ maxLength: 10 }}
                      value={formik.values.securityAmount}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1} sx={{ marginTop: "2%" }}>
                  <Grid item lg={6} sm={6} xs={12}>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          marginTop: "10px",
                        }}
                        onClick={SaveClassMaster}
                      >
                        {t("text.save")}
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
                      onClick={(e: any) => formik.resetForm()}
                    >
                      {t("text.reset")}
                    </Button>
                  </Grid>

                  <Grid item lg={6} sm={6} xs={12}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      align="left"
                    >
                      After Saving, Press Reset on Main Page to refresh form.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default ClassMaster;
