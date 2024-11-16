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
import ePub from 'epubjs';
import { arrayBuffer } from "stream/consumers";
import { ReactReader } from 'react-reader'
import ButtonWithLoader from "../utils/ButtonWithLoader";

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

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function EPubViewer() {
  const { t } = useTranslation();
  const Userid = getId();
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
  const [fullWidth, setFullWidth] = React.useState(true);
  const [imagePreview, setImagePreview] = React.useState("");
  const [imageName, setImageName] = React.useState("");
  const [epubUrl, setEpubUrl] = useState<string | null>(null);
  const [book, setBook] = useState<any | null>(null);
  const [rend, setRend] = useState<ePub.Rendition | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [epubdata, setEpubdata] = useState<any>(null);
  const [location, setLocation] = useState<string | number>(0)


  const dialogClose = () => {
    setDialoOpen(false);
    setImageName("");
    setImagePreview("");
    if (rendition) {
      rendition.destroy();
    }
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

              return (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedFileName(fileName);
                    fetchEpubUrl(digitalContentId);
                  }}
                >
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

  // const fetchEpubUrl = async (epub:any) => {
  //   if (epub && epub.toLowerCase().endsWith('.epub')) {
  //     try {
  //       // Fetch the EPUB file with Axios and specify responseType as 'blob'
  //       const response = await api.post('api/DigitalOperate/GetFiles', [epub], { responseType: 'blob' });

  //       // Convert the response data to a Blob and create an Object URL
  //       const blob = response.data.files[0] as Blob;
  //       console.log("🚀 ~ fetchEpubUrl ~ blob:", blob)
  //       const objectURL = URL.createObjectURL(blob);

  //       // Create and set up the EPUB book
  //       const newBook = ePub(objectURL);
  //       console.log("🚀 ~ fetchEpubUrl ~ newBook:", newBook)
  //       setBook(newBook);

  //       // Render the EPUB book
  //       const rendition = newBook.renderTo(containerRef.current!);
  //       console.log("🚀 ~ fetchEpubUrl ~ rendition:", rendition)
  //       setRend(rendition);
  //       setDialoOpen(true);
  //       // Cleanup function to revoke object URL and destroy renderer
  //       return () => {
  //         URL.revokeObjectURL(objectURL);
  //         if (rendition) {
  //           rendition.destroy();
  //         }
  //       };
  //     } catch (error) {
  //       console.error('Error fetching EPUB file:', error);
  //     }
  //   }
  // };


  // const fetchEpubUrl = async (epub: string) => {
  //   if (epub && epub.toLowerCase().endsWith('.epub')) {
  //     try {
  //       const response = await api.post('api/DigitalOperate/GetFiles', [epub], { responseType: 'blob' });
  //       console.log("🚀 ~ fetchEpubUrl ~ response:", response)
  //       const blob = response.data.files as Blob;
  //       console.log("🚀 ~ fetchEpubUrl ~ blob:", blob)
  //       const objectURL = URL.createObjectURL(blob);
  //       console.log("🚀 ~ fetchEpubUrl ~ objectURL:", objectURL)

  //       const newBook = ePub(objectURL);
  //       console.log("🚀 ~ fetchEpubUrl ~ newBook:", newBook)
  //       setBook(newBook);

  //       const newRendition = newBook.renderTo(containerRef.current!);
  //       console.log("🚀 ~ fetchEpubUrl ~ newRendition:", newRendition)
  //       setRendition(newRendition);
  //       setDialoOpen(true);

  //       // Cleanup function
  //       return () => {
  //         URL.revokeObjectURL(objectURL);
  //         if (newRendition) {
  //           newRendition.destroy();
  //         }
  //       };
  //     } catch (error) {
  //       console.error('Error fetching EPUB file:', error);
  //     }
  //   }
  // };

  const fetchEpubUrl = async (epub: string) => {
    if (epub && epub.toLowerCase().endsWith('.epub')) {
      try {
        // Fetch the EPUB file with Axios expecting JSON response
        const response = await api.post('api/DigitalOperate/GetFiles', [epub]);

        // Log full response data
        console.log('Full Response Data:', response.data.data);

        // Check the response structure
        if (response.data.data && response.data.data.files && Array.isArray(response.data.data.files) && response.data.data.files.length > 0) {
          // The Base64-encoded data should be the first item

          const base64Data = response.data.data.files[0];
          //https://react-reader.metabits.no/files/alice.epub
          // setEpubdata("https://weblibraryfilepath.mssplonline.com:8130/"+response.data.data.fileNames[0])
          setEpubdata("https://react-reader.metabits.no/files/alice.epub")
          console.log('epubdata Data:', epubdata);
          console.log('Base64 Data:', base64Data);
          const blob = new Blob([base64Data], { type: 'application/epub' });
          const objectURL = URL.createObjectURL(blob);

          // Create and set up the EPUB book
          const newBook = ePub(objectURL);
          setBook(newBook);
          // setBook(newBook);

          // Render the EPUB book
          const rendition = newBook.renderTo(containerRef.current!);
          console.log('Rendition:', rendition);
          setRendition(rendition);
          setDialoOpen(true);

          // Cleanup function to revoke object URL and destroy renderer
          return () => {
            URL.revokeObjectURL(objectURL);
            if (rendition) {
              rendition.destroy();
              console.log('Rendition destroyed');
            }
          };
        } else {
          console.error('Invalid response format or empty files array:', response.data.files);
        }
      } catch (error) {
        console.error('Error fetching EPUB file:', error);
      }
    } else {
      console.error('Invalid EPUB file name or extension');
    }
  };
  const { defaultValuestime } = getISTDate();

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
      //console.log("before submitting value check", values);
      const response = await api.post(
        `api/DigitalOperate/GetDigitalContent`,
        values
      );
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
                {t("text.eEPubViewer")}
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

              {/* <Grid xs={12} item>
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
              </Grid> */}
              <Grid item lg={6} sm={6} xs={12}>
                <Grid>
                  {/* <Button
                    type="submit"
                    fullWidth
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {t("text.save")}
                  </Button> */}
                  <ButtonWithLoader
                    buttonText={t("text.search")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
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
        </Paper>
      </Card>
      <>
        {digitalDatamain?.map((item: any, index: any) => (
          <Card
            key={index}
            style={{
              width: "100%",
              border: ".5px solid #BA160C",
              marginTop: "1vh",
              //marginBottom: "1vh",
              backgroundColor: "#FFF8E7",
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
                  {item.forAllUsers !== undefined && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        For All Users:
                      </Typography>
                      {item.forAllUsers ? "Yes" : "No"}
                    </Grid>
                  )}
                  {item.forMember && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Typography
                        fontSize={{ xs: 14, sm: 17 }}
                        fontWeight={600}
                      >
                        For Member:
                      </Typography>{" "}
                      {item.forMember}
                    </Grid>
                  )}
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
                      backgroundColor: `var(--header-background)`,
                      color: "#fff",
                      borderRadius: "5px",
                      "&:hover": {
                        backgroundColor: "#BA160C",
                        color: "white",
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
                onClose={() => { }}
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
                    # {selectedFileID} -- EPUB Previews Details
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
          fullWidth={fullWidth}
          maxWidth="md"
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
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
          <DialogContent sx={{ backgroundColor: "#f4f4f5", height: "30%" }}>
            <DialogContentText>
              {/* <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "auto" }}>
      </div> */}
              <div style={{ height: '100vh' }}>
                <ReactReader
                  url={epubdata}
                  location={location}
                  locationChanged={(epubcfi: string) => setLocation(epubcfi)}
                />
              </div>


            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}