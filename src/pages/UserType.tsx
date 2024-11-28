import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
   Box, Divider,
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
   const [item, setItem] = useState([]);
   const [columns, setColumns] = useState<any>([]);

   const { t } = useTranslation();

   const [delID, setDelID] = useState("");

   useEffect(() => {

      fetchUserData();
   }, [])



   const formik = useFormik({
      initialValues: {
         "userTypeId": null,
         "userTypeName": ""
      },
      
      validationSchema: Yup.object({
         userTypeName: Yup.string()
            .required("User Type is required")
      }),

      onSubmit: async (values: any) => {
         console.log("before submitting value check", values);
         const response = await api.post(
            `api/Admin/UserType`,
            values
         );
         if (response.data.isSuccess) {
            formik.setFieldValue("userTypeName", "");
            formik.setFieldValue("userTypeId", null);
            toast.success(response.data.mesg);
         } else {
            toast.error(response.data.mesg);
         }
         fetchUserData();
      },
   });

   const handleEdit = (row: any) => {
      //console.log(row);
      formik.setFieldValue("userTypeName", row.userTypeName);
      formik.setFieldValue("userTypeId", row.userTypeId);
   }


   let delete_id = "";
   const accept = () => {
      const collectData = {
         "appId": "",
         "appName": "",
         "add": true,
         "update": true,
         "delete": true,
         "read": true,
         "instId": 0,
         "id": delete_id
      };
      console.log("collectData " + JSON.stringify(collectData));
      api
         .post(`api/Admin/DelUserType`, collectData)
         .then((response) => {
            if (response.data.isSuccess) {
               toast.success(response.data.mesg);
            } else {
               toast.error(response.data.mesg);
            }
            fetchUserData();
         });
   };

   const reject = () => {
      toast.warn("Rejected: You have rejected", { autoClose: 3000 });
   };

   const handledeleteClick = (row: any) => {
      console.log("rowwww", row);
      delete_id = (row).toString();
      confirmDialog({
         message: "Do you want to delete this record ?",
         header: "Delete Confirmation",
         icon: "pi pi-info-circle",
         acceptClassName: "p=-button-danger",
         accept,
         reject,
      });
      fetchUserData();
   };


   const fetchUserData = async () => {
      const response = await api.get("api/Admin/getUsertype");
      console.log("userdata", response.data.data);
      const data = response.data.data;
      const arr = data.map((item: any, index: any) => ({
         id: index + 1,
         userTypeId: item.userTypeId,
         userTypeName: item.userTypeName
      }));
      setItem(arr);
      setIsLoading(false);
      if (data.length > 0) {
         const columns: GridColDef[] = [
            {
               field: "actions",
               headerClassName: "MuiDataGrid-colCell",
               headerName: t("text.Action"),
               width: 150,
               renderCell: (params) => {
                  return [
                     <Stack
                        spacing={1}
                        direction="row"
                        sx={{ alignItems: "center", marginTop: "5px" }}
                     >
                        <EditIcon
                           style={{
                              fontSize: "20px",
                              color: "blue",
                              cursor: "pointer",
                           }}
                           className="cursor-pointer"
                           onClick={() => handleEdit(params.row)}
                        />
                        <DeleteIcon
                           style={{
                              fontSize: "20px",
                              color: "red",
                              cursor: "pointer",
                           }}
                           onClick={() =>
                              handledeleteClick(params.row.userTypeId)
                           }
                        />
                     </Stack>,
                  ];
               },
            },
            {
               field: "id",
               headerName: t("text.SrNo"),
               flex: 1,
               headerClassName: "MuiDataGrid-colCell",
            },
            {
               field: "userTypeName",
               headerName: t("text.UserType"),
               flex: 3,
               headerClassName: "MuiDataGrid-colCell",
            },
         ];
         setColumns(columns as any);
      }
   }

   const adjustedColumns = columns.map((column: any) => ({
      ...column,
   }));


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
                  <ConfirmDialog />
                  <Grid item xs={12} container spacing={2} sx={{ justifyContent: "center", paddingX: "4rem" }}>
                     <Grid item xs={12} sm={12} lg={12}>
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
                        {formik.touched.userTypeName && formik.errors.userTypeName ? (
                           <div style={{ color: "red", margin: "5px" }}>
                              {t("text.UserTypereq")}
                           </div>
                        ) : null}
                     </Grid>
                     <Grid item xs={3} sm={1} lg={1}>
                        <Button variant="contained" sx={{ backgroundColor: "#3474eb" }} onClick={() => {
                           formik.submitForm();
                        }}>
                           {t("text.save")}
                        </Button>
                     </Grid>
                     <Grid item xs={3} sm={1} lg={1} >
                        <Button variant="contained" sx={{ backgroundColor: "#42afed" }} onClick={() => {
                           formik.setFieldValue("userTypeName", "");
                           formik.setFieldValue("userTypeId", 0);
                        }}>
                           {t("text.reset")}
                        </Button>
                     </Grid>
                  </Grid>

               </form>
               <DataGrids
                  isLoading={isLoading}
                  rows={item}
                  columns={adjustedColumns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialPageSize={5}
               />
            </Paper >
         </Card >
         <ToastApp />
      </>
   );
}

