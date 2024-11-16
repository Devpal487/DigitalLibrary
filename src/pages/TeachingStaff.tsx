import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  TextField,
  Typography,
  Table,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
//import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getMenuData } from "../utils/Constant";
import ReactQuill from "react-quill";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";
import NotesIcon from "@mui/icons-material/Notes";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MessageIcon from "@mui/icons-material/Message";

type Props = {};

const TeachingStaff = (props: Props) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // const validationSchema = Yup.object({

  //   dept_name: Yup.string().test(
  //     'required',
  //     t('text.reqdept_name'),
  //     function (value: any) {
  //       return value && value.trim() !== '';
  //     }
  //   ),
  // });
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");

  const [memberGroup, setMemberGroup] = useState([
    { value: "-1", label: t("text.SelectMemberGroup") },
  ]);
  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectSession") },
  ]);

  const [progSubj, setProgSubj] = useState([
    { value: "-1", label: t("text.SelectProgramForSubject") },
  ]);

  const [subject, setSubject] = useState("");
  const [IsFacultyClass, setFacultyClass] = useState([]);
  const [IsClassSumm, setClassSumm] = useState([]);

  const [IsClassPlan, setClassPlan] = useState([]);

  const [session, setSession] = useState("");

  const [selectedProgram, setSelectedProgram] = useState(null);

  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [isRecord, setIsRecord] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isPlans, setIsPlans] = useState(false);
  const [isMember, setIsMember] = useState(false);
  // const [planTable, setPlanTable] = useState(false);

  const handleDayClassRecordsClick = () => {
    setIsRecord(true);
    setValue(1);
    setIsVisible(false);
    setIsPlans(false);
    setIsMember(false);
  };

  const handleClassPlansClick = () => {
    setIsPlans(true);
    setIsRecord(false);
    setValue(2);
    setIsVisible(false);
    setIsMember(false);
  };

  const handleMessageToMemberClick = () => {
    setIsPlans(false);
    setIsRecord(false);
    setValue(3);
    setIsVisible(false);
    setIsMember(true);
  };

  const [value, setValue] = useState(0);

  const tabStyle = {
    default: {
      backgroundColor: "#3474eb",
      color: "#fff",
      fontWeight: "normal",
      transition: "background-color 0.3s ease, color 0.3s ease",

      "&:hover": {
        backgroundColor: "#00007a",
      },
    },
    selected: {
      backgroundColor: "#f0f0f0",
      color: "#000",
      fontWeight: "bold",

      transition: "background-color 0.3s ease, color 0.3s ease",
    },
  };

  const handleTabChange = (event: any, newValue: any) => {
    setValue(newValue);
    // Call the corresponding function based on the tab index
    switch (newValue) {
      case 0:
        handleButtonClick();
        break;
      case 1:
        handleDayClassRecordsClick();
        break;
      case 2:
        handleClassPlansClick();
        break;
      case 3:
        handleMessageToMemberClick();
        break;
      default:
        break;
    }
  };

  const [IsNoteDate, setNoteDate] = useState("");
  console.log("checkDateEducation", IsNoteDate);
  const [EduSubject, setEduSubject] = useState("");
  const [IsEducation, setEducation] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [summaryTable, setSummaryTable] = useState(false);
  const [editorContent, setEditorContent] = useState<string>("");

  const [tableData1, setTableData1] = useState<any>([]);
  const [EmpCode, setEmpCode] = useState<any>("");
  const [Remark, setRemark] = useState<any>("");
  const [keywords, setKeywords] = useState<any>("");

  const getClassPlanning = () => {
    const collectData = {
      facultyCode: MemberCode.toString(),

      classDateFrom: formik.values.planFromDate.toString(),
      classDateTo: formik.values.planToDate.toString(),
    };
    api.post(`api/Academic/GetFacultyNotesNoPrg`, collectData).then((res) => {
      const arr: any = [];
      // console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          classDate: res.data.data[index]["classDate"],

          noteContent: res.data.data[index]["noteContent"],
          noteTitle: res.data.data[index]["noteTitle"],

          id: res.data.data[index]["noteId"],
        });
      }
      setTableData1(arr);
    });
  };

  const addMoreRow1 = () => {
    const newRows = {
      id: null,

      classDate: keywords,
      noteTitle: EmpCode,
      noteContent: Remark,
    };

    console.log("🚀 ~ addMoreRow1 ~ newRows:", newRows);
    setTableData1((prevTableData: any) => {
      const updatedTableDataed = [...prevTableData, newRows];
      return updatedTableDataed;
    });

    setKeywords("");
    setEmpCode("");
    setRemark("");
  };

  const removeExtraRow1 = (id: any) => {
    setTableData1((prevTableData: any) => {
      const updatedTableDataed = prevTableData.filter(
        (row: any) => row.id !== id
      );
      return updatedTableDataed;
    });
  };

  const SaveClassPlanning = () => {
    const collectData = tableData1.map((row: any) => ({
      appId: menuId,
      appName: menuName,
      instId: 1,
      noteId: row.id,
      facultyCode: MemberCode.toString(),
      programSubjectId: 0,
      noteTitle: row.noteTitle,
      classDate: row.classDate,
      noteContent: row.noteContent,
      asOn: new Date().toISOString(),
      noSave:false,
    }));

    api.post(`api/Academic/SaveFacultyNoteRange`, collectData).then((res) => {
      if (res.data.isSuccess) {
        // setToaster(true);
        toast.success(res.data.mesg);
        setTableData1([]);
      } else {
        // setToaster(true);
        toast.error(res.data.mesg);
      }
    });
  };

  const handleButtonClick = () => {
    getFacultyClasses();
    setIsVisible(true);
    setValue(0);
    setIsRecord(false);
    setIsPlans(false);
    setIsMember(false);
  };

  const handleClassSummary = () => {
    getClassSumm();
    setSummaryTable(true);
  };

  const handleEditorChange = (content: any) => {
    setEditorContent(content);
  };

  useEffect(() => {
    getVehicleZone();
    getProgramSubject();
    //getMemberGroup();
    // GetFaculty();
  }, []);

  const [MemberCode, setMemberCode] = useState<any>();
  const [MemberName, setMemberName] = useState("");
  const [IsCircClass, setIsCircClass] = useState("");

  const GetFaculty = (facultyCode: any) => {
    // const collectData = {};
    api
      .get(`api/Academic/GetFaculty?MemberCodeNm=${facultyCode}`)
      .then((res) => {
        // console.log('checkmember',res.data.data.memberName)
        const data = res.data.data;
        setMemberCode(data.memberCode);
        setMemberName(data.memberName);
        setIsCircClass(data.circClass);
      });
  };
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (event: any) => {
    const { value } = event.target;
    formik.setFieldValue("faculty", value);

    if (value.trim() != "" || value != null) {
      if (timerCheck) {
        clearTimeout(timerCheck);
      }

      const checkResult = setTimeout(() => {
        GetFaculty(value);
      }, 500);
      setTimerCheck(checkResult);
    }
    //GetFaculty(value);
  };

  const getVehicleZone = () => {
    const collectData = {};
    api.get(`api/Basic/GetAcademicSession`).then((res) => {
      const arr: any = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["academicSession"],
          value: res.data.data[index]["academicSession"],
        });
      }
      setZoneOption(arr);
    });
  };

  const getProgramSubject = () => {
    const collectData = {
      isActive: true,
    };
    api.post(`api/Academic/GetProgramSubject`, collectData).then((res) => {
      const arr: any = [];
      //console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          subjectName: res.data.data[index]["subjectName"],
          sess: res.data.data[index]["sess"],
          prgName: res.data.data[index]["prgName"],
          label: res.data.data[index]["prgName"],
          value: res.data.data[index]["id"],
        });
      }
      setProgSubj(arr);
    });
  };

  const getFacultyClasses = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,

      facultyCode: MemberCode.toString(),
      subject: "",
      facultyName: "",
      subjectType: "",

      program: "",
      sess: session,
    };
    api.post(`api/Academic/GetFacultyClasses`, collectData).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          subject: res.data.data[index]["subject"],

          dayNo: res.data.data[index]["dayNo"],
          program_name: res.data.data[index]["program_name"],
          periodName: res.data.data[index]["periodName"],
          id: res.data.data[index]["timeTableId"],
        });
      }
      setFacultyClass(arr);
    });
  };

  const getClassSumm = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,

      facultyCode: MemberCode.toString(),
      subject: "",
      facultyName: "",
      subjectType: "",
      fromDate: formik.values.fromDate.toString(),
      toDate: formik.values.toDate.toString(),

      program: "",
      sess: session,
    };
    api.post(`api/Academic/GetAttendClassesSumm`, collectData).then((res) => {
      const arr: any = [];
      // console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          classDate: res.data.data[index]["classDate"],
          attended: res.data.data[index]["attended"],
          total: res.data.data[index]["total"],

          subject: res.data.data[index]["subject"],
          subjectType: res.data.data[index]["subjectType"],
          program: res.data.data[index]["program"],
          id: res.data.data[index]["programSubjectId"],
        });
      }
      setClassSumm(arr);
    });
  };

  const [IsFacultyTitle, setFacultyTitle] = useState("");
  const [IsProgSubjectId, setProgSubjectId] = useState();
  const [IsAsOn, setOnAs] = useState("");

  const getFacultyNote = (row: any) => {
    const collectData = {
      facultycode: MemberCode.toString(),
      classdate: row.classDate,
      programsubjectid: row.id,
    };
    api.post(`api/Academic/GetFacultyNote`, collectData).then((res) => {
      const arr: any = [];
      // console.log("facultyNote" + JSON.stringify(res.data.data));

      setFacultyTitle(res.data.data.noteTitle);
      setEditorContent(res.data.data.noteContent);
      setProgSubjectId(res.data.data.programSubjectId);
      setOnAs(res.data.data.asOn);
    });
  };

  const saveNoteClass = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,

      noteId: null,
      facultyCode: MemberCode.toString(),
      programSubjectId: IsProgSubjectId,
      noteTitle: IsFacultyTitle,
      classDate: IsNoteDate,
      noteContent: editorContent,
      asOn: IsAsOn,
      noSave: true,
    };

    api.post(`api/Academic/SaveFacultyNote`, collectData).then((res) => {
      if (res.data.isSuccess) {
        // setToaster(true);
        toast.success(res.data.mesg);
      } else {
        // setToaster(true);
        toast.error(res.data.mesg);
      }
    });
  };

  const { menuId, menuName } = getMenuData();

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: false,
      read: true,
      instId: 0,
      fromDate: "",
      toDate: "",
      id: null,
      prgSubjId: 0,
      facultyCode: "",
      periodId: 0,
      dayNo: 0,
      isActive: true,
      remark: "",
      memberGroupId: 0,
      memberGroup: "",
      period: "",
      day: "",
      faculty: "",
      program_name: "",
      subject_name: "",
      sess: "",
      planFromDate: "",
      planToDate: "",
    },
    //validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `api/Academic/AddUpdateClassTimeTableSingle`,
        values
      );
      if (response.data.isSuccess) {
        // setToaster(true);
        toast.success(response.data.mesg);

        setTimeout(() => {
          navigate("/ClassTimeTable");
        }, 900);
      } else {
        // setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [""];

  const formatDate = (dateString: string) => {
    // Convert to a Date object
    const date = new Date(dateString);

    // Adjust to local timezone if needed (optional)
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);

    // Format to YYYY-MM-DD
    return localDate.toISOString().split("T")[0];
  };

  const handleEducation = (row: any) => {
    setEducation(row.program);
    setEduSubject(row.subject);

    setNoteDate(formatDate(row.classDate));
  };

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
                {t("text.TeachingStaffPanel")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              {/* <select
                    className="language-dropdown"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Language)}
                  >
                    {Languages.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select> */}
            </Grid>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            <ToastContainer />
            {/*   { <ToastApp />} */}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} lg={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  // value={
                  //   ZoneOption.find(
                  //     (option: any) => option.value === formik.values.instId
                  //   ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("sess", newValue?.value);
                    setSession(newValue?.value);

                    formik.setFieldTouched("sess", true);
                    formik.setFieldTouched("sess", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectSession")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="faculty"
                  name="faculty"
                  label={
                    <CustomLabel text={t("text.Faculty")} required={false} />
                  }
                  value={formik.values.faculty}
                  placeholder={t("text.Faculty")}
                  size="small"
                  fullWidth
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="left"
                >
                  : {""} {MemberName}
                </Typography>
              </Grid>

              <Grid xs={12} lg={5} item>
                <Grid>
                  <Button
                    fullWidth
                    style={{
                      backgroundColor: "#3474eb",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={handleButtonClick}
                    // disabled={!selectedProgram}
                  >
                    class
                  </Button>
                </Grid>
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
              sx={{
                marginTop: "2%",

                borderRadius: 2,
              }}
            >
              <Grid
                item
                lg={12}
                xs={12}
                sx={{
                  // backgroundColor: "#3474eb",
                  // padding: 1,
                  borderRadius: "10px",
                  //marginLeft: "1%",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                  variant="fullWidth"
                  sx={{
                    minHeight: "50px",
                    maxHeight: "50px",
                    alignItems: "center",
                  }}
                >
                  <Tab
                    label="Faculty Classes"
                    icon={<ClassIcon />}
                    iconPosition="start"
                    sx={value === 0 ? tabStyle.selected : tabStyle.default}
                  />
                  <Tab
                    label="Day Class Records"
                    icon={<NotesIcon />}
                    iconPosition="start"
                    sx={value === 1 ? tabStyle.selected : tabStyle.default}
                  />
                  <Tab
                    label="Class Plans"
                    icon={<AssignmentIcon />}
                    iconPosition="start"
                    sx={value === 2 ? tabStyle.selected : tabStyle.default}
                  />
                  <Tab
                    label="Message To Member"
                    icon={<MessageIcon />}
                    iconPosition="start"
                    sx={value === 3 ? tabStyle.selected : tabStyle.default}
                  />
                </Tabs>
              </Grid>

              {isVisible && (
                <>
                  <Grid item lg={12} xs={12}>
                    <Table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        border: "1px solid black",
                        tableLayout: "fixed", // Ensures columns take equal space
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#00009c",
                          color: "#f5f5f5",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "20%",
                            }}
                          >
                            Serial No.
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "20%",
                            }}
                          >
                            Period
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "20%",
                            }}
                          >
                            Day
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "20%",
                            }}
                          >
                            Class
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "20%",
                            }}
                          >
                            Subject
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ border: "1px solid black" }}>
                        {IsFacultyClass.map((row: any, index: any) => (
                          <tr
                            key={row.id}
                            style={{ border: "1px solid black" }}
                          >
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "right",
                                padding: "2px",
                                color: "#000",
                                width: "20%",
                                paddingRight: "3%",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "left",
                                color: "blue",
                                width: "20%",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setIsPlans(true);
                                setIsRecord(false);
                                setValue(2);
                                setIsVisible(false);
                                setIsMember(false);
                              }}
                            >
                              {row.periodName}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "right",
                                color: "#000",
                                width: "20%",
                                paddingRight: "3%",
                              }}
                            >
                              {row.dayNo}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "left",
                                color: "#000",
                                width: "20%",
                              }}
                            >
                              {row.program_name}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "left",
                                color: "#000",

                                width: "20%",
                              }}
                            >
                              {row.subject}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Grid>
                </>
              )}

              {isRecord && (
                <>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Typography variant="h6" align="center">
                      Record only for Class Date wise by Teaching staff based on
                      Class Subject
                    </Typography>
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="fromDate"
                      type="date"
                      name="fromDate"
                      label={
                        <CustomLabel
                          text={t("text.ClassFrom")}
                          required={false}
                        />
                      }
                      value={formik.values.fromDate}
                      placeholder={t("text.ClassFrom")}
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
                          text={t("text.ClassTo")}
                          required={false}
                        />
                      }
                      value={formik.values.toDate}
                      placeholder={t("text.ClassTo")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid xs={12} lg={4} item>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "#3474eb",
                          color: "white",
                        }}
                        onClick={handleClassSummary}
                        // disabled={!selectedProgram}
                      >
                        Class Summary
                      </Button>
                    </Grid>
                  </Grid>

                  {summaryTable && (
                    <Grid item lg={12} xs={12}>
                      <Table
                        style={{
                          borderCollapse: "collapse",
                          width: "100%",
                          border: "1px solid black",
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#00009c",
                            color: "#f5f5f5",
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                // width: "100px",
                              }}
                            >
                              Serial No.
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                // width: "100px",
                              }}
                            >
                              Program Subject
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                              }}
                            >
                              Class Date
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                width: "100px",
                              }}
                            >
                              Subject Type
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                width: "100px",
                              }}
                            >
                              Attend
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                width: "100px",
                              }}
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ border: "1px solid black" }}>
                          {IsClassSumm.map((row: any, index: any) => (
                            <tr
                              key={row.id}
                              style={{ border: "1px solid black" }}
                            >
                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "right",
                                  padding: "2px",
                                  color: "#000",
                                  // width: "20%",
                                  paddingRight: "3%",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "left",
                                  color: "#000",
                                }}
                              >
                                <span
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => {
                                    handleEducation(row);
                                    getFacultyNote(row);
                                  }}
                                >
                                  {row.program}
                                </span>{" "}
                                : {row.subject}
                              </td>

                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "right",
                                  color: "#000",
                                  paddingRight: "1%",
                                }}
                              >
                                {moment(row.classDate).format("DD-MM-YYYY")}
                              </td>

                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "center",
                                  color: "#000",
                                }}
                              >
                                {row.subjectType}
                              </td>
                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "right",
                                  color: "#000",
                                  paddingRight: "3%",
                                }}
                              >
                                {row.attended}
                              </td>
                              <td
                                style={{
                                  borderLeft: "1px solid black",
                                  borderTop: "1px solid black",
                                  textAlign: "right",
                                  color: "#000",
                                  paddingRight: "3%",
                                }}
                              >
                                {row.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Grid>
                  )}

                  <Grid item lg={3} xs={12}>
                    <TextField
                      id="noteTitle"
                      name="noteTitle"
                      label={
                        <CustomLabel
                          text={t("text.TitleOfNote")}
                          required={false}
                        />
                      }
                      value={IsFacultyTitle}
                      placeholder={t("text.TitleOfNote")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                      style={{ marginTop: "10%" }}
                    />
                  </Grid>

                  <Grid item lg={3} xs={12}>
                    <TextField
                      id="noteDate"
                      type="date"
                      name="noteDate"
                      label={
                        <CustomLabel
                          text={t("text.NoteDate")}
                          required={false}
                        />
                      }
                      value={IsNoteDate}
                      placeholder={t("text.NodeDate")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                      style={{ marginTop: "10%" }}
                    />
                  </Grid>

                  <Grid xs={12} lg={3} item>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "#3474eb",
                          color: "white",
                          marginTop: "10%",
                        }}
                        onClick={() => {
                          setIsEditor(true);
                        }}
                        // disabled={!selectedProgram}
                      >
                        Open Note
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid xs={12} lg={3} item>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "#3474eb",
                          color: "white",
                          marginTop: "10%",
                        }}
                        onClick={saveNoteClass}
                        // disabled={!selectedProgram}
                      >
                        Save Note For Class
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid xs={12} lg={12} item>
                    <Typography
                      variant="h6"
                      style={{ marginTop: "3%", justifyContent: "flex-start" }}
                      //onClick={handleClick}
                    >
                      Program Subject :
                      <span
                        style={{
                          color: "#595796",
                        }}
                      >
                        {""} {IsEducation} :- {EduSubject}
                      </span>
                    </Typography>
                  </Grid>

                  {isEditor && (
                    <Grid item xs={12} sm={12} sx={{ marginTop: "5%" }}>
                      {/* <QuillEditor /> */}

                      <ReactQuill
                        value={editorContent}
                        onChange={handleEditorChange}
                        modules={modules}
                        formats={formats}
                      />
                    </Grid>
                  )}
                </>
              )}

              {isPlans && (
                <>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="planFromDate"
                      type="date"
                      name="planFromDate"
                      label={
                        <CustomLabel
                          text={t("text.ClassFrom")}
                          required={false}
                        />
                      }
                      value={formik.values.planFromDate}
                      placeholder={t("text.ClassFrom")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="planToDate"
                      type="date"
                      name="planToDate"
                      label={
                        <CustomLabel
                          text={t("text.ClassTo")}
                          required={false}
                        />
                      }
                      value={formik.values.planToDate}
                      placeholder={t("text.ClassTo")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid xs={12} lg={4} item>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "#3474eb",
                          color: "white",
                        }}
                        onClick={() => {
                          getClassPlanning();
                        }}
                        // disabled={!selectedProgram}
                      >
                        Get Class Planning
                      </Button>
                    </Grid>
                  </Grid>

                  {/* {planTable && ( */}
                  <Grid xs={12} lg={12} item>
                    <Table
                      style={{
                        borderCollapse: "collapse",
                        width: "100%",
                        border: "1px solid black",
                      }}
                    >
                      <thead
                        style={{ backgroundColor: "#f5f5f5", color: "#000" }}
                      >
                        <tr>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                              width: "25%",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {t("text.Action")}
                              <IconButton
                                color="primary"
                                aria-label="add"
                                sx={{
                                  backgroundColor: "#47cc4c",
                                  "&:hover": { backgroundColor: "#B2EBF2" },
                                  color: "#fff",
                                  fontSize: "16px",
                                  width: "30px",
                                  height: "30px",
                                  marginLeft: "5px",
                                }}
                                onClick={addMoreRow1}
                              >
                                <AddIcon />
                              </IconButton>
                            </div>
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                              width: "25%",
                            }}
                          >
                            {t("text.Date")}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="EmpName"
                                name="EmpName"
                                label={t("text.Date")}
                                value={keywords}
                                placeholder={t("text.Date")}
                                size="small"
                                type="date"
                                fullWidth
                                style={{
                                  backgroundColor: "white",
                                  margin: "1%",
                                }}
                                onChange={(e: any) =>
                                  setKeywords(e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                            </div>
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                              width: "25%",
                            }}
                          >
                            {t("text.PlanTitle")}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="EmpCode"
                                name="EmpCode"
                                label={t("text.PlanTitle")}
                                value={EmpCode}
                                placeholder={t("text.PlanTitle")}
                                size="small"
                                type="text"
                                fullWidth
                                style={{ backgroundColor: "white" }}
                                onChange={(e: any) =>
                                  setEmpCode(e.target.value)
                                }
                              />
                            </div>
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                              width: "25%",
                            }}
                          >
                            {t("text.Plans")}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                id="Remark"
                                name="Remark"
                                label={t("text.Plans")}
                                value={Remark}
                                placeholder={t("text.Plans")}
                                size="small"
                                type="text"
                                fullWidth
                                style={{ backgroundColor: "white" }}
                                onChange={(e: any) => setRemark(e.target.value)}
                              />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ border: "1px solid black" }}>
                        {tableData1?.map((row: any, index: any) => (
                          <tr
                            key={row.id}
                            style={{ border: "1px solid black" }}
                          >
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                width: "25%",
                              }}
                            >
                              {" "}
                              <DeleteIcon
                                style={{
                                  fontSize: "20px",
                                  color: "darkred",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeExtraRow1(row.id)}
                              />{" "}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                width: "25%",
                              }}
                            >
                              {row.classDate}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                width: "25%",
                              }}
                            >
                              {row.noteTitle}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                width: "25%",
                              }}
                            >
                              {row.noteContent}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Grid>

                  <Grid xs={12} lg={4} item></Grid>

                  <Grid xs={12} lg={4} item>
                    <Grid>
                      <Button
                        fullWidth
                        style={{
                          backgroundColor: "#3c54a6",
                          color: "white",
                        }}
                        onClick={() => {
                          SaveClassPlanning();
                        }}
                        // disabled={!selectedProgram}
                      >
                        Save Class Plan
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid xs={12} lg={4} item></Grid>

                  {/* )} */}
                </>
              )}

              {isMember && (
                <>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Typography variant="h6" align="center">
                      Send Mail to Member
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "code-block",
];

export default TeachingStaff;
