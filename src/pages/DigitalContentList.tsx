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
  Autocomplete,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getinstId } from "../utils/Constant";
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
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faL } from "@fortawesome/free-solid-svg-icons";
import { ReactReader } from "react-reader";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { stringify } from "querystring";
import { json } from "stream/consumers";
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const getFileTypeIcon = (fileName: string) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "pdf":
      return "📄";
    case "mp3":
      return "🎵";
    case "jpg":
    case "jpeg":
    case "png":
      return "🖼️";
    case "mp4":
      return "🎥";
    case "epub":
      return "📚";
    default:
      return "📄";
  }
};

export default function DigitalContentList() {
  const { t } = useTranslation();
  const Userid = getId();
  const [digitalDatamain, setDigitalDataMain] = useState<any>([]);
  const [lang, setLang] = useState<Language>("en");
  const [digitalDatazones, setDigitalDataZones] = React.useState([]);
  const [wishDatazones, setWishDataZones] = React.useState([]);
  const [digitalDatacolumns, setDigitalDataColumns] = React.useState<any>([]);
  const [wishDatacolumns, setWishDataColumns] = React.useState<any>([]);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [selectedFileID, setSelectedFileID] = React.useState("");
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [dialogOpen, setDialoOpen] = React.useState<any>("");
  const [imagePreview, setImagePreview] = React.useState<any>("");
  const [imageName, setImageName] = React.useState("");
  const [epubPreview, setEpubPreview] = React.useState<any>(null);

  const [pdfPreview, setPdfPreview] = React.useState<any>(null);
  const [audioPreview, setAudioPreview] = React.useState<any>(null);
  const [videoPreview, setVideoPreview] = React.useState<any>(null);
  const [location, setLocation] = React.useState<any | number>(0);
  const [selectedRows, setSelectedRows] = React.useState<any>(new Set());
  const [WishOpen, setWishOpen] = React.useState(false);
  const [heartData, setHeartData] = React.useState<any>([]);
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

  const [IsTitle, setTitle] = useState<any>([
    { value: "-1", label: t("text.Title") },
  ]);

  const getTitle = (title: any) => {
    const collectData = {
      title: title,
      description: "",
      fileNames: "",
      accnos: [""],
      memberCodes: [""],
      groupName: "",
    };
    api
      .post(`api/DigitalOperate/GetDigitalContent`, collectData)
      .then((res) => {
        //console.log("checkMemb", res.data.data);
        console.log("checkIssueItem", res?.data);
        const arr: any = [];

        for (let index = 0; index < res?.data?.data?.length; index++) {
          arr.push({
            value: res?.data?.data[index]["id"],
            label: res?.data?.data[index]["title"],
          });
        }
        setTitle(arr);
      });
  };
  //console.log("🚀 ~ ImageViewer ~ digitalDatazones:", digitalDatazones);
  //console.log("🚀 ~ ImageViewer ~ digitalDatacolumns:", digitalDatacolumns);

  useEffect(() => {
    GetWishListFile();
  }, []);

  const dialogClose = () => {
    setDialoOpen(false);
    setImageName("");
    setImagePreview("");
    setPdfPreview("");
    setAudioPreview("");
    setVideoPreview("");
    setEpubPreview("");
  };

  const handleConversionChange = (params: any, text: string) => {
    // let data = text.trim();

    formik.setFieldValue(params, text);
  };

  // const handleHeartClick = (fileName: any, index: any) => {
  //   console.log("Clicked fileName:", fileName);
  //   console.log("Clicked index:", index);
  //   console.log("Clicked digitalDatazones:", digitalDatazones);

  //   if (!digitalDatazones || digitalDatazones.length === 0) {
  //     console.error("Heart data is not available");
  //     return;
  //   }

  //   // Clone the heartData array to ensure immutability
  //   const updatedHeartData: any = [...digitalDatazones];

  //   if (updatedHeartData[index]["heartselect"]) {
  //     updatedHeartData[index]["heartselect"] = false;
  //   } else {
  //     updatedHeartData[index]["heartselect"] = true;
  //   }

  //   setDigitalDataZones(updatedHeartData);
  // };

  const handleHeartClick = (index: any) => {
    setDigitalDataZones((prevDigitalDataZones: any) => {
      // Ensure index is within bounds
      if (index < 0 || index >= prevDigitalDataZones.length) {
        console.error("Index out of bounds");
        return prevDigitalDataZones;
      }

      const updatedDigitalDataZones = [...prevDigitalDataZones];
      const item = updatedDigitalDataZones[index];
      item.heartselect = !item.heartselect;

      // localStorage.setItem(`heartselect-${item.digitalContentId}`, item.heartselect.toString());

      if (item.heartselect === true) {
        saveWish(item);
      } else {
        CancelWish(item);
      }

      return updatedDigitalDataZones;
    });
  };

  var userId = getId();

  var instId: any = getinstId();

  const saveWish = (row: any) => {
    const collectData = {
      // wishId:0,
      // memberId:"",
      // instId:0,
      //  dateSaved:"",
      digitalFileId: row.id,
      //  comment:""
    };
    api
      .post(`api/DigitalOperate/SaveDigitalWishList`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
        }
      })
      .catch((error) => {
        console.error("Error saving wish:", error);
        toast.error("Failed to save wish.");
      });
  };

  const CancelWish = (row: any) => {
    const collectData = {
      //wishId:0,
      //memberId: "",
      //  instId: 0,
      // dateSaved:"",
      digitalFileId: row.id,
      //  comment:""
    };
    api
      .post(`api/DigitalOperate/SaveDigitalWishList`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg);
        }
      })
      .catch((error) => {
        console.error("Error canceling wish:", error);
        toast.error("Failed to cancel wish.");
      });
  };

  const GetDigitalFile = async (id: any) => {
    try {
      const response = await api.get(`api/DigitalOperate/GetDigitalFiles`, {
        params: { digicontentid: id },
      });
      const data = response.data.data;

      //const storedSelection = localStorage.getItem(`heartselect-${response.data.data.digitalContentId}`);

      const wishFileNames = new Set(wishDatazones.map((file: any) => file.id));

      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
        heartselect: wishFileNames.has(zone.id),
      }));
      setDigitalDataZones(zonesWithIds);
      // setHeartData(zonesWithIds);

      console.log("TCL: GetDigitalFile -> WithIds", zonesWithIds);

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
              const isSelected = params.row.heartselect;
              console.log("🚀 ~ GetDigitalFile ~ isSelected:", isSelected);
              // console.log(
              //   "🚀 ~ GetDigitalFile ~ digitalContentId:",
              //   digitalContentId
              // );

              // if (isSelected === true) {
              //   saveWish(params.row);
              // } else {
              //   CancelWish(params.row);
              // }

              const handleClick = (e: any) => {
                e.preventDefault();
                setSelectedFileName(fileName);
                getImagePreviewDetails(digitalContentId);
              };

              return [
                <div>
                  <IconButton
                    onClick={() => handleHeartClick(params.row.serialNo - 1)}
                    style={{ color: isSelected ? "green" : "red" }}
                  >
                    {isSelected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <span style={{ marginRight: "8px" }}>
                    {getFileTypeIcon(fileName)}
                  </span>
                  <span onClick={handleClick}>{fileName}</span>
                </div>,
              ];
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

  const getImagePreviewDetails = (filename: any) => {
    const fileType = filename.toLowerCase();
    const response = `https://adhyalibdoc.mssplonline.com:8130/${filename}`;

    if (fileType.endsWith(".pdf")) {
      setPdfPreview(response);
      setImagePreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (
      fileType.endsWith(".jpg") ||
      fileType.endsWith(".png") ||
      fileType.endsWith(".jpeg")
    ) {
      setImagePreview(response);
      setPdfPreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".mp3")) {
      setAudioPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".mp4")) {
      setVideoPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setAudioPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".epub")) {
      setEpubPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
    } else {
      toast.error("File type not supported for preview");
      return;
    }

    setDialoOpen(true);
  };

  const GetWishListFile = async () => {
    try {
      const response = await api.get("api/Admin2/GetDigitalWishListContents");
      const data = response.data.data;

      const zonesWithIds = data.map((zone: any, index: number) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
      }));
      setWishDataZones(zonesWithIds);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 0.5,
            headerClassName: "grid-header", // Custom header class
            cellClassName: "grid-cell", // Custom cell class
          },
          {
            field: "givenFileName",
            headerName: "Related File Name",
            flex: 1,
            headerClassName: "grid-header",
            renderCell: (params: any) => {
              const fileName = params.row.givenFileName;
              const digitalContentId = params.row;

              const handleClick = (e: any) => {
                e.preventDefault();
                setSelectedFileName(fileName);
                getWishPreviewDetails(digitalContentId);
              };

              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginRight: "8px" }}>
                    {getFileTypeIcon(fileName)}
                  </span>
                  <span
                    onClick={handleClick}
                    style={{ color: "#007bff", textDecoration: "underline" }}
                  >
                    {fileName}
                  </span>
                </div>
              );
            },
          },
          {
            field: "comment",
            headerName: "Comment",
            flex: 1,
            headerClassName: "grid-header",
          },
          {
            field: "dateSaved",
            headerName: "Save Date",
            flex: 0.7,
            headerClassName: "grid-header",
            renderCell: (params: {
              row: { dateSaved: moment.MomentInput };
            }) => {
              return moment(params.row.dateSaved).format("DD-MM-YYYY");
            },
          },
        ];

        setWishDataColumns(columns as any);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getWishPreviewDetails = async (row: any) => {
    const fileType = row.savedFile.toLowerCase();
    const response = `https://adhyalibdoc.mssplonline.com:8130/${row.savedFile}`;
    // let data = response.data.data;

    // let result = data.find((item:any)=> item.id === row.id)
    // console.log("check result", result?.savedFile)
    // var wishData = response.filter(row.id == response.data.data.id);
    // console.log("checkWish",wishData)

    // console.log('checkFileType',fileType);

    if (fileType.endsWith(".pdf")) {
      setPdfPreview(response);
      setImagePreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (
      fileType.endsWith(".jpg") ||
      fileType.endsWith(".png") ||
      fileType.endsWith(".jpeg")
    ) {
      setImagePreview(response);
      setPdfPreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".mp3")) {
      setAudioPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setVideoPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".mp4")) {
      setVideoPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setAudioPreview(null);
      setEpubPreview(null);
    } else if (fileType.endsWith(".epub")) {
      setEpubPreview(response);
      setImagePreview(null);
      setPdfPreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
    } else {
      toast.error("File type not supported for preview");
      return;
    }

    setDialoOpen(true);
  };

  const currentDate = new Date().toISOString();

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
      //console.log("checkSerchdata",response.data.data)
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

  const HandleWishList = () => {
    setWishOpen(true);
    GetWishListFile();
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
            <Grid item lg={6} md={6} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.DigitalContentList")}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3} lg={3} marginTop={2} textAlign="end">
              <Button
                onClick={() => HandleWishList()}
                sx={{
                  cursor: "pointer",
                  fontSize: 12,
                  backgroundColor: `var(--header-background)`,
                  color: "#fff",
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "success",
                    color: "#38ab5d",
                  },
                }}
              >
                <FavoriteIcon /> Wish list
              </Button>
            </Grid>

            <Grid item lg={3} md={3} xs={12} marginTop={2}>
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
              {/* <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.Title")}
                  value={formik.values.title}
                  onChangeText={(text: string) =>
                    handleConversionChange("title", text)
                  }
                  required={true}
                  lang={lang}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={IsTitle}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    // Check if newValue is valid
                    if (newValue && newValue.label) {
                      console.log(newValue?.value);
                      formik.setFieldValue("title", newValue.label);
                    } else {
                      // Handle case where newValue is null or invalid
                      formik.setFieldValue("title", "");
                    }
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() !== "" || value !== null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getTitle(value);
                        }, 500);
                        setTimerCheck(checkResult);
                      }
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.Title")} required={false} />
                      }
                    />
                  )}
                  popupIcon={null}
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
              // marginBottom: "1vh",
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
                    # {selectedFileID} -- Digital Content List
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
                      pagination={false} // Pagination disabled
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

        {/* swipbleDrawer for wish List */}

        <SwipeableDrawer
          anchor="right"
          open={WishOpen}
          onClose={() => {}}
          onOpen={() => HandleWishList()}
          style={{
            zIndex: 1300,
          }}
        >
          <Box sx={{ width: "50vw" }} role="presentation">
            <IconButton
              edge="end"
              onClick={() => {
                setWishOpen(false);
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
              Fevorite List Content
            </p>

            <DataGrids
              isLoading={false}
              rows={wishDatazones}
              columns={wishDatacolumns}
              pagination={false}
            />
          </Box>
        </SwipeableDrawer>
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
          <DialogContent sx={{ backgroundColor: "#f4f4f5" }}>
            <Grid
              container
              spacing={0}
              sx={{
                height: "100%",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item xs={12} sx={{ height: "100%" }}>
                {videoPreview && (
                  <video
                    controls
                    style={{
                      width: "100%",
                      height: "80vh",
                      objectFit: "cover",
                    }}
                  >
                    <source src={videoPreview} type="video/mp4" />
                  </video>
                )}
                {audioPreview && (
                  <audio
                    controls
                    style={{
                      width: "100%",
                      height: "80vh",
                      objectFit: "cover",
                    }}
                  >
                    <source src={audioPreview} type="audio/mp3" />
                  </audio>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: "80vh" }}
                  />
                )}
                {pdfPreview && <Flipbook filePath={pdfPreview} />}
                {epubPreview && (
                  <div style={{ height: "100vh" }}>
                    <ReactReader
                      url={epubPreview}
                      location={location}
                      locationChanged={(epubcfi: string) =>
                        setLocation(epubcfi)
                      }
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
