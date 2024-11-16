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
import moment from "moment";

type Props = {};

const StudentDayClass = (props: Props) => {
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

  const [subject, setSubject] = useState<any>();
  const [program, setProgram] = useState<any>();
  const [session, setSession] = useState<any>("");

  console.log("CheckForClass", { program, subject });

  const [isVisible, setIsVisible] = useState(false);
  const [classTable, setClassTable] = useState([]);

  const handleVisible = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Function to toggle visibility

  useEffect(() => {
    getVehicleZone();

    getMemberGroup();
  }, []);

  const getVehicleZone = () => {
    const collectData = {};
    api.get(`api/Basic/GetAcademicSession`).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["academicSession"],
          value: res.data.data[index]["academicSession"],
        });
      }
      setZoneOption(arr);
    });
  };

  const getProgramSubject = (sess: any) => {
    api.get(`api/Academic/ProgSubject?sess=${sess}`).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["program_name"],
          value: res.data.data[index]["program_id"],
        });
      }
      setProgSubj(arr);
    });
  };

  const getClassTable = (value: any) => {
    const collectData = {
      program_id: value?.value,
      // programSubjectId: value?.subjectId,
      sess: session,
      facultyCode: "",
    };
    api.post(`api/Academic/GetTimeTable`, collectData).then((res) => {
      const arr: any = [];
      console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        if (res.data.data[index]["prgSubjId"] != null) {
          arr.push({
            facultyCode: res.data.data[index]["facultyCode"],
            subject_name: res.data.data[index]["subject_name"],
            period: res.data.data[index]["period"],

            faculty: res.data.data[index]["faculty"],
            memberGroup: res.data.data[index]["memberGroup"],

            day: res.data.data[index]["day"],
            dayNo: res.data.data[index]["dayNo"],
            id: res.data.data[index]["id"],
          });
        }
      }
      setClassTable(arr);
    });
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

      listClassDet: [
        {
          appId: menuId,
          appName: menuName,
          add: true,
          update: true,
          delete: false,
          read: true,
          instId: 0,
          classId: 0,
          studentCode: "",
          studentName: "",
          programSubjectId: 0,
          classDate: "",
          facultyCode: "",
          facultyName: "",
          program: "",
          subject: "",
          periodId: 0,
          memberGroupId: 0,
          memberGroup: "",
          attendStatus: "s",
          isActive: "",
          period: "",
          roomNo: "",
          remark: "",
          sess: "",
        },
      ],
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
                {t("text.CreateStudentDayClass")}
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
            {/* <ToastContainer />
                { <ToastApp />} */}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} lg={6} item>
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
                    getProgramSubject(newValue?.value);

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

              <Grid xs={12} lg={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={progSubj}
                  // value={
                  //   ZoneOption.find(
                  //     (option: any) => option.value === formik.values.instId
                  //   ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("prgSubjId", newValue?.value);
                    formik.setFieldValue("program_name", newValue?.label);
                    handleVisible();

                    getClassTable(newValue);

                    formik.setFieldTouched("prgSubjId", true);
                    formik.setFieldTouched("prgSubjId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectProgramForSubject")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {isVisible && (
                <>
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
                              paddingBlock: "10",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              // width: "100px",
                            }}
                          >
                            {t("text.SrNo")}
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              // width: "100px",
                            }}
                          >
                            DayNo
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          >
                            Day
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                              width: "100px",
                            }}
                          >
                            Period
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          >
                            Class Subject
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          >
                            Faculty Code
                          </th>

                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          >
                            Faculty
                          </th>
                          <th
                            style={{
                              borderLeft: "1px solid black",
                              paddingTop: "5px",
                              paddingBottom: "5px",
                            }}
                          >
                            Group(If.Appl.)
                          </th>
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
                                textAlign: "center",
                                padding: "2px",
                                color: "#000",
                              }}
                            >
                              {index + 1}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.dayNo}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.day}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.period}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.subject_name}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.facultyCode}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.faculty}
                            </td>

                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                color: "#000",
                              }}
                            >
                              {row.memberGroup}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Grid>
                </>
              )}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="faculty"
                  name="faculty"
                  label={
                    <CustomLabel text={t("text.Faculty")} required={false} />
                  }
                  // value={formik.values.faculty}
                  placeholder={t("text.Faculty")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="faculty"
                  type="date"
                  name="faculty"
                  label={
                    <CustomLabel text={t("text.ClassDate")} required={false} />
                  }
                  // value={formik.values.faculty}
                  placeholder={t("text.ClassDate")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid xs={12} lg={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={memberGroup}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("memberGroupId", newValue?.value);
                    formik.setFieldValue("memberGroup", newValue?.label);

                    formik.setFieldTouched("memberGroupId", true);
                    formik.setFieldTouched("memberGroupId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectMemberGroup")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "2%" }}>
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
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default StudentDayClass;
