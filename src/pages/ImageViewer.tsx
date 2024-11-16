import React, { useCallback, useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import dayjs from "dayjs";

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

export default function ImageViewer() {
  const { t } = useTranslation();
  const Userid = getId();
  const { defaultValuestime, defaultValues } = getISTDate();
  console.log("🚀 ~ ImageViewer ~ defaultValues:", defaultValues);
  const [digitalDatamain, setDigitalDataMain] = useState<any>(null);
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

  console.log("🚀 ~ ImageViewer ~ digitalDatazones:", digitalDatazones);
  console.log("🚀 ~ ImageViewer ~ digitalDatacolumns:", digitalDatacolumns);

 

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
            headerName: "Related File Name",
            flex: 1,
            renderCell: (params: any) => {
              const fileName = params.row.givenFileName;
              const digitalContentId = params.row.digitalContentId;

              const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
              const fileExtension = fileName
                .slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)
                .toLowerCase();
              const isImageFile = imageExtensions.includes(`.${fileExtension}`);

              const cellStyle = {
                cursor: isImageFile ? "pointer" : "default",
                backgroundColor: isImageFile ? "#f0f8ff" : "#f5f5f5",
                opacity: isImageFile ? 1 : 0.5,
                padding: "4px",
                borderRadius: "4px",
              };

              const iconStyle = {
                width: "25px",
                hight: "25px",
                marginRight: "5%",
                color: "blue",
              };

              const handleClick = (e: React.MouseEvent) => {
                e.preventDefault();
                if (isImageFile) {
                  setSelectedFileName(fileName);
                  getImagePreviewDetails(digitalContentId);
                } else {
                  toast.info("This file is not an image.");
                }
              };

              return (
                <span onClick={handleClick} style={cellStyle}>
                  {isImageFile && (
                    <FontAwesomeIcon icon={faImage} style={iconStyle} />
                  )}
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

  const getImagePreviewDetails = async (id: any) => {
    const response = await api.get(`api/DigitalOperate/GetImageFilesDContId`, {
      params: { digicontentid: id },
    });
    const data = response.data.data;
    console.log("🚀 ~ getImagePreviewDetails ~ data:", data);
    if (data.length > 0) {
      setImageName(data[0]["userFileNames"]);
      setImagePreview(`data:image/jpg;base64, ${data[0]["files"]}`);
      setDialoOpen(true);
    } else {
      toast.error("NO Data Available");
    }
  };

  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);

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
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        const data = response.data.data;
        // setDigitalDataMain(response.data.data);

        if (data != null) {
          if (timerCheck) {
            clearTimeout(timerCheck);
          }

          const checkResult = setTimeout(() => {
            setDigitalDataMain(data);
          }, 100);
          setTimerCheck(checkResult);
        }
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(...args), delay);
  };
};
  // Optimized API call function
  const fetchDigitalFile = async (id: number) => {
    setIsLoading(true);
    try {
      await GetDigitalFile(id); // Assuming GetDigitalFile is an async function
    } catch (error) {
      console.error('Failed to fetch digital file:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounce the fetchDigitalFile function
  const debouncedFetchDigitalFile = useCallback(debounce(fetchDigitalFile, 300), []);
  
  const handleExpandClick = (index: number, id: number, item: any) => {
    if (index != null && id != null && item != null) {
      // Toggle expanded index
      setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
      
      // Fetch the digital file with debounce to avoid rapid calls
      debouncedFetchDigitalFile(id);
      
      // Open profile drawer and set selected file details
      setProfileDrawerOpen(true);
      setSelectedFileID(item.id);
      setSelectedFileName(item.title);
      
      // Optional: Log item for debugging
      console.log(item);
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
                {t("text.ImageView")}
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
                  lang={"en"}
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
        {/* {digitalDatamain && digitalDatamain.length > 0 ?(<> */}
        {digitalDatamain?.map((item: any, index: any) => (
          <Card
            key={index}
            style={{
              // display:"flex",
              // flexDirection:"row",
              // justifyContent:"space-evenly",
              // alignItems: "flex-start",
              width: "100%",
              border: ".5px solid #BA160C",
              marginTop: "1vh",
              marginBottom: "1vh",
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
                    # {selectedFileID} -- Image Previews Details
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
        {/* </>)
        :(<>No Record/Data found</>)} */}
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
              <i>{imageName}</i>
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
            <img
              src={imagePreview}
              alt={imageName}
              style={{ width: "100%", height: "75vh" }}
            />
          </DialogContent>
        </Dialog>
      </>
    </>
  );
}
