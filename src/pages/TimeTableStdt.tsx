import React, { useEffect, useState, useRef } from "react";
import {
  Autocomplete,
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  Table,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../utils/Url";
import CustomLabel from "../utils/CustomLabel";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TimeTableStdt = (props: {}) => {
  let navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [ZoneOption, setZoneOption] = useState([
    { value: "-1", label: t("text.SelectSession") },
  ]);
  const [progSubj, setProgSubj] = useState([
    { value: "-1", label: t("text.SelectProgramForSubject") },
  ]);
  const [subject, setSubject] = useState("");
  const [program, setProgram] = useState("");
  const [session, setSession] = useState("");
  const [classTable, setClassTable] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handleVisible = () => {
    setIsVisible((prevState) => !prevState);
  };

  useEffect(() => {
    getVehicleZone();
  }, []);

  const getVehicleZone = () => {
    api.get(`api/Basic/GetAcademicSession`).then((res) => {
      const arr: any = [];
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
      programSubjectId: value?.subjectId,
      sess: session,
      facultyCode: "",
    };
    api.post(`api/Academic/GetTimeTable`, collectData).then((res) => {
      const arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
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
      setClassTable(arr);
    });
  };

  const formik = useFormik({
    initialValues: {
      appId: 0,
      appName: "",
      add: true,
      update: true,
      delete: false,
      read: true,
      instId: 0,
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
    },
    onSubmit: async (values) => {
      const response = await api.post(
        `api/Academic/AddUpdateClassTimeTableSingle`,
        values
      );
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        setTimeout(() => {
          navigate("/ClassTimeTable");
        }, 900);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const printTable = () => {
    if (printRef.current) {
      html2canvas(printRef.current, { scrollY: -window.scrollY }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = 295; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 
        let heightLeft = imgHeight;
        let position = 0;
  
        // Add the first page
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        // Add additional pages if necessary
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save("timetable.pdf");
      });
    }
  };

  return (
    <div>
      <div
        style={{
          padding: "5px",
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
                onClick={() => navigate(-1)}
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
                {t("text.PrintTimeTable")}
              </Typography>
            </Grid>
            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              {/* Language dropdown can be added here if needed */}
            </Grid>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} lg={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ZoneOption}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("sess", newValue?.value);
                    setSession(newValue?.value);
                    getProgramSubject(newValue?.value);
                    formik.setFieldTouched("sess", true);
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
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("prgSubjId", newValue?.value);
                    formik.setFieldValue("program_name", newValue?.label);
                    handleVisible();
                    getClassTable(newValue);
                    formik.setFieldTouched("prgSubjId", true);
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
                    <div ref={printRef}>
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
                              }}
                            >
                              {t("text.SrNo")}
                            </th>
                            <th
                              style={{
                                borderLeft: "1px solid black",
                                paddingTop: "5px",
                                paddingBottom: "5px",
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
                    </div>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              container
              spacing={2}
              sx={{ marginTop: "2%", justifyContent: "center" }}
            >
              <Grid item lg={3} sm={3} xs={12}>
                <Grid>
                  <Button
                    onClick={printTable}
                    fullWidth
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    Print
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default TimeTableStdt;
