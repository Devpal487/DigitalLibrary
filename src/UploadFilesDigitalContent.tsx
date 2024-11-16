import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Modal,
  IconButton,
  Table,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import nopdf from "../src/assets/images/imagepreview.jpg";
import CustomLabel from "./utils/CustomLabel";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonWithLoader from "./utils/ButtonWithLoader";
import api from "./utils/Url";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  height: "80vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

interface Props {
  modalOpen: boolean;
  fileId: any;
}

const UploadFilesDigitalContent: React.FC<Props> = ({ modalOpen, fileId }) => {
  //console.log("🚀 ~ fileId:", fileId);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pdf, setPDF] = useState<any>();
  const [pdfView, setPdfView] = useState<string>("");
  const [filetypetable, setFiletypetable] = useState<string>("");
  const [fileexten, setFileexten] = useState<string>("");
  const [fileName, setfileName] = useState<any>("");
  const [Shows, setShows] = useState<boolean>(false);
  const [Img, setImg] = useState<string>("");
  const [filetyperesult, setFiletyperesult] = useState<string>("");
  const [fileExtensionTable, setFileExtensionTable] = useState<string>("");
  const [binaryFile, setBinaryFile] = useState<any>();
  const [tableData, setTableData] = useState<any>([]);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [fieldValue, setFieldValue] = useState<any>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [proOpen, setProOpen] = useState(false);

  //console.log("🚀 ~ fieldValue:", fieldValue);
  const [thumbnailData, setThumbnailData] = useState("");
  //console.log("🚀 ~ thumbnailData:", thumbnailData);

  const handleClose = () => {
    navigate("/AddDigitalContent");
  };

  useEffect(() => {
    setTimeout(() => {
      if (uploadProgress === 100) {
        setProOpen(false);
      }
    }, 500);
  }, [uploadProgress, setProOpen]);

  const removeDynamicId = (id: any) => {
    return id.replace(/ /g, "");
  };

  var key = removeDynamicId("uniqueId");
  var uniqueId = sessionStorage.getItem(key);

  if (uniqueId) {
    uniqueId = uniqueId.replace(/"/g, "");
  }

  const onTransctionChange = async (event: any, funcType: any) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const result = getFileType(file.name);
      const exten = file.name
        .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
        .toLowerCase();
      const fileURL = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        if (funcType === "pdfFile") {
          setBinaryFile(reader.result);
          setFileexten(exten);
          setFiletypetable(result);
          setPdfView(fileURL);
          setfileName(file.name);
          setPDF(file);
        } else if (funcType === "thumbnail") {
          setFieldValue(reader.result);
          setThumbnailData(fileURL);
          setfileName(file.name);
          setPDF(file);
          setFileexten(exten);
          //console.log("🚀 ~ reader.onloadend= ~ fileURL:", fileURL);
          //console.log("🚀 ~ reader.onloadend= ~ result:", result);
          //console.log("🚀 ~ reader.onloadend= ~ file:", file);
        }
      };
    }
  };

  const uploadFile = async () => {
    const startTime = Date.now();
    let lastLoaded = 0;

    try {
      const blob = new Blob([binaryFile], { type: pdf.type });
      const formData = new FormData();
      formData.append("file", blob, fileName);

      const response = await axios.post(
        "http://103.12.1.132:8156/api/MssplUploads/UploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            digitalContentId: fileId,
            Accept: "*/*",
            Uniqueid: uniqueId,
          },
          onUploadProgress: (progressEvent) => {
            const total: any = progressEvent.total;
            const current = progressEvent.loaded;
            const percentage = Math.floor((current / total) * 100);

            // Calculate upload speed
            const now = Date.now();
            const bytesUploaded = current - lastLoaded;
            const timeElapsed = (now - startTime) / 1000; // in seconds
            const uploadSpeed = bytesUploaded / timeElapsed; // bytes/second

            // Estimate time remaining
            const remainingBytes = total - current;
            const remainingTime = remainingBytes / uploadSpeed; // seconds

            lastLoaded = current;

            setUploadProgress(percentage);
            setEstimatedTime(remainingTime);
          },
        }
      );

      if (response.data.isSuccess) {
        toast.success(response.data.succMesg);
        addMoreRow();
      } else {
        toast.error(response.data.succMesg);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const formatEstimatedTime = (timeInSeconds: any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const uploadThubnail = async () => {
    //console.log("checkthumbnail");
    try {
      const blob = new Blob([fieldValue], { type: pdf.type });
      const formData = new FormData();
      formData.append("file", blob, fileName);
      //console.log("🚀 ~ uploadFile ~ blob:", blob);
      //console.log("🚀 ~ uploadFile ~ formData:", formData);
      //console.log("🚀 ~ uploadFile ~ binaryFile:", binaryFile);
      //console.log("🚀 ~ uploadFile ~ fileName:", fileName);

      const response = await axios.post(
        "http://103.12.1.132:8156/api/MssplUploads/UploadThumbnail",
        formData,
        {
          headers: {
            //"Content-Type": "multipart/form-data",
            Id: fileId,
            Accept: "*/*",
            Uniqueid: uniqueId,
          },
        }
      );

      if (response.data.isSuccess) {
        toast.success(response.data.succMesg);
        //addMoreRow();
      } else {
        toast.error(response.data.succMesg);
      }
    } catch (error) {
      //console.error("Error uploading file:", error);
    }
    //console.log("object");
  };

  const getFileType = (filename: string) => {
    const extension = filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
    switch (true) {
      case ["png", "jpg", "jpeg", "gif", "webp"].includes(extension):
        return "image";
      case ["pdf"].includes(extension):
        return "pdf";
      case ["mp4", "avi", "mov"].includes(extension):
        return "video";
      case ["mp3", "wav"].includes(extension):
        return "audio";
      case ["epub"].includes(extension):
        return "epub";
      default:
        return "unknown";
    }
  };

  const getDisplayUI = (
    filetyperesult: string,
    filepath: string,
    extension: string
  ) => {
    switch (filetyperesult) {
      case "image":
        return (
          <img
            src={filepath}
            alt="Preview"
            style={{ width: "100%", height: "100%" }}
          />
        );
      case "video":
        return (
          <video controls style={{ width: "100%", height: "auto" }}>
            <source src={filepath} type={`video/${extension}`} />
          </video>
        );
      case "audio":
        return (
          <audio controls style={{ width: "100%" }}>
            <source src={filepath} type={`audio/${extension}`} />
          </audio>
        );
      case "pdf":
        return (
          <embed
            src={filepath}
            type="application/pdf"
            style={{ width: "100%", height: "100%" }}
          />
        );
      case "epub":
        return (
          <embed src={filepath} style={{ width: "100%", height: "100%" }} />
        );
      default:
        return <Typography color="error">Error displaying file</Typography>;
    }
  };

  const addMoreRow = () => {
    const newRows = {
      id: tableData.length + 1,
      pdFid: -1,
      pdfName: fileName,
      docMid: -1,
      subFtype: "",
      isMain: "",
      user_id: -1,
      pdfPath: pdf,
      pdfView: pdfView,
      srn: -1,
      isDelete: false,
      filetype: filetypetable,
      extension: fileexten,
    };

    setTableData((prevTableData: any) => {
      const updatedTableDataed = [...prevTableData, newRows];
      return updatedTableDataed;
    });
    // console.log(newRows);
    // setfileName("");
    // setPDF("");
    // setFiletypetable("");
  };

  const modalOpenHandle1 = () => {
    setShows(true);
    setImg(pdfView);
    setFiletyperesult(filetypetable);
    setFileExtensionTable(fileexten);
  };
  const modalOpenHandle = (event: any) => {
    console.log("🚀 ~ modalOpenHandle1 ~ event:", event);
    setShows(true);
    setImg(event.pdfView);
    setFiletyperesult(event.filetype);
    setFileExtensionTable(event.extension);
  };

  const handlePanClose1 = () => {
    setImg("");
    setFiletyperesult("");
    setFileExtensionTable("");
    setShows(false);
  };

  const handleSubmitWrapper = () => {
    setUploadProgress(0); // Reset progress before upload
    uploadFile();
    setProOpen(true);
  };

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandlethumb = (event: any) => {
    setPanOpen(true);
    if (event === "thumbnail") {
      setModalImg(fieldValue);
    }
  };

  const ConvertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const base64ToByteArray = (base64: string): Uint8Array => {
    // Remove the data URL scheme if it exists
    const base64String = base64.split(",")[1];

    // Decode the Base64 string
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    // Convert binary string to Uint8Array
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  };

  const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  };

  const otherDocChangeHandler = async (event: any, params: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
        toast.error(
          "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
        );
        event.target.value = null;
        return;
      }
      try {
        const base64Data = (await ConvertBase64(file)) as string;
        const byteArray = base64ToByteArray(base64Data);
        const base64String = uint8ArrayToBase64(byteArray);
        setFieldValue(base64String);
      } catch (error) {
        //console.error("Error converting image file to Base64:", error);
      }
    }
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={modalOpen}
        onClose={() => {}}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{t("text.UploadDigitalContent")}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form
          //onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.Attachedthumbnail")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => onTransctionChange(e, "thumbnail")}
                />
              </Grid>
              <Grid xs={12} md={1} sm={1} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {thumbnailData == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={thumbnailData}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}

                  <Typography
                    onClick={() => modalOpenHandlethumb("thumbnail")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>
              <Modal open={panOpens} onClose={handlePanClose}>
                <Box sx={style}>
                  {thumbnailData == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={thumbnailData}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
              <Grid item lg={2} sm={2} xs={12}>
                <Grid>
                  <Button
                    // type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      marginTop: "40px",
                    }}
                    onClick={uploadThubnail}
                  >
                    {t("text.save")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Divider sx={{ borderWidth: "1px", borderColor: "#524f4f" }} />
            <br />

            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={12} lg={5} sx={{ my: 5 }}>
                <TextField
                  id="savedFile"
                  name="savedFile"
                  label={
                    <CustomLabel
                      text={t("text.AttachedFile")}
                      required={false}
                    />
                  }
                  placeholder={t("text.AttachedFile")}
                  size="small"
                  type="file"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => onTransctionChange(e, "pdfFile")}
                />
              </Grid>
              <Grid item xs={12} lg={2}></Grid>

              <Grid lg={5}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "5px",
                    gap: 10,
                  }}
                >
                  <div style={{}}>
                    {pdfView ? (
                      getDisplayUI(filetypetable, pdfView, fileexten)
                    ) : (
                      <img
                        src={nopdf}
                        alt="No Preview"
                        style={{
                          border: "1px solid grey",
                          borderRadius: "10px",
                          width: "60%",
                          height: "60%",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <Typography
                      onClick={() => modalOpenHandle1()}
                      style={{
                        textDecoration: "underline",
                        color: "blue",
                        fontSize: "15px",
                        cursor: "pointer",
                      }}
                    >
                      {t("text.Preview")}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Modal open={Shows} onClose={handlePanClose1}>
                <Box sx={style}>
                  {Img ? (
                    getDisplayUI(filetyperesult, Img, fileExtensionTable)
                  ) : (
                    <img
                      src={nopdf}
                      alt="No Preview"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </Box>
              </Modal>
              <Grid xs={12} item>
                {(uploadProgress === 0 || uploadProgress === 100) && (
                  <Button
                    startIcon={<UploadIcon />}
                    variant="contained"
                    fullWidth
                    style={{
                      marginBottom: 15,
                      backgroundColor: "lightgreen",
                      color: "black",
                    }}
                    onClick={handleSubmitWrapper}
                  >
                    {t("text.upload")}
                  </Button>
                )}
              </Grid>
              <Grid xs={12} item>
                <Dialog
                  open={proOpen}
                  onClose={() => setProOpen(false)}
                  maxWidth="sm"
                  fullWidth
                  style={{
                    border: "2px solid lightblue",
                    borderRadius: "12px",
                    boxShadow: "0 6px 30px rgba(0, 0, 0, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid lightgray",
                      borderRadius: "10px",
                    }}
                  >
                    <DialogContent
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        backgroundColor: "#fefefe",
                        borderRadius: "10px",
                      }}
                    >
                      {uploadProgress > 0 && uploadProgress < 100 ? (
                        <>
                          <Typography
                            variant="h6"
                            style={{
                              marginBottom: 15,
                              fontWeight: "600",
                              color: "#333",
                            }}
                          >
                            Uploading...
                          </Typography>
                          <div
                            style={{
                              position: "relative",
                              display: "inline-flex",
                              marginBottom: 15,
                            }}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={uploadProgress}
                              style={{
                                color: "lightgray", // Background circle color
                              }}
                              thickness={4}
                            />
                            <CircularProgress
                              variant="determinate"
                              value={uploadProgress}
                              style={{
                                position: "absolute",
                                left: 0,
                                color: `hsl(${
                                  uploadProgress * 1.2
                                }, 100%, 50%)`, // Multicolor effect
                              }}
                              thickness={4}
                            />
                          </div>
                          <Typography
                            variant="body1"
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {uploadProgress}%
                          </Typography>
                          {estimatedTime > 0 && (
                            <Typography
                              variant="body2"
                              style={{
                                marginTop: 10,
                                color: "#666",
                                fontStyle: "italic",
                              }}
                            >
                              Time Remaining:{" "}
                              <span
                                style={{
                                  fontWeight: "bold",
                                  color: "#444",
                                }}
                              >
                                {formatEstimatedTime(Math.ceil(estimatedTime))}
                              </span>
                            </Typography>
                          )}
                        </>
                      ) : uploadProgress === 100 ? (
                        <Typography
                          variant="h6"
                          style={{ color: "green", fontWeight: "bold" }}
                        >
                          Upload Complete!
                        </Typography>
                      ) : null}
                    </DialogContent>
                  </div>
                </Dialog>
              </Grid>

              <Grid xs={12} sm={12} item sx={{ marginTop: "3px" }}>
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",
                  }}
                >
                  <thead
                    style={{ backgroundColor: "#2196f3", color: "#f5f5f5" }}
                  >
                    <tr>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingBlock: "10",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.Action")}
                      </th>

                      <th
                        style={{
                          borderLeft: "1px solid black",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.FileName")}
                      </th>
                      <th
                        style={{
                          borderLeft: "1px solid black",
                          width: "35%",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                        }}
                      >
                        {t("text.PdfFile")}
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "1px solid black" }}>
                    {tableData?.map((row: any, index: any) => (
                      <tr key={row.id} style={{ border: "1px solid black" }}>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {row.pdfName}
                        </td>
                        <td
                          style={{
                            borderLeft: "1px solid black",
                            borderTop: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              margin: "5px",
                            }}
                          >
                            <div>
                              {row.pdfView == "" ? (
                                ""
                              ) : (
                                <>
                                  {getDisplayUI(
                                    row.filetype,
                                    row.pdfView,
                                    row.extension
                                  )}
                                </>
                              )}
                            </div>
                            <div>
                              <Typography
                                onClick={() => modalOpenHandle(row)}
                                style={{
                                  textDecorationColor: "blue",
                                  textDecorationLine: "underline",
                                  color: "blue",
                                  fontSize: "15px",
                                  cursor: "pointer",
                                }}
                              >
                                {t("text.Preview")}
                              </Typography>
                            </div>
                          </div>
                          <Modal open={Shows} onClose={handlePanClose1}>
                            <Box sx={style}>
                              {Img == "" ? (
                                <img
                                  src={nopdf}
                                  style={{
                                    width: "170vh",
                                    height: "75vh",
                                  }}
                                />
                              ) : (
                                <>
                                  {getDisplayUI(
                                    filetyperesult,
                                    Img,
                                    fileExtensionTable
                                  )}
                                </>
                              )}
                            </Box>
                          </Modal>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadFilesDigitalContent;
