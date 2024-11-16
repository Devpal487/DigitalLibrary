import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Grid,
  Typography,
  TextField,
  Button,
  CardContent,
  SwipeableDrawer,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate } from "../utils/Constant";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
import CustomLabel from "../utils/CustomLabel";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import Draggable from "react-draggable";
import { PaperProps } from "@mui/material/Paper";
import Flipbook from "./Flipbook";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';



function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});



export default function Pdfviewer() {
  const { t } = useTranslation();

  const Userid = getId();
  const { defaultValuestime } = getISTDate();
  const [digitalDatamain, setDigitalDataMain] = useState<any>([]);
  const [lang, setLang] = useState<Language>("en");
  const [digitalDatazones, setDigitalDataZones] = React.useState([]);
  const [digitalDatacolumns, setDigitalDataColumns] = React.useState<any>([]);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [selectedFileID, setSelectedFileID] = React.useState("");
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [dialogOpen, setDialoOpen] = React.useState<any>("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [imageName, setImageName] = React.useState("");

  // console.log("🚀 ~ ImageViewer ~ digitalDatazones:", digitalDatazones);
  // console.log("🚀 ~ ImageViewer ~ digitalDatacolumns:", digitalDatacolumns);

  const dialogClose = () => {
    setDialoOpen(false);
    setImageName("");
    setImagePreview("");
  };

  const handleConversionChange = (params: any, text: string) => {

    // let data = text.trim();
    formik.setFieldValue(params, text);

  };

  const GetDigitalFile = async (id: any) => {
    try {
      const response = await api.get(`api/DigitalOperate/GetDigitalFiles`, {
        params: { digicontentid: id },
      });
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
      }));
      setDigitalDataZones(zonesWithIds);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
          },
          {
            field: "givenFileName",
            headerName: " Related File Name",
            flex: 1,
            renderCell: (params: any) => {
              const fileName = params.row.givenFileName;
              const digitalContentId = params.row.savedFile;
              console.log("🚀 ~ GetDigitalFile ~ digitalContentId:", digitalContentId)

              const pdfExtensions = [".pdf", ];
              const fileExtension = fileName
                .slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
                .toLowerCase();
              const isPdfFile = pdfExtensions.includes(`.${fileExtension}`);

             
              const cellStyle = {
                cursor: isPdfFile ? "pointer" : "default",
                backgroundColor: isPdfFile ? "#f0f8ff" : "#f5f5f5",
                opacity: isPdfFile ? 1 : 0.5,
                padding: "4px",
                borderRadius: "4px",
              };

              const iconStyle = {
                width:"25px",
                hight:"25px",
                marginRight:"5%",
                color:"#e8633a"
              };

              const handleClick = (e: React.MouseEvent) => {
                e.preventDefault();
                if (isPdfFile) {
                  setSelectedFileName(fileName);
                  getImagePreviewDetails(digitalContentId);
                } else {
                  toast.info("This file is not an pdf file.");
                }
              };

              return (
                <span onClick={handleClick} style={cellStyle}>
                  {isPdfFile && <FontAwesomeIcon icon={faFilePdf} style={iconStyle} />}
                  {fileName}
                </span>
              );
            },
          },
          {
            field: "comment",
            headerName: "Comment",
            flex: 1,
          },
          {
            field: "dateSaved",
            headerName: "Save Date ",
            flex: 0.7,
            renderCell: (params: {
              row: { dateSaved: moment.MomentInput };
            }) => {
              return moment(params.row.dateSaved).format("DD-MM-YYYY");
            },
          },
        ];
        setDigitalDataColumns(columns as any);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getImagePreviewDetails =  (filename: any) => {
    console.log("🚀 ~ getImagePreviewDetails ~ filename:", filename)

    if (filename.toLowerCase().endsWith(".pdf")) {
      const response = `https://adhyalibdoc.mssplonline.com:8130/${filename}`;
      console.log("🚀 ~ getImagePreviewDetails ~ data:", response);
          setImagePreview(response);
          setDialoOpen(true);
        }
     else {
      toast.error("File type not supported for preview");
    }
  };

 

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      fileNames: "",
      dateFrom: null,
      dateTo: null,
      accnos: [""],
      memberCodes: [""],
      groupId: null,
      groupName: "",
      typeContentId: null,
      audienceId: null,
      memberGroupId: null,
      prgSubjId: null,
    },
    onSubmit: async (values) => {
      console.log("before submitting value check", values);
      const response = await api.post(
        `api/DigitalOperate/GetDigitalContent`,
        values
      );
      console.log("🚀 ~ onSubmit: ~ response:", response)
      
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        setDigitalDataMain(response.data.data);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const handleExpandClick = (index: number, id: number, item: any) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    GetDigitalFile(id);
    setProfileDrawerOpen(true);
    console.log(item);
    setSelectedFileID(item.id);
    setSelectedFileName(item.title);
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
        <ToastApp />
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
                {t("text.PdfViewer")}
                
              </Typography>
            </Grid>

            <Grid item lg={2} md={2} xs={12} marginTop={2}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>

          <Divider />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label="Search By Title"
                  value={formik.values.title}
                  onChangeText={(text: string) =>
                    handleConversionChange("title", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label="Search By Description"
                  value={formik.values.description}
                  onChangeText={(text: string) =>
                    handleConversionChange("description", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text="From Date" />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(event: any) =>
                    formik.setFieldValue("dateFrom", event.target.value)
                  }
                />
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TextField
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text="To Date" />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(event: any) =>
                    formik.setFieldValue("dateTo", event.target.value)
                  }
                />
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label="Search By Group Name"
                  value={formik.values.groupName}
                  onChangeText={(text: string) =>
                    handleConversionChange("groupName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label="Search By File Name"
                  value={formik.values.fileNames}
                  onChangeText={(text: string) =>
                    handleConversionChange("fileNames", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Divider />

              <Grid xs={12} item>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#059669",
                      margin: "1%",
                    }}
                    onClick={handleSubmitWrapper}
                  >
                    {t("text.search")}
                  </Button>
                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => {
                      formik.resetForm();
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Card>
      <>
        {digitalDatamain?.map((item: any, index: any) => (
          <Card
            key={index}
            style={{
              width: "100%",
              border: ".5px solid #2B4593",
              marginTop: "1vh",
              marginBottom: "1vh",
              backgroundColor: "#f3f3f3",
            }}
          >
            <>
              <CardContent>
                <Grid container spacing={3}>
                  {item.title && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Title/Collection:
                      </Typography>
                      {item.title}
                    </Grid>
                  )}
                  {item.descr && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Description:
                      </Typography>{" "}
                      {item.descr}
                    </Grid>
                  )}
                  {item.urlIfAny && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        URL If Any
                      </Typography>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Applicable Accnos (if any):
                      </Typography>
                      {item.urlIfAny}
                    </Grid>
                  )}
                  {item.appliedAccnos && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Applicable Accnos (if any):
                      </Typography>{" "}
                      {item.appliedAccnos}
                    </Grid>
                  )}
                  {item.appliedMembCodes && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Applicable User/Member (if any):
                      </Typography>
                      {item.appliedMembCodes}
                    </Grid>
                  )}
                  {item.dateSaved && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Date Saved:
                      </Typography>
                      {new Date(item.dateSaved).toLocaleDateString()}
                    </Grid>
                  )}
                  {/* {item.forAllUsers !== undefined && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        For All Users:
                      </Typography>
                      {item.forAllUsers ? "Yes" : "No"}
                    </Grid>
                  )} */}
                  {/* {item.forMember && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        For Member:
                      </Typography>{" "}
                      {item.forMember}
                    </Grid>
                  )} */}
                  {item.libraryName && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        Library Name:
                      </Typography>
                      {item.libraryName}
                    </Grid>
                  )}
                  {item.districtName && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        District Name:
                      </Typography>
                      {item.districtName}
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} md={4} lg={4} textAlign="end">
                  <Button
                    type="submit"
                    onClick={() => handleExpandClick(index, item.id!, item)}
                    sx={{
                      cursor: "pointer",
                      fontSize: 12,
                      backgroundColor:`var(--header-background)`,
                      color: "#fff",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "success",
                        color: "#000",
                      },
                    }}
                  >
                    Show more
                  </Button>
                </Grid>
              </CardContent>

              <SwipeableDrawer
                anchor="right"
                open={profileDrawerOpen}
                onClose={() => {}}
                onOpen={() => setProfileDrawerOpen(true)}
                style={{
                  zIndex: 1300,
                }}
              >
                <Box sx={{ width: "50vw" }} role="presentation">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setProfileDrawerOpen(false);
                      setExpandedIndex(null);
                    }}
                    aria-label="close"
                    sx={{
                      color: "white",
                      position: "absolute",
                      right: 15,
                      top: 2,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <p
                    style={{
                      backgroundColor: "#00009c",
                      color: "whitesmoke",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                      fontSize: "20px",
                      padding: "3vh",
                    }}
                  >
                    # {selectedFileID} -- PDF Previews Details
                  </p>
                  {isLoading ? (
                    <div
                      style={{ 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : digitalDatazones.length > 0 ? (
                    <DataGrids
                      isLoading={false}
                      rows={digitalDatazones}
                      columns={digitalDatacolumns}
                      pageSizeOptions={[5, 10, 25, 50, 100]}
                      initialPageSize={5}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      align="center"
                      color="textSecondary"
                    >
                      No data available
                    </Typography>
                  )}
                </Box>
              </SwipeableDrawer>

              {/* </Collapse>  */}
            </>
          </Card>
        ))}
      </>
      <>
        <Dialog
          open={dialogOpen}
          fullScreen
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          TransitionComponent={Transition}
        >
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            sx={{
              backgroundColor: "#00009c",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
              marginBottom: "2px",
            }}
          >
            <Typography fontWeight="600" fontSize={17}>
              <i>{selectedFileName}</i>
            </Typography>

            <IconButton
              edge="end"
              onClick={dialogClose}
              aria-label="close"
              sx={{
                color: "#fff",
                position: "absolute",
                right: 20,
                top: 10,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f4f4f5", }}>
            {/* <DialogContentText> */}
              {/* <Grid
                container
                spacing={2}
                sx={{
                  marginTop: 2,
                  color: "#000",
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
              > */}
                  {/* <iframe width="860" height="484" src={imagePreview}/> */}
                  <Flipbook filePath={imagePreview} />
              {/* </Grid> */}
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}