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

export default function IssuReturnTrans() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

 

  const { t } = useTranslation();

  //   useEffect(() => {
  //     fetchZonesData();
  //   }, []);

  const fetchZonesData = async () => {
    try {
      const collectData = {
        userId: "",
        name: "",
        prog_name: "",
        accNo: "",
        title: "",
        status: "",
        issuedate:formik.values.IssueDateTo,
        issuedateto:formik.values.IssueDateTo,
        issuedatefrom:formik.values.IssueDateFrom,
        duedate:formik.values.IssueDateFrom,
        institutename: "",
      };
      const response = await api.post(
        `api/Basic/GetBookDetails_DateRange`,
        collectData
      );
      const data = response?.data?.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id:index + 1,
      }));
      setZones(zonesWithIds);

      
      //setIsLoading(false);
      setIsVisible(true);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "userid",
            headerName: t("text.UserId"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "name",
            headerName: t("text.Name"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "prgCourse",
            headerName: t("text.ProgramName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "accno",
            headerName: t("text.AccnNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "status",
            headerName: t("text.Status"),
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
            field: "duedate",
            headerName: t("text.DueDate"),
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

  const formik = useFormik({
    initialValues: {
      IssueDateFrom: "",
      IssueDateTo: "",
    },

    onSubmit: async (values) => {},
  });

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
                {t("text.CircularReport")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={6} lg={6} item>
                <TextField
                  id="IssueDateFrom"
                  type="date"
                  name="IssueDateFrom"
                  label={
                    <CustomLabel text={t("text.FromDate")} required={false} />
                  }
                  value={formik.values.IssueDateFrom}
                  placeholder={t("text.FromDate")}
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
                  type="date"
                  name="IssueDateTo"
                  label={
                    <CustomLabel text={t("text.ToDate")} required={false} />
                  }
                  value={formik.values.IssueDateTo}
                  placeholder={t("text.FromDate")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
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

          <Grid item xs={12} container spacing={2}>
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
          </Grid>

        
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
