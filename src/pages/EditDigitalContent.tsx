import React, { useEffect, useState } from "react";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Grid,
  Typography,
  TextField,
  TextareaAutosize,
  Modal,
  Table,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast, ToastContainer } from "react-toastify";
import ToastApp from "../ToastApp";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useFormik } from "formik";
import { getId, getinstId } from "../utils/Constant";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { styled } from "@mui/system";
import UploadIcon from "@mui/icons-material/Upload";
import nopdf from "../../src/assets/images/imagepreview.jpg";
import { getMenuData } from "../utils/Constant";
import UploadFilesDigitalContent from "../UploadFilesDigitalContent";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";

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

export default function EditDigitalContent() {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const Userid = getId();
  const instId = getinstId();

  // console.log("useLocation " + useLocation());
  const location = useLocation();

  const back = useNavigate();
  const [lang, setLang] = useState<Language>("en");
  const [contentListOption, setContentListOption] = useState([
    { value: "-1", label: t("text.contentgrp") },
  ]);
  const [audianceListOption, setAudianceListOption] = useState([
    { value: "-1", label: t("text.memberGroup") },
  ]);
  const [digitalListOption, setDigitalListOption] = useState([
    { value: "-1", label: t("text.typeOfContent") },
  ]);
  const [memberListOption, setMemberListOption] = useState([
    { value: "-1", label: t("text.Audience") },
  ]);
  const [programsubOption, setProgramSubOption] = useState([
    { value: "-1", label: t("text.ProgramSub") },
  ]);
  const [subjectOption, setSubjectOption] = useState([
    { value: "-1", label: t("text.Subject") },
  ]);
  const [applicableMemOption, setApplicableMemOption] = useState([
    { value: "-1", label: t("text.ApplicabeMember") },
  ]);
  const [memberData, setMemberData] = useState("");
  const [applicableAcceOption, setASpplicableAcceOption] = useState([
    { value: "-1", label: t("text.ApplicableAccession") },
  ]);
  const [termData, setTermData] = useState("");
  const [adminOption, setAdminOption] = useState([
    { value: "-1", label: t("text.AdminType") },
  ]);
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);
  const [pdf, setPDF] = useState<any>("");

  const [taxOptions, setTaxOptions] = useState<any>([
    { value: "-1", label: t("text.SelectTax"), pcent: 0 },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);

  //console.log("pdfview",pdf)
  const [pdfView, setPdfView] = useState("");
  const [fileName, setfileName] = useState("");
  const [filetypetable, setFiletypetable] = useState<any>("");
  const [fileexten, setFileexten] = useState("");
  const [open, setOpen] = React.useState(false);
  const { menuId, menuName } = getMenuData();
  const [cautionFile, setCautionFile] = useState(0);
  const [digId, setDigId] = useState<any | number>(0);
  const [modal, setModal] = useState(false);
  const [toaster, setToaster] = useState(false);
  const [Shows, setShows] = useState<boolean>(false);
  const [Img, setImg] = useState<string>("");
  const [filetyperesult, setFiletyperesult] = useState<string>("");
  const [fileExtensionTable, setFileExtensionTable] = useState<string>("");
  const [binaryFile, setBinaryFile] = useState<any>();
  const [tableData, setTableData] = useState<any>([]);
  const [showFiles, setShowFiles] = useState(false);
  const [addFiles, setAddFiles] = useState(false);
  const [userTypeData, setUserTypeData] = useState([]);
  const [userTypePerm, setUserTypePerm] = useState([]);
  const [panOpens, setPanOpen] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [fieldValue, setFieldValue] = useState<any>("");
  const [thumbnail, setThumbnail] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [currCode, setCurrCode] = useState([
    { value: "-1", label: t("text.SelectCurrency") },
  ]);

  // console.log('fieldValue',fieldValue);
  // console.log("fileName",fileName)

  const [contentGroup, setContentGroup] = useState([
    { value: "-1", label: t("text.SelectContentGroup") },
  ]);

  const [memberGroup, setMemberGroup] = useState<any>([
    { value: "-1", label: t("text.SelectMemberGroup") },
  ]);
  const [thumbnailData, setThumbnailData] = useState("");

  const [isCategory, setCategory] = useState([
    { value: "-1", label: t("text.SelectCategory") },
  ]);

  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [proOpen, setProOpen] = useState(false);

  const [isTax, setTax] = useState([
    { value: "-1", label: t("text.SelectTax") },
  ]);

  const removeDynamicId = (id: any) => {
    return id.replace(/ /g, "");
  };

  useEffect(() => {
    setTimeout(() => {
      if (uploadProgress === 100) {
        setProOpen(false);
      }
    }, 500);
  }, [uploadProgress, setProOpen]);

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
        }
      };
    }
  };

  useEffect(() => {
    getDigitalDDl();
    getProgramSubject();
    getAdmin();
    getCurrCode();
    getPageSetUp();
    getContentGroup();
    getMemberGroup();
    getDigitalFiles(location.state.id);
    getDigiUserType(location.state.id);
    setThumbnail(
      `https://adhyalibdoc.mssplonline.com:8130/` + location.state.thumbnail
    );
    getCategory();
    GetTaxData();
    GetUnitData();
  }, []);

  const GetTaxData = async () => {
    const collectData = {
      taxId: -1,
    };
    const response = await api.post(`api/TaxMaster/GetTaxMaster`, collectData);
    const data = response.data.data;
    const arr: any = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["taxName"],
        value: data[index]["taxId"],
        pcent: data[index]["taxPercentage"],
      });
    }
    setTaxOptions(arr);
  };

  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(
      `api/UnitMaster/GetUnitMaster`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["unitName"],
        value: data[index]["unitId"],
      });
    }
    setUnitOptions(arr);
  };

  const getContentGroup = () => {
    api.get(`api/DigitalOperate/GetDigitalDDl`).then((res) => {
      const arr: any = [];
      //console.log("resultProram" + JSON.stringify(res.data.data));
      for (
        let index = 0;
        index < res.data.data.digitalGroupList.length;
        index++
      ) {
        arr.push({
          label: res.data.data.digitalGroupList[index]["groupName"],
          value: res.data.data.digitalGroupList[index]["id"],
        });
      }
      setContentGroup(arr);
    });
  };

  const getMemberGroup = () => {
    api.get(`api/Basic/GetMemberGroup`).then((res) => {
      const arr: any = [];
      //console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["groupName"],
          value: res.data.data[index]["id"],
        });
      }
      setMemberGroup(arr);
    });
  };

  const [showState, setShowState] = useState();
  const [showAccesion, setShowAccesion] = useState();
  const [showApMember, setShowApMember] = useState();
  const [showContent, setShowContent] = useState();

  //const [currentRow, setCurrentRow] = useState(null);

  const getPageSetUp = () => {
    api
      .get(`api/Basic/GetPageSetupData?Pageid=${menuName}.aspx`)
      .then((res) => {
        const arr: any = [];
        const AccesionId = 10;
        const ApMemberId = 9;
        const setupIdToFind = 7;
        const ContentId = 8;
        const setupItem = res.data.data.find(
          (item: any) => item.setupId === setupIdToFind
        );
        if (setupItem) {
          setShowState(setupItem.showHide);
        }

        const setupAccesion = res.data.data.find(
          (item: any) => item.setupId === AccesionId
        );
        if (setupAccesion) {
          setShowApMember(setupAccesion.showHide);
        }

        const setupApl = res.data.data.find(
          (item: any) => item.setupId === ApMemberId
        );
        if (setupApl) {
          setShowAccesion(setupApl.showHide);
        }

        const Contentgrp = res.data.data.find(
          (item: any) => item.setupId === ContentId
        );
        if (Contentgrp) {
          setShowContent(Contentgrp.showHide);
        }

        //console.log("resultSetUpPage" + JSON.stringify(res.data.data));
      });
  };

  const getCurrCode = () => {
    api.get(`api/Basic/GetExchange?curcode=-1`).then((res) => {
      const arr: any = [];
      //console.log("resultProram" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["currencyName"],
          value: res.data.data[index]["currencyCode"],
        });
      }
      setCurrCode(arr);
    });
  };

  const getDigitalDDl = () => {
    api.get(`api/DigitalOperate/GetDigitalDDl`).then((res) => {
      let arr: any = [];
      let memberGroupListarr: any = [];
      let audienceModListarr: any = [];
      let digitalGroupListarr: any = [];

      for (
        let index = 0;
        index < res.data.data.contentModList.length;
        index++
      ) {
        arr.push({
          label: res.data.data.contentModList[index]["contentType"],
          value: res.data.data.contentModList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.audienceModList.length;
        index++
      ) {
        audienceModListarr.push({
          label: res.data.data.audienceModList[index]["audience"],
          value: res.data.data.audienceModList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.digitalGroupList.length;
        index++
      ) {
        digitalGroupListarr.push({
          label:
            res.data.data.digitalGroupList[index]["groupName"] +
            "-" +
            res.data.data.digitalGroupList[index]["groupDescr"],
          value: res.data.data.digitalGroupList[index]["id"],
        });
      }
      for (
        let index = 0;
        index < res.data.data.memberGroupList.length;
        index++
      ) {
        memberGroupListarr.push({
          label: res.data.data.memberGroupList[index]["groupName"],
          value: res.data.data.memberGroupList[index]["id"],
        });
      }
      setMemberListOption(memberGroupListarr);
      setContentListOption(arr);
      setAudianceListOption(audienceModListarr);
      setDigitalListOption(digitalGroupListarr);
    });
  };
  const getProgramSubject = () => {
    api
      .post(`api/Academic/GetProgramSubject`, { isActive: true })
      .then((res) => {
        let arr: any = [];
        let subjectarr: any = [];

        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label:
              res.data.data[index]["prgName"] +
              "-" +
              res.data.data[index]["subjectName"],
            value: res.data.data[index]["id"],
          });
        }
        for (let index = 0; index < res.data.data.length; index++) {
          subjectarr.push({
            label: res.data.data[index]["subjectName"],
            value: res.data.data[index]["id"],
          });
        }

        setProgramSubOption(arr);
        setSubjectOption(subjectarr);
      });
  };
  const getCategory = () => {
    api.get(`api/E_CommDigitalContent/GetReactCategory?id=-1`).then((res) => {
      const arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["category_LoadingStatus"],
          value: res.data.data[index]["id"],
        });
      }
      setCategory(arr);
    });
  };
  const getApplicableMember = async (termData: any) => {
    if (termData.length < 3) {
      setMemberData("");
      return;
    }
    api
      .get(`api/Search/GetCircUserSugg`, { params: { term: termData } })
      .then((res) => {
        let arr: any = [];
        for (let index = 0; index < res.data.length; index++) {
          arr.push({
            label: res.data[index]["label"],
            value: res.data[index]["value"],
          });
        }
        setApplicableMemOption(arr);
      });
  };

  const getAdmin = () => {
    api.get(`api/Admin/getUsertype`).then((res) => {
      let arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["userTypeName"],
          value: res.data.data[index]["userTypeId"],
        });
      }
      setAdminOption(arr);
    });
  };

  const validationSchema = Yup.object({
    title: Yup.string().test(
      "required",
      "Title is required",
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),

    contentTypeId: Yup.number().test(
      "required",
      "Content type is required",
      function (value: any) {
        return value > 0;
      }
    ),

    audienceId: Yup.number().test(
      "required",
      "Audience is required",
      function (value: any) {
        return value > 0;
      }
    ),

    progSubjId: Yup.number().test(
      "required",
      "class/Program  is required",
      function (value: any) {
        return value > 0;
      }
    ),

    subjectId: Yup.number().test(
      "required",
      "Subject is required",
      function (value: any) {
        return value > 0;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: false,
      update: true,
      delete: false,
      read: false,
      instId: instId,
      id: location.state.id || null,
      title: location.state.title,
      descr: location.state.descr,
      urlIfAny: location.state.urlIfAny,
      givenFileName: location.state.givenFileName,
      storedFileName: location.state.storedFileName,
      appliedMembCodes: location.state.appliedMembCodes || "",
      appliedAccnos: location.state.appliedAccnos || "",
      contentTypeId: location.state.contentTypeId || null,
      contentType: location.state.contentType,
      audienceId: location.state.audienceId,
      memberGroupId: location.state.memberGroupId || null,
      audience: location.state.audience,
      dateSaved: new Date().toISOString().slice(0, 10),
      validTill: new Date().toISOString().slice(0, 10),
      forAllUsers: location.state.forAllUsers || "",
      forMember: location.state.forMember,
      noOfFiles: location.state.noOfFiles,
      files: location.state.files || "",
      groupId: location.state.groupId || null,
      groupName: location.state.groupName,
      progSubjId: location.state.progSubjId,
      libraryName: location.state.libraryName,
      district: location.state.district,
      subjectId: location.state.subjectId,
      currencyCode: location.state.currencyCode || null,
      exRate: location.state.exRate,
      thumbnail: location.state.thumbnail,
      categoryId: location.state.categoryId,
      categoryLoadStatus: location.state.categoryLoadStatus,
      accessionNo: location.state.accessionNo,
      unitId: location.state.unitId,
      taxId: location.state.taxId,
      unitname: location.state.unitname,
      taxName: location.state.taxName,
    },

    validationSchema: validationSchema,
    onSubmit: async (values: any) => {
      const response = await api.post(
        `api/DigitalOperate/SaveDigitalContent`,
        values
      );
      if (response.data.isSuccess) {
        //setToaster(false);
        setDigId(parseInt(response.data.data));
        setOpen(true);
        toast.success(response.data.mesg);
      } else {
        //setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const handleFileExtension = (file_name: any) => {
    return file_name
      .slice(((file_name.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
  };
  const getDigitalFiles = (id: any) => {
    api
      .get(`api/DigitalOperate/GetDigitalFiles`, {
        params: { digicontentid: id },
      })
      .then((res) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            pdfName: res.data.data[index]["givenFileName"],
            value: res.data.data[index]["id"],
            pdfpath: res.data.data[index]["savedFile"],
            pdfView: res.data.data[index]["savedFile"],
            dcid: res.data.data[index]["digitalContentId"],
            //extension: res.data.data[index]["digitalContentId"],
            filetype: getFileType(res.data.data[index]["givenFileName"]),
            extension: handleFileExtension(
              res.data.data[index]["givenFileName"]
            ),
          });
        }
        setTableData(arr);
      });
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const GradientDivider = styled(Divider)({
    height: "1px",
    background: "linear-gradient(to right, #ff7e5f, #feb47b)", // Gradient colors
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)", // Shadow
    border: "none",
  });

  const getFileType = (filename: any) => {
    const extension = filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
    switch (true) {
      case [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(`.${extension}`):
        return "image";
      case [".pdf"].includes(`.${extension}`):
        return "pdf";
      case [".mp4", ".avi", ".mov"].includes(`.${extension}`):
        return "video";
      case [".mp3", ".wav"].includes(`.${extension}`):
        return "audio";
      case [".epub"].includes(`.${extension}`):
        return "epub";
      default:
        return "unknown";
    }
  };

  const getDisplayUI = (filetyperesult: any, filepath: any, extension: any) => {
    console.log("displayUi", filetyperesult, filepath, extension);
    let baseurl = "https://adhyalibdoc.mssplonline.com:8130/";
    const finalPath = filepath.startsWith("blob:http://localhost")
      ? filepath
      : baseurl + filepath;
    switch (filetyperesult) {
      case "image":
        return (
          <img src={finalPath} style={{ height: "150px", width: "200px" }} />
        );
      case "video":
        return (
          <>
            <video controls style={{ width: "70%", height: "50%" }}>
              <source src={finalPath} type={`video/${extension}`} />
            </video>
          </>
        );
      case "audio":
        return (
          <div style={{ width: "50%" }}>
            <audio controls>
              <source src={finalPath} type={`audio/${extension}`} />
            </audio>
          </div>
        );
      case "pdf":
        return <embed src={finalPath} type="application/pdf" />;
      case "epub":
        return <embed src={finalPath} />;
      default:
        return "Error";
    }
  };

  const previewDisplayUI = (
    filetyperesult: any,
    filepath: any,
    extension: any
  ) => {
    console.log("displayUi", filetyperesult, filepath, extension);
    let baseurl = "https://adhyalibdoc.mssplonline.com:8130/";
    const style = {
      width: "170vh",
      height: "75vh",
      borderRadius: 10,
    };

    switch (filetyperesult) {
      case "image":
        return (
          <img
            src={baseurl + filepath}
            style={{ ...style, objectFit: "contain" }}
          />
        );
      case "video":
        return (
          <video controls style={style}>
            <source src={baseurl + filepath} type={`video/${extension}`} />
          </video>
        );
      case "audio":
        return (
          <div style={{ width: "50%" }}>
            <audio controls style={style}>
              <source src={baseurl + filepath} type={`audio/${extension}`} />
            </audio>
          </div>
        );
      case "pdf":
        return (
          <embed
            src={baseurl + filepath}
            type="application/pdf"
            style={style}
          />
        );
      case "epub":
        return <embed src={baseurl + filepath} style={style} />;
      default:
        return "Error";
    }
  };

  const getLocalDisplayUI = (
    filetyperesult: any,
    filepath: any,
    extension: any
  ) => {
    //console.log("displayUi", filetyperesult, filepath, extension);
    switch (filetyperesult) {
      case "image":
        return (
          <img src={filepath} style={{ height: "150px", width: "200px" }} />
        );
      case "video":
        return (
          <>
            <video controls style={{ width: "70%", height: "50%" }}>
              <source src={filepath} type={`video/${extension}`} />
            </video>
          </>
        );
      case "audio":
        return (
          <div style={{ width: "50%" }}>
            <audio controls>
              <source src={filepath} type={`audio/${extension}`} />
            </audio>
          </div>
        );
      case "pdf":
        return <embed src={filepath} type={`application/${extension}`} />;
      case "epub":
        return <embed src={filepath} />;
      default:
        return "Error";
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
            digitalContentId: location.state.id,
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
        console.log("🚀 ~ uploadFile ~ response.data:", response.data);
        toast.success(response.data.succMesg);
        //console.log("🚀 ~ uploadFile ~ response.data.file[0]['savedFile']:", response.data.files[0]['savedFile'])
        // response.data.file[0]['savedFile']
        // setThumbnail(response.data.files[0]['savedFile']);
        addMoreRow();
      } else {
        toast.error(response.data.succMesg);
      }
    } catch (error) {
      //console.error("Error uploading file:", error);
    }
  };

  const formatEstimatedTime = (timeInSeconds: any) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
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
      value: 0,
      dcid: 0,
      thumbnail: thumbnail,
    };

    setTableData((prevTableData: any) => {
      const updatedTableDataed = [...prevTableData, newRows];
      return updatedTableDataed;
    });
    // setfileName("");
    // setPDF("");
    // setFiletypetable("");
    console.log(newRows);
  };

  const modalOpenHandle1 = () => {
    setShows(true);
    setImg(pdfView);
    setFiletyperesult(filetypetable);
    setFileExtensionTable(fileexten);
  };
  const modalOpenHandle = (event: any) => {
    console.log("🚀 ~ modalOpenHandle1 ~ event:", event);
    const response = `https://adhyalibdoc.mssplonline.com:8130/${event.pdfpath}`;

    setShows(true);
    setImg(response);
    setSelectedRow(event);
  };

  const handlePanClose1 = () => {
    setImg("");
    setFiletyperesult("");
    setFileExtensionTable("");
    setShows(false);
    setSelectedRow(null);
    //setCurrentRow(null)
  };

  const handleSubmitWrapper = () => {
    setUploadProgress(0); // Reset progress before upload
    setProOpen(true);
    uploadFile();
  };

  const removeExtraRow = (id: any) => {
    console.log("🚀 ~ removeExtraRow ~ id:", id);

    // setTableData((prevTableData: any) => {
    //   const updatedTableDataed = prevTableData.filter(
    //     (row: any) => row.value !== id.value
    //   );
    handledeleteClick(id.value);
    //   return updatedTableDataed;
    // });
  };

  let delete_id = "";

  const accept = () => {
    const collectData = [
      delete_id,
      //user_ID: Userid,
    ];

    console.log("🚀 ~ accept ~ collectData:", collectData);
    api
      .post(`api/DigitalOperate/DeleteDigitalFiles`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          setTableData((prevTableData: any) => {
            const updatedTableDataed = prevTableData.filter(
              (row: any) => row.value !== delete_id
            );
            // handledeleteClick(delete_id);
            return updatedTableDataed;
          });
        } else {
          toast.error(response.data.mesg);
        }
        //fetchZonesData();
      });
  };

  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    // console.log("🚀 ~ handledeleteClick ~ del_id:", del_id);
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

  const uploadThubnail = async () => {
    //console.log('checkthumbnail');
    try {
      const blob = new Blob([fieldValue], { type: pdf.type });
      const formData = new FormData();
      formData.append("file", blob, fileName);
      // console.log("🚀 ~ uploadFile ~ blob:", blob);
      // console.log("🚀 ~ uploadFile ~ formData:", formData);
      // console.log("🚀 ~ uploadFile ~ binaryFile:", binaryFile);
      // console.log("🚀 ~ uploadFile ~ fileName:", fileName);

      const response = await axios.post(
        "http://103.12.1.132:8156/api/MssplUploads/UploadThumbnail",
        formData,
        {
          headers: {
            //"Content-Type": "multipart/form-data",
            //Id: fileId?.id,
            Id: location.state.id,
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
    //console.log("object")
  };

  // const handleSubmitThumbnail = () => {
  //   uploadThubnail(fileId);
  // };

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

  const getDigiUserType = (id: any) => {
    api
      .get(`api/UserInstituteMapping/GetDigiUserTypePerm`, {
        params: { DigitalContId: id },
      })
      .then((res) => {
        const result = res.data.data?.usertypeid;
        if (result.length > 0) {
          let arr: any = [];
          for (let index = 0; index < result.length; index++) {
            arr.push({
              value: result[index],
            });
          }
          setUserTypePerm(arr);
        } else {
          setUserTypePerm([]);
        }
      });
  };

  return (
    <>
      <UploadFilesDigitalContent modalOpen={modal} fileId={digId} />
      <Card
        style={{
          width: "100%",
          backgroundColor: "lightgreen",
          border: ".5px solid #2B4593",
          marginTop: "3vh",
          padding: "5px",
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
                {t("text.editdigital")}
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
          <GradientDivider />
          {/* <Divider sx={{ borderColor: '#7C0902' }} /> */}
          <br />

          <Box height={10} />
          <form onSubmit={formik.handleSubmit}>
            {/* //{toaster === false ? "" : <ToastApp />} */}
            <Grid item xs={12} container spacing={2}>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.Title")}
                  value={formik.values.title}
                  onChangeText={(text: string) =>
                    handleConversionChange("title", text)
                  }
                  required={true}
                  lang={lang}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.title)}
                  </div>
                ) : null}
              </Grid>
              <Grid xs={12} sm={4} lg={4} item>
                <TranslateTextField
                  label={t("text.filecollectionname")}
                  value={formik.values.givenFileName}
                  onChangeText={(text: string) =>
                    handleConversionChange("givenFileName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={contentListOption}
                  value={
                    contentListOption.find(
                      (option: any) =>
                        option.value === formik.values.contentTypeId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("contentTypeId", newValue?.value);
                    formik.setFieldValue("contentType", newValue?.label);
                    formik.setFieldTouched("contentTypeId", true);
                    formik.setFieldTouched("contentTypeId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.typeOfContent")} />
                  )}
                />

                {formik.touched.contentTypeId && formik.errors.contentTypeId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.contentTypeId)}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={audianceListOption}
                  value={
                    audianceListOption.find(
                      (option: any) => option.value === formik.values.audienceId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("audienceId", newValue?.value);
                    formik.setFieldValue("audience", newValue?.label);
                    formik.setFieldTouched("audienceId", true);
                    formik.setFieldTouched("audienceId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.Audience")} />
                  )}
                />

                {formik.touched.audienceId && formik.errors.audienceId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.audienceId)}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={programsubOption}
                  value={
                    programsubOption.find(
                      (option: any) => option.value === formik.values.progSubjId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("progSubjId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("progSubjId", true);
                    formik.setFieldTouched("progSubjId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.classprogramsub")} />
                  )}
                />

                {formik.touched.progSubjId && formik.errors.progSubjId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.progSubjId)}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subjectOption}
                  value={
                    subjectOption.find(
                      (option: any) => option.value === formik.values.subjectId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("subjectId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("subjectId", true);
                    formik.setFieldTouched("subjectId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.sub")} />
                  )}
                />

                {formik.touched.subjectId && formik.errors.subjectId ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {String(formik.errors.subjectId)}
                  </div>
                ) : null}
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  multiple
                  id="combo-box-demo"
                  options={adminOption}
                  fullWidth
                  size="small"
                  value={adminOption.filter((opt: any) =>
                    userTypePerm.some((role: any) => role.value === opt.value)
                  )}
                  onChange={(event, newValue: any) => {
                    let result: any = [];
                    for (let i = 0; i < newValue.length; i++) {
                      result.push(newValue[i]["value"]);
                    }
                    setUserTypeData(result);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.adminuser")} />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  // multiple
                  id="combo-box-demo"
                  options={currCode}
                  value={
                    currCode.find(
                      (option: any) =>
                        option.value === formik.values.currencyCode
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("currencyCode", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("currencyCode", true);
                    formik.setFieldTouched("currencyCode", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectCurrency")} />
                  )}
                />
              </Grid>

              {showState && (
                <>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Autocomplete
                      disablePortal
                      // multiple
                      id="combo-box-demo"
                      options={memberGroup}
                      fullWidth
                      size="small"
                      onChange={(event, newValue: any) => {
                        formik.setFieldValue("memberGroupId", newValue?.value);
                        //formik.setFieldValue("zoneName", newValue?.label);
                        formik.setFieldTouched("memberGroupId", true);
                        formik.setFieldTouched("memberGroupId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("text.SelectMemberGroup")}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {showContent && (
                <>
                  <Grid item xs={12} sm={4} lg={4}>
                    <Autocomplete
                      disablePortal
                      // multiple
                      id="combo-box-demo"
                      options={contentGroup}
                      fullWidth
                      size="small"
                      onChange={(event, newValue: any) => {
                        formik.setFieldValue("groupId", newValue?.value);
                        //formik.setFieldValue("zoneName", newValue?.label);
                        formik.setFieldTouched("groupId", true);
                        formik.setFieldTouched("groupId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("text.SelectContentGroup")}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              {showApMember && (
                <>
                  <Grid lg={4} md={4} xs={12} item>
                    <TextField
                      label={
                        <CustomLabel
                          text="Aplicable Members (if any)"
                          required={false}
                        />
                      }
                      value={formik.values.appliedMembCodes}
                      name="appliedMembCodes"
                      id="appliedMembCodes"
                      placeholder="Aplicable Members (if any)"
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </>
              )}

              {showAccesion && (
                <>
                  <Grid lg={4} md={4} xs={12} item>
                    <TextField
                      label={
                        <CustomLabel
                          text="Aplicable Accession (if any)"
                          required={false}
                        />
                      }
                      value={formik.values.appliedAccnos}
                      name="appliedAccnos"
                      id="appliedAccnos"
                      placeholder="Aplicable Accession (if any)"
                      size="small"
                      fullWidth
                      style={{ backgroundColor: "white" }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={isCategory}
                  value={
                    isCategory.find(
                      (option: any) =>
                        option.value === formik.values.categoryId + ""
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    formik.setFieldValue("categoryId", newValue?.value);
                    //formik.setFieldValue("zoneName", newValue?.label);
                    formik.setFieldTouched("categoryId", true);
                    formik.setFieldTouched("categoryId", false);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectCategory")} />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="exRate"
                  name="exRate"
                  type="number"
                  label={<CustomLabel text={t("text.Rate")} required={false} />}
                  value={formik.values.exRate}
                  placeholder={t("text.Rate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid lg={4} md={4} xs={12} item>
                <TextField
                  type="date"
                  label={
                    <CustomLabel text={t("text.validupto")} required={false} />
                  }
                  value={formik.values.validTill}
                  name="validTill"
                  id="validTill"
                  placeholder={t("text.validupto")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              {/* <Grid lg={4} md={4} xs={12} item>
                <TextField
                  type="number"
                  label={
                    <CustomLabel text={t("text.AccnNo")} required={false} />
                  }
                  value={formik.values.accessionNo}
                  name="accessionNo"
                  id="accessionNo"
                  placeholder={t("text.AccnNo")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid> */}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={taxOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue);

                    formik.setFieldValue("taxId", newValue?.value);
                    // if(newValue){
                    // let cgstresult = (Number(formik.values.rate) * Number(formik.values.inQty) *( newValue?.pcent / 2)) / 100
                    // formik.setFieldValue('cgst', cgstresult);
                    // formik.setFieldValue('sgstid', newValue?.value);
                    // formik.setFieldValue('cgstid', newValue?.value);
                    // formik.setFieldValue('sgst', cgstresult);
                    // formik.setFieldValue('igst', 0);
                    // }
                  }}
                  value={
                    taxOptions.find(
                      (opt: any) => opt.value === formik.values.taxId
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectTax")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={unitOptions}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("unitId", newValue?.value);
                    formik.setFieldValue('unitname', newValue?.label);
                  }}
                  value={
                    unitOptions.find(
                      (opt: any) => opt.value === formik.values.unitId
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.enterunit")} />}
                    />
                  )}
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
                      id="forAllUsers"
                      name="forAllUsers"
                      checked={formik.values.forAllUsers === true}
                      onChange={(e) => {
                        const newValue = e.target.checked ? true : false;
                        formik.setFieldValue("forAllUsers", newValue);
                      }}
                      color="primary"
                    />
                  }
                  label="Check If Public for All"
                  labelPlacement="end"
                />
              </Grid>

              <Grid xs={12} sm={12} lg={12} item>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder={t("text.Description")}
                  name="descr"
                  id="descr"
                  style={{
                    width: "100%",
                    fontSize: " 1.075rem",
                    fontWeight: "400",
                    // lineHeight: "5",
                    padding: "8px 12px",
                    borderRadius: "4px",
                  }}
                  value={formik.values.descr}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                    {fieldValue == "" ? (
                      <img
                        src={thumbnail}
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
                    {modalImg == "" ? (
                      <img
                        src={thumbnail}
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
              <Divider sx={{ borderWidth: "1px", borderColor: "black" }} />
              <br />

              {/* <Grid xs={12} sm={12} lg={12} item>
                <Button 
                style={{color:'#007185',fontWeight:'700', backgroundColor:"lightcyan"}} 
                onClick={()=>setShowFiles(!showFiles)}
                >
                  Show Files
                </Button>
                
              </Grid> */}
              <Grid xs={12} sm={12} lg={12} item>
                <Button
                  style={{
                    color: "#007185",
                    fontWeight: "700",
                    backgroundColor: "lightcyan",
                  }}
                  onClick={() => setShowFiles(!showFiles)}
                >
                  {showFiles ? "Hide Files" : "Show Files"}
                </Button>
              </Grid>

              {showFiles && (
                <Grid container spacing={2} sx={{ p: 2 }}>
                  <Grid item xs={12} lg={12} sx={{ my: 1 }}>
                    <Button
                      style={{
                        color: "brown",
                        cursor: "pointer",
                        fontWeight: "700",
                        background:
                          "linear-gradient(to right, lightgoldenrodyellow, lightcyan)", // Gradient background
                        border: "1px solid #007185",
                      }}
                      onClick={() => setAddFiles(!addFiles)}
                      fullWidth
                    >
                      Upload Files
                    </Button>
                  </Grid>
                  {addFiles && (
                    <>
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
                              getLocalDisplayUI(
                                filetypetable,
                                pdfView,
                                fileexten
                              )
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
                          {pdfView ? (
                            getLocalDisplayUI(filetypetable, pdfView, fileexten)
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
                    </>
                  )}

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
                                    {formatEstimatedTime(
                                      Math.ceil(estimatedTime)
                                    )}
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
                          <tr
                            key={row.id}
                            style={{ border: "1px solid black" }}
                          >
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                textAlign: "center",
                                width: "10%",
                                maxWidth: "20%",
                              }}
                            >
                              {" "}
                              <DeleteIcon
                                style={{
                                  fontSize: "20px",
                                  color: "darkred",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeExtraRow(row)}
                              />{" "}
                            </td>
                            <td
                              style={{
                                borderLeft: "1px solid black",
                                borderTop: "1px solid black",
                                width: "40%",
                                maxWidth: "50%",
                                padding: "2px",
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Modal open={Shows} onClose={handlePanClose1}>
                      <Box sx={style}>
                        {selectedRow && selectedRow.pdfView === "" ? (
                          <img
                            src={nopdf}
                            style={{ width: "170vh", height: "75vh" }}
                          />
                        ) : (
                          previewDisplayUI(
                            selectedRow?.filetype,
                            selectedRow?.pdfView,
                            selectedRow?.extension
                          )
                        )}
                      </Box>
                    </Modal>
                  </Grid>
                </Grid>
              )}

              {/****************Save And Reset Button Start**************** */}
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
                  >
                    {t("text.update")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
              {/****************Save And Reset Button End**************** */}
            </Grid>
          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
