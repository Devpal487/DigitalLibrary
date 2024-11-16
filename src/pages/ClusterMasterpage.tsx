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
  Autocomplete,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId, getISTDate, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
import DataGrids from "../utils/Datagrids";
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ClusterMasterpage() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
  const [zones, setZones] = useState([]);
  const [columns, setColumns] = useState<any>([]);
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

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    // if (dataString) {
    //   const data = JSON.parse(dataString);
    //   if (data && data.length > 0) {
    //     const userPermissionData = data[0]?.userPermission;
    //     if (userPermissionData && userPermissionData.length > 0) {
    //       const menudata = userPermissionData[0]?.parentMenu;
    //       for (let index = 0; index < menudata.length; index++) {
    //         const childMenudata = menudata[index]?.childMenu;
    //         const pathrow = childMenudata.find(
    //           (x: any) => x.path === location.pathname
    //         );

    //         if (pathrow) {
    //           console.log("data", pathrow);
    //           setPermissionData(pathrow);
    //           fetchZonesData();
    //         }
    //       }
    //     }
    //   }
    // }

    fetchZonesData();
  }, []);
  const [DeptOption, setDeptOption] = useState([
    { value: "-1", label: t("text.SelectState") },
  ]);

  const [DivOption, setDivOption] = useState([
    { value: "-1", label: t("text.SelectDivision") },
  ]);

  const [DistOption, setDistOption] = useState([
    { value: "-1", label: t("text.SelectDivision") },
  ]);

  const [BlockOption, setBlockOption] = useState([
    { value: "-1", label: t("text.SelectBlock") },
  ]);

  const { menuId, menuName } = getMenuData();

  useEffect(() => {
   // getDivision();
    getDept();
    //getDistrict();
    //getBlock();
    getPageSetUp();
  }, []);

  const [showState, setShowState] = useState();

  const getPageSetUp = () => {
    api
      .get(`api/Basic/GetPageSetupData?Pageid=${menuName}.aspx`)
      .then((res) => {
        const arr: any = [];

        const setupIdToFind = 4;
        const setupItem = res.data.data.find(
          (item: any) => item.setupId === setupIdToFind
        );
        if (setupItem) {
          setShowState(setupItem.showHide);
        }
        console.log("resultSetUpPage" + JSON.stringify(res.data.data));
      });
  };

  const getDept = () => {
    const collectData = {
      stateId: -1,
      countryId: -1,
    };
    api.post(`api/StateMaster/GetStateMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["stateName"],
          value: res.data.data[index]["stateId"],
        });
      }
      setDeptOption(arr);
    });
  };

  const getDivision = (SteteId:any) => {
    const collectData = {
      divisionId: -1,
      stateId:SteteId,
    };
    api
      .post(`api/DivisionMaster/GetDivisionMaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["divisionName"],
            value: res.data.data[index]["divisionId"],
          });
        }
        setDivOption(arr);
      });
  };

  const getDistrict = (DivId:any) => {
    const collectData = {
      districtId: -1,
      stateId: -1,
      divisionId:DivId,
    };
    api
      .post(`api/DistrictMaster/GetDistrictMaster`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["districtName"],
            value: res.data.data[index]["districtId"],
          });
        }
        setDistOption(arr);
      });
  };

  const getBlock = (DistId:any) => {
    const collectData = {
      blockId: -1,
      stateId: -1,
      divisionId: -1,
      districtId:DistId,
      instId: -1,
    };
    api.post(`api/BlockMaster/GetBlockMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["blockName"],
          value: res.data.data[index]["blockId"],
        });
      }
      setBlockOption(arr);
    });
  };

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const collectData = {
      zoneID: value.id,
      zoneName: value.zoneName,
      zoneCode: value.zoneCode,
      isActive: event.target.checked,
      user_ID: Userid,
      sortOrder: value.sortOrder,
    };
    api.post(`Zone/AddUpdateZonemaster`, collectData).then((response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.mesg);
        fetchZonesData();
      } else {
        toast.error(response.data.mesg);
      }
    });
  };

  const routeChangeEdit = (row: any) => {
    console.log(row);
    formik.setFieldValue("clusterId", row.clusterId);
    formik.setFieldValue("clusterName", row.clusterName);
    formik.setFieldValue("stateId", row.stateId);
    formik.setFieldValue("divisionId", row.divisionId);
    formik.setFieldValue("districtId", row.districtId);
    formik.setFieldValue("blockId", row.blockId);
    formik.setFieldValue("createdBy", row.createdBy);
    formik.setFieldValue("updatedBy", row.updatedBy);
    formik.setFieldValue("createdOn", row.createdOn);
    formik.setFieldValue("updatedOn", row.updatedOn);
    formik.setFieldValue("stateName", row.stateName);
    formik.setFieldValue("divisionName", row.divisionName);
    formik.setFieldValue("districtName", row.districtName);
    formik.setFieldValue("blockName", row.blockName);

    setEditId(row.id);
  };

  let delete_id = "";

  const accept = () => {
    const collectData = {
      clusterId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`api/ClusterMaster/DeleteClusterMaster`, collectData)
      .then((response) => {
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
        clusterId: -1,
        stateId: -1,
        divisionId: -1,
        districtId: -1,
        blockId: -1,
      };
      const response = await api.post(
        `api/ClusterMaster/GetClusterMaster`,
        collectData
      );
      const data = response.data.data;
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.clusterId,
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
                  )}
                  {permissionData?.isDel ? ( */}
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
                  {/* ) : (
                    ""
                  )} */}
                 
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
            field: "stateName",
            headerName: t("text.StateName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "divisionName",
            headerName: t("text.DivisionName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "districtName",
            headerName: t("text.DistrictName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "blockName",
            headerName: t("text.BlockName"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
         
          {
            field: "clusterName",
            headerName: t("text.ClusterName"),
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

  const requiredFields = [""];

  const { defaultValuestime } = getISTDate();

  const formik = useFormik({
    initialValues: {
      clusterId: -1,
      clusterName: "",
      stateId: 0,
      divisionId: 0,
      districtId: 0,
      blockId: 0,
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime,
      stateName: "",
      divisionName: "",
      districtName: "",
      blockName: "",
    },

    onSubmit: async (values) => {
      values.clusterId = editId;

      console.log("before submitting value check", values);
      const response = await api.post(
        `api/ClusterMaster/AddUpdateClusterMaster`,
        values
      );
      if (response.data.isSuccess) {
        formik.setFieldValue("clusterName", "");
        formik.setFieldValue("stateId", "");
        formik.setFieldValue("divisionId", "");
        formik.setFieldValue("districtId", "");
        formik.setFieldValue("blockId", "");
        formik.setFieldValue("stateName", "");
        formik.setFieldValue("divisionName", "");
        formik.setFieldValue("districtName", "");
        formik.setFieldValue("blockName", "");

        fetchZonesData();
        toast.success(response.data.mesg);
        setEditId(-1);
      } else {
        toast.error(response.data.mesg);
      }
    },
  });

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
                {t("text.ClusterMaster")}
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
              {showState && (
                <>
                  <Grid xs={12} sm={6} lg={6} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={DeptOption}
                      value={
                        DeptOption.find(
                          (option: any) =>
                            option.value === formik.values.stateId
                        ) || null
                      }
                      fullWidth
                      size="small"
                      onChange={(event, newValue) => {
                        console.log(newValue?.value);

                        formik.setFieldValue("stateId", newValue?.value);
                        formik.setFieldValue("stateName", newValue?.label);
                        getDivision(newValue?.value);

                        formik.setFieldTouched("stateId", true);
                        formik.setFieldTouched("stateId", false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <CustomLabel
                              text={t("text.SelectState")}
                              required={false}
                            />
                          }
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid xs={12} sm={6} lg={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DivOption}
                  value={
                    DivOption.find(
                      (option: any) => option.value === formik.values.divisionId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("divisionId", newValue?.value);
                    formik.setFieldValue("divisionName", newValue?.label);
                    getDistrict(newValue?.value);

                    formik.setFieldTouched("divisionId", true);
                    formik.setFieldTouched("divisionId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDivision")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={DistOption}
                  value={
                    DistOption.find(
                      (option: any) => option.value === formik.values.districtId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("districtId", newValue?.value);
                    formik.setFieldValue("districtName", newValue?.label);
                    getBlock(newValue?.value);

                    formik.setFieldTouched("districtId", true);
                    formik.setFieldTouched("districtId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectDistrict")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={BlockOption}
                  value={
                    BlockOption.find(
                      (option: any) => option.value === formik.values.blockId
                    ) || null
                  }
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("blockId", newValue?.value);
                    formik.setFieldValue("blockName", newValue?.label);

                    formik.setFieldTouched("blockId", true);
                    formik.setFieldTouched("blockId", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectBlock")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item>
                <TranslateTextField
                  label={t("text.ClusterName")}
                  value={formik.values.clusterName}
                  onChangeText={(text: string) =>
                    handleConversionChange("clusterName", text)
                  }
                  required={true}
                  lang={lang}
                />
              </Grid>

              <Grid xs={12} sm={6} lg={6} item></Grid>

              <Grid item xs={3} sx={{ m: -1 }}>
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
