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
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
// HOST_URL from "../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../assets/images/imagepreview.jpg";
import { Console } from "console";
import dayjs, { Dayjs } from "dayjs";
import api from "../utils/Url";
import CustomLabel from "../utils/CustomLabel";

import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import { getMenuData } from "../utils/Constant";

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

const IssueSt = [
  { label: "Active", value: "1" },
  { label: "Sleep", value: "2" },
];

const BloodGroup = [
  { label: "O+", value: "1" },
  { label: "A+", value: "2" },
  { label: "B+", value: "3" },
  { label: "AB+", value: "4" },
  { label: "O-", value: "5" },
  { label: "A-", value: "6" },
  { label: "B-", value: "7" },
  { label: "AB-", value: "8" },
];

const Membership = [
  { label: "Free", value: "1" },
  { label: "Paid", value: "2" },
  { label: "Subscribe", value: "3" },
];

const Gender = [
  { label: "Male", value: "1" },
  { label: "Female", value: "2" },
  { label: "Other", value: "3" },
];

type Props = {};

const MemberPetronEdit = (props: Props) => {
  const { i18n, t } = useTranslation();

  const [EmpDesignation, setEmpDesignation] = useState<any>([
    { value: "-1", label: t("text.SelectDesignation") },
  ]);
  const [Department, setDepartment] = useState<any>([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);
  const [StateOption, setStateOption] = useState<any>([
    { value: "-1", label: t("text.AcademicSession") },
  ]);
  const [Country, setCountry] = useState<any>([
    { value: "-1", label: t("text.CasteCategory") },
  ]);
  const [City, setCity] = useState<any>([
    { value: "-1", label: t("text.StudentMemberGroup") },
  ]);

  const [Role, setRole] = useState<any>([
    { value: "-1", label: t("text.MemberGroup") },
  ]);

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.ProgramCourse") },
  ]);

  const [DeptOption, setDeptOption] = useState([
    { value: "-1", label: t("text.EnterState") },
  ]);

  const [DistOption, setDistOption] = useState([
    { value: "-1", label: t("text.EnterCity") },
  ]);

  const [count, setCout] = useState<any>([
    { value: "-1", label: t("text.EnterCountry") },
  ]);

  const location = useLocation();
  console.log("location", location.state);

  useEffect(() => {
    getEmpDesignation();
    getDepartment();
    getState();
    getCountry();
    getCity();
    getProgram();
    getMember();
    getRole();
    getSignById();
    getAddress();

    getCount();
    // formik.setFieldValue("circUser.memberGroupId", location.state.memberGroupId);
    // console.log(formik.values.circUser.memberGroupId);
  }, []);

  const getCount = () => {
    const collectData = {
      countryId: -1,
    };
    api.post(`api/Country/GetCountryMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["countryName"],
          value: res.data.data[index]["countryId"],
        });
      }
      setCout(arr);
    });
  };

  const getDept = (countId: any) => {
    const collectData = {
      stateId: -1,
      countryId: countId,
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
      setDeptOption(arr);
    });
  };

  const getDistrict = (stateID: any) => {
    const collectData = {
      districtId: -1,
      stateId: stateID,
      divisionId: -1,
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
  const getEmpDesignation = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetDesignationMaster`, { params: { collectData } })
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.designation,
          value: item.designationId,
          //value: null,
        }));
        setEmpDesignation(arr);
      });
  };

  const getDepartment = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetDeptmaster`, { params: { collectData } })
      .then((res) => {
        console.log("checkDepartment", res.data.data);
        const arr = res.data.data.map((item: any) => ({
          label: item.departmentname,
          value: item.departmentcode,
        }));
        setDepartment(arr);
      });
  };

  const getState = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetAcademicSession`, { params: { collectData } })
      .then((res) => {
        console.log("checkAcademicSession", res.data.data);
        const arr = res.data.data.map((item: any) => ({
          label: item.academicSession,
          value: item.academicSession,
        }));
        setStateOption(arr);
      });
  };

  const getCountry = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetCastCategories`, { params: { collectData } })
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.cat_Name,
          value: item.cat_Id,
        }));
        setCountry(arr);
      });
  };

  const getCity = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetMemberGroup`, { params: { collectData } })
      .then((res) => {
        console.log("checMemberGroup", res.data.data);
        const arr = res.data.data.map((item: any) => ({
          label: item.groupName,
          value: item.id,
        }));
        setCity(arr);
      });
  };

  const getRole = () => {
    const collectData = {};
    api
      .get(`api/CircUser/GetCircClass`, { params: { collectData } })
      .then((res) => {
        console.log("checCircClass", res.data.data);
        const arr = res.data.data.map((item: any) => ({
          label: item.classname,
          value: item.classname,
        }));
        setRole(arr);
      });
  };

  const getProgram = () => {
    const collectData = {};
    api
      .get(`api/Basic/GetProgramMasterByName`, { params: { collectData } })
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.program_name,
          value: item.program_id,
        }));
        setProgram(arr);
      });
  };

  // const getAddress = () => {
  //   const collectData = {};
  //   api
  //     .get(`api/CircUser/getCircUserById?UserId=${location.state.userid}`, { params: { collectData } })
  //     .then((res) => {
  //       console.log('checkAddress',res.data.data)
  //       const arr = res.data.data.map((item: any) => ({
  //        localaddress: item.address.localaddress,
  //         localcity: item.address.localcity,
  //         localstate: item.address.localstate,
  //         localpincode: item.address.localpincode,
  //         localcountry: item.address.localcountry,
  //         peraddress: item.address.peraddress,
  //         perstate: item.address.perstate,
  //         percountry: item.address.percountry,
  //         percity: item.address.percity,
  //         addid: item.address.addid,
  //       }));

  //       setProgram(arr);
  //     });
  // };

  const getAddress = () => {
    api
      .get(`api/CircUser/getCircUserById?UserId=${location.state.userid}`)
      .then((res) => {
        const addressData = res.data.data.address;
        //console.log("CheckAddress", addressData);

        const formattedData = {
          address: {
            addid: addressData.addid || "",

            peraddress: addressData.peraddress || "",
            percountry: addressData.percountry || "",
            perstate: addressData.perstate || "",
            percity: addressData.percity || "",
            perpincode: addressData.perpincode || "",
            localaddress: addressData.localaddress || "",
            localcountry: addressData.localcountry || "",
            localstate: addressData.localstate || "",
            localcity: addressData.localcity || "",
            localpincode: addressData.localpincode || "",
            addrelation: addressData.addrelation || "",
          },
        };

        formik.setValues((prevValues: any) => ({
          ...prevValues,
          ...formattedData,
        }));
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  };

  // const getimgbyid = () => {
  //   const collectData = {
  //     // empid: location.state.empid,
  //     // userId: location.state.userId,
  //     // empName: location.state.empName,
  //     // empMobileNo: location.state.empMobileNo,
  //     // empDesignationId: location.state.empDesignationId,
  //     // empDeptId: location.state.empDeptId,
  //     // empStateId: location.state.empStateId,
  //     // empCountryID: location.state.empCountryID,
  //     // empCityId: location.state.empCityId,
  //     // empPincode: location.state.empPincode,
  //     // roleId: location.state.roleId,
  //   };

  //   api
  //     .get(`api/Basic/GetProgramMasterByName`, {
  //       params: { collectData },
  //     })
  //     .then((res) => {
  //       console.log("result" + JSON.stringify(res.data.data[0]["memberPic"]));

  //       const Doc = res.data.data[0]["memberPic"];
  //       formik.setFieldValue("circUser.memberPic", Doc);
  //     });
  // };

  const getSignById = () => {
    const collectData = {
      // empid: location.state.empid,
      // userId: location.state.userId,
      // empName: location.state.empName,
      // empMobileNo: location.state.empMobileNo,
      // empDesignationId: location.state.empDesignationId,
      // empDeptId: location.state.empDeptId,
      // empStateId: location.state.empStateId,
      // empCountryID: location.state.empCountryID,
      // empCityId: location.state.empCityId,
      // empPincode: location.state.empPincode,
      // roleId: location.state.roleId,
    };

    api
      .get(`api/Basic/GetProgramMasterByName`, {
        params: { collectData },
      })
      .then((res) => {
        // console.log(
        //   "result" + JSON.stringify(res.data.data[0]["signatureFile"])
        // );

        const signature = res.data.data[0]["memberSign"];
        const photo = res.data.data[0]["memberPic"];
        if (signature || photo) {
          formik.setFieldValue("circUser.memberSign", signature);
          formik.setFieldValue("circUser.memberPic", photo);
        }
      });
  };

  const [MemberCode, setMemberCode] = useState("");

  const getMember = () => {
    const collectData = {};
    api.get(`api/Basic/GetmaxMemberCode`).then((res) => {
      //console.log('checkmember',res.data.data)

      setMemberCode(res.data.data);
    });
  };

  const [selectedMembership, setSelectedMembership] = useState(null);

  const [sameAsPermanentName, setSameAsPermanentName] = useState<any>(false);

  const handleSameAsPermanentNameChange = (event: any) => {
    const checked = event.target.checked;
    setSameAsPermanentName(checked);

    if (checked) {
      formik.setFieldValue(
        "address.localaddress",
        formik.values.address.peraddress
      );
      formik.setFieldValue(
        "address.localcountry",
        formik.values.address.percountry
      );
      formik.setFieldValue(
        "address.localstate",
        formik.values.address.perstate
      );
      formik.setFieldValue("address.localcity", formik.values.address.percity);
      formik.setFieldValue(
        "address.localpincode",
        formik.values.address.perpincode
      );
    } else {
      // Clear local address fields if not same
      formik.setFieldValue("address.localaddress", "");
      formik.setFieldValue("address.localcountry", "");
      formik.setFieldValue("address.localstate", "");
      formik.setFieldValue("address.localcity", "");
      formik.setFieldValue("address.localpincode", "");
    }
  };

  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Opens, setOpen] = React.useState(false);
  const [Img, setImg] = useState("");
  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "circUser.memberPic") {
      setModalImg(formik.values.circUser.memberPic);
    }
  };

  const handlePanClose1 = () => {
    setOpen(false);
  };
  const modalOpenHandle1 = (event: any) => {
    setOpen(true);
    if (event === "circUser.memberSign") {
      setImg(formik.values.circUser.memberSign);
    }
  };

  const ConvertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToByteArray = (base64: string): Uint8Array => {
    // Remove the data URL scheme if it exists
    const base64String = base64.split(",")[1];

    // Decode the Base64 string
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    // Convert binary string to Uint8Array
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const otherDocChangeHandler = async (event: any, params: string) => {
    console.log("Image file change detected");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
        alert(
          "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
        );
        event.target.value = null;
        return;
      }

      try {
        const base64Data = (await ConvertBase64(file)) as string;
        console.log("Base64 image data:", base64Data);

        // Convert Base64 to Uint8Array
        const byteArray = base64ToByteArray(base64Data);
        console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

        // Convert Uint8Array to base64 string
        const base64String = uint8ArrayToBase64(byteArray);
        console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

        // Set value in Formik
        formik.setFieldValue(params, base64String);

        let outputCheck =
          "data:image/png;base64," + formik.values.circUser.memberPic;
        console.log(outputCheck);
      } catch (error) {
        console.error("Error converting image file to Base64:", error);
      }
    }
  };

  let navigate = useNavigate();

  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [usercode, setUsercode] = useState("");
  console.log("checkUserCode", usercode);

  const [option, setOption] = useState([
    {
      value: "-1",
      label: t("text.SelectGender"),
    },
  ]);

  const { menuId, menuName } = getMenuData();

  const validationSchema = Yup.object({
    circUser: Yup.object({
      firstname: Yup.string().test(
        "required",
        t("text.FristNameRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      dob: Yup.string().test(
        "required",
        t("text.DobRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      doj: Yup.string().test(
        "required",
        t("text.JoiningYearRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      cat_id: Yup.string().test(
        "required",
        t("text.CastCategoryRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      departmentcode: Yup.string().test(
        "required",
        t("text.DepartmentRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      classname: Yup.string().test(
        "required",
        t("text.MemberGroupRequired"),
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),
      designationId: Yup.number().test(
        "required",
        "Designation  is required",
        function (value: any) {
          return value > 0;
        }
      ),

      validupto: Yup.string().test(
        "required",
        "Date of retirement is required",
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),

      phone1: Yup.string()
        .matches(/^[0-9]{10}$/, t("text.PhoneNumberInvalid"))
        .notRequired(),

      // Fax validation (must follow a general phone number format)
      phone2: Yup.string()
        .matches(/^[0-9]{10}$/, t("text.FaxInvalid"))
        .notRequired(),

      // Email validation (must contain @gmail.com)
      email1: Yup.string()
        .email(t("text.EmailInvalid"))
        .matches(/@/, "must contain @")
        .notRequired(),

      aadharNo: Yup.string()
        .matches(/^\d{12}$/, t("text.AadharInvalid"))
        .notRequired(),
    }),
  });
  const formik: any = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,

      instId: location.state.instId,

      circUser: {
        appName: menuName || "",
        designationId: location.state.designationId || 0,
        usercode: location.state.usercode || "",
        userid: location.state.userid || "",
        firstname: location.state.firstname || "",
        middlename: location.state.middlename || "",
        lastname: location.state.lastname || "",
        departmentcode: location.state.departmentcode || 0,
        validupto: dayjs(location.state.validupto).format("YYYY-MM-DD") || "",
        status: location.state.status || "",
        remarks: location.state.remarks || "",
        issuedbookstatus: location.state.issuedbookstatus || 0,
        email1: location.state.email1 || "",
        email2: location.state.email2 || "",
        memberGroupId: location.state.memberGroupId || null,
        gender: location.state.gender || "",
        doj: dayjs(location.state.doj).format("YYYY-MM-DD") || "",
        phone1: location.state.phone1 || "",
        phone2: location.state.phone2 || "",
        memberPic: location.state.memberPic || "",
        issuedjournalstatus: location.state.issuedjournalstatus || 0,
        classname: location.state.classname || "",
        passwd: location.state.passwd || "",
        saltVc: location.state.saltVc || "",
        deactivatedon: location.state.deactivatedon || "",
        fathername: location.state.fathername || "",
        dob: dayjs(location.state.dob).format("YYYY-MM-DD") || "",
        joinyear: location.state.joinyear || "",
        cat_id: location.state.cat_id || 0,
        program_id: location.state.program_id || 0,
        subjects: location.state.subjects || "",
        userid1: location.state.userid1 || "",
        passwd1: location.state.passwd1 || "",
        saltVc1: location.state.saltVc1 || "",
        yearSem: location.state.yearSem || "",
        section: location.state.section || "",
        bloodGrp: location.state.bloodGrp || 0,
        session: location.state.session || "",
        affiliation: location.state.affiliation || "",
        fingerPrint: location.state.fingerPrint || "",
        memberSign: location.state.memberSign || "",
        printing_status: location.state.printing_status || "",
        image_status: location.state.image_status || "",
        opac_status: location.state.opac_status || "",
        studentThumb: location.state.studentThumb || "",
        isThumb: location.state.isThumb || "",
        thumbTemplate1: location.state.thumbTemplate1 || "",
        thumbTemplate2: location.state.thumbTemplate2 || "",
        studentThumb2: location.state.studentThumb2 || "",
        isThumb2: location.state.isThumb2 || "",
        thumbTemplate3: location.state.thumbTemplate3 || "",
        thumbTemplate4: location.state.thumbTemplate4 || "",
        mothername: location.state.mothername || "",
        pan_no: location.state.pan_no || "",
        rfIdId: location.state.rfIdId || "",
        aadharNo: location.state.aadharNo || "",
        photoname: location.state.photoname || "",
        signname: location.state.signname || "",
        searchText: location.state.searchText || "",
        latitude: location.state.latitude || 0,
        longitude: location.state.longitude || 0,
        securityMoney: location.state.securityMoney || 0,
      },

      address: {
        appName: menuName || "",
        addid: location.state.userid,
        localaddress: location.state.localaddress || "",
        localcity: location.state.localcity || "",
        localstate: location.state.localstate || "",
        localpincode: location.state.localpincode || "",
        localcountry: location.state.localcountry || "",
        peraddress: location.state.peraddress || "",
        percity: location.state.percity || "",
        perstate: location.state.perstate || "",
        percountry: location.state.percountry || "",
        perpincode: location.state.perpincode || "",
        addrelation: "user management",
      },
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      // console.log('checkUserCode',usercode);

      const response = await api.post(`api/CircUser/AddUpdateCircUser`, values);
      if (response.data.isSuccess) {
        //setToaster(false);
        toast.success(response.data.mesg);
        setTimeout(() => {
          navigate("/UserManagement");
        }, 800);
        // navigate("/UserManagement");
      } else {
        //setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const handleFieldChange = (event: any) => {
    const { name, value } = event.target;

    formik.setFieldValue("circUser.userid", value);
    //formik.setFieldValue("Address.addid", value);
    //formik.setFieldValue
    setUsercode(value);
    formik.setFieldValue("circUser.usercode", value);
  };

  const requiredFields = [
    "circUser.doj",
    "circUser.dob",

    "circUser.cat_id",
    "circUser.departmentcode",
    "circUser.classname",
  ];

  const back = useNavigate();

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

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
                {t("text.EditMemberPetron")}
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
            <ToastApp />
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={6} xs={12}>
                <TextField
                  id="userid"
                  name="circUser.userid"
                  label={
                    <CustomLabel text={t("text.MemberId")} required={false} />
                  }
                  value={formik.values.circUser.userid}
                  placeholder={t("text.MemberId")}
                  inputProps={{}}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
                />
                {t("text.AvailabelMemberCode")}: {""} {MemberCode}*
              </Grid>

              <Grid lg={6} xs={12}></Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.FristName")}
                  value={formik.values.circUser.firstname}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.firstname", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.circUser?.firstname &&
                formik.errors.circUser?.firstname ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser?.firstname)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.MiddleName")}
                  value={formik.values.circUser.middlename}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.middlename", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.LastName")}
                  value={formik.values.circUser.lastname}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.lastname", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterFatherName")}
                  value={formik.values.circUser.fathername}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.fathername", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.EnterMotherName")}
                  value={formik.values.circUser.mothername}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.mothername", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="dob"
                  type="date"
                  name="circUser.dob"
                  label={
                    <CustomLabel
                      text={t("text.EnterDOB")}
                      required={requiredFields.includes("circUser.dob")}
                    />
                  }
                  value={formik.values.circUser.dob}
                  placeholder={t("text.EnterDOB")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />

                {formik.touched.circUser?.dob && formik.errors.circUser?.dob ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.dob)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Gender}
                  fullWidth
                  size="small"
                  value={
                    Gender.find(
                      (option: any) =>
                        option.value === formik.values.circUser.gender
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.gender",
                      newValue?.value + ""
                    );
                    formik.setFieldTouched("circUser.gender", true);
                    formik.setFieldTouched("circUser.gender", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectGender")}
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
                  options={Country}
                  fullWidth
                  size="small"
                  value={
                    Country.find(
                      (option: any) =>
                        option.value === formik.values.circUser.cat_id
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("circUser.cat_id", newValue?.value);
                    formik.setFieldTouched("circUser.cat_id", true);
                    formik.setFieldTouched("circUser.cat_id", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.CasteCategory")}
                          required={requiredFields.includes("circUser.cat_id")}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.circUser?.cat_id &&
                formik.errors.circUser?.cat_id ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser?.cat_id)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="aadharNo"
                  name="circUser.aadharNo"
                  label={
                    <CustomLabel
                      text={t("text.EnterAdharNumber")}
                      required={false}
                    />
                  }
                  value={formik.values.circUser.aadharNo}
                  placeholder={t("text.EnterAdharNumber")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  inputProps={{ maxLength: 12 }}
                />

                {formik.touched.circUser?.aadharNo &&
                formik.errors.circUser?.aadharNo ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.aadharNo)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StateOption}
                  fullWidth
                  size="small"
                  value={
                    StateOption.find(
                      (option: any) =>
                        option.value === formik.values.circUser.session
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("circUser.session", newValue?.value);
                    formik.setFieldTouched("circUser.session", true);
                    formik.setFieldTouched("circUser.session", false);

                    console.log("checkSession", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.AcademicSession")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={City}
                  fullWidth
                  size="small"
                  value={
                    City.find(
                      (option: any) =>
                        option.value == formik.values.circUser.memberGroupId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.memberGroupId",
                      newValue?.value
                    );
                    formik.setFieldTouched("circUser.memberGroupId", true);
                    formik.setFieldTouched("circUser.memberGroupId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.StudentMemberGroup")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="affiliation"
                  name="circUser.affiliation"
                  label={
                    <CustomLabel text={t("text.Affilation")} required={false} />
                  }
                  value={formik.values.circUser.affiliation}
                  placeholder={t("text.Affilation")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="phone1"
                  name="phone1"
                  inputProps={{ maxLength: 10 }}
                  label={
                    <CustomLabel text={t("text.MobNo")} required={false} />
                  }
                  value={formik.values.circUser.phone1}
                  placeholder={t("text.MobNo")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.circUser?.phone1 &&
                formik.errors.circUser?.phone1 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.phone1)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="phone2"
                  name="circUser.phone2"
                  label={<CustomLabel text={t("text.Fax")} required={false} />}
                  value={formik.values.circUser.phone2}
                  placeholder={t("text.Fax")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.circUser?.phone2 &&
                formik.errors.circUser?.phone2 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.phone2)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="email1"
                  name="circUser.email1"
                  label={
                    <CustomLabel text={t("text.EnterEmail")} required={false} />
                  }
                  value={formik.values.circUser.email1}
                  placeholder={t("text.EnterEmail")}
                  inputProps={{}}
                  size="small"
                  type="email"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.circUser?.email1 &&
                formik.errors.circUser?.email1 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.email1)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="pan_no"
                  name="circUser.pan_no"
                  label={
                    <CustomLabel
                      text={t("text.EnterPanNumber")}
                      required={false}
                    />
                  }
                  value={formik.values.circUser.pan_no}
                  placeholder={t("text.EnterPanNumber")}
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
                  options={Role}
                  fullWidth
                  size="small"
                  value={
                    Role.find(
                      (option: any) =>
                        option.value + "" === formik.values.circUser.classname
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.classname",
                      newValue?.value + ""
                    );
                    formik.setFieldTouched("circUser.classname", true);
                    formik.setFieldTouched("circUser.classname", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.MemberGroup")}
                          required={requiredFields.includes(
                            "circUser.classname"
                          )}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.circUser?.classname &&
                formik.errors.circUser?.classname ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.classname)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Department}
                  fullWidth
                  size="small"
                  value={
                    Department.find(
                      (option: any) =>
                        option.value === formik.values.circUser.departmentcode
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.departmentcode",
                      newValue?.value
                    );
                    formik.setFieldTouched("circUser.departmentcode", true);
                    formik.setFieldTouched("circUser.departmentcode", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDepartment")}
                          required={requiredFields.includes(
                            "circUser.departmentcode"
                          )}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.circUser?.departmentcode &&
                formik.errors.circUser?.departmentcode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.departmentcode)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={EmpDesignation}
                  fullWidth
                  style={{
                    backgroundColor: "white",
                  }}
                  size="small"
                  value={
                    EmpDesignation.find(
                      (option: any) =>
                        option.value === formik.values.circUser.designationId
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.designationId",
                      newValue?.value
                    );
                    formik.setFieldTouched("circUser.designationId", true);
                    formik.setFieldTouched("circUser.designationId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDesignation")}
                          required={false}
                        />
                      }
                    />
                  )}
                />

                {formik.touched.circUser?.designationId &&
                formik.errors.circUser?.designationId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.designationId)}
                  </div>
                ) : null}
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <TextField
                  id="yearSem"
                  name="circUser.yearSem"
                  label={
                    <CustomLabel text={t("text.YearSem")} required={false} />
                  }
                  value={formik.values.circUser.yearSem}
                  placeholder={t("text.YearSem")}
                  inputProps={{ maxLength: 6 }}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="section"
                  name="circUser.section"
                  label={
                    <CustomLabel text={t("text.Section")} required={false} />
                  }
                  value={formik.values.circUser.section}
                  placeholder={t("text.Section")}
                  inputProps={{ maxLength: 6 }}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={BloodGroup}
                  fullWidth
                  size="small"
                  value={
                    BloodGroup.find(
                      (option: any) =>
                        option.value == formik.values.circUser.bloodGrp
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("circUser.bloodGrp", newValue?.value);
                    formik.setFieldTouched("circUser.bloodGrp", true);
                    formik.setFieldTouched("circUser.bloodGrp", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.BloodGroup")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="doj"
                  name="circUser.doj"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label={
                    <CustomLabel
                      text={t("text.EnterJoiningDate")}
                      required={requiredFields.includes("circUser.doj")}
                    />
                  }
                  value={formik.values.circUser.doj}
                  placeholder={t("text.EnterJoiningDate")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.circUser?.doj && formik.errors.circUser?.doj ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.doj)}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="validupto"
                  name="circUser.validupto"
                  label={
                    <CustomLabel
                      text={t("text.EnterRetirementDate")}
                      required={false}
                    />
                  }
                  value={formik.values.circUser.validupto}
                  placeholder={t("text.EnterRetirementDate")}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  type="date"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.circUser?.validupto &&
                formik.errors.circUser?.validupto ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.circUser.validupto)}
                  </div>
                ) : null}
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Program}
                  fullWidth
                  size="small"
                  value={
                    Program.find(
                      (option: any) =>
                        option.value === formik.values.circUser.program_id
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.program_id",
                      newValue?.value
                    );
                    formik.setFieldTouched("circUser.program_id", true);
                    formik.setFieldTouched("circUser.program_id", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.programCourse")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={IssueSt}
                  fullWidth
                  size="small"
                  value={
                    IssueSt.find(
                      (option) =>
                        option.value ==
                        formik.values.circUser.issuedjournalstatus
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "circUser.issuedjournalstatus",
                      newValue?.value + ""
                    );
                    formik.setFieldTouched(
                      "circUser.issuedjournalstatus",
                      true
                    );
                    formik.setFieldTouched(
                      "circUser.issuedjournalstatus",
                      false
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.IssueStatus")}
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
                  options={IssueSt}
                  fullWidth
                  size="small"
                  value={
                    IssueSt.find(
                      (option) => option.label == formik.values.circUser.status
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("circUser.status", newValue?.label);
                    formik.setFieldTouched("circUser.status", true);
                    formik.setFieldTouched("circUser.status", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.Status")} required={false} />
                      }
                    />
                  )}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                  <TextField
                    id="dlno"
                    name="dlno"
                    label="Enter DL No"
                    value={formik.values.dlno}
                    placeholder="Enter DL No"
                    inputProps={{}}
                    size="small"
                    type="text"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid> */}

              <Grid item lg={4} xs={12}>
                <TranslateTextField
                  label={t("text.Remark")}
                  value={formik.values.circUser.remarks}
                  onChangeText={(text: string) =>
                    handleConversionChange("circUser.remarks", text)
                  }
                  required={true}
                  lang={lang}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Membership}
                  fullWidth
                  size="small"
                  // value={
                  //   option.find(
                  //     (option) => option.value === formik.values.circUser.roleId
                  //   ) || null
                  // }
                  onChange={(event, newValue: any) => {
                    setSelectedMembership(newValue?.value || null);
                    formik.setFieldValue(
                      "circUser.roleId",
                      newValue?.value + ""
                    );
                    formik.setFieldTouched("circUser.roleId", true);
                    formik.setFieldTouched("circUser.roleId", false);
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
              </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="securityMoney"
                  name="circUser.securityMoney"
                  label={
                    <CustomLabel
                      text={t("text.SecurityMoney")}
                      required={false}
                    />
                  }
                  value={formik.values.circUser.securityMoney}
                  placeholder={t("text.SecurityMoney")}
                  inputProps={{ maxLength: 6 }}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {selectedMembership === "2" && (
                <>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="toDate"
                      type="date"
                      name="toDate"
                      label={
                        <CustomLabel
                          text={t("text.FromDate")}
                          required={requiredFields.includes("toDate")}
                        />
                      }
                      // value={formik.values.toDate}
                      placeholder={t("text.FromDate")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="toDate"
                      type="date"
                      name="toDate"
                      label={
                        <CustomLabel
                          text={t("text.ToDate")}
                          required={requiredFields.includes("toDate")}
                        />
                      }
                      // value={formik.values.toDate}
                      placeholder={t("text.ToDate")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="amount"
                      type="number"
                      name="amount"
                      label={
                        <CustomLabel
                          text={t("text.Amount")}
                          required={requiredFields.includes("amount")}
                        />
                      }
                      //value={formik.values.amount}
                      placeholder={t("text.Amount")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </>
              )}

              <br />
              <Divider />

              <Grid lg={12} xs={12}>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.PermanentAddress")}
                </Typography>
              </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="peraddress"
                  name="address.peraddress"
                  label={
                    <CustomLabel
                      text={t("text.HouseNoStreet")}
                      required={requiredFields.includes("address.peraddress")}
                    />
                  }
                  value={formik.values.address.peraddress}
                  placeholder={t("text.HouseNoStreet")}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={count}
                  fullWidth
                  size="small"
                  //onOpen={() => getCount()}

                  value={
                    count.find(
                      (option: any) =>
                        option.label + "" ===
                        formik.values.address.percountry + ""
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    setSelectedMembership(newValue?.value || null);
                    formik.setFieldValue(
                      "address.percountry",
                      newValue?.label + ""
                    );
                    getDept(newValue?.value);
                    formik.setFieldTouched("address.percountry", true);
                    formik.setFieldTouched("address.percountry", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterCountry")}
                          required={requiredFields.includes(
                            "address.percountry"
                          )}
                        />
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DeptOption}
                  fullWidth
                  size="small"
                  value={
                    DeptOption.find(
                      (option) =>
                        option.label + "" ===
                        formik.values.address.perstate + ""
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "address.perstate",
                      newValue?.label + ""
                    );

                    getDistrict(newValue?.value);
                    formik.setFieldTouched("address.perstate", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterState")}
                          required={false}
                        />
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null, // Remove the dropdown arrow
                      }}
                    />
                  )}
                  PopperComponent={(props) => (
                    <Popper {...props} style={{ width: "auto" }} />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DistOption}
                  fullWidth
                  size="small"
                  value={
                    DistOption.find(
                      (option) =>
                        option.label + "" === formik.values.address.percity + ""
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "address.percity",
                      newValue?.label + ""
                    );
                    formik.setFieldTouched("address.percity", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterCity")}
                          required={false}
                        />
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null, // Remove the dropdown arrow
                      }}
                    />
                  )}
                  PopperComponent={(props) => (
                    <Popper {...props} style={{ width: "auto" }} />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="perpincode"
                  name="address.perpincode"
                  label={
                    <CustomLabel
                      text={t("text.EnterPinCode")}
                      required={false}
                    />
                  }
                  value={formik.values.address.perpincode}
                  placeholder={t("text.EnterPinCode")}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <br />
              <Divider />

              <Grid lg={12} xs={12}>
                <Typography
                  gutterBottom
                  variant="h4"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left"
                >
                  {t("text.LocalAddress")}
                </Typography>
              </Grid>

              <Grid item lg={12} xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsPermanentName}
                      onChange={handleSameAsPermanentNameChange}
                    />
                  }
                  label={t("text.SameAsPermanentAddress")}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="localaddress"
                  name="address.localaddress"
                  label={
                    <CustomLabel
                      text={t("text.HouseNoStreet")}
                      required={false}
                    />
                  }
                  value={formik.values.address.localaddress}
                  placeholder={t("text.HouseNoStreet")}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={count}
                  fullWidth
                  size="small"
                  //onOpen={() => getCount()}

                  value={
                    count.find(
                      (option: any) =>
                        option.label + "" ===
                        formik.values.address.localcountry + ""
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue(
                      "address.localcountry",
                      newValue?.label + ""
                    );
                    getDept(newValue?.value);
                    formik.setFieldTouched("address.localcountry", true);
                    formik.setFieldTouched("address.localcountry", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterCountry")}
                          required={requiredFields.includes(
                            "address.localcountry"
                          )}
                        />
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null, // Remove the dropdown arrow
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DeptOption}
                  fullWidth
                  size="small"
                  value={
                    DeptOption.find(
                      (option) =>
                        option.label + "" ===
                        formik.values.address.localstate + ""
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "address.localstate",
                      newValue?.label + ""
                    );

                    getDistrict(newValue?.value);
                    formik.setFieldTouched("address.localstate", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterState")}
                          required={false}
                        />
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null, // Remove the dropdown arrow
                      }}
                    />
                  )}
                  PopperComponent={(props) => (
                    <Popper {...props} style={{ width: "auto" }} />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DistOption}
                  fullWidth
                  size="small"
                  value={
                    DistOption.find(
                      (option) =>
                        option.label + "" ===
                        formik.values.address.localcity + ""
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    formik.setFieldValue(
                      "address.localcity",
                      newValue?.label + ""
                    );
                    formik.setFieldTouched("address.localcity", true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnterCity")}
                          required={false}
                        />
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: null, // Remove the dropdown arrow
                      }}
                    />
                  )}
                  PopperComponent={(props) => (
                    <Popper {...props} style={{ width: "auto" }} />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="localpincode"
                  name="address.localpincode"
                  label={
                    <CustomLabel
                      text={t("text.EnterPinCode")}
                      required={false}
                    />
                  }
                  value={formik.values.address.localpincode}
                  placeholder={t("text.EnterPinCode")}
                  size="small"
                  type="text"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.EnterImageUpload")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) =>
                      otherDocChangeHandler(e, "circUser.memberPic")
                    }
                  />
                </Grid>

                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.circUser.memberPic == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={
                          "data:image/png;base64," +
                          formik.values.circUser.memberPic
                        }
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle("circUser.memberPic")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>
                <Modal open={panOpens} onClose={handlePanClose}>
                  <Box sx={style}>
                    {modalImg == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={"data:image/png;base64," + modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>

              <Grid container spacing={1} item>
                <Grid
                  xs={12}
                  md={4}
                  sm={4}
                  item
                  style={{ marginBottom: "30px", marginTop: "30px" }}
                >
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    InputLabelProps={{ shrink: true }}
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.EnterSignatureUpload")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) =>
                      otherDocChangeHandler(e, "circUser.memberSign")
                    }
                  />
                </Grid>
                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {formik.values.circUser.memberSign == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <img
                        src={
                          "data:image/png;base64," +
                          formik.values.circUser.memberSign
                        }
                        style={{
                          width: 150,
                          height: 100,
                          border: "1px solid grey",
                          borderRadius: 10,
                          padding: "2px",
                        }}
                      />
                    )}
                    <Typography
                      onClick={() => modalOpenHandle1("circUser.memberSign")}
                      style={{
                        textDecorationColor: "blue",
                        textDecorationLine: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </Grid>
                </Grid>

                <Modal open={Opens} onClose={handlePanClose1}>
                  <Box sx={style}>
                    {Img == "" ? (
                      <img
                        src={nopdf}
                        style={{
                          width: "170vh",
                          height: "75vh",
                        }}
                      />
                    ) : (
                      <img
                        alt="preview image"
                        src={"data:image/png;base64," + Img}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
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

export default MemberPetronEdit;
