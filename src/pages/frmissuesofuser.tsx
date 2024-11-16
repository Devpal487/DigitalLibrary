import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreIcon from "@mui/icons-material/Restore";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function Frmissuesofuser() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMember, setMember] = useState<any>([]);
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

  const { t } = useTranslation();

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.FindMember") },
  ]);


 
  //   useEffect(() => {
  //     fetchZonesData();
  //   }, []);
  
  const getProgram = (term: any) => {
    //console.log("term", term);
    // api.get(`api/Admin/SuggCircUser?term=${term}`).then((res) => {
    api.get(`api/Admin/SuggCircUser?term=${term}`).then((res) => {
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


  const fetchZonesData = async (MemberId:any) => {
    try {
      const response = await api.get(
        `api/Transaction/GetIssueReceive?UserCode=${MemberId}`
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.issueId,
      }));
      setZones(zonesWithIds);
      //setIsLoading(false);
      setIsVisible(true);
      setMember(data);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex:0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "accno",
            headerName: t("text.AccnNo"),
            flex:0.8,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "callNo",
            headerName: t("text.CallNo"),
            flex: 0.8,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "title",
            headerName: t("text.Title"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "auth1",
            headerName: t("text.Authors"),
            flex: 1.5,
            // headerClassName: "MuiDataGrid-colCell",
          },

         
          {
            field: "issuedate",
            headerName: t("text.IssueDate"),
            flex:2,
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
            flex:2,
            // headerClassName: "MuiDataGrid-colCell",
            valueGetter: (params) => {
              const date = new Date(params.value);
              const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
              const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
              return `${formattedDate} (Time : ${time})`;
          },
          },


          {
            field: "receivingdate",
            headerName: t("text.ReceivingDate"),
            flex: 2,
            // headerClassName: "MuiDataGrid-colCell",
            valueGetter: (params) => {
              const date = new Date(params.value);
              const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
              const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
              return `${formattedDate} (Time : ${time})`;
          },
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

  const formik = useFormik({
    initialValues: {
      MemberId: 0,
      MemberName: "",
      memberGroup: "",
      Department: "",
      FromCourse: "",
    },

    onSubmit: async (values) => {},
  });

  const handleReturn = (event: any) => {
    if (event.target.checked) {
      formik.setFieldValue("status", "Y");
    } else {
      formik.setFieldValue("status", "N");
    }
  };

  const handleAsOn = (event: any) => {
    if (event.target.checked) {
      formik.setFieldValue("canRequest", "Y");
    } else {
      formik.setFieldValue("canRequest", "N");
    }
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
                {t("text.IssueDetailsOfMember")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>

            <Grid item xs={12} sm={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Program}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    fetchZonesData(newValue?.value);
                    setIsVisible(true);

                    
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
              {/* <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="MemberId"
                  type="number"
                  name="MemberId"
                  label={
                    <CustomLabel text={t("text.MemberId")} required={false} />
                  }
                  value={formik.values.MemberId}
                  placeholder={t("text.MemberId")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}

              <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="IssueDateTo"
                  // type="date"
                  name="IssueDateTo"
                  label={
                    <CustomLabel text={t("text.MemberName")} required={false} />
                  }
                  value={isMember[0]?.name}
                  placeholder={t("text.MemberName")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="IssueDateTo"
                  // type="date"
                  name="IssueDateTo"
                  label={
                    <CustomLabel
                      text={t("text.MemberGroup")}
                      required={false}
                    />
                  }
                  value={isMember[0]?.className}
                  placeholder={t("text.MemberGroup")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="IssueDateTo"
                  // type="date"
                  name="IssueDateTo"
                  label={
                    <CustomLabel text={t("text.Department")} required={false} />
                  }
                  value={isMember[0]?.deptname}
                  placeholder={t("text.Department")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="IssueDateTo"
                  // type="date"
                  name="IssueDateTo"
                  label={
                    <CustomLabel text={t("text.FromCourse")} required={false} />
                  }
                  value={isMember[0]?.prgCourse}
                  placeholder={t("text.FromCourse")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item></Grid>

              <Grid item sm={6} lg={6} xs={12}>
                <FormControlLabel
                  control={<Checkbox onChange={handleReturn} />}
                  label="Issue But Returned"
                />
              </Grid>

              <Grid item sm={6} lg={6} xs={12}>
                <FormControlLabel
                  control={<Checkbox onChange={handleAsOn} />}
                  label="Issue As On Date"
                />
              </Grid>

              {isVisible && (
                <>
                  <Grid item sm={12} lg={12} xs={12}>
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

          {/* <Grid item xs={12} container spacing={2}>
            <Grid xs={12} sm={6} lg={6} item>
              <Button
                fullWidth
                style={{
                  backgroundColor: "#1abdb5",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={(e) => {
                  fetchZonesData();
                  e.preventDefault();
                }}
              >
                <VisibilityIcon style={{ marginRight: "8px" }} />
                Show
              </Button>
            </Grid>

            <Grid xs={12} sm={6} lg={6} item>
              <Button
                fullWidth
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  marginTop: "10px",
                }}
                onClick={(e) => {
                  formik.resetForm();
                  e.preventDefault();
                }}
              >
                <RestoreIcon style={{ marginRight: "8px" }} />
                Reset
              </Button>
            </Grid>
          </Grid> */}
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
