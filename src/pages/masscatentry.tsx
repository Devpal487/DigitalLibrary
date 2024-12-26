import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Modal,
  Box,
  FormControlLabel,
  Radio,
  Checkbox,
  Popper,
  IconButton,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import HOST_URL from "../../utils/Url";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../assets/images/imagepreview.jpg";

import api from "../utils/Url";

import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import KeyboardArrowUpTwoToneIcon from "@mui/icons-material/KeyboardArrowUpTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import dayjs, { Dayjs } from "dayjs";

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

const FormType = [
  { label: "Soft Bound", value: "1" },
  { label: "Hard Bound", value: "2" },
];

const isAntena = [
  { label: "2", value: "1" },
  // { label: "Hard Bound", value: "2" },
];

type Props = {};

const Masscatentry = (props: Props) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const back = useNavigate();

  const [IsDept, setDept] = useState<any>([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);

  const [ItemCat, setItemCat] = useState<any>([
    { value: "-1", label: t("text.SelectItemCategory") },
  ]);

  const [ItemType, setItemType] = useState<any>([
    { value: "-1", label: t("text.SelectItemType") },
  ]);

  const [IsStatus, setItemStatus] = useState<any>([
    { value: "-1", label: t("text.SelectItemStatus") },
  ]);

  const [IsCurrency, setCurrency] = useState<any>([
    { value: "-1", label: t("text.SelectCurrency") },
  ]);

  const [IsLang, setLanguage] = useState<any>([
    { value: "-1", label: t("text.SelectLanguage") },
  ]);

  const [IsMedia, setMedia] = useState<any>([
    { value: "-1", label: t("text.SelectMedia") },
  ]);

  const [IsProgramCourse, setProgramCourse] = useState<any>([
    { value: "-1", label: t("text.SelectProgramCourse") },
  ]);

  const [IsVendor, setVendor] = useState<any>([
    { value: "-1", label: t("text.Vendor") },
  ]);

  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

  const [openCollaps, setopenCollaps] = useState(false);

  const [openCollaps1, setopenCollaps1] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const handleAccordionToggle = () => {
    setAccordionExpanded((prev) => !prev);
  };

  const handleCollapse = () => {
    setopenCollaps((prevOpen) => !prevOpen);
  };

  const handleCollapse1 = () => {
    setopenCollaps1((prevOpen1) => !prevOpen1);
  };

  useEffect(() => {
    // getCountry();
    getItemCat();
    getItemType();
    getDept();
    getItemStatus();
    getCurrency();
    getLanguage();
    getMedia();
    getProgramCourse();
  }, []);

  const handleInputChange = (event: any) => {
    const { value } = event.target;

    formik.setFieldValue("accession[0].accessionnumber", value);
    // formik.setFieldValue("Address.addid", value);

    const newQuery = event.target.value;
    console.log("newQuery", newQuery);

    if (newQuery.trim() != "" || newQuery != null) {
      if (timerCheck) {
        clearTimeout(timerCheck);
      }

      const checkResult = setTimeout(() => {
        getAccnByNo(newQuery);
      }, 500);
      setTimerCheck(checkResult);
    }
  };

  const getAccnByNo = (Value: any) => {
    api.get(`api/Catalog/GetAccnByNo?Accn=${Value}`).then((res) => {
      const data = res.data.data;
      if (data) {
        // Set values in the accession section
        formik.setFieldValue("accession[0].accessionnumber", data.accessionnumber || "");
        formik.setFieldValue("accession[0].ordernumber", data.ordernumber || "");
        formik.setFieldValue("accession[0].indentnumber", data.indentnumber || "");
        formik.setFieldValue("accession[0].form", data.form || "");
        formik.setFieldValue("accession[0].accessionid", data.accessionid || 0);
        formik.setFieldValue("accession[0].accessioneddate", dayjs(data.accessioneddate).format("YYYY-MM-DD") || "");
        formik.setFieldValue("accession[0].booktitle", data.booktitle || "");
        formik.setFieldValue("accession[0].srno", data.srno || 0);
        formik.setFieldValue("accession[0].released", data.released || "");
        formik.setFieldValue("accession[0].bookprice", data.bookprice || 0);
        formik.setFieldValue("accession[0].status", data.status || "");
        formik.setFieldValue("accession[0].releaseDate", dayjs(data.releaseDate).format("YYYY-MM-DD") || "");
        formik.setFieldValue("accession[0].issueStatus", data.issueStatus || "");
        formik.setFieldValue("accession[0].loadingDate", dayjs(data.loadingDate).format("YYYY-MM-DD") || "");
        formik.setFieldValue("accession[0].checkStatus", data.checkStatus || "");
        formik.setFieldValue("accession[0].ctrl_no", data.ctrl_no || 0);
        formik.setFieldValue("accession[0].editionyear", data.editionyear || 0);
        formik.setFieldValue("accession[0].copynumber", data.copynumber || 0);
        formik.setFieldValue("accession[0].pubYear", data.pubYear || 0);
        formik.setFieldValue("accession[0].biilNo", data.biilNo || "");
        formik.setFieldValue("accession[0].billDate", dayjs(data.billDate).format("YYYY-MM-DD") || "");
        formik.setFieldValue("accession[0].catalogdate", dayjs(data.catalogdate).format("YYYY-MM-DD") || "");
        formik.setFieldValue("accession[0].item_type", data.item_type || "");
        formik.setFieldValue("accession[0].itemCategoryCode", data.itemCategoryCode || 0);
        formik.setFieldValue("accession[0].itemCategory", data.itemCategory || "");
        formik.setFieldValue("accession[0].bookNumber", data.bookNumber || "");
        
        // Set values in the catalog section
        formik.setFieldValue("catalog.ctrl_no", data.ctrl_no || 0);
        formik.setFieldValue("catalog.booktype", data.item_type || 0);
        formik.setFieldValue("catalog.title", data.booktitle || "");
        //formik.setFieldValue("catalog.publishercode", data.vendorId || 0); // Assuming vendorId is relevant here
  
        alert("User data already exists");
        setopenCollaps(true)
      }
    });
  };

  const getDept = () => {
    // const collectData = {};
    api.get(`api/Basic/GetDeptmaster`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.departmentname,
        value: item.departmentcode,
      }));
      setDept(arr);
    });
  };

  const getItemCat = () => {
    const collectData = {};
    api.get(`api/Basic/GetCategory`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.category_LoadingStatus,
        value: item.id,
      }));
      setItemCat(arr);
    });
  };

  const getItemType = () => {
    // const collectData = {};
    api.get(`api/Basic/GetItemType`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.item_Type,
        value: item.id,
      }));
      setItemType(arr);
    });
  };

  const getItemStatus = () => {
    // const collectData = {};
    api.get(`api/Basic/GetItemStatus`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.itemStatus,
        value: item.itemStatusId,
      }));
      setItemStatus(arr);
    });
  };

  const getCurrency = () => {
    // const collectData = {};
    api.get(`api/Basic/GetExchange?curcode=-1`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.currencyName,
        value: item.currencyCode,
      }));
      setCurrency(arr);
    });
  };

  const getLanguage = () => {
    //const collectData = {};
    api.get(`api/Basic/getDropDownsStatLang`).then((res) => {
      const arr = res?.data?.data?.lisLang.map((item: any) => ({
        label: item.language_Name,
        value: item.language_Id,
      }));
      setLanguage(arr);
    });
  };

  const getMedia = () => {
    //const collectData = {};
    api.get(`api/Basic/GetMedia`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.media_name,
        value: item.media_id,
      }));
      setMedia(arr);
    });
  };

  const getProgramCourse = () => {
    //const collectData = {};
    api.get(`api/Basic/GetProgramMasterByName`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.program_name,
        value: item.program_id,
      }));
      setProgramCourse(arr);
    });
  };

  const getVendor = (vendorId: any) => {
    api.get(`api/Basic/GetVendorMaster?vendorid=${vendorId}`).then((res) => {
      //console.log("checkMemb", res.data.data);
      console.log("checkIssueItem", res?.data);
      const arr: any = [];

      for (let index = 0; index < res?.data?.data?.length; index++) {
        arr.push({
          value: res?.data?.data[index]["vendorid"],
          label: res?.data?.data[index]["label"],
        });
      }
      setVendor(arr);
    });
  };

  const { menuId, menuName } = getMenuData();
  const instId: any = getinstId();

  //var addRelation = menuName?.toLowerCase();

  console.log("appName", menuName);

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,

      instId: parseInt(instId),

      accession: [
        {
          appId: menuId,

          accessionnumber: "",
          ordernumber: "",
          indentnumber: "",
          form: "",
          accessionid: 0,
          accessioneddate: new Date().toISOString().slice(0, 10),
          booktitle: "",
          srno: 0,
          released: "",
          bookprice: 0,
          srNoOld: 0,
          status: "",
          releaseDate: new Date().toISOString().slice(0, 10),
          issueStatus: "",
          loadingDate: new Date().toISOString().slice(0, 10),
          checkStatus: "",
          ctrl_no: 0,
          editionyear: 0,
          copynumber: 0,
          specialprice: 0,
          pubYear: 0,
          biilNo: "",
          billDate: new Date().toISOString().slice(0, 10),
          catalogdate: new Date().toISOString().slice(0, 10),
          item_type: "",
          originalPrice: 0,
          originalCurrency: "",
          userid: "",
          vendor_source: "",
          program_id: 0,
          deptCode: 0,
          dSrno: 0,
          deptName: "",
          itemCategoryCode: 0,
          itemCategory: "",
          loc_id: 0,
          location: "",
          rfidId: "",
          bookNumber: "",
          setOFbooks: 0,
          searchText: "",
          ipAddress: "",
          transNo: 0,
          appName: menuName,
          vendorId: 0,
          instId: parseInt(instId),
          vendorCity: "",
        },
      ],
      author: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        firstname1: "",
        middlename1: "",
        lastname1: "",
        firstname2: "",
        middlename2: "",
        lastname2: "",
        firstname3: "",
        middlename3: "",
        lastname3: "",
        personalName: "",
        dateAssociated: "",
        corporateName: "",
        transNo: 0,
      },
      catalog: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        catalogdate1: new Date().toISOString().slice(0, 10),
        booktype: 0,
        volumenumber: "",
        initpages: "",
        pages: 0,
        parts: "",
        leaves: "",
        boundind: "",
        title: "",
        publishercode: 0,
        edition: "",
        isbn: null,
        subject1: "",
        subject2: "",
        subject3: "",
        booksize: "",
        lccn: "",
        volumepages: "",
        biblioPages: "",
        bookindex: "",
        illustration: "",
        variouspaging: "",
        maps: 0,
        eTalEditor: "",
        eTalCompiler: "",
        eTalIllus: "",
        eTalTrans: "",
        eTalAuthor: "",
        accmaterialhistory: "",
        materialDesignation: "",
        issn: null,
        volume: "",
        dept: 0,
        language_id: 0,
        media_id: 0,
        part: "",
        eBookURL: "",
        fixedData: "",
        cat_Source: "",
        identifier: "",
        firstname: "",
        percity: "",
        perstate: "",
        percountry: "",
        peraddress: "",
        departmentname: "",
        btype: "string",
        language_name: "",
        publisherNo: "",
        pubSource: "",
        nlmcn: "",
        geoArea: "",
        phyExtent: "",
        phyOther: "",
        pubDate: "",
        bookCost: "",
        latestTransDate: "",
        itemCategory: "",
        originalCurrency: "",
        originalPrice: 0,
        searchText: "",
        transNo: 0,
        control001: "",
        leader: "",
        vendorId: 0,
        publisherCity: "",
      },
      conference: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        subtitle: "",
        paralleltype: "",
        confName: "",
        confYear: "",
        bnNote: "",
        cnNote: "",
        gnNotes: "",
        vnNotes: "",
        snNotes: "",
        anNotes: "",
        course: "",
        adFname1: "",
        adMname1: "",
        adLname1: "",
        adFname2: "",
        adMname2: "",
        adLname2: "",
        adFname3: "",
        adMname3: "",
        adLName3: "",
        abstract: "",
        program_name: "",
        confPlace: "",
        loccallno: "",
        transno: 0,
      },
      relators: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        editorFname1: "",
        editorMname1: "",
        editorLname1: "",
        editorFname2: "",
        editorMname2: "",
        editorLname2: "",
        editorFname3: "",
        editorMname3: "",
        editorLname3: "",
        compilerFname1: "",
        compilerMname1: "",
        compilerLname1: "",
        compilerFname2: "",
        compilerMname2: "",
        compilerLname2: "",
        compilerFname3: "",
        compilerMname3: "",
        compilerLname3: "",
        illusFname1: "",
        illusMname1: "",
        illusLname1: "",
        illusFname2: "",
        illusMname2: "",
        illusrLname2: "",
        illusFname3: "",
        illusMname3: "",
        illusLname3: "",
        translatorFname1: "",
        translatorMname11: "",
        translatorLname1: "",
        translatorFname2: "",
        translatorMname2: "",
        translatorLname2: "",
        translatorFname3: "",
        translatorMname3: "",
        translatorLname3: "",
      },
      series: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        seriesName: "",
        seriesNo: "",
        seriesPart: "",
        etal: "",
        svolume: 0,
        af1: "",
        am1: "",
        al1: "",
        af2: "",
        am2: "",
        al2: "",
        af3: "",
        am3: "",
        al3: "",
        sSeriesName: "",
        sseriesNo: "",
        sseriesPart: "",
        setal: "",
        sSvolume: 0,
        saf1: "",
        sam1: "",
        sal1: "",
        saf2: "",
        sam2: "",
        sal2: "",
        saf3: "",
        sam3: "",
        sal3: "",
        seriesParallelTitle: "",
        sSeriesParallelTitle: "",
        subSeriesName: "",
        subseriesNo: "",
        subSeriesPart: "",
        subEtal: "",
        subSvolume: 0,
        subaf1: "",
        subam1: "",
        subal1: "",
        subaf2: "",
        subam2: "",
        subal2: "",
        subaf3: "",
        subam3: "",
        subal3: "",
        subSeriesParallelTitle: "",
        issnMain: "",
        issnSub: "",
        issnSecond: "",
      },
      catalogData: {
        appId: menuId,
        appName: menuName,

        instId: parseInt(instId),
        ctrl_no: 0,
        classnumber: "",
        booknumber: null,
        classnumber_l1: "",
        booknumber_l1: "",
        classnumber_l2: "",
        booknumber_l2: "",
        transno: 0,
      },
      image: {
        ctrl_no: 0,
        coverPage: "",
      },
      updSingleAccn: true,
      newArrival: false,
    },

    onSubmit: async (values) => {
      console.log("Before submission formik values", values);

      // Handle form submission
      try {
        const response = await api.post(`api/Catalog/SaveCatelog`, values);
        if (response.data.isSuccess) {
          // setToaster(false);
          toast.success(response.data.mesg);

          formik.resetForm();

          // setTimeout(() => {
          //   navigate("/UserManagement");
          // }, 800);
        } else {
          toast.error(response.data.mesg);
        }
      } catch (error) {
        //setToaster(true);
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  console.log("Formik errors:", formik.errors);
  console.log("Formik touched:", formik.touched);

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const defaultValue = isAntena[0];

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
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
                  backgroundColor: "blue",
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
                {t("text.MassCatalogEntry")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}></Grid>
          </Grid>

          <form onSubmit={formik.handleSubmit}>
            <ToastApp />
            <Grid item xs={12} container spacing={2} sx={{ marginTop: "2%" }}>
              <Grid xs={12} sm={12} item style={{ marginBottom: "10px" }}>
                <Accordion
                  expanded={accordionExpanded}
                  onChange={handleAccordionToggle}
                >
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={{ backgroundColor: "#3492eb", color: "#fff" }}
                  >
                    <Typography style={{ fontWeight: 600, fontSize: "16px" }}>
                     {t("text.CatalogRelatedDate")}
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
                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="accession[0].catalogdate"
                          name="accession[0].catalogdate"
                          label={
                            <CustomLabel
                              text={t("text.CatalogDate")}
                              required={false}
                            />
                          }
                          value={formik.values.accession[0].catalogdate}
                          placeholder={t("text.CatalogDate")}
                          size="small"
                          type="date"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="accession[0].accessioneddate"
                          name="accession[0].accessioneddate"
                          label={
                            <CustomLabel
                              text={t("text.AccessionDate")}
                              required={false}
                            />
                          }
                          value={formik.values.accession[0].accessioneddate}
                          placeholder={t("text.AccessionDate")}
                          size="small"
                          type="date"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="accession[0].releaseDate"
                          name="accession[0].releaseDate"
                          label={
                            <CustomLabel
                              text={t("text.ReleaseDate")}
                              required={false}
                            />
                          }
                          value={formik.values.accession[0].releaseDate}
                          placeholder={t("text.ReleaseDate")}
                          size="small"
                          type="date"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <TextField
                          id="accession[0].loadingDate"
                          name="accession[0].loadingDate"
                          label={
                            <CustomLabel
                              text={t("text.LoadingDate")}
                              required={false}
                            />
                          }
                          value={formik.values.accession[0].loadingDate}
                          placeholder={t("text.LoadingDate")}
                          size="small"
                          type="date"
                          fullWidth
                          style={{ backgroundColor: "white" }}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item lg={4} xs={12}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={isAntena}
                          fullWidth
                          size="small"
                          value={defaultValue}
                          onChange={(event, newValue: any) => {
                            formik.setFieldValue("", newValue?.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <CustomLabel
                                  text={t("text.SelectAntena")}
                                  required={false}
                                />
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <br />
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "2%" }}>
              <Grid item lg={6} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].accessionnumber"
                  name="accession[0].accessionnumber"
                  label={
                    <CustomLabel text={t("text.AccnNo")} required={false} />
                  }
                  value={formik.values.accession[0].accessionnumber}
                  placeholder={t("text.AccnNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item lg={3} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.newArrival}
                      onChange={formik.handleChange}
                      name="arrival"
                      color="primary"
                    />
                  }
                  label={t("text.NewArrival")}
                  //style={{ marginTop: "8px" }}
                />
              </Grid>

              <Grid item lg={3} xs={12}>
                {/* <TextField
                  // typeof="date"
                  type="number"
                  id="chekField"
                  name="chekField"
                  // value={formik.values.chekField}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                /> */}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].accessionnumber"
                  name="accessionnumber"
                  label={
                    <CustomLabel text={t("text.CopyAccNo")} required={false} />
                  }
                  //value={formik.values.accession}
                  placeholder={t("text.CopyAccNo")}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].bookprice"
                  name="accession[0].bookprice"
                  label={
                    <CustomLabel text={t("text.Price")} required={false} />
                  }
                  value={formik.values.accession[0].bookprice}
                  placeholder={t("text.Price")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].bookNumber"
                  name="accession[0].bookNumber"
                  label={
                    <CustomLabel
                      text={t("text.CopyBookNumber")}
                      required={false}
                    />
                  }
                  value={formik.values.accession[0].bookNumber}
                  placeholder={t("text.CopyBookNumber")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].copynumber"
                  name="accession[0].copynumber"
                  label={
                    <CustomLabel text={t("text.CopyNo")} required={false} />
                  }
                  value={formik.values.accession[0].copynumber}
                  placeholder={t("text.CopyNo")}
                  type="number"
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="chekField"
                  name="chekField"
                  label={<CustomLabel text={t("text.Dt")} required={false} />}
                  value={formik.values.accession}
                  placeholder={t("text.Dt")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="chekField"
                  name="chekField"
                  label={
                    <CustomLabel text={t("text.VolAcc")} required={false} />
                  }
                  value={formik.values.accession}
                  placeholder={t("text.VolAcc")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].biilNo"
                  name="accession[0].biilNo"
                  label={
                    <CustomLabel text={t("text.BillNoOrInvoiceNo")} required={false} />
                  }
                  value={formik.values.accession[0].biilNo}
                  placeholder="Bill No / Invoice No"
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].billDate"
                  name="accession[0].billDate"
                  label={
                    <CustomLabel text={t("text.BillDate")} required={false} />
                  }
                  value={formik.values.accession[0].billDate}
                  placeholder={t("text.BillDate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  type="date"
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="chekField"
                  name="chekField"
                  label={
                    <CustomLabel text={t("text.VolNo")} required={false} />
                  }
                  value={formik.values.accession}
                  placeholder={t("text.VolNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={IsVendor}
                  //   value={
                  //     DeptOption.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }

                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "accession[0].vendorId",
                      newValue?.value
                    );
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() != "" || value != null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getVendor(value);
                        }, 500);
                        setTimerCheck(checkResult);
                      }
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.vender")} required={false} />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="accession[0].location"
                  name="accession[0].location"
                  label={
                    <CustomLabel text={t("text.Location")} required={false} />
                  }
                  value={formik.values.accession[0].location}
                  placeholder={t("text.Location")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={IsDept}
                  fullWidth
                  size="small"
                  value={
                    IsDept.find(
                     (option:any) => option.value === formik.values.accession[0].deptCode
                   ) || null
                  }

                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "accession[0].deptCode",
                      newValue?.value
                    );
                    formik.setFieldValue(
                      "accession[0].deptName",
                      newValue?.label
                    );
                    formik.setFieldTouched("accession[0].deptCode", true);
                    formik.setFieldTouched("accession[0].deptCode", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.Department")} required={false} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ItemType}
                  fullWidth
                  size="small"
                  value={
                    ItemType.find(
                     (option:any) => option.label === formik.values.accession[0].item_type
                   ) || null
                  }

                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "accession[0].item_type",
                      newValue?.label
                    );
                    formik.setFieldTouched("accession[0].item_type", true);
                    formik.setFieldTouched("accession[0].item_type", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.ItemType")} required={false} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ItemCat}
                  fullWidth
                  size="small"
                  value={
                    ItemCat.find(
                     (option:any) => option.value === formik.values.accession[0].itemCategoryCode
                   ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "accession[0].itemCategoryCode",
                      newValue?.value
                    );
                    formik.setFieldValue(
                      "accession[0].itemCategory",
                      newValue?.label
                    );
                    formik.setFieldTouched(
                      "accession[0].itemCategoryCode",
                      true
                    );
                    formik.setFieldTouched(
                      "accession[0].itemCategoryCode",
                      false
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.ItemCategory")} required={false} />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            <div style={{ marginTop: "3%" }}>
              <IconButton
                onClick={handleCollapse}
                style={{
                  backgroundColor: openCollaps ? "#ff5722" : "#2196f3",
                  color: "#fff",
                  marginBottom: "5px",
                }}
              >
                {openCollaps ? (
                  <KeyboardArrowUpTwoToneIcon />
                ) : (
                  <ExpandMoreTwoToneIcon />
                )}
              </IconButton>
              <strong style={{ textDecoration: "underline" }}>
                {openCollaps ? "Close" : "Open"} Catalog Fields
              </strong>
              <Collapse in={openCollaps}>
                <div
                  style={{
                    backgroundColor: "#f2f4f5",
                    padding: "3%",
                    border: "1px solid white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Grid item xs={12} container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.title"
                        name="catalog.title"
                        label={
                          <CustomLabel
                            text={t("text.Title")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.title}
                        placeholder={t("text.Title")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="conference.subtitle"
                        name="conference.subtitle"
                        label={
                          <CustomLabel
                            text={t("text.SubTitle")}
                            required={false}
                          />
                        }
                        value={formik.values.conference.subtitle}
                        placeholder={t("text.SubTitle")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    {/* <Grid item lg={4} xs={12}>
                    <TextField
                      // typeof="date"
                      id="chekField"
                      name="chekField"
                      label={
                        <CustomLabel text={t("text.BillNo")} required={false} />
                      }
                      value={formik.values.catalog}
                      placeholder={t("text.BillNo")}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                    />
                  </Grid> */}

                    {/* <Grid item lg={4} xs={12}>
                    <TextField
                      // typeof="date"
                      type="date"
                      id="chekField"
                      name="chekField"
                      label={
                        <CustomLabel
                          text={t("text.BillDate")}
                          required={false}
                        />
                      }
                      value={formik.values.catalog}
                      placeholder={t("text.CopyNo")}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                    />
                  </Grid> */}

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalogData.classnumber"
                        name="catalogData.classnumber"
                        label={
                          <CustomLabel
                            text={t("text.ClassNo")}
                            required={false}
                          />
                        }
                        value={formik.values.catalogData.classnumber}
                        placeholder={t("text.ClassNo")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    {/* <Grid item lg={4} xs={12}>
                    <TextField
                      // typeof="date"
                      id="catalogData.booknumber"
                      name="catalogData.booknumber"
                      label={
                        <CustomLabel text={t("text.BookNo")} required={false} />
                      }
                      //value={formik.values.catalogData.booknumber}
                      placeholder={t("text.BookNo")}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                    />
                  </Grid> */}

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.volume"
                        name="catalog.volume"
                        label={<CustomLabel text={t("text.Volume")} required={false} />}
                        value={formik.values.catalog.volume}
                        placeholder={t("text.Volume")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.part"
                        name="catalog.part"
                        label={
                          <CustomLabel text={t("text.Part")} required={false} />
                        }
                        value={formik.values.catalog.part}
                        placeholder={t("text.Part")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.edition"
                        name="catalog.edition"
                        label={
                          <CustomLabel
                            text={t("text.Edition")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.edition}
                        placeholder={t("text.Edition")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="accession[0].pubYear"
                        name="accession[0].pubYear"
                        label={
                          <CustomLabel
                            text={t("text.PublisherYear")}
                            required={false}
                          />
                        }
                        value={formik.values.accession[0].pubYear}
                        placeholder={t("text.PublisherYear")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={ItemCat}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "catalog.itemCategory",
                            newValue?.value + ""
                          );
                          formik.setFieldTouched("catalog.itemCategory", true);
                          formik.setFieldTouched("catalog.itemCategory", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.Category")} required={false} />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    {/* <Grid item lg={4} xs={12}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={ItemType}
                      fullWidth
                      size="small"
                      // value={
                      // option.find(
                      //    (option) => option.value === formik.values.empCountryID
                      //  ) || null
                      //}

                      onChange={(event, newValue: any) => {
                        formik.setFieldValue(
                          "catalog.itemCategory",
                          newValue?.value + ""
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel text="Item Type" required={false} />
                          }
                        />
                      )}
                    />
                  </Grid> */}

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsStatus}
                        fullWidth
                        size="small"
                        value={
                          IsStatus.find(
                           (option:any) => option.value +"" === formik.values.accession[0].status
                         ) || null
                        }

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "accession[0].status",
                            newValue?.value + ""
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel
                                text={t("text.ItemStatus")}
                                required={false}
                              />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsCurrency}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "catalog.originalCurrency",
                            newValue?.label
                          );
                          formik.setFieldTouched(
                            "catalog.originalCurrency",
                            true
                          );
                          formik.setFieldTouched(
                            "catalog.originalCurrency",
                            false
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.Currency")} required={false} />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsLang}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "catalog.language_id",
                            newValue?.value
                          );

                          formik.setFieldValue(
                            "catalog.language_name",
                            newValue?.label
                          );
                          formik.setFieldTouched("catalog.language_id", true);
                          formik.setFieldTouched("catalog.language_id", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.Language")} required={false} />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>


                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsDept}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue("catalog.dept", newValue?.value);

                          formik.setFieldValue(
                            "catalog.departmentname",
                            newValue?.label
                          );
                          formik.setFieldTouched("catalog.dept", true);
                          formik.setFieldTouched("catalog.dept", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.Department")} required={false} />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.originalPrice"
                        name="catalog.originalPrice"
                        label={
                          <CustomLabel
                            text={t("text.Price")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.originalPrice}
                        placeholder={t("text.Price")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.volumepages"
                        name="catalog.volumepages"
                        label={
                          <CustomLabel
                            text={t("text.SetofVol")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.volumepages}
                        placeholder={t("text.SetofVol")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>


                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.pubSource"
                        name="catalog.pubSource"
                        label={
                          <CustomLabel
                            text={t("text.Publisher")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.pubSource}
                        placeholder={t("text.Publisher")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4} lg={4}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsVendor}
                        fullWidth
                        size="small"
                        onChange={(event: any, newValue: any) => {
                          console.log(newValue?.value);

                          formik.setFieldValue(
                            "catalog.vendorId",
                            newValue?.value
                          );
                        }}
                        onInputChange={(event: any, value: string) => {
                          if (value.trim() != "" || value != null) {
                            if (timerCheck) {
                              clearTimeout(timerCheck);
                            }

                            if (value) {
                              const checkResult = setTimeout(() => {
                                getVendor(value);
                              }, 500);
                              setTimerCheck(checkResult);
                            }
                          }
                        }}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel
                                text={t("text.vender")}
                                required={false}
                              />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    {/* <Grid item lg={4} xs={12}>
                    <TextField
                      // typeof="date"
                      id="catalog.isbn"
                      name="catalog.isbn"
                      label={
                        <CustomLabel text={t("text.ISBN")} required={false} />
                      }
                     // value={formik.values.catalog.isbn}
                      placeholder={t("text.ISBN")}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                    />
                  </Grid> */}

                    {/* <Grid item lg={4} xs={12}>
                    <TextField
                      // typeof="date"
                      id="catalog.issn"
                      name="catalog.issn"
                      label={
                        <CustomLabel text={t("text.ISSN")} required={false} />
                      }
                     // value={formik.values.catalog.issn}
                      placeholder={t("text.ISSN")}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                    />
                  </Grid> */}

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.pages"
                        name="catalog.pages"
                        label={
                          <CustomLabel text={t("text.TotalPage")} required={false} />
                        }
                        value={formik.values.catalog.pages}
                        placeholder={t("text.TotalPage")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.peraddress"
                        name="catalog.peraddress"
                        label={
                          <CustomLabel
                            text={t("text.Location")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.peraddress}
                        placeholder={t("text.Location")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.control001"
                        name="catalog.control001"
                        label={
                          <CustomLabel
                            text={t("text.ControlNo")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.control001}
                        placeholder={t("text.ControlNo")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.subject1"
                        name="catalog.subject1"
                        label={
                          <CustomLabel
                            text={t("text.Subject1")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.subject1}
                        placeholder={t("text.Subject1")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.subject2"
                        name="catalog.subject2"
                        label={
                          <CustomLabel
                            text={t("text.Subject2")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.subject2}
                        placeholder={t("text.Subject2")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="catalog.subject3"
                        name="catalog.subject3"
                        label={
                          <CustomLabel
                            text={t("text.Subject3")}
                            required={false}
                          />
                        }
                        value={formik.values.catalog.subject3}
                        placeholder={t("text.Subject3")}
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsMedia}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "catalog.media_id",
                            newValue?.value
                          );
                          formik.setFieldTouched("catalog.media_id", true);
                          formik.setFieldTouched("catalog.media_id", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel text={t("text.Media")} required={false} />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={FormType}
                        fullWidth
                        size="small"
                        value={
                          FormType.find(
                           (option) => option.label == formik.values.accession[0].form
                         ) || null
                        }

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "accession[0].form",
                            newValue?.label
                          );
                          formik.setFieldTouched("accession[0].form", true);
                          formik.setFieldTouched("accession[0].form", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<CustomLabel text={t("text.Form")} required={false} />}
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={IsProgramCourse}
                        fullWidth
                        size="small"
                        // value={
                        // option.find(
                        //    (option) => option.value === formik.values.empCountryID
                        //  ) || null
                        //}

                        onChange={(event, newValue: any) => {
                          formik.setFieldValue(
                            "circUser.cat_id",
                            newValue?.value
                          );
                          formik.setFieldTouched("circUser.cat_id", true);
                          formik.setFieldTouched("circUser.cat_id", false);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={
                              <CustomLabel
                                text={t("text.ProgramCourse")}
                                required={false}
                              />
                            }
                            style={{ backgroundColor: "white" }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Collapse>
            </div>

            <div style={{ marginTop: "3%" }}>
              <IconButton
                onClick={handleCollapse1}
                style={{
                  backgroundColor: openCollaps1 ? "#ff5722" : "#2196f3",
                  color: "#fff",
                  marginBottom: "5px",
                }}
              >
                {openCollaps1 ? (
                  <KeyboardArrowUpTwoToneIcon />
                ) : (
                  <ExpandMoreTwoToneIcon />
                )}
              </IconButton>
              <strong style={{ textDecoration: "underline" }}>
                {openCollaps1 ? "Close" : "Open"} Other Than Author Also
              </strong>
              <Collapse in={openCollaps1}>
                <div
                  style={{
                    backgroundColor: "#f2f4f5",
                    padding: "3%",
                    border: "1px solid white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Grid item xs={12} container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorFname1"
                        name="relators.editorFname1"
                        label={
                          <CustomLabel text="Editor F Name1" required={false} />
                        }
                        value={formik.values.relators.editorFname1}
                        placeholder="Editor F Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorMname1"
                        name="relators.editorMname1"
                        label={
                          <CustomLabel text="Editor M Name1" required={false} />
                        }
                        value={formik.values.relators.editorMname1}
                        placeholder="Editor M Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorLname1"
                        name="relators.editorLname1"
                        label={
                          <CustomLabel text="Editor L Name1" required={false} />
                        }
                        value={formik.values.relators.editorLname1}
                        placeholder="Editor L Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        //type="date"
                        id="relators.editorFname2"
                        name="relators.editorFname2"
                        label={
                          <CustomLabel text="Editor F Name2" required={false} />
                        }
                        value={formik.values.relators.editorFname2}
                        placeholder="Editor F Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorMname2"
                        name="relators.editorMname2"
                        label={
                          <CustomLabel text="Editor M Name2" required={false} />
                        }
                        value={formik.values.relators.editorMname2}
                        placeholder="Editor M Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorLname2"
                        name="relators.editorLname2"
                        label={
                          <CustomLabel text="Editor L Name2" required={false} />
                        }
                        value={formik.values.relators.editorLname2}
                        placeholder="Editor L Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorFname3"
                        name="relators.editorFname3"
                        label={
                          <CustomLabel text="Editor F Name3" required={false} />
                        }
                        value={formik.values.relators.editorFname3}
                        placeholder="Editor F Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorMname3"
                        name="relators.editorMname3"
                        label={
                          <CustomLabel text="Editor M Name3" required={false} />
                        }
                        value={formik.values.relators.editorMname3}
                        placeholder="Editor M Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.editorLname3"
                        name="relators.editorLname3"
                        label={
                          <CustomLabel text="Editor L Name3" required={false} />
                        }
                        value={formik.values.relators.editorLname3}
                        placeholder="Editor L Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerFname1"
                        name="relators.compilerFname1"
                        label={
                          <CustomLabel text="Comp. F Name1" required={false} />
                        }
                        value={formik.values.relators.compilerFname1}
                        placeholder="Comp. F Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerMname1"
                        name="relators.compilerMname1"
                        label={
                          <CustomLabel text="Comp. M Name1" required={false} />
                        }
                        value={formik.values.relators.compilerMname1}
                        placeholder="Comp. F Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerLname1"
                        name="relators.compilerLname1"
                        label={
                          <CustomLabel text="Comp. L Name1" required={false} />
                        }
                        value={formik.values.relators.compilerLname1}
                        placeholder="Comp. L Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerFname2"
                        name="relators.compilerFname2"
                        label={
                          <CustomLabel text="Comp. F Name2" required={false} />
                        }
                        value={formik.values.relators.compilerFname2}
                        placeholder="Comp. F Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerMname2"
                        name="relators.compilerMname2"
                        label={
                          <CustomLabel text="Comp. M Name2" required={false} />
                        }
                        value={formik.values.relators.compilerMname2}
                        placeholder="Comp. M Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerLname2"
                        name="relators.compilerLname2"
                        label={
                          <CustomLabel text="Comp. L Name2" required={false} />
                        }
                        value={formik.values.relators.compilerLname2}
                        placeholder="Comp. L Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerFname3"
                        name="relators.compilerFname3"
                        label={
                          <CustomLabel text="Comp. F Name3" required={false} />
                        }
                        value={formik.values.relators.compilerFname3}
                        placeholder="Comp. F Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerMname3"
                        name="relators.compilerMname3"
                        label={
                          <CustomLabel text="Comp. M Name3" required={false} />
                        }
                        value={formik.values.relators.compilerMname3}
                        placeholder="Comp. M Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.compilerLname3"
                        name="relators.compilerLname3"
                        label={
                          <CustomLabel text="Comp. L Name3" required={false} />
                        }
                        value={formik.values.relators.compilerLname3}
                        placeholder="Comp. L Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusFname1"
                        name="relators.illusFname1"
                        label={
                          <CustomLabel text="Illus. F Name1" required={false} />
                        }
                        value={formik.values.relators.illusFname1}
                        placeholder="Illus. F Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusMname1"
                        name="relators.illusMname1"
                        label={
                          <CustomLabel text="Illus. M Name1" required={false} />
                        }
                        value={formik.values.relators.illusMname1}
                        placeholder="Illus. M Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusLname1"
                        name="relators.illusLname1"
                        label={
                          <CustomLabel text="Illus. L Name1" required={false} />
                        }
                        value={formik.values.relators.illusLname1}
                        placeholder="Illus. L Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusFname2"
                        name="relators.illusFname2"
                        label={
                          <CustomLabel text="Illus. F Name2" required={false} />
                        }
                        value={formik.values.relators.illusFname2}
                        placeholder="Illus. F Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusMname2"
                        name="relators.illusMname2"
                        label={
                          <CustomLabel text="Illus. M Name2" required={false} />
                        }
                        value={formik.values.relators.illusMname2}
                        placeholder="Illus. M Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusrLname2"
                        name="relators.illusrLname2"
                        label={
                          <CustomLabel text="Illus. L Name2" required={false} />
                        }
                        value={formik.values.relators.illusrLname2}
                        placeholder="Illus. L Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // type="date"
                        id="relators.illusFname3"
                        name="relators.illusFname3"
                        label={
                          <CustomLabel text="Illus. F Name3" required={false} />
                        }
                        value={formik.values.relators.illusFname3}
                        placeholder="Tran. F Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusMname3"
                        name="relators.illusMname3"
                        label={
                          <CustomLabel text="Illus. M Name3" required={false} />
                        }
                        value={formik.values.relators.illusMname3}
                        placeholder="Illus. M Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.illusLname3"
                        name="relators.illusLname3"
                        label={
                          <CustomLabel text="Illus. L Name3" required={false} />
                        }
                        value={formik.values.relators.illusLname3}
                        placeholder="Illus. L Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorFname1"
                        name="relators.translatorFname1"
                        label={
                          <CustomLabel text="Tran. F Name1" required={false} />
                        }
                        value={formik.values.relators.translatorFname1}
                        placeholder="Tran. F Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorMname11"
                        name="relators.translatorMname11"
                        label={
                          <CustomLabel text="Tran. M Name1" required={false} />
                        }
                        value={formik.values.relators.translatorMname11}
                        placeholder="Tran. M Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorLname1"
                        name="relators.translatorLname1"
                        label={
                          <CustomLabel text="Tran. L Name1" required={false} />
                        }
                        value={formik.values.relators.translatorLname1}
                        placeholder="Tran. L Name1"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorFname2"
                        name="relators.translatorFname2"
                        label={
                          <CustomLabel text="Tran. F Name2" required={false} />
                        }
                        value={formik.values.relators.translatorFname2}
                        placeholder="Tran. F Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorMname2"
                        name="relators.translatorMname2"
                        label={
                          <CustomLabel text="Tran. M Name2" required={false} />
                        }
                        value={formik.values.relators.translatorMname2}
                        placeholder="Tran. M Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorLname2"
                        name="relators.translatorLname2"
                        label={
                          <CustomLabel text="Tran. L Name2" required={false} />
                        }
                        value={formik.values.relators.translatorLname2}
                        placeholder="Tran. L Name2"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorFname3"
                        name="relators.translatorFname3"
                        label={
                          <CustomLabel text="Tran. F Name3" required={false} />
                        }
                        value={formik.values.relators.translatorFname3}
                        placeholder="Tran. F Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorMname3"
                        name="relators.translatorMname3"
                        label={
                          <CustomLabel text="Tran. M Name3" required={false} />
                        }
                        value={formik.values.relators.translatorMname3}
                        placeholder="Tran. M Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>

                    <Grid item lg={4} xs={12}>
                      <TextField
                        // typeof="date"
                        id="relators.translatorLname3"
                        name="relators.translatorLname3"
                        label={
                          <CustomLabel text="Tran. L Name3" required={false} />
                        }
                        value={formik.values.relators.translatorLname3}
                        placeholder="Tran. L Name3"
                        size="small"
                        fullWidth
                        style={{ backgroundColor: "white" }}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Collapse>
            </div>

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "2%" }}>
              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.firstname1"
                  name="author.firstname1"
                  label={<CustomLabel text={t("text.FirstName")} required={false} />}
                  value={formik.values.author.firstname1}
                  placeholder={t("text.FirstName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.middlename1"
                  name="author.middlename1"
                  label={<CustomLabel text={t("text.MiddleName")} required={false} />}
                  value={formik.values.author.middlename1}
                  placeholder={t("text.MiddleName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.lastname1"
                  name="author.lastname1"
                  label={<CustomLabel text={t("text.LastName")} required={false} />}
                  value={formik.values.author.lastname1}
                  placeholder={t("text.LastName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid lg={12} xs={12} sx={{ marginTop: "2%" }}>
              <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{ padding: "5px",height:'2%' }}
                  align="left"
                >
                  {t("text.Author2")} :-
                </Typography>
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.firstname2"
                  name="author.firstname2"
                  label={<CustomLabel text={t("text.FirstName")} required={false} />}
                  value={formik.values.author.firstname2}
                  placeholder={t("text.FirstName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.middlename2"
                  name="author.middlename2"
                  label={<CustomLabel text={t("text.MiddleName")} required={false} />}
                  value={formik.values.author.middlename2}
                  placeholder={t("text.MiddleName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.lastname2"
                  name="author.lastname2"
                  label={<CustomLabel text={t("text.LastName")} required={false} />}
                  value={formik.values.author.lastname2}
                  placeholder={t("text.LastName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid lg={12} xs={12} sx={{ marginTop: "2%" }}>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{ padding: "5px",height:'2%' }}
                  align="left"
                >
                  {t("text.Author3")} :-
                </Typography>
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.firstname3"
                  name="author.firstname3"
                  label={<CustomLabel text={t("text.FirstName")} required={false} />}
                  value={formik.values.author.firstname3}
                  placeholder={t("text.FirstName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>            

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.middlename3"
                  name="author.middlename3"
                  label={<CustomLabel text={t("text.MiddleName")} required={false} />}
                  value={formik.values.author.middlename3}
                  placeholder={t("text.MiddleName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  // typeof="date"
                  id="author.lastname3"
                  name="author.lastname3"
                  label={<CustomLabel text={t("text.LastName")} required={false} />}
                  value={formik.values.author.lastname3}
                  placeholder={t("text.LastName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "3%" }}>
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

export default Masscatentry;
