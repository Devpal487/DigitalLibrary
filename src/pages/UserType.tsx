import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
   Box,   Divider,
   Stack,
   Grid,
   Typography,
   Input,
   TextField,
   backdropClasses,
   Button,
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
import Autocomplete from '@mui/material/Autocomplete';
import { use } from "i18next";

interface MenuPermission {
   isAdd: boolean;
   isEdit: boolean;
   isPrint: boolean;
   isDel: boolean;
}

export default function UserType() {
   const [isLoading, setIsLoading] = useState(true);
   const location = useLocation();
   const [lang, setLang] = useState<Language>("en");
   const [permissionData, setPermissionData] = useState<MenuPermission>({
      isAdd: false,
      isEdit: false,
      isPrint: false,
      isDel: false,
   });

   const [isEdit, setisEdit] = useState(false);

   const { t } = useTranslation();

   const [userTypeOption, setUserTypeOption] = useState([
      { value: -1, label: t("text.UserType") },
   ]);

   useEffect(() => {
      getUserTypeData();
   }, [])

   const getUserTypeData = () => {
      api.get(`api/Admin/getUsertype`).then((res) => {
         const arr = res.data.data.map((item: any) => ({
            label: item.userTypeName,
            value: item.userTypeId,
         }));
         setUserTypeOption(arr);
      });
   };

   const formik = useFormik({
      initialValues: {
         "userTypeId": null,
         "userTypeName": ""
      },

      onSubmit: async (values: any) => {
         console.log("before submitting value check", values);
         const response = await api.post(
            `api/Admin/UserType`,
            values
         );
         if (response.data.isSuccess) {
            toast.success(response.data.mesg);
         } else {
            toast.error(response.data.mesg);
         }
      },
   });


   const handleDelete = () => {
      const collectData = {
         "appId": "",
         "appName": "",
         "add": true,
         "update": true,
         "delete": true,
         "read": true,
         "instId": 0,
         //id: (formik.values.userTypeId).toString()
      }
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`api/Admin/DelUserType`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.mesg);
            } else {
               toast.success(response.data.mesg);
            }
         });
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


               <Grid item xs={12} container spacing={1}>
                  <Grid item lg={10} md={10} xs={12}>
                     <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ padding: "20px" }}
                        align="left"
                     >
                        {t("text.UserType")}
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
                  <Grid item xs={12} container spacing={2} sx={{ justifyContent: "center" }}>
                     <Grid item xs={12} sm={10} lg={10}>
                        <TextField
                           label={<CustomLabel text={t("text.UserType")} required />}
                           name="userTypeName"
                           id="userTypeName"
                           value={formik.values.userTypeName}
                           onChange={(event: any) => {
                              const newValue = event.target.value;
                              formik.setFieldValue("userTypeName", newValue);
                           }}
                           placeholder={t("text.UserType")}
                           size="small"
                           fullWidth
                           style={{ backgroundColor: "white" }}
                        />

                     </Grid>
                     <Grid item xs={6} sm={4} lg={4}>
                        <Button variant="contained" sx={{ backgroundColor: "#3474eb" }} onClick={() => {
                           formik.submitForm();
                        }}>
                           {t("text.save")}
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: "#42afed" }} onClick={() => {
                           formik.setFieldValue("userTypeName", "");
                           formik.setFieldValue("userTypeId", 0);
                        }}>
                           {t("text.reset")}
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: "#f5405e" }} onClick={handleDelete}>
                           {t("text.delete")}
                        </Button>
                     </Grid>
                  </Grid>
                  <Divider sx={{ marginTop: "2rem" }} />
                  <div style={{ marginTop: "3rem", width: "50%" }}>
                     {userTypeOption.map((item: any) => (
                        <a style={{ fontSize: "1.1rem", color: "blueviolet", fontStyle: "underline", margin: ".5rem", padding: ".5rem", cursor: "pointer" }} onClick={() => {
                           formik.setFieldValue("userTypeName", item.label);
                           formik.setFieldValue("userTypeId", item.value);
                        }}>{item.label}</a>
                     ))}

                     </div>
               </form>
            </Paper>
         </Card>
         <ToastApp />
      </>
   );
}