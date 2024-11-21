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

export default function AssignUserTypeToMember() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [userTypeData, setUserTypeData] = useState([]);
  const [memberCode,setMemberCode] = useState("0002");
  const [timerCheck, setTimerCheck] = useState<NodeJS.Timeout | null>(null);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const [isEdit, setisEdit] = useState(false);

  const { t } = useTranslation();

  const [userTypeMemberOptions, setUserTypeMemberOptions] = useState([
    { value: -1, label: t("text.MemberCode") },
  ]);
  const [userTypeOption, setUserTypeOption] = useState([
    { value: -1, label: t("text.UserType") },
  ]);

  useEffect(() => {
    getUserTypeMember("");
    getUserTypeData();
  }, []);


  const getUserTypeMember = (value:any) => {
    api.get(`api/Admin/GetUserTypeMemb?UserCode=${value}`)
      .then((res) => {
        const arr = res.data.data.map((item:any) => ({
          label: item.userCode,
          value: item.userCode,
        }));
        setUserTypeMemberOptions(arr);
      })
      .catch((error) => {
        console.error("Error fetching user type members:", error);
      });
  };

  const getUserTypeData = () => {
    api.get(`api/Admin/getUsertype`).then((res) => {
      //console.log("checkDepartment", res.data.data);
      const arr = res.data.data.map((item: any) => ({
        label: item.userTypeName,
        value: item.userTypeId,
      }));
      setUserTypeOption(arr);
    });
  };


  const formik = useFormik({
    initialValues: {
      "appName": "",
      "userTypeIds": [],
      "userCode": ""
    },

    onSubmit: async (values: any) => {
      console.log("before submitting value check", values);
        const response = await api.post(
          `api/Admin/AssignUserTypeMemb`,
          values
        );
      if (response.data.isSuccess) {
        toast.success("Successfully Assigned");
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    await formik.setFieldValue("userTypeIds", userTypeData);
    await formik.handleSubmit();
  };

  const handleReset = () => {
    getUserTypeMember(null); 
    console.log(formik.values)
    formik.setFieldValue("userCode", null); 
    formik.resetForm();
  };



  const handleRevoke = async () => {
    const collectData = {
      "appName": "",
      "userTypeIds": formik.values.userTypeIds,
       "userCode": formik.values.userCode
    }
    api
      .post(`api/Admin/RevokeUserTypeMemb`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          toast.success(res.data.mesg)
          //console.log("Revocation successful:", res.data.message);
        } else {
          toast.error(res.data.mesg)
          //console.warn("Revocation unsuccessful:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error revoking access:", error);
      });
  };

  const [isUserCode, setUserCode] = useState<any>("");
  const [member, setMember] = useState<any>([]);

  const [Program, setProgram] = useState<any>([
    { value: "-1", label: t("text.FindMember") },
  ]);

  const getMember = (usercode: any) => {
    const collectData = {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: parseInt(instId),
      userCode: usercode,
      fromDate: lastYearDate.toISOString(),
      asOn: new Date().toISOString().slice(0, 10),
    };
    api.post(`api/Transaction/MembBalanceData`, collectData).then((res) => {
      console.log("checkMemb", res?.data?.data);

      if (res?.data?.data) {
        setMember(res?.data?.data?.memSmall);
       
      }
    });
  };

  const getProgram = (term: any) => {
    //console.log("term", term);
    // api.get(`api/Admin/SuggCircUser?term=${term}`).then((res) => {
    api.get(`api/Admin/GetUserTypeMemb?UserCode=${term}`).then((res) => {
      console.log("checkMemb", res?.data);

      const arr: any = [];

      for (let index = 0; index < res?.data.length; index++) {
        arr.push({
          value: res?.data[index]["userCode"],
          label: res?.data[index]["userCode"],
        });
      }
      setProgram(arr);
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
                {t("text.AssignUserType")}
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
            <Grid item xs={12} container spacing={2} sx={{justifyContent:"center"}}>
              <Grid item xs={12} sm={6} lg={6}>
                {/* <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={userTypeMemberOptions}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    getUserTypeMember(newValue?.value);
                    setMemberCode(newValue?.value);
                    formik.setFieldValue("userCode", newValue?.value.toString());
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() != "" || value != null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getUserTypeMember(value);
                        }, 500);
                        setTimerCheck(checkResult);
                      }
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.MemberCode")} />}
                      name="userCode"
                      id="userCode"
                      placeholder={t("text.MemberCode")}
                    />
                  )}
                />
              </Grid> */}

<Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Program}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);

                    getMember(newValue?.value);

                    setUserCode(newValue?.value);
                  }}
                  onInputChange={(event: any, value: string) => {
                    if (value.trim() != "" || value != null) {
                      if (timerCheck) {
                        clearTimeout(timerCheck);
                      }

                      if (value) {
                        const checkResult = setTimeout(() => {
                          getProgram(value);
                        }, 500);
                        setTimerCheck(checkResult);
                      }
                    }
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.FindMember")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={userTypeOption}
                  getOptionLabel={(option) => option.label}
                  filterSelectedOptions
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue);
                    let result: any = [];
                    for (let i = 0; i < newValue.length; i++) {
                      result.push(newValue[i]["value"]);
                    }
                    //console.log("result", result);
                    setUserTypeData(result);
                    formik.setFieldValue("userTypeIds", result); 
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.UserType")}
                          required={false}
                        />
                      }
                      name="userTypeIds"
                      id="userTypeIds"
                    />
                  )}
                />
              </Grid>
                 
              <Grid item xs={6} sm={2} lg={2}>
                <Button variant="contained" sx={{ backgroundColor: "#3474eb" }} fullWidth onClick={handleSubmitWrapper}>
                  {t("text.save")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={2} lg={2}>
                <Button variant="contained" sx={{ backgroundColor: "#f5405e" }} fullWidth onClick={handleReset}>
                  {t("text.reset")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} lg={3}>
                <Button variant="contained" sx={{ backgroundColor: "#42afed" }} fullWidth onClick={handleRevoke}>
                  {t("text.RevokeUserType")}
                </Button>
              </Grid>
            </Grid>

          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}

