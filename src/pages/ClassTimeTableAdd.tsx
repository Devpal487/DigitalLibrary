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

type Props = {};

const ClassTimeTableAdd = (props: Props) => {
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
  const [subject, setSubject] = useState([]);
  const [memberGroup, setMemberGroup] = useState([
    { value: "-1", label: t("text.SelectMemberGroup") },
  ]);
  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectSession") },
  ]);

  const [progSubj, setProgSubj] = useState([
    { value: "-1", label: t("text.SelectProgramForSubject") },
  ]);

  const [selectedProgram, setSelectedProgram] = useState();

  const [isVisible, setIsVisible] = useState(false);

  const [isPeriod, setIsPeriod] = useState<any>([]);
  const [isSess, setSess] = useState("");
  console.log("checkSession", isSess);

  // Function to toggle visibility
  const handleButtonClick = () => {
    getPeriod();
    getSubject();
    setIsVisible((prevState) => !prevState);
  };

  useEffect(() => {
    getVehicleZone();
    // getProgramSubject();
    getMemberGroup();
    //getPeriod();
  }, []);

  const getSubject = () => {
    // setIsTableLoading(true);
    const collectData = {
      appId: menuId,
      appName: menuName,
      subjectName: "",
      prgId: selectedProgram,
      prgName: "",
      sess: isSess,
      isActive: true,
    };
    api.post(`api/Academic/GetProgramSubject`, collectData).then((res) => {
      const arr: any = [];
      console.log("CheckPrgSubject" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          id: res.data.data[index]["id"],
          subjectName: res.data.data[index]["subjectName"],
          subjectId: res.data.data[index]["subjectId"],
        });
      }
      setSubject(arr);
    });
  };

  const getPeriod = () => {
    const collectData = {
      //sess: isSess,
    };
    api.get(`api/Academic/GetClassPeriodBySess?sess=${isSess}`).then((res) => {
      const arr: any = [];
      //console.log("CheckPeriod" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          id: res.data.data[index]["id"],
          periodName: res.data.data[index]["periodName"],
          sess: res.data.data[index]["sess"],
        });
      }
      setIsPeriod(arr);
    });
  };

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
      

     // id: null,
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

  const handlePeriodClick = (period: any) => {
    formik.setFieldValue("period", period.periodName);
    formik.setFieldValue("periodId", period.id);
  };

  const handleClick = (value: any) => {
    formik.setFieldValue("subject_name", value.subjectName);
   // formik.setFieldValue("prgSubjId", value.subjectId);
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
                {t("text.CreateStudentClassTimeTable")}
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
                    setSess(newValue?.value);
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
                    setSelectedProgram(newValue?.value);

                    formik.setFieldValue("prgSubjId", newValue?.value);
                    formik.setFieldValue("program_name", newValue?.label);

                    //setSubject(newValue?.subjectName);

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

              <Grid xs={12} lg={4} item>
                <Grid>
                  <Button
                    fullWidth
                    style={{
                      backgroundColor: "#3474eb",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={handleButtonClick}
                    disabled={!selectedProgram}
                  >
                    Get Subject/Time Table
                  </Button>
                </Grid>
              </Grid>

              {isVisible && (
                <>
                  <Grid xs={12} lg={8} item>
                    <Grid
                      container
                      item
                      xs="auto"
                      spacing={1}
                      justifyContent="flex-start"
                    >
                      {subject.map((value: any) => (
                        <Grid item key={value.id}>
                          <Typography
                            variant="h6"
                            onClick={() => handleClick(value)}
                            sx={{
                              color: "#595796",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {value.subjectName}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  <Grid xs={12} lg={12} item  sx={{marginTop:"3%"}}>
                    <Grid
                      item
                      xs={12}
                      container
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        align="center"
                        style={{ marginRight: "16px" }}
                      >
                        Days:
                      </Typography>
                      <Grid
                        container
                        item
                        xs="auto"
                        spacing={1}
                        justifyContent="flex-start"
                      >
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Monday");
                              formik.setFieldValue("dayNo", 1);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Monday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Tuesday");
                              formik.setFieldValue("dayNo", 2);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Tuesday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Wednesday");
                              formik.setFieldValue("dayNo", 3);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Wednesday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Thursday");
                              formik.setFieldValue("dayNo", 4);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Thursday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Friday");
                              formik.setFieldValue("dayNo", 5);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Friday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Saturday");
                              formik.setFieldValue("dayNo", 6);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Saturday
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body1"
                            onClick={() => {
                              formik.setFieldValue("day", "Sunday");
                              formik.setFieldValue("dayNo", 7);
                            }}
                            sx={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Sunday
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid xs={12} lg={12} item>
                    <Grid
                      item
                      xs={12}
                      container
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        align="center"
                        style={{ marginRight: "16px" }}
                      >
                        Periods:
                      </Typography>
                      <Grid
                        container
                        item
                        xs="auto"
                        spacing={1}
                        justifyContent="flex-start"
                      >
                        {isPeriod.map((period: any) => (
                          <Grid item key={period.id}>
                            <Typography
                              variant="body1"
                              onClick={() => handlePeriodClick(period)}
                              sx={{
                                color: "blue",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              {period.periodName}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>

            <br />
            <Divider sx={{ borderWidth: "1px", borderColor: "#524f4f" }} />
            <br />

            {isVisible && (
              <>
                <Grid
                  item
                  xs={12}
                  container
                  spacing={2}
                  sx={{
                    marginTop: "2%",
                    backgroundColor: "#57b4bd",
                    padding: 2,
                    borderRadius: 2,
                  }}
                >
                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="subject_name"
                      name="subject_name"
                      label={
                        <CustomLabel
                          text={t("text.Subject")}
                          required={false}
                        />
                      }
                      value={formik.values.subject_name}
                      placeholder={t("text.Subject")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputProps={{ readOnly: true }}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        "& .MuiInputBase-input": {
                          padding: "10px",
                        },
                        "& .MuiFormLabel-root": {
                          color: "#333333",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cccccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#007bff",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="period"
                      name="period"
                      label={
                        <CustomLabel text={t("text.Period")} required={false} />
                      }
                      value={formik.values.period}
                      placeholder={t("text.Period")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputProps={{ readOnly: true }}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        "& .MuiInputBase-input": {
                          padding: "10px",
                        },
                        "& .MuiFormLabel-root": {
                          color: "#333333",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cccccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#007bff",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="day"
                      name="day"
                      label={
                        <CustomLabel text={t("text.Day")} required={false} />
                      }
                      value={formik.values.day}
                      placeholder={t("text.Day")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputProps={{ readOnly: true }}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        "& .MuiInputBase-input": {
                          padding: "10px",
                        },
                        "& .MuiFormLabel-root": {
                          color: "#333333",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cccccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#007bff",
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <TextField
                      id="faculty"
                      name="faculty"
                      label={
                        <CustomLabel
                          text={t("text.Faculty")}
                          required={false}
                        />
                      }
                      value={formik.values.faculty}
                      placeholder={t("text.Faculty")}
                      size="small"
                      fullWidth
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        "& .MuiInputBase-input": {
                          padding: "10px",
                        },
                        "& .MuiFormLabel-root": {
                          color: "#333333",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#cccccc",
                          },
                          "&:hover fieldset": {
                            borderColor: "#999999",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#007bff",
                          },
                        },
                      }}
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
                          sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: 1,
                            "& .MuiInputBase-input": {
                              padding: "10px",
                            },
                            "& .MuiFormLabel-root": {
                              color: "#333333",
                            },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#cccccc",
                              },
                              "&:hover fieldset": {
                                borderColor: "#999999",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#007bff",
                              },
                            },
                          }}
                        />
                      )}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

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

export default ClassTimeTableAdd;
