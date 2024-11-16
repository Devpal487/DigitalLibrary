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
  Dialog,
  DialogTitle,
  DialogContent,
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
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SearchIcon from "@mui/icons-material/Search";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function StockReport() {
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMember, setMember] = useState<any>([]);
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const [isItemId, setItemId] = useState();

  const [open, setOpen] = useState(false);
  const [Row, setRow] = useState<any>(null);

  const { t } = useTranslation();

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.SelectItem") },
  ]);

  const closeStatus = () => {
    setOpen(false);
  };

  useEffect(() => {
    getProgram();
  }, []);

  const getProgram = () => {
    api.get(`api/Basic/GetDigitalContent`).then((res) => {
      // console.log("checkMemb", res?.data);

      const arr: any = [];

      for (let index = 0; index < res?.data?.data?.length; index++) {
        arr.push({
          value: res?.data?.data[index]["id"],
          label: res?.data?.data[index]["title"],
        });
      }
      setProgram(arr);
    });
  };

  const exportToPDF = async () => {
    const input: any = document.getElementById("data-grid"); // The id of the Grid container
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190; // Adjust according to your needs
    const pageHeight = pdf.internal.pageSize.height;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add the image to PDF
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Stock-Ledger-report.pdf");
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        voucherId: -1,
        stockBinId: 5,
        itemId: isItemId,
      };

      const response = await api.post(
        `api/StockLedger/GetStockLedgerReportDetails`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.entryNo,
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
            flex: 0.5,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "titleName",
            headerName: t("text.ItemName"),
            flex: 1,
            // renderCell: (params) => (
            //   <span
            //     onClick={() => {
            //       setOpen(true);
            //       setRow(params?.row);
            //     }}
            //     style={{
            //       color: "blue",
            //       textDecoration: "underline",
            //       cursor: "pointer",
            //     }}
            //   >
            //     {params.value}
            //   </span>
            // ),
          },

          {
            field: "rate",
            headerName: t("text.Rate"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "voucherType",
            headerName: t("text.voucherType"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },


          {
            field: "inQty",
            headerName: t("text.InQuantity"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "outQty",
            headerName: t("text.OutQuantity"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "unitName",
            headerName: t("text.UnitName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

        
          // {
          //   field: "openning",
          //   headerName: t("text.Opening"),
          //   flex: 1,
          //   // headerClassName: "MuiDataGrid-colCell",
          // },
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
                {t("text.StockReport")}
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
                  options={[{ value: -1, label: "Select All" }].concat(Program)}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    //console.log(newValue?.value);

                    setItemId(newValue?.value);
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectItem")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={2} lg={2}>
                <Button
                  onClick={fetchZonesData}
                  variant="contained"
                  endIcon={<SearchIcon />}
                  
                  style={{ backgroundColor: `var(--header-background)` }}
                >
                  search
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={1}
                lg={1}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={exportToPDF}
              >
                <PrintIcon
                  style={{ color: isHovered ? "black" : "blue" }}
                  fontSize="large"
                />
              </Grid>
              {isVisible && (
                <>
                  <Grid item sm={12} lg={12} xs={12} id="data-grid">
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
                          backgroundColor: `var(--grid-headerBackground)`,
                          color:`var(--grid-headerColor)`,
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

            <Grid item xs={12} container spacing={2}>
              <Grid item sm={12} lg={12} xs={12}>
                <Dialog
                  open={open}
                  onClose={closeStatus}
                  fullWidth
                  sx={{
                    "& .MuiDialogContent-root": {
                      padding: "20px",
                      height: "350px",
                    },
                  }}
                >
                  <DialogTitle
                    style={{
                      padding: "10px",
                      backgroundColor: `var(--grid-headerBackground)`,
                      color: `var(--grid-headerColor)`,
                    }}
                  >
                    Stock Summary Details
                  </DialogTitle>
                  <DialogContent>
                    <Grid
                      item
                      xs={12}
                      container
                      spacing={2}
                      sx={{ marginTop: "2%" }}
                    >
                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          Title Name:{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.titleName}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          Rate(s):{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.rate}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          In Quantity:{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.inQty}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          Out Quantity:{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.outQty}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          total In Ammount:{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.totalInAmount}
                          </span>
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} lg={6}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          align="left"
                          marginTop="2%"
                        >
                          total Out Ammount:{""}{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {Row?.totalOutAmount}
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
