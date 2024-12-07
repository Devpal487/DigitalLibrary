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
import ScheduleIcon from "@mui/icons-material/Schedule";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserManageHourlyTrans() {
  const Userid = getId();

  const [zones, setZones] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);

  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const [stateOption, setStateOption] = useState([
    { value: "-1", label: t("text.SelectState") },
  ]);
  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.ProgramCourse") },
  ]);

  const [Department, setDepartment] = useState<any>([
    { value: "-1", label: t("text.SelectDepartment") },
  ]);

  const [isCirculation, setCirculation] = useState<any>([
    { value: "-1", label: t("text.MemberGroup") },
  ]);

  const [IsTrans, setTrans] = useState<any>([
    { value: "-1", label: t("text.HourlyTransClass") },
  ]);

  const [isCirc, setCirc] = useState();

  useEffect(() => {
    getState();
    //fetchZonesData();
    getProgram();
    getDepartment();
    getCirculation();
    getTransiction();
  }, []);

  const getDepartment = () => {
    api.get(`api/Basic/GetDeptmaster`).then((res) => {
      //console.log("checkDepartment", res.data.data);
      const arr = res.data.data.map((item: any) => ({
        label: item.departmentname,
        value: item.departmentcode,
      }));
      setDepartment(arr);
    });
  };

  const getProgram = () => {
    api.get(`api/Basic/GetProgramMasterByName`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.program_name,
        value: item.program_id,
      }));
      setProgram(arr);
    });
  };

  const getState = () => {
    const collectData = {
      stateId: -1,
      countryId: -1,
    };
    api.post(`api/StateMaster/GetStateMaster`, collectData).then((res) => {
      const arr: any = [];
      //console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["stateName"],
          value: res.data.data[index]["stateId"],
        });
      }
      setStateOption(arr);
    });
  };

  const getCirculation = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: parseInt(instId),
      prog: true,
      categ: true,
      lang: true,
      inst: true,
      media: true,
      currency: true,
      castCateg: true,
      itemStatus: true,
      sess: true,
    };
    api.post(`api/Basic/getDropDownscommon`, collectData).then((res) => {
      const arr: any = [];
      console.log("resultCirc" + JSON.stringify(res?.data?.data));
      for (let index = 0; index < res?.data?.data?.lisInst?.length; index++) {
        arr.push({
          label: res?.data?.data?.lisInst[index]["userid"],
          value: res?.data?.data?.lisInst[index]["instituteCode"],
        });
      }
      setCirculation(arr);
    });
  };

  const getTransiction = () => {
    // const collectData = {
    //   appId: menuId,
    //   appName: menuName,
    //   add: true,
    //   update: true,
    //   delete: true,
    //   read: true,
    //   instId: parseInt(instId),
    //   prog: true,
    //   categ: true,
    //   lang: true,
    //   inst: true,
    //   media: true,
    //   currency: true,
    //   castCateg: true,
    //   itemStatus: true,
    //   sess: true,
    // };
    api.get(`api/Search/GetHourlyTransactions`).then((res) => {
      const arr: any = [];
      console.log("resulttrans" + JSON.stringify(res.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: `${res.data.data[index]["hrClassName"]} , ${res.data.data[index]["issuedMinutes"]} , ${res.data.data[index]["lateFinePerMinute"]} , ${res.data.data[index]["dayFinePerDay"]}`,
          value: res.data.data[index]["circClassId"],
        });
      }
      setTrans(arr);
    });
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        appId: menuId,
        appName: menuName,
        add: true,
        update: true,
        delete: true,
        read: true,
        instId: parseInt(instId),
        userCodeFrm: formik.values.MemberCodeFrom || "",
        userCodeTo: formik.values.MemberCodeTo || "",
        name: formik.values.MemberName || "",
        fatherName: "",
        sess: "",
        mobile: "",
        dojFrm: formik.values.DOJFrom || "",
        dojTo: formik.values.DOJTo || "",
        issdNotRet: true,
        haveFineBal: true,
        permAddr: "",
        permCity: "",
        dept: "",
        prog: "",
        joinYear: "",
        aadhar: "",
        setNo: formik.values.setNo,
      };
      const response = await api.post(
        `api/CircUser/GetMemberVwHourClass`,
        collectData
      );
      const data = response.data.data;
      console.log("checkMember", data);
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: index + 1,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "usercode",
            headerName: t("text.MemberId"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "name",
            headerName: t("text.Name"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "classname",
            headerName: t("text.MemberGroup"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "phone1",
            headerName: t("text.Phone"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "peraddress",
            headerName: t("text.PermanentAddress"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "percity",
            headerName: t("text.PermanentCity"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "session",
            headerName: t("text.Session"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "program_name",
            headerName: t("text.ProgramName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
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

  const handleRowSelection = (selectionModel: any) => {
    const selectedData = zones.filter((zone: any) =>
      selectionModel.includes(zone.id)
    );
    setSelectedRows(selectedData);
    console.log("Selected Rows:", selectedData); // Log selected rows
  };

  const { menuId, menuName } = getMenuData();

  // interface FormValues {
  //   appId: string;
  //   appName: any;
  //   add: boolean;
  //   update: boolean;
  //   delete: boolean;
  //   read: boolean;
  //   //designationId: any;
  //   designation: string;
  //   shortName: string;
  //   instId: number;
  // }

  const validationSchema = Yup.object({
    designation: Yup.string().test(
      "required",
      t("text.DesignationNameRequired"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const instId: any = getinstId();

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      DeptId: -1,
      circId: 0,
      TransId: 0,

      designationId: 0,
      designation: "",
      shortName: "",
      instId: parseInt(instId),
      MemberCodeFrom: "",
      MemberCodeTo: "",
      DOJFrom: "",
      DOJTo: new Date().toISOString().slice(0, 10),
      MemberName: "",
      setNo: 1,
    },

    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      // console.log("before submitting value check", values);
      // const response = await api.post(
      //   `api/Basic/AddUpdateDesignationMaster`,
      //   values
      // );
      // if (response.data.isSuccess) {
      //   formik.setFieldValue("designation", "");
      //   formik.setFieldValue("shortName", "");
      //   // fetchZonesData();
      //   toast.success(response.data.mesg);
      // } else {
      //   toast.error(response.data.mesg);
      // }
    },
  });

  const applyRule = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: parseInt(instId),
      hourlyRuleId: isCirc,
      hourlyMembist: [
        {
          appId: menuId,
          appName: menuName,
          add: true,
          update: true,
          delete: true,
          read: true,
          instId: parseInt(instId),
          hourTranId: null,
          userCode: selectedRows[0]?.usercode || "",
          name: "",
          circClassId: isCirc,
          hourlyClass: "",
          dateApplied: new Date().toISOString().slice(0, 10),
          applied: true,
        },
      ],
    };
    api
      .post(`api/CircUserOperate2/ApplyHourlyClass`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);

          formik.resetForm();

          formik.setFieldValue("TransId", "");

          formik.setFieldValue("circId", "");
          formik.setFieldValue("DeptId", "");
          setIsVisible(false);
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
                {t("text.MemberHourlyTransClass")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.MemberCodeFrom")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="MemberCodeFrom"
                  id="MemberCodeFrom"
                  value={formik.values.MemberCodeFrom}
                  placeholder={t("text.MemberCodeFrom")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.MemberCodeTo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="MemberCodeTo"
                  id="MemberCodeTo"
                  value={formik.values.MemberCodeTo}
                  placeholder={t("text.MemberCodeTo")}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  type="date"
                  label={
                    <CustomLabel text={t("text.DOJFrom")} required={true} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="DOJFrom"
                  id="DOJFrom"
                  value={formik.values.DOJFrom}
                  placeholder={t("text.DOJFrom")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  type="date"
                  label={
                    <CustomLabel text={t("text.DOJTo")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="DOJTo"
                  id="DOJTo"
                  value={formik.values.DOJTo}
                  placeholder={t("text.DOJTo")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={isCirculation}
                  value={
                    isCirculation.find(
                      (option: any) => option.value === formik.values.circId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("circId", newValue?.value);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.MemberGroup")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Program}
                  //   value={
                  //     DeptOption.find(
                  //       (option: any) => option.value === formik.values.stateId
                  //     ) || null
                  //   }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("stateId", newValue?.value);
                    formik.setFieldValue("stateName", newValue?.label);

                    formik.setFieldTouched("stateId", true);
                    formik.setFieldTouched("stateId", false);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.ProgramCourse")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}

              {/* <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Department}
                  value={
                    Department.find(
                      (option: any) => option.value === formik.values.DeptId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("DeptId", newValue?.value);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDepartment")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  type="number"
                  label={
                    <CustomLabel text={t("text.setNo")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="setNo"
                  id="setNo"
                  value={formik.values.setNo}
                  placeholder={t("text.setNo")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Button
                  fullWidth
                  style={{
                    backgroundColor: "#3474eb",
                    color: "white",
                    //marginTop: "10px",
                  }}
                  onClick={(e) => {
                    if (
                      formik.values.DOJFrom != "" &&
                      formik.values.DOJFrom != null
                    ) {
                      fetchZonesData();
                      setIsVisible(true);
                      e.preventDefault();
                    } else {
                      alert("Please fill Date of Joining ");
                    }
                  }}
                >
                  <SearchIcon style={{ marginRight: "8px" }} />
                  Find Members
                </Button>
              </Grid>
            </Grid>

            {isVisible && (
              <>
                <br />
                <Divider sx={{ borderWidth: "1px", borderColor: "#524f4f" }} />
                <br />
                <Grid item xs={12} container spacing={2}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={IsTrans}
                      value={
                        IsTrans.find(
                          (option: any) =>
                            option.value === formik.values.TransId
                        ) || null
                      }
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        formik.setFieldValue("TransId", newValue?.value);
                        setCirc(newValue?.value);
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel
                              text={t("text.HourlyTransClass")}
                              required={false}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#3474eb",
                        color: "white",
                      }}
                      onClick={(e) => {
                        applyRule();
                        e.preventDefault();
                      }}
                    >
                      <ScheduleIcon style={{ marginRight: "8px" }} />
                      Apply Hourly Rules
                    </Button>
                  </Grid>

                  {/* <Grid item xs={12} sm={8} lg={8}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  align="left"
                  marginTop="2%"
                >
                  Delete later when - no currently issued items
                </Typography>
              </Grid> */}
                </Grid>
              </>
            )}

            <Grid item xs={12} container spacing={2} sx={{ marginTop: "3%" }}>
              {isVisible && (
                <>
                  <Grid item xs={12} sm={12} lg={12}>
                    <DataGrid
                      rows={zones}
                      columns={adjustedColumns}
                      rowSpacingType="border"
                      autoHeight
                      checkboxSelection
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      onRowSelectionModelChange={handleRowSelection}
                      pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                        value: size,
                        label: `${size}`,
                      }))}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                      sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#42b6f5", // Header background color
                          color: "white", // Header text color
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          color: "white", // Header title text color
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
