import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Modal,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import api from "../utils/Url";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
//import { getdivisionId } from "../../../utils/Constant";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomLabel from "../utils/CustomLabel";
import DataGrids from "../utils/Datagrids";
import { Language, ReactTransliterate } from "react-transliterate";
import Languages from "../utils/Languages";
import nopdf from "../assets/images/imagepreview.jpg";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonWithLoader from "../utils/ButtonWithLoader";


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
export default function CintentDescription() {
  const { i18n, t } = useTranslation();
  const [editId, setEditId] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [panOpens, setPanOpen] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [contentOption, setContentOption] = useState<any>([]);
  const [totalFile, setTotalFile] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [editorContent, setEditorContent] = useState<string>("");
  const [modalImg, setModalImg] = useState("");

  const handleEditorChange = (content: any) => {
    setEditorContent(content);
  };

  useEffect(() => {
    fetchTotalFile();
    getFileTypeData();
  }, []);

  const getFileTypeData = () => {
    const collectData = {
      "id": -1
    }
   //ContentTypes
    api.post(`api/TypeOfContentControllers/GetTypeOfContent`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.contentType,
        value: item.id,
      }));
      setContentOption([ { value: "-1", label: t("text.ContentTypes") }, ...arr]);
    });
  };
  
  let delete_id = "";

  const accept = () => {
    const collectData = {
      id: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/ContentDescription/DeleteContentDescription`, collectData)
      .then((response: any) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchTotalFile();
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


  const fetchTotalFile = async () => {
    try {
      const collectData = {
        "id": -1,
        "contentTypeId": -1
      };
      console.log("collectData", collectData);
      const response = await api.post(
        `api/ContentDescription/GetContentDescriptionAdmin`,
        collectData
      );

      console.log("result", response.data.data);
      const data = response.data.data;
      const DocsWithIds = data.map((doc: any, index: any) => ({
        ...doc,
        serialNo: index + 1,
        id: doc.id,
      }));

      setTotalFile(DocsWithIds);
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
            width: 120,
            headerClassName: "MuiDataGrid-colCell",

          },
          {
            field: "contentTypeName",
            headerName: t("text.contentTypeName"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "title",
            headerName: t("text.title"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "description",
            headerName: t("text.description"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
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

  const getImgById = (ImgId:any) => {
    const collectData = {
        "id": ImgId,
        "contentTypeId": -1
    };

    api.post(`api/ContentDescription/GetContentDescriptionAdmin`, collectData)
        .then((res) => {
            const Doc = res.data.data[0]["image"];
            if (Doc) {
                formik.setFieldValue("image", Doc);
            }
        });
};

  const routeChangeEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("contentTypeId", row.contentTypeId);
    formik.setFieldValue("title", row.title);
    formik.setFieldValue("isActive", row.isActive);
    formik.setFieldValue("contentTypeName", row.contentTypeName);
    setEditorContent(row.description)
    getImgById(row.id)

    setEditId(row.id);
  };

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      "id": -1,
      "description": "",
      "title": "",
      "contentTypeId": 0,
      "isActive": false,
      "contentTypeName": "",
      "image": ""
    },

    onSubmit: async (values) => {
      values.id = editId;
      values.description = editorContent;
      console.log("checktext", values);
      const response = await api.post(`api/ContentDescription/AddUpdateContentDescription`, values);
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        formik.resetForm();
        fetchTotalFile();
        setEditorContent("");
        setEditId(-1);
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });
  const handleTransliterateChange = (text: string) => {
    setEditorContent(text);
  };

  
  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "image") {
      setModalImg(formik.values.image);
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
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg|png)$/)) {
        alert("Only image files (jpg, jpeg) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };

  const handleSubmitWrapper = async () => {
    await formik.handleSubmit();
  };


  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593 ",
            marginTop: "5px",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
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
                 {t("text.ContentDescr")}
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
              <Grid item xs={12} container spacing={3}>
                <Grid xs={12} sm={4} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={contentOption}
                    value={
                      contentOption.find(
                        (option: any) =>
                          option.value === formik.values.contentTypeId
                      ) || null
                    }
                    fullWidth
                    size="small"
                    onChange={(event, newValue: any) => {
                      console.log(newValue);
                      formik.setFieldValue("contentTypeId", newValue?.value);
                      formik.setFieldValue("contentTypeName", newValue?.label);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={<CustomLabel text={t("text.ContentTypes")} />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.titles")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="title"
                  id="title"
                  value={formik.values.title}
                  placeholder={t("text.titles")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid
                xs={12}
                sm={4}
                lg={4}
                item
                alignItems="center"
                justifyContent="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      id="isActive"
                      name="isActive"
                      checked={formik.values.isActive === true}
                      onChange={(e) => {
                        console.log("🚀 ~ CreateDigitalContent ~ e:", e);
                        const newValue = e.target.checked ? true : false;
                        formik.setFieldValue("isActive", newValue);
                      }}
                      color="primary"
                    />
                  }
                  label={t('text.ActiveContent')}
                  labelPlacement="end"
                />
              </Grid>
              
                <Grid item xs={12} sm={12}>
                   <ReactTransliterate
                    renderComponent={(props: any) => (
                      <ReactQuill
                        {...props}
                        value={editorContent}
                        onChange={handleEditorChange}
                        modules={modules}
                        formats={formats}
                      />
                    )}
                    value={editorContent}
                    placeholder={t('text.description')}
                    label={t('text.description')}
                    onChangeText={handleTransliterateChange}
                    lang={lang}
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
                    onChange={(e) => otherDocChangeHandler(e, "image")}
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
                    {formik.values.image == "" ? (
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
                        src={formik.values.image}
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
                      onClick={() => modalOpenHandle("image")}
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

                <Grid item lg={6} sm={6} xs={12}>
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

                <Grid item lg={6} sm={6} xs={12}>
                  <Button
                    type="reset"
                    fullWidth
                    style={{
                      backgroundColor: "#F43F5E",
                      color: "white",
                      marginTop: "10px",
                    }}
                    onClick={(e) => {
                      formik.resetForm();
                      setEditorContent("");
                      setEditId(-1);
                    }}
                  >
                    {t("text.reset")}
                  </Button>
                </Grid>

                <Grid item sm={12} md={12}>
                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <DataGrids
                      isLoading={isLoading}
                      rows={totalFile}
                      columns={adjustedColumns}
                      pageSizeOptions={[5, 10, 25, 50, 100]}
                      initialPageSize={5}
                    />
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "code-block",
];
