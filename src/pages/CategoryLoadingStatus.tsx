import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api, { File_Preview } from "../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  TextField,
  Modal,
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
import nopdf from "../assets/images/imagepreview.jpg";
import axios from "axios";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function CategoryLoadingStatus() {
  const Userid = getId();
  const location = useLocation();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [isEdit, setisEdit] = useState(false);
  const { t } = useTranslation();
  const [binaryFile, setBinaryFile] = useState<any>();
  const [fileName, setfileName] = useState<any>("");
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [fieldImage, setFieldImage] = useState("");
  const [pdf, setPdf] = useState<any>("");
  const [imagePreview, setImagePreview] = useState("");
  const [editCondition, setEditCondition] = useState(0);

  // console.log('imagePreview',imagePreview);

  const handlePanClose = () => {
    setPanOpen(false);
  };
  const modalOpenHandle = () => {
    setPanOpen(true);

    setModalImg(fieldImage);
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
    console.log("Image file change detected");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!fileExtension.match(/(jpg|jpeg|bmp|gif|png)$/)) {
        alert(
          "Only image files (.jpg, .jpeg, .bmp, .gif, .png) are allowed to be uploaded."
        );
        event.target.value = null;
        return;
      }

      try {
        const base64Data = (await ConvertBase64(file)) as string;
        console.log("Base64 image data:", base64Data);

        // Convert Base64 to Uint8Array
        const byteArray = base64ToByteArray(base64Data);
        console.log("🚀 ~ otherDocChangeHandler ~ byteArray:", byteArray);

        setPdf(file);

        // Convert Uint8Array to base64 string
        const base64String = uint8ArrayToBase64(byteArray);
        console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

        // Set value in Formik
        setFieldImage(base64String);
        setBinaryFile(byteArray);

        setfileName(file.name);

        // let outputCheck =
        //   "data:image/png;base64," + formik.values.circUser.memberPic;
        // console.log(outputCheck);
      } catch (error) {
        console.error("Error converting image file to Base64:", error);
      }
    }
  };

  const removeDynamicId = (id: any) => {
    return id.replace(/ /g, "");
  };

  var key = removeDynamicId("uniqueId");
  var uniqueId = sessionStorage.getItem(key);

  if (uniqueId) {
    uniqueId = uniqueId.replace(/"/g, "");
  }

  const uploadFile = async (digiId: any) => {
  try {
    const blob = new Blob([binaryFile], { type: pdf.type });

    const formData = new FormData();
    formData.append("file", blob, fileName);

    // Determine the appropriate ID to use in headers
    const idHeader = digiId ? digiId : editId;

    const response = await axios.post(
      "http://103.12.1.132:8156/api/MssplUploads/UploadItemCateg",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ItemCategId: idHeader,  
          Accept: "*/*",
          Uniqueid: uniqueId,
        },
      }
    );

    if (response.data.isSuccess) {
      toast.success(response.data.succMesg);
      setFieldImage("");
      setImagePreview("");
    } else {
      toast.error(response.data.succMesg);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

  useEffect(() => {
    fetchZonesData();
  }, []);

  // }, [isLoading]);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const routeChangeEdit = (row: any) => {
    console.log(row.itemcategimg);
    console.log("url preview", File_Preview);
    setImagePreview(`${File_Preview}${row.itemcategimg}`);
    setEditCondition(1);
    setisEdit(true);
    formik.setFieldValue("id", row.id);
    formik.setFieldValue("category_LoadingStatus", row.category_LoadingStatus);
    formik.setFieldValue("abbreviation", row.abbreviation);
    formik.setFieldValue("itemcategid", row.itemcategimg);
    // formik.setFieldValue("isActive", row.isActive);
    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: false,
      update: false,
      delete: true,
      read: false,
      instId: 0,
      id: delete_id.toString(),
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/Basic/DeleteItemCategory`, collectData)
      .then((response: any) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchZonesData();
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const fetchZonesData = async () => {
    try {
      const response = await api.get(`api/Basic/GetCategory`);
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            // headerClassName: "MuiDataGrid-colCell",
            headerName: t("text.Action"),
            width: 150,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >
                  {/* {permissionData?.isEdit ? ( */}
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  {/* ) : (
                    ""
                  )} */}
                  {/* {permissionData?.isDel ? ( */}
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row.id);
                    }}
                  />
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "category_LoadingStatus",
            headerName: t("text.CategoryName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "abbreviation",
            headerName: t("text.ShortName"),
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

  const { menuId, menuName } = getMenuData();

  const validationSchema = Yup.object({
    category_LoadingStatus: Yup.string().test(
      "required",
      "Category name is required ",
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

      instId: parseInt(instId),
      id: 0,

      category_LoadingStatus: "",
      abbreviation: "",
      cat_icon: "",
      userid: "",
      itemcategid: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      //values.designationId = editId;
      // if (editId !== undefined) {
      //   values.designationId = editId;
      // }

      if (isEdit === false) {
        values = Object.keys(values)
          .filter((objKey: any) => objKey !== "id")
          .reduce((newObj: any, key: any) => {
            newObj[key] = values[key];
            return newObj;
          }, {});
      }

      console.log("before submitting value check", values);
      const response = await api.post(`api/Admin/SaveCategoryLoading`, values);

      if (response.data.isSuccess) {
        formik.setFieldValue("category_LoadingStatus", "");
        formik.setFieldValue("abbreviation", "");
        fetchZonesData();

        toast.success(response.data.mesg);
        console.log("checkId", response.data.data);

        setTimeout(() => {
          uploadFile(parseInt(response.data.data));
        }, 500);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

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
                {t("text.ItemCategory")}
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
              <Grid xs={12} sm={6} lg={6} item>
                <TranslateTextField
                  label={t("text.CategoryName")}
                  value={formik.values.category_LoadingStatus}
                  onChangeText={(text: string) =>
                    handleConversionChange("category_LoadingStatus", text)
                  }
                  required={true}
                  lang={lang}
                />

                {formik.touched.category_LoadingStatus &&
                formik.errors.category_LoadingStatus ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.category_LoadingStatus)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <TextField
                  label={
                    <CustomLabel text={t("text.ShortName")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="abbreviation"
                  id="abbreviation"
                  value={formik.values.abbreviation}
                  placeholder={t("text.ShortName")}
                  onChange={formik.handleChange}
                />
              </Grid>

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
                    label={
                      <strong style={{ color: "#000" }}>
                        {t("text.EnterImageUpload")}
                      </strong>
                    }
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "fieldImage")}
                  />
                </Grid>

                <Grid xs={12} md={4} sm={4} item></Grid>

                <Grid xs={12} md={4} sm={4} item>
                  <Grid
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      margin: "10px",
                    }}
                  >
                    {fieldImage === "" ? (
                      editCondition === 0 ? (
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
                          src={imagePreview}
                          style={{
                            width: 150,
                            height: 100,
                            border: "1px solid grey",
                            borderRadius: 10,
                          }}
                        />
                      )
                    ) : (
                      <img
                        src={"data:image/png;base64," + fieldImage}
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
                      onClick={() => modalOpenHandle()}
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
                    {modalImg == "" ? (
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
                        src={"data:image/png;base64," + modalImg}
                        style={{
                          width: "170vh",
                          height: "75vh",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </Box>
                </Modal>
              </Grid>

              <Grid item xs={4} sx={{ m: -1 }}>
                {/* {editId === -1 && permissionData?.isAdd && ( */}
                {editId === -1 && (
                  <ButtonWithLoader
                    buttonText={t("text.save")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}

                {editId !== -1 && (
                  <ButtonWithLoader
                    buttonText={t("text.update")}
                    onClickHandler={handleSubmitWrapper}
                    fullWidth={true}
                  />
                )}
              </Grid>
            </Grid>
          </form>

          <DataGrids
            isLoading={isLoading}
            rows={zones}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
