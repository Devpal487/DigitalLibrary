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

// Define the type for userTypeMemberOptions
interface UserTypeMemberOption {
  label: string;
  value: number; // or string, depending on your API response
}

export default function AssignUserTypeToMember() {
  const { t } = useTranslation();
  const location = useLocation();
  const {menuId, menuName} = getMenuData();
  const [lang, setLang] = useState<Language>("en");
  const [userTypeMemberOptions, setUserTypeMemberOptions] = useState<UserTypeMemberOption[]>([]);
  const [userTypeOption, setUserTypeOption] = useState([
    { value: -1, label: t("text.UserType") },
  ]);
  const [memberCode, setMemberCode] = useState<any>("")
  const [userType, setUserType] = useState<any>([])

  useEffect(() => {
    getUserTypeData();
  }, []);

  const getCircUserSmall = (value: any) => {
    api.get(`api/CircUser/CircUserSmall?userId=${value}`)
      .then((res) => {
        if(res?.data?.isSuccess){
        const userData = res.data.data;
        const arr = {
          label: `${userData.userid} -- ${userData.name} (${userData.program})`,
          value: userData.userid,
        };
        console.log("CircUser", arr);
        setUserTypeMemberOptions([arr]);
      }else{
        toast.error(res.data.mesg)
      }
      })
      .catch((error) => {
      });
  };
  
  const getUserTypeMember = (value: any) => {
    api.get(`api/Admin/GetUserTypeMemb?UserCode=${value}`)
      .then((res) => {
        const arr = res.data.data.map((item: any) => item.userTypeID);
        console.log("userTypeID", arr)
        setUserType(arr)
      })
      .catch((error) => {
        console.error("Error fetching user type members:", error);
      });
  };

  const getUserTypeData = () => {
    api.get(`api/Admin/getUsertype`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.userTypeName,
        value: item.userTypeId,
      }));
      setUserTypeOption(arr);
    });
  };

  const initialValues = {
    appName: menuName,
    userTypeIds: [],
    userCode: ''
  };

  const AssignUserTypeMemberformik = useFormik({
    initialValues: initialValues,

    onSubmit: async (values: any) => {
      values.userTypeIds = userType
      values.userCode = memberCode

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

  const RevokeUserTypeMemberformik = useFormik({
    initialValues: initialValues,

    onSubmit: async (values: any) => {
      values.userTypeIds = userType
      values.userCode = memberCode
      console.log("before revoking value check", values);
      const response = await api.post(
        `api/Admin/RevokeUserTypeMemb`,
        values
      );
      if (response.data.isSuccess) {
        toast.success("Successfully Revoked");
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

  const handleSubmitWrapper = async () => {
    AssignUserTypeMemberformik.handleSubmit();
  };

  const handleRevokeWrapper = async () => {
    RevokeUserTypeMemberformik.handleSubmit();
  };

  const handleReset = () => {
    console.log("hi");
    setMemberCode("");
    setUserType([]);
    setUserTypeMemberOptions([{ value: -1, label: t("text.MemberCode") }]);
    AssignUserTypeMemberformik.resetForm();
    RevokeUserTypeMemberformik.resetForm();
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
            overflow: "hidden"
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
          <form >
            <Grid item xs={12} container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item xs={12} sm={6} lg={6}>
                <Autocomplete
                  // disablePortal
                  id="combo-box-demo"
                  options={userTypeMemberOptions}
                  fullWidth
                  size="small"
                  onChange={(event: any, newValue: any) => {
                    console.log(newValue?.value);
                    setMemberCode(newValue?.value || "");
                    // setUserType([newValue?.userTypeId])
                    if(newValue){
                      getUserTypeMember(newValue?.value)
                    }
                  }}
                  onInputChange={(event: any, newValue: string) => {
                    if (event && event?.target && event?.target?.value?.length >= 4) {
                      getCircUserSmall(event?.target?.value);
                    }
                  }}
                  value={userTypeMemberOptions.find(option => option.value === memberCode) || null}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.FindMember")}
                          required={false}
                        />
                      }
                      value={memberCode}
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
                    setUserType(result);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={(
                        <CustomLabel
                          text={t("text.UserType")}
                          required={false}
                        />
                      )}
                    />
                  )}
                  value={userTypeOption.filter(option => userType.includes(option.value))}
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
                <Button variant="contained" sx={{ backgroundColor: "#42afed" }} fullWidth onClick={handleRevokeWrapper}>
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

