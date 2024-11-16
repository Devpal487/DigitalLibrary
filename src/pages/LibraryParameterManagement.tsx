import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    Modal,
    Box,
    FormControlLabel,
    Radio,
    Checkbox,
    Popper,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import nopdf from "../assets/images/imagepreview.jpg";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import TranslateTextField from "../utils/TranslateTextField";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

type Props = {};

const LibraryParameterManagement = (props: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const back = useNavigate();    
    const [library, setLibrary] = useState<any>([]);
    const [initialValue, setInitialValue] = useState<any>({
        instId:'0', instName:""
    });

    console.log("initial Values", initialValue);
    const [librarysetupinformation, setLibrarysetupinformation] = useState<any>([]);
    const [currencyData, setCurrencyData] = useState<any>([]);
    const [userTypeNameData, setUserTypeNameData] = useState<any>([]);
    const [createNewLibraryCond, setCreateNewLibraryCond] = useState<any>(0)

    useEffect(() => {
        getfullInformationData();
        getusertypeData();
        getcurrencyData();
        setInitialValue({
            instId: parseInt(sessionStorage.getItem("instId") || '0'), 
            instName: sessionStorage.getItem("institute") || "" 
        });
        getLibraryData();
        getImageData();
    }, []);

    const getLibraryData =async()=>{
        const collectData ={
            "name": "",
            "all": true
        }
        const response = await api.post(`api/Basic/GetInstitutes`, collectData)
        let result = response?.data?.data;
        const arr = result?.map((item: any) => ({
            label: item?.instituteName,
            value: item?.instituteCode,
        }));
        setLibrary([ { value: "-1", label: t("text.selectInstitueName") }, ...arr])
    };

 const getfullInformationData =async()=>{
        const response = await api.get(`api/Basic/GetLibrarysetupinformation`, )
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.institutename,
            value: item?.id,
            details: item
        }));
        setLibrarysetupinformation(arr);
    };

 const getcurrencyData =async()=>{
        const response = await api.get(`api/Basic/Getexchangemaster`, )
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.shortName + " -- " + item?.currencyName,
            value: item?.currencyCode
        }));
        setCurrencyData(arr);
    };

 const getusertypeData =async()=>{

    const collectData = {
        "userTypeId": 0,
        "userTypeName": ""
      }
        const response = await api.post(`api/UserPermission/GetUserType`,collectData )
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.userTypeName,
            value: item?.userTypeId
        }));
        console.log("arr", arr);
        setUserTypeNameData(arr);
    };


 const getImageData =async()=>{

        const response = await api.get(`api/LibrarySetup/getLibrary`);
        console.log("Image base64", response.data.data.libImages.length);
        if(response?.data?.data?.libImages?.length > 0){
            let resp = response.data.data.libImages[0]
            const arr = [];
            for(let i=0; i<resp.length;i++){
                arr.push({"id": resp[i]['id'],
                "purpose": resp[i]['purpose'],
                "imageData": resp[i]['imageData'],
                "descr": resp[i]['descr'],
                "delete": resp[i]['delete'],
                "libId": resp[i]['libId']})
            }
        formik.setFieldValue("libImages", arr);
        };
    };
    
    const [Opens, setOpen] = React.useState(false);
    const [Img, setImg] = useState("");


    const handlePanClose1 = () => {
        setOpen(false);
    };
    const modalOpenHandle1 = (event: any) => {
        setOpen(true);
        if (event === "libImages.imageData") {
            //setImg(formik.values.memberSign);
        }
    };

    const [lang, setLang] = useState<Language>("en");

    const { menuId, menuName } = getMenuData();
    const instId: any = getinstId();

    const formik = useFormik({
        initialValues: {
            "appId": menuId,
            "appName": menuName,
            "add": true,
            "update": true,
            "delete": true,
            "read": true,
            "libImages": [
              {
                "id": 0,
                "purpose": "",
                "imageData": "",
                "descr": "",
                "delete": true,
                "libId": 0
              }
            ],
            "dashboard": [
              {
                "dashBoardId": 0,
                "boardName": "",
                "boardId": 0,
                "defaultCount": "",
                "active": true,
                "noOfDays": 0,
                "id": 0
              }
            ],
            "librarysetupinformation": {
              "appId": menuId,
              "appName": menuName,
              "add": true,
              "update": true,
              "delete": true,
              "read": true,
              "instId": parseInt(instId),
              "id": 0,
              "institutename": "",
              "libraryname": "",
              "address": "",
              "city": "",
              "pincode": '',
              "state": "",
              "phoneno": "",
              "fax": "",
              "email": "",
              "gram": "",
              "currency": "",
              "shortname": "",
              "reminderValidityPeriod": 0,
              "currentAcademicSession": "",
              "currencyConversionFactor": "",
              "databasesource": "",
              "smptp_IPadd": "",
              "discount": 0,
              "orderArrivalGap": 0,
              "isBackDateAllowed": "",
              "isAuditRequired": "",
              "isEmailAllowed": "",
              "cutterNoLength": 0,
              "maxResPerCopy": 0,
              "jurl_RemainderPeriod": 0,
              "ipAddress_1": "",
              "ipAddress_2": "",
              "proxyAdd": "",
              "iUser": "",
              "iPwd": "",
              "category_id": 0,
              "media_id": 0,
              "language_id": 0,
              "def_language": "",
              "media": "",
              "category": "",
              "dbbLocation1": "",
              "dbbLocation2": "",
              "dbbLocation3": "",
              "dbservername": "",
              "dbuserid": "",
              "dbpassword": "",
              "menu": "",
              "departmentcode": 0,
              "def_city": "",
              "def_state": "",
              "def_country": "",
              "dis_newarr": "",
              "circPassword": "",
              "checkBudget": "",
              "college_picture": "",
              "theme": 0,
              "downloadpwd": "",
              "stopIssueRetirement": 0,
              "bbSecurity": 0,
              "bbRent": 0,
              "cD_RomPath": "",
              "appLanguage": "",
              "emProOrd": 0,
              "emCanOrd": 0,
              "emOrdRemLet": 0,
              "emOrdConLet": 0,
              "emRemLetPriPro": 0,
              "emTran": 0,
              "emIsu": 0,
              "emReIsu": 0,
              "emRet": 0,
              "emIsuTU": 0,
              "emRetTU": 0,
              "emIsuBakLog": 0,
              "emRetBakLog": 0,
              "emIsuSpe": 0,
              "emIsuTecUnp": 0,
              "emRetTecUnp": 0,
              "emODCRecEnt": 0,
              "emODCIntRecEnt": 0,
              "emODCWavOff": 0,
              "emODCDetMem": 0,
              "emOrdJou": 0,
              "emOrdPack": 0,
              "emJouPay": 0,
              "emJouClaim": 0,
              "onlineP": "",
              "orgSName": "",
              "msgOPAC": "",
              "onlinePIndent": "",
              "dept_B_Cat": "",
              "jornal_Bind_All": "",
              "binding_Must": "",
              "digitalDocPath": "",
              "withoutOIP": "",
              "webSite": "",
              "isLMenuSlider": "",
              "descImage": "",
              "primaryDescType": "",
              "smtp_Port": 0,
              "bookReturnDate_Msg": 0,
              "overDue_Msg": 0,
              "dBookBind": "",
              "msgPopUp": "",
              "schedule_performed_upto": "2024-11-13T10:01:53.278Z",
              "sendMailAttempt": 0,
              "organization_Picture": "",
              "reminder_email": "",
              "enableBiometric": "",
              "enableAutoPassword": "",
              "enableDualBiometric": "",
              "eAttLoc": 0,
              "indent_comb_prnt": "",
              "bookreturn_reminder": 0,
              "usersdataband": "",
              "enble_FregImm": "",
              "multi_Issue": "",
              "addPublisher": 0,
              "addResources": 0,
              "jrnl_reminder_mobno": "",
              "callNo": "",
              "cpyInform": "",
              "reserve": "",
              "content": "",
              "addKey": "",
              "addCart": "",
              "authorIfo": "",
              "bookInfo": "",
              "billno": "",
              "billdate": "",
              "classno": "",
              "bookno": "",
              "volume": "",
              "part": "",
              "edition": "",
              "editionYear": "",
              "pubYear": "",
              "isbn": "",
              "issn": "",
              "totalPage": "",
              "mediaP": "",
              "form": "",
              "location": "",
              "lbmem": "",
              "lbbook": "",
              "lblLocation": "",
              "mssplSuggestion": "",
              "searchButton": "",
              "refreshLocation": "",
              "libTraining": "",
              "trainingPath": "",
              "epcEnable": "",
              "setOfVol": "",
              "vendorPercentage": "",
              "btnOk": "",
              "btnIncorrect": "",
              "ant1": "",
              "ant4": "",
              "ant2": "",
              "ant3": "",
              "eArticlePath": "",
              "eProjectPath": "",
              "eThesisPath": "",
              "eJournalPath": "",
              defUserTypeId:""
            },
            "newLibUser": {
              "loginName": "",
              "passw1": "",
              "passw2": ""
            },
            "instId": parseInt(instId)
          },
        // validationSchema: validationSchema,

        onSubmit: async (values:any) => {
            console.log("Before submission formik values", values);

            try {
                const response = await api.post(
                    `api/LibrarySetup/UpdateLibrarySetupFull`,
                    values
                );
                if (response.data.isSuccess) {
                    // setToaster(false);
                    toast.success(response.data.mesg);

                    // setTimeout(() => {
                    //     navigate("/UserManagement");
                    // }, 800);
                } else {
                    toast.error(response.data.mesg);
                }
            } catch (error) {
                //setToaster(true);
                console.error("Error:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    console.log("Formik errors:", formik.errors);
    console.log("Formik touched:", formik.touched);

    const requiredFields = [
        "circUser.doj",

        "circUser.cat_id",
        "circUser.departmentcode",
        "circUser.dob",
        "circUser.classname",
        "address.peraddress",
        "address.perstate",
        "address.percountry",
        "address.percity",
    ];

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

                // Convert Uint8Array to base64 string
                const base64String = uint8ArrayToBase64(byteArray);
                console.log("🚀 ~ otherDocChangeHandler ~ base64String:", base64String);

                // Set value in Formik
                formik.setFieldValue(params, base64String);

                //let outputCheck ="data:image/png;base64," + formik.values.circUser.memberPic;
                //console.log(outputCheck);
            } catch (error) {
                console.error("Error converting image file to Base64:", error);
            }
        }
    };

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    const handleCreateNewLibrary = (e:any)=>{
        e.preventDefault();
        setCreateNewLibraryCond(1);
        formik.resetForm();
    }

    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    border: ".5px solid #2B4593",
                    marginTop: "3vh",
                }}
            >
                <CardContent>
                    <Grid item xs={12} container spacing={2}>
                        <Grid item lg={2} md={2} xs={2} marginTop={2}>
                            {/* <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    backgroundColor: "blue",
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button> */}
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
                                {t("text.LibraryParameterManagement")}
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
                        <ToastApp />
                        <Grid item xs={12} container spacing={2}>
                            
                        <Grid item xs={12} container spacing={2}>
                            <Grid item lg={9} md={9} >
                            <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={library}
                                    fullWidth
                                    size="small"
                                    value={library.find((opt:any)=> opt.value == initialValue?.instId)}
                                    onChange={(event, newValue: any) => {
                                        console.log("newValue", newValue);
                                        setCreateNewLibraryCond(0);
                                        if(newValue){
                                        formik.setFieldValue("librarysetupinformation.id", newValue?.value);
                                        formik.setFieldValue("librarysetupinformation.institutename", newValue?.label);
                                        let res = librarysetupinformation.find((opt:any) => opt.value === newValue?.value)
                                        console.log("librarySetupInformation", res)
                                        console.log("librarySetupInformation", res?.details?.defUserTypeId)
                                        console.log("librarySetupInformation", res?.details?.currency)
                                        formik.setFieldValue("librarysetupinformation.institutename", res?.details?.institutename)
                                        formik.setFieldValue("librarysetupinformation.shortname", res?.details?.shortname)
                                        formik.setFieldValue("librarysetupinformation.libraryname", res?.details?.libraryname)
                                        formik.setFieldValue("librarysetupinformation.id", res?.details?.id)
                                        formik.setFieldValue("librarysetupinformation.address", res?.details?.address)
                                        formik.setFieldValue("librarysetupinformation.city", res?.details?.city)
                                        formik.setFieldValue("librarysetupinformation.state", res?.details?.state)
                                        formik.setFieldValue("librarysetupinformation.phoneno", res?.details?.phoneno)
                                        formik.setFieldValue("librarysetupinformation.email", res?.details?.email)
                                        formik.setFieldValue("librarysetupinformation.webSite", res?.details?.webSite)
                                        formik.setFieldValue("librarysetupinformation.defUserTypeId", res?.details?.defUserTypeId)
                                        formik.setFieldValue("librarysetupinformation.currency", res?.details?.currency)
                                        formik.setFieldValue("librarysetupinformation.pincode", parseInt(res?.details?.pincode))
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectInstitueName")}
                                                    required={false}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={3} md={3}>
                                <Button onClick={handleCreateNewLibrary}> <AddCircleOutlineIcon />Create New Library</Button>
                            </Grid>
                        </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.nameOfTheOrginsation") : t("text.enterNameOfTheOrginsation")}
                                    value={formik.values.librarysetupinformation.institutename}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.institutename", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                            <TranslateTextField
                                label={ createNewLibraryCond === 0 ? t("text.shortName") : t("text.enterShortName")}
                                value={formik.values.librarysetupinformation.shortname}
                                onChangeText={(text: string) =>
                                    handleConversionChange("librarysetupinformation.shortname", text)
                                }
                                required={false}
                                lang={lang}
                            />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                 <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.nameOfTheLibrary") : t("text.enterNameOfTheLibrary")}
                                    value={formik.values.librarysetupinformation.libraryname}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.libraryname", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                   label={ createNewLibraryCond === 0 ? t("text.address") : t("text.enterAddress")}
                                   value={formik.values.librarysetupinformation.address}
                                   onChangeText={(text: string) =>
                                       handleConversionChange("librarysetupinformation.address", text)
                                   }
                                   required={false}
                                   lang={lang}
                               />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                            <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.city") : t("text.city")}
                                    value={formik.values.librarysetupinformation.city}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.city", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.state") : t("text.state")}
                                    value={formik.values.librarysetupinformation.state}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.state", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>


                            <Grid item lg={4} xs={12}>
                            <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.pinCode") : t("text.enterpinCode")}
                                    value={formik.values.librarysetupinformation.pincode}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.pincode", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.phone") : t("text.enterPhone")}
                                    value={formik.values.librarysetupinformation.phoneno}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.phoneno", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.email") : t("text.enterEmail")}
                                    value={formik.values.librarysetupinformation.email}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.email", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                            <TranslateTextField
                                    label={createNewLibraryCond === 0 ? t("text.website") : t("text.enterWebsite")}
                                    value={formik.values.librarysetupinformation.webSite}
                                    onChangeText={(text: string) =>
                                        handleConversionChange("librarysetupinformation.webSite", text)
                                    }
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={userTypeNameData}
                                fullWidth
                                size="small"
                                value={userTypeNameData.find((opt:any)=> opt.value === formik.values.librarysetupinformation.defUserTypeId) || null}
                                onChange={(event, newValue: any) => {
                                    formik.setFieldValue("librarysetupinformation.defUserTypeId",newValue?.value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <CustomLabel
                                                text={t("text.defuserType")}
                                                required={true}
                                                value={formik.values.librarysetupinformation.defUserTypeId}
                                            />
                                        }
                                    />
                                )}
                            />
                            </Grid>
                            
                            <Grid item lg={4} xs={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={currencyData}
                                fullWidth
                                size="small"
                                value={currencyData.find((opt:any)=> opt.value === parseInt(formik.values.librarysetupinformation.currency)) || null}
                                onChange={(event, newValue: any) => {
                                    formik.setFieldValue("librarysetupinformation.currency",newValue?.value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <CustomLabel
                                                text={t("text.currency")}
                                                required={true}
                                                value={formik.values.librarysetupinformation.currency}
                                            />
                                        }
                                    />
                                )}
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
                                                {t("text.EnterSignatureUpload")}
                                            </strong>
                                        }
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white" }}
                                        onChange={(e) =>
                                            otherDocChangeHandler(e, "libImages.imageData")
                                        }
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
                                        {/* {formik.values.libImages.imageData == "" ? (
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
                                                src={
                                                    "data:image/png;base64," +
                                                    formik.values.libImages.imageData
                                                }
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    border: "1px solid grey",
                                                    borderRadius: 10,
                                                    padding: "2px",
                                                }}
                                            />
                                        )} */}
                                        <Typography
                                            onClick={() => modalOpenHandle1("libImages.imageData")}
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

                                <Modal open={Opens} onClose={handlePanClose1}>
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
                                            <img
                                                alt="preview image"
                                                src={"data:image/png;base64," + Img}
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

                            {/* <Grid item lg={6} sm={6} xs={12}>
                  <Grid>
                    <Button
                      type="submit"
                      fullWidth
                      style={{
                        backgroundColor: "#059669",
                        color: "white",
                        marginTop: "10px",
                      }}
                    >
                      {t("text.save")}
                    </Button>
                  </Grid>
                </Grid> */}

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
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
                                    onClick={(e) => formik.resetForm()}
                                >
                                    {t("text.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

export default LibraryParameterManagement;