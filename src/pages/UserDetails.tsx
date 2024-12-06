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
  Checkbox,
  CardContent,
  FormControlLabel,
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
import { FormikConsumer, useFormik } from "formik";
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
import Autocomplete from "@mui/material/Autocomplete";
import { use } from "i18next";
import { display } from "html2canvas/dist/types/css/property-descriptors/display";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [lang, setLang] = useState<Language>("en");
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  const { t } = useTranslation();

  const [memberID, setMemberID] = useState("");
  // const [instID, setInstID] = useState("");
  const [cardMemberWithNoId, setCardMemberWithNoId] = useState<string | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

  const [isVisible1, setIsVisible1] = useState(false);

  const [memberData, setMemberData] = useState([
    {
      memberName: "",
      memberDepartment: "",
      memberGroup: "",
      memberProgram: "",
      memberValidity: "",
      memberID: "",
      memberType: "",
      memberStatus: "",
    },
  ]);

  const [userTypeOption, setUserTypeOption] = useState([
    { value: -1, label: t("text.UserType") },
  ]);

  const [libraryOption, setLibraryOption] = useState([
    { value: -1, label: t("text.SelectLibrary") },
  ]);

  const [userWithNoMemberID, setUserWithNoMemberID] = useState([
    { value: -1, label: t("user") },
  ]);

  const { menuId, menuName } = getMenuData();
  const instId: any = getinstId();

  useEffect(() => {
    getUserTypeData();
    getLibraryList();
    // getUserWithNoMemberID();
  }, []);

  const getUserTypeData = () => {
    api.get(`api/Admin/getUsertype`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.userTypeName,
        value: item.userTypeId,
      }));
      setUserTypeOption(arr);
    });
  };

  const getLibraryList = async () => {
    const collectData = {
      id: -1,
      name: "",
      all: true,
    };
    const response = await api.post(
      `api/Admin2/GetLibrarySetupLimitMod`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["institutename"],
        value: data[index]["instId"],
      });
    }
    setLibraryOption(arr);
  };

  const getUserWithNoMemberID = () => {
    api.get(`api/Admin2/GetUserWithNoMemberMod`).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        value: item.id,
        label: item.userId,
      }));
      setUserWithNoMemberID(arr);
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMemberID(event.target.value);

    formik.setFieldValue("userid", event.target.value);
  };

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisible(event.target.checked);

    if (event.target.checked) {
      getUserWithNoMemberID();
    }
    formik.setFieldValue("userid", event.target.value);
  };

  function formatDate(dateString: string) {
    const timestamp = Date.parse(dateString);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("checked", event.target);
    const value = event.target.name;
    setCardMemberWithNoId((prev: any) => (prev === value ? null : value)); // Deselect if clicked again
  };

  const handleFind = async () => {
    const collectData = {
      userCode: memberID,
      userId: "",
      userName: "",
      className: "",
      programId: 0,
      deptCode: 0,
      canRequest: true,
      instId: parseInt(instId),
    };
    const response = await api.post(
      `api/CircUser/getCircUserByAllLib`,
      collectData
    );
    const data = response.data.data;
    let arr: any = [];
    for (let i = 0; i < data.length; i++) {
      arr.push({
        memberName: data[i].userData.membName,
        memberDepartment: data[i].userData.departmentname,
        memberGroup: data[i].userData.memberGroup,
        memberProgram: data[i].userData.program_name,
        memberValidity: formatDate(data[i].userData.validupto),
        memberID: data[i].userData.userid,
        memberType: data[i].userData.userType,
        memberStatus: data[i].userData.status,
      });
      console.log("arr", arr);
      setMemberData(arr);

      setIsVisible1(true);
    }
  };
  // console.log("data", memberData);

  const formik = useFormik({
    initialValues: {
      appId: menuId,
      appName: menuName,
      add: true,
      update: true,
      delete: true,
      read: true,
      instId: parseInt(instId),
      id: 0,
      usertype: 0,
      userid: "",
      userTypeName: "",
      password: "",
      memberid: "",
      saltVc: "",
      status: "",
      logStatus: "",
      status1: "",
      validUpTo: "",
      ipAddress: "",
      libId: 0,
    },

    onSubmit: async (values: any) => {
      values.memberid = memberID;
      values.validUpTo = memberData[0].memberValidity;
      console.log("before submitting value check", values);
      const response = await api.post(`api/Admin/CreateUser`, values);
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        formik.resetForm();
        formik.setFieldValue("usertype", "");

        formik.setFieldValue("libId", "");

        setMemberID("");

        setMemberData([
          {
            memberName: "",
            memberDepartment: "",
            memberGroup: "",
            memberProgram: "",
            memberValidity: "",
            memberID: "",
            memberType: "",
            memberStatus: "",
          },
        ]);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

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
                {t("text.UserDetails")}
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
              <Grid item xs={12} sm={5} lg={5}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={libraryOption}
                  value={
                    libraryOption.find(
                      (Opt: any) => Opt.value === formik.values.libId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    //setInstID(newValue?.value);
                    formik.setFieldValue("libId", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("text.SelectLibrary")} />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={5} lg={5}>
                <TextField
                  label={
                    <CustomLabel text={t("text.MemberID")} required={false} />
                  }
                  value={memberID}
                  onChange={handleChange}
                  name="userCode"
                  id="userCode"
                  placeholder={t("text.MemberID")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                />
              </Grid>
              <Grid item xs={6} sm={2} lg={2}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#3474eb" }}
                  fullWidth
                  onClick={() => {
                    handleFind();
                  }}
                >
                  {t("text.find")}
                </Button>
              </Grid>

              {isVisible1 && (
                <>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                      {t("text.Name")}: {""}{" "}
                      <span
                        style={{
                          fontSize: "1.15rem",
                          color: "blueviolet",
                          fontWeight: "bold",
                        }}
                      >
                        {memberData[0]?.memberName}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                      {t("text.Department")}: {""}{" "}
                      <span
                        style={{
                          fontSize: "1.15rem",
                          color: "blueviolet",
                          fontWeight: "bold",
                        }}
                      >
                        {memberData[0]?.memberDepartment}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                      {t("text.MemberGroup")}:{""}{" "}
                      <span
                        style={{
                          fontSize: "1.15rem",
                          color: "blueviolet",
                          fontWeight: "bold",
                        }}
                      >
                        {memberData[0]?.memberGroup}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                      {t("text.ValidUpto")}:{""}{" "}
                      <span
                        style={{
                          fontSize: "1.15rem",
                          color: "blueviolet",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        {memberData[0]?.memberValidity}
                      </span>
                    </Typography>
                  </Grid>

                  {/* <Grid item xs={12} sm={6} lg={6}>
                <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                  {t("text.UserType")}:{""}{" "}
                  <span
                    style={{
                      fontSize: "1.15rem",
                      color: "blueviolet",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {memberData[0].memberType}
                  </span>
                </Typography>
              </Grid> */}

                  {/* <Grid item xs={12} sm={6} lg={6}>
                <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                  {t("text.ProgramCourse")}:{""}{" "}
                  <span
                    style={{
                      fontSize: "1.15rem",
                      color: "blueviolet",
                      fontWeight: "bold",
                    }}
                  >
                    {memberData[0].memberProgram}
                  </span>
                </Typography>
              </Grid> */}

                  <Grid item xs={12} sm={6} lg={6}>
                    <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                      {t("text.LoginId")}:{""}{" "}
                      <span
                        style={{
                          fontSize: "1.15rem",
                          color: "blueviolet",
                          fontWeight: "bold",
                        }}
                      >
                        {memberData[0]?.memberID}
                      </span>
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <Typography sx={{ fontSize: "1.1rem", padding: ".3rem" }}>
                  {t("text.Status")}:{""}{" "}
                  <span
                    style={{
                      fontSize: "1.15rem",
                      color: "blueviolet",
                      fontWeight: "bold",
                    }}
                  >
                    {memberData[0].memberStatus}
                  </span>
                </Typography> */}
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={4} lg={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={userTypeOption}
                  fullWidth
                  size="small"
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  value={
                    userTypeOption.find(
                      (opt: any) => opt.value === formik.values.usertype
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);
                    formik.setFieldValue("usertype", newValue?.value);
                    formik.setFieldValue("userTypeName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("text.UserType")}
                      id="usertype"
                      name="usertype"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.LoginId")} required />}
                  name="userid"
                  id="userid"
                  placeholder={t("text.LoginId")}
                  // value={formik.values.userid}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(event: any) => {
                    const newValue = event.target.value;
                    formik.setFieldValue("userid", newValue);
                    //console.log("data appId", newValue);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.Password")} required />}
                  value={formik.values.password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder={t("text.Password")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel text={t("text.ConfirmPassword")} required />
                  }
                  //value={formik.values.password}
                  type="password"
                  name="c_password"
                  id="c_password"
                  placeholder={t("text.ConfirmPassword")}
                  // value={formik.values.password}
                  onChange={formik.handleChange}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onBlur={(event: any) => {
                    let newValue = event.target.value;
                    if (newValue != formik.values.password) {
                      toast.error(
                        "Password and confirm password should be same"
                      );
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8} lg={8}></Grid>

              <Grid item xs={12} sm={12} lg={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography
                    sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    color="initial"
                  >
                    {t("text.FindUserWithNoUserID")}
                    <Checkbox
                      //checked={checked}
                      onChange={handleChecked}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    {t("text.FindUsers")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      marginRight: "30rem",
                      marginTop: ".5rem",
                      color: "blueviolet",
                    }}
                    color="initial"
                  >
                    {cardMemberWithNoId}
                  </Typography>
                </div>
                <div
                  style={{
                    display: isVisible ? "flex" : "none",
                    gap: "16px",
                    flexWrap: "wrap",
                    height: "20rem",
                    overflowY: "scroll",
                    border: "1px solid blue",
                    justifyContent: "center",
                  }}
                >
                  {userWithNoMemberID.map((item) => (
                    <Card key={item.value} style={{ width: "16rem" }}>
                      <CardContent>
                        <Typography sx={{ fontSize: "1.1rem" }}>
                          {item.label}
                        </Typography>
                        <FormControlLabel
                          key={item.value}
                          control={
                            <Checkbox
                              checked={cardMemberWithNoId === item.label}
                              onChange={handleCheckboxChange}
                              name={item.label}
                            />
                          }
                          label={item.label}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Grid>

              <Grid item xs={6} sm={6} lg={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#3474eb" }}
                  fullWidth
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                >
                  {t("text.CreateLogin")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={6} lg={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#F43F5E" }}
                  fullWidth
                >
                  {t("text.reset")}
                </Button>
              </Grid>
              {/* <Grid item xs={6} sm={3} lg={3}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#3474eb" }}
                  fullWidth
                >
                  {t("text.ChangePassword")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={2} lg={2}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#3474eb" }}
                  fullWidth
                >
                  {t("text.ChangeStatus")}
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} lg={3}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#3474eb" }}
                  fullWidth
                >
                  {t("text.ChangeUsertype")}
                </Button>
              </Grid> */}
            </Grid>
          </form>
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
