import React, { useEffect, useState } from "react";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import ToastApp from "../ToastApp";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getISTDate } from "../utils/Constant";
import CustomLabel from "../utils/CustomLabel";
import "react-transliterate/dist/index.css";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf"; 
import html2canvas from "html2canvas";
import SearchIcon from "@mui/icons-material/Search";
import PrintReportFormatpdf from "./PrintReportFormatpdf";
import PrintReportFormat from "./PrintReportFormat";
import * as ReactDOM from 'react-dom/client';
import DownloadIcon from '@mui/icons-material/Download';

export default function StockLedgerReport() {
  const [zones, setZones] = useState<any>([]);
  const {defaultValuestime} = getISTDate();
  const [isVisible, setIsVisible] = useState(false);
  const [isMember, setMember] = useState<any>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isItemId, setItemId] = useState();
  const [itemName, setItemName] = useState<any>("");
  const [showHide, setShowHide] = useState(false);
  const { t } = useTranslation();
  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.SelectItem") },
  ]);


  useEffect(() => {
    getProgram();
  }, []);

  const getProgram = () => {
    api.get(`api/Basic/GetDigitalContent`).then((res) => {
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
    // Dynamically create a div to render the PrintReportFormatpdf component
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    const element = (
      <PrintReportFormatpdf itemName={itemName} zones={zones} showHide={false} />
    );

    // Render the component in the hidden div
    const root = ReactDOM.createRoot(container);
    root.render(element);

    // Wait for the component to render before capturing it
    setTimeout(async () => {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL("image/png");
      const fileName = `${itemName}_${defaultValuestime}.pdf`;
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(fileName);

      // Cleanup the temporary container
      document.body.removeChild(container);
    }, 0);
  };

  const fetchZonesData = async () => {
    try {
      const collectData = {
        voucherId: -1,
        stockBinId: 5,
        itemId: isItemId,
      };

      const response = await api.post(
        `api/StockLedger/GetStockReport`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.itemId,
        balQty: parseInt(zone.inQty) - parseInt(zone.outQty),
      }));

      console.log("zonesWithIds",zonesWithIds);
      setZones(zonesWithIds);
      setIsVisible(true);
      setMember(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



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
                {t("text.StockSummary")}
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}></Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={4} md={6} lg={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={[{ value: -1, label: "Select All" }].concat(Program)}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    setItemId(newValue?.value);
                    setItemName(newValue?.label);
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

              <Grid item xs={2} md={2} lg={2}>
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
                md={4}
                lg={4}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={exportToPDF}
              >
                <DownloadIcon
                  style={{ color: isHovered ? "green" : "blue", cursor:"pointer" }}
                  fontSize="large"
                />
              </Grid>
              {isVisible && (
                <>
                  <Grid item sm={12} lg={12} xs={12} >
                    <PrintReportFormat itemName={itemName} zones={zones} showHide={showHide}/>
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
