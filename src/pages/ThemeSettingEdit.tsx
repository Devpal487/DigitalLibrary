import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    Divider,
    MenuItem,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Popover,
    Modal,
    Box,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
  import axios from "axios";
  import { Navigate, useNavigate, useLocation } from "react-router-dom";
  //import HOST_URL from "../../../utils/Url";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { useTranslation } from "react-i18next";
  import { toast, ToastContainer } from "react-toastify";
  import ToastApp from "../ToastApp";
  import api, { File_Preview } from "../utils/Url";
  import Languages from "../utils/Languages";
  import TranslateTextField from "../utils/TranslateTextField";
  import { Language } from "react-transliterate";
  import CustomLabel from "../utils/CustomLabel";
  import { getMenuData } from "../utils/Constant";
  import ButtonWithLoader from "../utils/ButtonWithLoader";
  import { ColorLens as ColorLensIcon } from "@mui/icons-material";
  import { SketchPicker } from "react-color";
  import nopdf from "../assets/images/imagepreview.jpg";
 
  type Props = {};
  
  
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
  
  const ThemeSettingEdit = (props: Props) => {
    let navigate = useNavigate();
    const { i18n, t } = useTranslation();
  
    const [toaster, setToaster] = useState(false);
    const [lang, setLang] = useState<Language>("en");
    const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
    const [colorPickerOver, setColorPickerOver] = useState(null);
  
    const [colorPickerOver2, setColorPickerOver2] = useState(null);
    const [panOpens, setPanOpen] = React.useState(false);
    const [modalImg, setModalImg] = useState("");

    const location = useLocation();
    console.log('location',location);

    const filePreview = `https://adhyalibdoc.mssplonline.com:8130/`

    

    useEffect(() => {
        getImgById();
    }, []);




    const getImgById = () => {
        const collectData = {
            themeId: location.state.id,
        };
    
        api.post(`api/ThemeMaster/GetThemeMaster`, collectData)
            .then((res) => {
                const Doc = res.data.data[0]["backgroundImage"];
                if (Doc) {
                    formik.setFieldValue("backgroundImage",filePreview + Doc);
                }
            });
    };
  
    const handlePanClose = () => {
      setPanOpen(false);
    };
  
    const modalOpenHandle = (event: any) => {
      setPanOpen(true);
      if (event === "backgroundImage") {
        setModalImg(formik.values.backgroundImage);
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
          alert("Only image files (jpg, jpeg,png) are allowed to be uploaded.");
          event.target.value = null;
          return;
        }
  
        const base64 = await ConvertBase64(file);
        formik.setFieldValue(params, base64);
        console.log(base64);
      }
    };
  
    //const { menuId, menuName } = getMenuData();
  
    const handleIconClick = (event: any) => {
      setColorPickerAnchor(event.currentTarget);
    };
  
    const handleIconClick1 = (event: any) => {
      setColorPickerOver(event.currentTarget);
    };
  
    const handleIconClick2 = (event: any) => {
      setColorPickerOver2(event.currentTarget);
    };
  
    const handleColorChange = (color: any) => {
      formik.setFieldValue("textColor", color.hex);
    };
  
    const handleColorChange1 = (color: any) => {
      formik.setFieldValue("navbarColor", color.hex);
    };
  
    const handleColorChange2 = (color: any) => {
      formik.setFieldValue("navbarTextColor", color.hex);
    };
  
    const handlePopoverClose = () => {
      setColorPickerAnchor(null);
    };
  
    const handlePopoverClose1 = () => {
      setColorPickerOver(null);
    };
  
    const handlePopoverClose2 = () => {
      setColorPickerOver2(null);
    };
  
    const open = Boolean(colorPickerAnchor);
    const open1 = Boolean(colorPickerOver);
    const open2 = Boolean(colorPickerOver2);
    const id = open ? "color-popover" : undefined;
    const id1 = open1 ? "color-popover" : undefined;
    const id2 = open2 ? "color-popover" : undefined;
  
    const validationSchema = Yup.object({
      themeName: Yup.string().test(
        "required",
        "Theme Name  is required",
        function (value: any) {
          return value && value.trim() !== "";
        }
      ),
    });
  
    const formik = useFormik({
      initialValues: {
        themeId:location.state.id,
        themeName:location.state.themeName,
        fontFamily:location.state.fontFamily,
        textColor:location.state.textColor,
        fontSize:location.state.fontSize,
        navbarColor:location.state.navbarColor,
        navbarTextColor:location.state.navbarTextColor,
        isActive:location.state.isActive,
        backgroundImage:filePreview +location.state.backgroundImage,
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        const response = await api.post(`api/ThemeMaster/AddUpdateThemeMaster`, values);
        if (response.data.isSuccess) {
          // setToaster(true);
          toast.success(response.data.mesg);
  
          setTimeout(() => {
            navigate("/ThemeSetting");
          }, 900);
        } else {
          // setToaster(true);
          toast.error(response.data.mesg);
        }
      },
    });
  
    const requiredFields = [""];
  
    const back = useNavigate();
  
    const handleConversionChange = (params: any, text: string) => {
      formik.setFieldValue(params, text);
    };
  
    const handleSubmitWrapper = async () => {
      await formik.handleSubmit();
    };
  
    return (
      <div>
        <div
          style={{
            padding: "-5px 5px",
            backgroundColor: "#ffffff",
            borderRadius: "5px",
            border: ".5px solid #FF7722",
            marginTop: "3vh",
          }}
        >
          <CardContent>
            <Grid item xs={12} container spacing={2}>
              <Grid item lg={2} md={2} xs={2} marginTop={2}>
                <Button
                  type="submit"
                  onClick={() => back(-1)}
                  variant="contained"
                  style={{
                    backgroundColor: `var(--header-background)`,
                    width: 20,
                  }}
                >
                  <ArrowBackSharpIcon />
                </Button>
              </Grid>
              <Grid
                item
                lg={7}
                md={7}
                xs={7}
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="center"
                >
                  {t("text.EditThemeSetting")}
                </Typography>
              </Grid>
  
              <Grid item lg={3} md={3} xs={3} marginTop={3}>
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
            <br />
            <form onSubmit={formik.handleSubmit}>
              {/* <ToastContainer />
                { <ToastApp />} */}
              <Grid item xs={12} container spacing={2}>
                <Grid item lg={4} xs={12}>
                  <TranslateTextField
                    label={t("text.ThemeName")}
                    value={formik.values.themeName}
                    onChangeText={(text: string) =>
                      handleConversionChange("themeName", text)
                    }
                    required={true}
                    lang={lang}
                  />
                  {formik.touched.themeName && formik.errors.themeName ? (
                    <div style={{ color: "red", margin: "5px" }}>
                      {String(formik.errors.themeName)}
                    </div>
                  ) : null}
                </Grid>
  
                <Grid item lg={4} xs={12}>
                  <TextField
                    label={
                      <CustomLabel text={t("text.FontFamily")} required={false} />
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="fontFamily"
                    id="fontFamily"
                    value={formik.values.fontFamily}
                    placeholder={t("text.FontFamily")}
                    onChange={formik.handleChange}
                  />
                </Grid>
  
                <Grid item lg={4} xs={12}>
                  <TextField
                    label={
                      <CustomLabel text={t("text.FontSize")} required={false} />
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    name="fontSize"
                    id="fontSize"
                    value={formik.values.fontSize}
                    placeholder={t("text.FontSize")}
                    onChange={formik.handleChange}
                  />
                </Grid>
  
                <Grid item md={4}>
                  <TextField
                    label={<CustomLabel text={t("text.TextColor")} />}
                    value={formik.values.textColor}
                    placeholder={t("text.TextColor")}
                    size="small"
                    fullWidth
                    name="textColor"
                    id="textColor"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleIconClick}>
                            <ColorLensIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={colorPickerAnchor}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <SketchPicker
                      color={formik.values.textColor}
                      onChangeComplete={handleColorChange}
                    />
                  </Popover>
                </Grid>
  
                <Grid item md={4}>
                  <TextField
                    label={<CustomLabel text={t("text.navbarColor")} />}
                    value={formik.values.navbarColor}
                    placeholder={t("text.navbarColor")}
                    size="small"
                    fullWidth
                    name="navbarColor"
                    id="navbarColor"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleIconClick1}>
                            <ColorLensIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
  
                  <Popover
                    id={id1}
                    open={open1}
                    anchorEl={colorPickerOver}
                    onClose={handlePopoverClose1}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <SketchPicker
                      color={formik.values.navbarColor}
                      onChangeComplete={handleColorChange1}
                    />
                  </Popover>
                </Grid>
  
                <Grid item md={4}>
                  <TextField
                    label={<CustomLabel text={t("text.navbarTextColor")} />}
                    value={formik.values.navbarTextColor}
                    placeholder={t("text.navbarTextColor")}
                    size="small"
                    fullWidth
                    name="navbarTextColor"
                    id="navbarTextColor"
                    style={{ backgroundColor: "white" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleIconClick2}>
                            <ColorLensIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
  
                  <Popover
                    id={id2}
                    open={open2}
                    anchorEl={colorPickerOver2}
                    onClose={handlePopoverClose2}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <SketchPicker
                      color={formik.values.navbarTextColor}
                      onChangeComplete={handleColorChange2}
                    />
                  </Popover>
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
                      label={<CustomLabel text={t("text.Attachedlogo")} />}
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={(e) => otherDocChangeHandler(e, "backgroundImage")}
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
                      {formik.values.backgroundImage == "" ? (
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
                          src={formik.values.backgroundImage}
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
                        onClick={() => modalOpenHandle("backgroundImage")}
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
                      buttonText={t("text.update")}
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
                  {/* <ButtonWithLoader
                        buttonText={t("text.reset")}
                        onClickHandler={handleSubmitWrapper}
                        fullWidth={true}
                        
                      /> */}
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </div>
      </div>
    );
  };
  
  export default ThemeSettingEdit;
  