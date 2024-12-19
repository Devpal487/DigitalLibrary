import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
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
  Autocomplete,
  Button,
  Drawer,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";

import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import ToastApp from "../ToastApp";
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function HourlyIssue() {
  const Userid = getId();

  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  
 

  const [isVisible1, setIsVisible1] = useState(false);

  const { t } = useTranslation();

  const { menuId, menuName } = getMenuData();

  const instId: any = getinstId();

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.FillMemberCode") },
  ]);

  const [IsAccn, setAccn] = useState<any>([
    { value: "-1", label: t("text.FillBookAccnNo") },
  ]);

  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);
  const [member, setMember] = useState<any>([]);

  const [isAccnData, setAccnData] = useState<any>([]);

  const [isUserCode, setUserCode] = useState<any>("");
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [accordionExpanded1, setAccordionExpanded1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const handleAccordionToggle1 = () => {
    setAccordionExpanded1((prev) => !prev);
  };

  useEffect(() => {
    // fetchZonesData();
    // getProgram();
  }, []);

  const getProgram = (term: any) => {
    //console.log("term", term);
    // api.get(`api/Admin/SuggCircUser?term=${term}`).then((res) => {
    api.get(`api/Search/GetHourTrans?term=${term}`).then((res) => {
      console.log("checkMemb", res?.data);

      const arr: any = [];

      for (let index = 0; index < res?.data.length; index++) {
        arr.push({
          value: res?.data[index]["value"],
          label: res?.data[index]["label"],
        });
      }
      setProgram(arr);
    });
  };

  const getMember = (usercode: any) => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: parseInt(instId),
      userCode: usercode,
      fromDate: "1900-10-03T13:14:15.279Z",
      asOn: new Date().toISOString().slice(0, 10),
    };
    api.post(`api/Transaction/MembBalanceData`, collectData).then((res) => {
      console.log("checkMemb", res?.data?.data);
      

      if (res?.data?.data) {
        setMember(res?.data?.data?.memSmall);
        setAccordionExpanded1(true);
        setIsVisible2(true);
      }
    });
  };

  const getAccn = (AccnNo: any) => {
    api.get(`api/Catalog/GetItemSugg2?term=${AccnNo}`).then((res) => {
      //console.log("checkMemb", res.data.data);
      console.log("checkIssueItem", res?.data);
      const arr: any = [];

      for (let index = 0; index < res?.data?.length; index++) {
        arr.push({
          value: res?.data[index]["value"],
          label: res?.data[index]["label"],
        });
      }
      setAccn(arr);
    });
  };

  const AccnData = (AccnNo: any) => {
    api.get(`api/Catalog/GetAccnSmall?Accn=${AccnNo}`).then((res) => {
      //console.log("checkMemb", res.data.data);
      console.log("checkIssueItem", res?.data);
      const data = res?.data?.data;

      setIsVisible1(true);

      setTimeout(() => {
        setAccordionExpanded(true);
      }, 500);

      setAccnData(data);
    });
  };

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,

      designationId: 0,
      designation: "",
      shortName: "",
      instId: parseInt(instId),
      AsOnDate: new Date().toISOString(),
    },

    onSubmit: async (values: any) => {
      console.log("before submitting value check", values);
      const response = await api.post(
        `api/Basic/AddUpdateDesignationMaster`,
        values
      );

      if (response.data.isSuccess) {
        formik.setFieldValue("designation", "");
        formik.setFieldValue("shortName", "");
        // fetchZonesData();
        toast.success(response.data.mesg);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

 

  const handleAccordionToggle = () => {
    setAccordionExpanded((prev) => !prev);
  };

  const today = new Date();
  const lastYearDate = new Date(today.setFullYear(today.getFullYear() - 1));

  const fetchZonesData = async (userCode: any) => {
    try {
      const collectData = {
        appId: menuId,
        appName: menuName,
        // add: true,
        // update: true,
        // delete: true,
        // read: true,
        instId: parseInt(instId),
        userCode: userCode,
        fromDate: lastYearDate.toISOString(),
        asOn: new Date().toISOString(),
      };
      const response = await api.post(
        `api/Transaction/MembBalanceHourData`,
        collectData
      );
      const data = response.data.data.vBookIssdRec;

      console.log("HourData", data);
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: index + 1,
      }));
      setZones(zonesWithIds);

      console.log("state data", zonesWithIds);

      //setSelectedRows(zonesWithIds.map((zone: any) => zone.id));
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "accno",
            headerName: t("text.AccnNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "title",
            headerName: t("text.Title"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "issuedate",
            headerName: t("text.IssueDate"),
            flex: 2,
            // headerClassName: "MuiDataGrid-colCell",

            valueGetter: (params) => {
              const date = new Date(params.value);
              const formattedDate = `${String(date.getDate()).padStart(
                2,
                "0"
              )}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${date.getFullYear()}`;
              const time = `${String(date.getHours()).padStart(
                2,
                "0"
              )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                date.getSeconds()
              ).padStart(2, "0")}`;
              return `${formattedDate} (Time: ${time})`;
            },
          },

          {
            field: "duedate",
            headerName: t("text.DueDate"),
            flex: 2,
            // headerClassName: "MuiDataGrid-colCell",
            valueGetter: (params) => {
              const date = new Date(params.value);
              const formattedDate = `${String(date.getDate()).padStart(
                2,
                "0"
              )}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}-${date.getFullYear()}`;
              const time = `${String(date.getHours()).padStart(
                2,
                "0"
              )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                date.getSeconds()
              ).padStart(2, "0")}`;
              return `${formattedDate} (Time : ${time})`;
            },
          },

          {
            field: "auth1",
            headerName: t("text.Auth1"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "fineamount",
            headerName: t("text.FineAmount"),
            flex: 0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "status",
            headerName: t("text.Status"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "userRecieve",
            headerName: t("text.Receive"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));

  // const handleRowSelection = (selectionModel: any) => {
  //   const selectedData = zones.filter((zone: any) =>
  //     selectionModel.includes(zone.id)
  //   );
  //   setSelectedRows(selectedData);
  //   console.log("Selected Rows:", selectedData);
  // };

  //const accnNo = selectedRows.length > 0 ? selectedRows[0].accnNo : "";

  const IssueData = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      // add: true,
      // update: true,
      // delete: true,
      // read: true,
      instId: parseInt(instId),
      ucode: isUserCode,
      accno: isAccnData[0]?.accnNo,
      asOn: "2024-10-03T13:30:18.658Z",
    };
    api.post(`api/Transaction/IssueItemHourly`, collectData).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  // const requiredFields = ["designation"];

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
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

          <Grid item xs={12} container spacing={1}>
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.HourlyIssue")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Program}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    getMember(newValue?.value);
                    setUserCode(newValue?.value);
                    setIsVisible(true);

                    fetchZonesData(newValue?.value);
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() != "" || value != null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getProgram(value);
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
                          text={t("text.FindMember")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={IsAccn}
                  //   value={
                  //     DeptOption.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    AccnData(newValue?.value);
                    // setIsVisible(true);
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() != "" || value != null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getAccn(value);
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
                          text={t("text.ItemToIssue")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  // type="date"
                  label={
                    <CustomLabel text={t("text.AsOnDate")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="AsOnDate"
                  id="AsOnDate"
                  value={formik.values.AsOnDate}
                  placeholder={t("text.AsOnDate")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {isVisible2 && (
                <>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Accordion
                      expanded={accordionExpanded1}
                      onChange={handleAccordionToggle1}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                        sx={{ backgroundColor: "#3492eb", color: "#fff" }}
                      >
                        <Typography
                          style={{ fontWeight: 600, fontSize: "16px" }}
                        >
                          {t("text.Member")} : {member?.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <br></br>
                        <br></br>

                        <Grid item xs={12} container spacing={2}>
                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.MemberGroup")}:{""} {""}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.classname}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.Program")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.program}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.CategoryApplied")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.itemCategory}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.ValidUpto")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.validUpto}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.Phone")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.phone1}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.ItemLimit")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {member?.issueLimit}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item sm={4} lg={4} xs={12}>
                            <img
                              src={"data:image/png;base64," + member?.memberpic}
                              style={{
                                height: "50vh",
                                width: "100%",
                                border: "1px solid gray",
                              }}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "3%" }}>
            {isVisible1 && (
                <>
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
                        <Typography
                          style={{ fontWeight: 600, fontSize: "16px" }}
                        >
                          {t("text.AccessionDetails")}
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
                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.AccnOrTitle")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {isAccnData[0]?.title}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.Authors")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {isAccnData[0]?.auth}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.CallNo")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {isAccnData[0]?.callno}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.Category")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {isAccnData[0]?.category}
                              </span>
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={4} lg={4}>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="div"
                              align="left"
                              marginTop="2%"
                            >
                              {t("text.IssueCount")}:{""}{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {isAccnData[0]?.issuedCount}
                              </span>
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                    <br />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={1.5} lg={1.5}></Grid>
              <Grid item xs={12} sm={4.5} lg={4.5}>
                <Button
                  fullWidth
                  style={{
                    backgroundColor: "#3474eb",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    IssueData();

                    e.preventDefault();
                  }}
                >
                  <CreateIcon style={{ marginRight: "8px" }} />
                  {t("text.Issue")}
                </Button>
              </Grid>

              <Grid item xs={12} sm={4.5} lg={4.5}>
                <Button
                  fullWidth
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => {
                    formik.resetForm();
                    e.preventDefault();
                  }}
                >
                  <RefreshIcon style={{ marginRight: "8px" }} />
                  {t("text.reset")}
                </Button>
              </Grid>
              <Grid item xs={12} sm={1.5} lg={1.5}></Grid>
            </Grid>

            <br />
            <Divider
              sx={{
                borderWidth: "1px",
                borderColor: "#524f4f",
                marginTop: "3%",
              }}
            />
            <br />

            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={12} lg={12}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="left"
                  marginTop="2%"
                >
                  Issued Items:
                </Typography>
              </Grid>
              {isVisible && (
                <>
                  <Grid item xs={12} sm={12} lg={12}>
                    <DataGrid
                      rows={zones}
                      columns={adjustedColumns}
                      rowSpacingType="border"
                      autoHeight
                      // checkboxSelection
                      pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                        value: size,
                        label: `${size}`,
                      }))}
                      // onRowSelectionModelChange={handleRowSelection}
                      // rowSelectionModel={selectedRows} // Default selected rows
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#42b6f5",
                          color: "white",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          color: "white",
                        },
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
