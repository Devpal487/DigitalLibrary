import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import Autocomplete from "@mui/material/Autocomplete";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getinstId, getMenuData } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";

type Props = {};

const UserInstituteMapping = (props: Props) => {
    const { t } = useTranslation();
    const [user, setUser] = useState<any>([]);
    const [userDetails, setUserDetails] = useState<any>([]);
    const [stateData, setStateData] = useState<any>([]);
    const [divisionData, setDivisionData] = useState<any>([]);
    const [districtData, setDistrictData] = useState<any>([]);
    const [blockData, setBlockData] = useState<any>([]);
    const [userTypeNameData, setUserTypeNameData] = useState<any>([]);
    const [userMappedData, setUserMappedData] = useState<any>(0);

    useEffect(() => {
        getusertypeData();
        getStateData();
        getLibraryData();
    }, []);

    const getLibraryData = async () => {
        const response = await api.get(`api/Basic/Getuserdetails`);
        //console.log("Basic/Getuserdetails", response.data.data)
        let result = response?.data?.data;
        const arr = result?.map((item: any) => ({
            label: item?.memberid,
            value: item?.id,
            instId: item?.instId,
            userid: item?.userid,
        }));
        setUser([{ value: "-1", label: t("text.selectUser") }, ...arr]);
    };

    const getStateData = async () => {
        const collectData = {
            stateId: -1,
            countryId: 0,
        };
        const response = await api.post(
            `api/StateMaster/GetStateMaster`,
            collectData
        );
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.stateName + " -- " + item?.stateCode,
            value: item?.stateId,
        }));
        setStateData([{ value: "-1", label: t("text.selectStete") }, ...arr]);
    };

    const getDivisonData = async (id: any) => {
        const collectData = {
            divisionId: -1,
            stateId: id,
        };
        const response = await api.post(
            `api/DivisionMaster/GetDivisionMaster`,
            collectData
        );
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.divisionName,
            value: item?.divisionId,
        }));
        setDivisionData([{ value: "-1", label: t("text.selectDivision") }, ...arr]);
    };

    const getDistrictData = async (id1: any, id2: any) => {
        const collectData = {
            districtId: -1,
            stateId: id1,
            divisionId: id2,
        };
        const response = await api.post(
            `api/DistrictMaster/GetDistrictMaster`,
            collectData
        );
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.districtName + " -- " + item?.stateName,
            value: item?.districtId,
        }));
        setDistrictData([{ value: "-1", label: t("text.selectDistrict") }, ...arr]);
    };

    const getBlockData = async (id1: any, id2: any, id3: any) => {
        const collectData = {
            blockId: -1,
            stateId: id1,
            divisionId: id2,
            districtId: id3,
            instId: 0,
        };
        const response = await api.post(
            `api/BlockMaster/GetBlockMaster`,
            collectData
        );
        const arr = response?.data?.data?.map((item: any) => ({
            label:
                item?.blockName +
                "--" +
                item?.districtName +
                "--" +
                item?.divisionName +
                "--" +
                item?.stateName,
            value: item?.blockId,
        }));
        setBlockData([{ value: "-1", label: t("text.selectBlock") }, ...arr]);
    };

    const getusertypeData = async () => {
        const response = await api.get(`api/Admin2/GetMemberLibs`);
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.institutename,
            value: item?.id,
            instId: item?.instId,
            details: item,
        }));
        //console.log("arr", arr);
        setUserTypeNameData([
            { value: "-1", label: t("text.selectLibrary") },
            ...arr,
        ]);
    };

    const getUserType = async (name: any) => {
        const result = await api.get(`api/UserInstituteMapping/GetUserLibrary`, {
            params: { user: name },
        });
        const arr = result?.data?.data?.map((item: any) => ({
            label: item?.libId,
            value: item?.userid,
        }));
        //console.log("arr", arr);
        setUserDetails(arr);
        let res = arr.map(
            (x: any) =>
                userTypeNameData.find((opt: any) => opt.value === x?.label) || null
        );
        let abc = res.map((x: any) => x.value);
        formik.setFieldValue("libId", abc);
        // console.log(abc);
    };

    const [lang, setLang] = useState<Language>("en");

    const { menuId, menuName } = getMenuData();
    const instId: any = getinstId();

    const formik = useFormik({
        initialValues: {
            appId: menuId,
            appName: menuName,
            add: true,
            update: true,
            delete: true,
            read: true,
            instId: parseInt(instId),
            userid: "",
            libId: [],
            stateid: 0,
            blockid: 0,
            districtid: 0,
            divisionid: 0,
        },
        onSubmit: async (values) => {
            // console.log("Before submission formik values", values);
            const { stateid, blockid, districtid, divisionid, ...dataToSubmit } =
                values;
            try {
                const response = await api.post(`api/Admin2/SaveUserLib`, dataToSubmit);
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                    formik.resetForm();
                    window.location.reload();
                } else {
                    toast.error(response.data.mesg);
                }
            } catch (error: any) {
                toast.error(error);
            }
        },
    });

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    const handleShowDetail = async () => {
        setUserMappedData(1);
    };

    const handleReset = async () => {
        window.location.reload()
    };

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
                        <Grid item lg={2} md={2} xs={2} marginTop={2}></Grid>
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
                                {t("text.UserInstituteMapping")}
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
                            <Grid item lg={12} md={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={user}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        // console.log("newValue", newValue);
                                        if (newValue) {
                                            getUserType(newValue?.userid);
                                            formik.setFieldValue("userid", newValue?.userid);
                                        }
                                        // console.log("formik.values.libId", formik.values.libId);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectUser")}
                                                    required={false}
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
                                    options={stateData}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        // console.log("newValue", newValue);
                                        if (newValue) {
                                            getDivisonData(newValue?.value);
                                            formik.setFieldValue("stateid", newValue?.value);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectStete")}
                                                    required={false}
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
                                    options={divisionData}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        // console.log("newValue", newValue);
                                        if (newValue) {
                                            getDistrictData(formik.values.stateid, newValue?.value);
                                            formik.setFieldValue("divisionid", newValue?.value);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectDivision")}
                                                    required={false}
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
                                    options={districtData}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        // console.log("newValue", newValue);
                                        if (newValue) {
                                            getBlockData(
                                                formik.values.stateid,
                                                formik.values.divisionid,
                                                newValue?.value
                                            );
                                            formik.setFieldValue("districtid", newValue?.value);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectDistrict")}
                                                    required={false}
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
                                    options={blockData}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue: any) => {
                                        // console.log("newValue", newValue);
                                        if (newValue) {
                                            formik.setFieldValue("blockid", newValue?.value);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectBlock")}
                                                    required={false}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}></Grid>
                            <Grid item lg={4} xs={12}></Grid>
                            <Grid item lg={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="combo-box-demo"
                                    options={userTypeNameData}
                                    fullWidth
                                    size="small"
                                    value={userTypeNameData.filter((opt: any) =>
                                        formik.values.libId.some((role: any) => role === opt.value)
                                    )}
                                    onChange={(event, newValue: any) => {
                                        const existingValues = userDetails.map(
                                            (x: any) =>
                                                userTypeNameData.find(
                                                    (opt: any) => opt.value === x?.label
                                                ) || null
                                        );
                                        // console.log("existing values", existingValues);

                                        const combinedValues = [
                                            ...existingValues,
                                            ...newValue.filter(
                                                (item: any) =>
                                                    !existingValues.some(
                                                        (existingItem: any) =>
                                                            existingItem.value === item.value
                                                    )
                                            ),
                                        ];
                                        // console.log(
                                        //     "Combined values after selection:",
                                        //     combinedValues
                                        // );
                                        const newRoles = combinedValues.map((item) => item?.value);
                                        // console.log("existing values", newRoles);
                                        formik.setFieldValue("libId", newRoles);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.selectLibrary")}
                                                    required={false}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} sm={4} xs={12}>
                                <Grid>
                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item lg={4} sm={4} xs={12}>
                                <Grid>
                                    <ButtonWithLoader
                                        buttonText={"Find user details"}
                                        onClickHandler={handleShowDetail}
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item lg={4} sm={4} xs={12}>
                                <Button
                                    type="reset"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#F43F5E",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={handleReset}
                                >
                                    {t("text.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <br />
                    <br />
                    <Divider />

                    {userMappedData === 1 && (
                        <Grid item xs={12} container spacing={2} sx={{}}>
                            <TableContainer component={Paper}>
                                <Typography
                                    variant="h6"
                                    textAlign="center"
                                    component="div"
                                    sx={{ p: 2 }}
                                >
                                    Institute Library Data
                                </Typography>
                                <Table>
                                    <TableHead style={{ backgroundColor: "#f1f2f3" }}>
                                        <TableRow>
                                            <TableCell>
                                                <strong>ID</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Institute Name</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Library Name</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Address</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>City</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Institute</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userDetails.map((x: any, index: any) => {
                                            const foundItem = userTypeNameData.find(
                                                (opt: any) => opt.value === x?.label
                                            );
                                            const institute = foundItem ? foundItem?.details : null;
                                            return institute ? (
                                                <TableRow key={institute.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{institute.institutename}</TableCell>
                                                    <TableCell>{institute.libraryname}</TableCell>
                                                    <TableCell>{institute.address}</TableCell>
                                                    <TableCell>{institute.city}</TableCell>
                                                    <TableCell>{institute.institute}</TableCell>
                                                </TableRow>
                                            ) : (
                                                <TableRow key={index}>
                                                    <TableCell colSpan={6}>No Data Available</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    )}
                </CardContent>
            </div>
        </div>
    );
};

export default UserInstituteMapping;