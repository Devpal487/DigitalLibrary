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
  Stack,
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
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataGrids from "../utils/Datagrids";

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

  const [dept, setDept] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toaster, setToaster] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [IsFaculty, setIsFaculty] = useState("");

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
  const [IsShow, setIsShow] = useState(false);
  const [classTable, setClassTable] = useState([]);
  //console.log('classTable',classTable)

  const handleVisible = () => {
    setIsVisible((prevState) => !prevState);
  };

  // Function to toggle visibility

  useEffect(() => {
    getVehicleZone();
    //getStudentTable();

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
            periodId: res.data.data[index]["periodId"],

            faculty: res.data.data[index]["faculty"],
            memberGroup: res.data.data[index]["memberGroup"],
            prgSubjId: res.data.data[index]["prgSubjId"],
            memberGroupId: res.data.data[index]["memberGroupId"],

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
          instId: 1,
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
      values.listClassDet[0].facultyName = IsFaculty;

      const response = await api.post(`api/Academic/RecordClasses`, values);
      if (response.data.isSuccess) {
        // setToaster(true);
        toast.success(response.data.mesg);
        setIsShow(false);

        // setTimeout(() => {
        //   navigate("/ClassTimeTable");
        // }, 900);
      } else {
        // setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const getStudentTable = async (row: any) => {
    formik.setFieldValue("listClassDet[0].memberGroup", row.memberGroup);
    formik.setFieldValue("listClassDet[0].memberGroupId", row.memberGroupId);
    formik.setFieldValue("listClassDet[0].facultyCode", row.facultyCode);
    setIsFaculty(row.faculty);

    try {
      const collectData = {
        progSubjId: row.prgSubjId,
        periodId: row.periodId,
        classDate: formik.values.listClassDet[0].classDate.toString(),
        dayNo: row.dayNo,
        memberGroupId: row.memberGroupId,
      };
      const response = await api.post(
        `api/Academic/GetStudentByNames`,
        collectData
      );
      const data = response.data.data;

      const formattedData = data.listStudent.map(
        (student: any, index: number) => ({
          ...student,
          id: index + 1,
          serialNo: index + 1,
          // classDate: student.classDate || 'N/A',
          // period: student.period || 'N/A',
          // studentCode: student.studentCode || 'N/A',
          // studentName: student.studentName || 'N/A',
          // memberGroup: student.memberGroup || 'N/A',
          // facultyCode: student.facultyCode || 'N/A',
          // facultyName: student.facultyName || 'N/A',
        })
      );
      setDept(formattedData);
      console.log("CheckStudentTable", formattedData);
      setIsLoading(false);

      if (data.listStudent.length > 0) {
        const columns: GridColDef[] = [
          // {
          //   field: "actions",
          //   headerClassName: "MuiDataGrid-colCell",
          //   headerName: t("text.Action"),
          //   width: 150,
          //   renderCell: (params) => (
          //     <Stack
          //       spacing={1}
          //       direction="row"
          //       sx={{ alignItems: "center", marginTop: "5px" }}
          //     >
          //       {/* Example action icons or buttons */}
          //       {/* Add your icons and event handlers here */}
          //     </Stack>
          //   ),
          // },
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "classDate",
            headerName: t("text.ClassDate"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "period",
            headerName: t("text.Period"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "studentCode",
            headerName: t("text.StudentCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "studentName",
            headerName: t("text.StudentName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "memberGroup",
            headerName: t("text.MemberGroup"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "facultyCode",
            headerName: t("text.FacultyCode"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "facultyName",
            headerName: t("text.FacultyName"),
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
            <ToastContainer />
            {/*  { <ToastApp />} */}
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

                    formik.setFieldValue(
                      "listClassDet[0].sess",
                      newValue?.value
                    );
                    setSession(newValue?.value);
                    getProgramSubject(newValue?.value);

                    formik.setFieldTouched("listClassDet[0].sess", true);
                    formik.setFieldTouched("listClassDet[0].sess", false);
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

              <Grid item lg={6} xs={12}>
                <TextField
                  id="classDate"
                  type="date"
                  name="listClassDet[0].classDate"
                  label={
                    <CustomLabel text={t("text.ClassDate")} required={false} />
                  }
                  value={formik.values.listClassDet[0].classDate}
                  placeholder={t("text.ClassDate")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
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

                    formik.setFieldValue(
                      "listClassDet[0].programSubjectId",
                      newValue?.value
                    );
                    formik.setFieldValue(
                      "listClassDet[0].program",
                      newValue?.label
                    );

                    //setProgram(newValue?.value);

                    handleVisible();

                    getClassTable(newValue);

                    formik.setFieldTouched(
                      "listClassDet[0].programSubjectId",
                      true
                    );
                    formik.setFieldTouched(
                      "listClassDet[0].programSubjectId",
                      false
                    );
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

             

              <Grid item lg={6} xs={12}>
                <TextField
                  id="memberGroup"
                  name="listClassDet[0].memberGroup"
                  label={
                    <CustomLabel
                      text={t("text.MemberGroup")}
                      required={false}
                    />
                  }
                  value={formik.values.listClassDet[0].memberGroup}
                  placeholder={t("text.MemberGroup")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <TextField
                  id="facultyCode"
                  name="listClassDet[0].facultyCode"
                  label={
                    <CustomLabel text={t("text.Faculty")} required={false} />
                  }
                  value={formik.values.listClassDet[0].facultyCode}
                  placeholder={t("text.Faculty")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item lg={6} xs={12}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="left"
                >
                  : {""} {IsFaculty}
                </Typography>
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
                          backgroundColor: "#3474eb",
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
                                color: "blue",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                if (formik.values.listClassDet[0].classDate) {
                                  getStudentTable(row);
                                  setIsShow(true);
                                } else {
                                  toast.error("Please Select Class Date");
                                }
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
            </Grid>

            {IsShow && (
              <>
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
              </>
            )}

            <Grid item xs={12} container spacing={2}>
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
