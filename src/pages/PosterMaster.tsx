import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
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

export default function PosterMaster() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [lang, setLang] = useState<Language>("en");

  const [isEdit, setisEdit] = useState(false);

  const [modalImg, setModalImg] = useState("");

  console.log("modalImg", modalImg);
  const [panOpens, setPanOpen] = React.useState(false);

  const { t } = useTranslation();

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "posterImage") {
      setModalImg(formik.values.posterImage);
    }
  };

  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    console.log("check");
  
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
  
      // Check if the file extension is valid (jpg, jpeg, png)
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg, png) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }
  
     
      const image = new Image();
      const reader = new FileReader();
  
      reader.onload = async (e: any) => {
        image.src = e.target.result;
  
        image.onload = () => {
          const imageHeight = image.height;
          const imageWidth = image.width;
  
          
          if (imageHeight < 200 || imageHeight > 250) {
            alert("Image height should be between 200px and 250px.");
            event.target.value = null;
            return;
          }
 
          if (imageWidth < 2000) {
            alert("Image width should be greater than or equal to 2000px.");
            event.target.value = null;
            return;
          }
  
          
          ConvertBase64(file).then((base64) => {
            formik.setFieldValue(params, base64);
            //console.log(base64);
          });
        };
      };
  
      
      reader.readAsDataURL(file);
    }
  };
  const getImgById = (ImgId: any) => {
    const collectData = {
        posterId: ImgId,
    };

    api.post(`api/Poster/GetPosterAdmin`, collectData).then((res) => {
      const Doc = res.data.data[0]["posterImage"];
      if (Doc) {
        formik.setFieldValue("posterImage", Doc);
      }
    });
  };

  useEffect(() => {
    fetchZonesData();
  }, []);

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);

    setisEdit(true);
    formik.setFieldValue("posterName", row.posterName);

    getImgById(row.id);

    // formik.setFieldValue("isActive", row.isActive);
    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      posterId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api.post(`api/Poster/DeletePoster`, collectData).then((response: any) => {
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
      const collectData = {
        posterId: -1,
      };
      const response = await api.post(`api/Poster/GetPosterAdmin`, collectData);
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.posterId,
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
            field: "posterName",
            headerName: t("text.PosterName"),
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

  const instId: any = getinstId();

  const formik = useFormik({
    initialValues: {
      posterId: -1,
      posterName: "",
      isActive: true,
      posterImage: "",
      createdBy: "",
      updatedBy: "",
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    },

    onSubmit: async (values: any) => {
      values.posterId = editId;
      console.log("before submitting value check", values);
      const response = await api.post(`api/Poster/AddUpdatePoster`, values);

      if (response.data.isSuccess) {
        formik.setFieldValue("posterName", "");
        formik.setFieldValue("posterImage", "");

        fetchZonesData();
        toast.success(response.data.mesg);
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
                {t("text.PosterMaster")}
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
              <Grid item xs={12} sm={12} lg={12}>
                <TextField
                  label={
                    <CustomLabel text={t("text.PosterName")} required={true} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="posterName"
                  id="posterName"
                  value={formik.values.posterName}
                  placeholder={t("text.PosterName")}
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
                    label={<CustomLabel text={t("text.AttachedImg")} />}
                    size="small"
                    fullWidth
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => otherDocChangeHandler(e, "posterImage")}
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
                    {formik.values.posterImage == "" ? (
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
                        src={formik.values.posterImage}
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
                      onClick={() => modalOpenHandle("posterImage")}
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
                        src={modalImg}
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

              <Grid item xs={12} sx={{ m: -1 }}>
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
