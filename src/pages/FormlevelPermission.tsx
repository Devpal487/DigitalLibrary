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
    Checkbox, Autocomplete,
    Collapse,
    IconButton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import api from "../utils/Url";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import CustomLabel from "../utils/CustomLabel";
import { getinstId, getMenuData } from "../utils/Constant";
import { KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import ButtonWithLoader from "../utils/ButtonWithLoader";

type Props = {};

const FormlevelPermission = (props: Props) => {
    const { t } = useTranslation();
    const [userTypeNameData, setUserTypeNameData] = useState<any>([]);
    const [libraryDetails, setLibraryDetails] = useState<any>(0);
    const [menuData, setMenuData] = useState<any[]>([]);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [headerCheckboxes, setHeaderCheckboxes] = useState<any>({
        selected:false,
        readPerm: false,
        writePerm: false,
        updatePerm: false,
        deletePerm: false
    });
    const [permissionsData, setPermissionsData] = useState<any[]>([]);
    const [condition, setCondition] = useState<any>(0);


    const toggleExpand = (menuId: number) => {
        setExpandedRows((prev) =>
            prev.includes(menuId)
                ? prev.filter((id) => id !== menuId)
                : [...prev, menuId]
        );
    };

    useEffect(() => {
        getusertypeData();
        getLibraryData();

    }, []);


    const getusertypeData = async () => {

        const collectData = {
            "userTypeId": 0,
            "userTypeName": ""
        }
        const response = await api.post(`api/UserPermission/GetUserType`, collectData)
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.userTypeName,
            value: item?.userTypeId
        }));
        //console.log("arr", arr);
        setUserTypeNameData(arr);
    };

    const getMenuPermissionData = async (id: any) => {
        const collectData = {
            "appId": menuId,
            "instId": parseInt(instId),
            "userTypeId": id
        }
        const response = await api.post(`api/Admin/GetPermission`, collectData);
        const instIds = response?.data?.data?.instId;
        setCondition(1);

        if (Array.isArray(instIds) && instIds.length > 0) {
            formik.setFieldValue("instId", instIds);
        } else {
            formik.setFieldValue("instId", []);
        }

        const menus = response?.data?.data?.menus;
        

        if (menus && menus.length > 0) {
            
            const setPermissions = (menuList: any[]) => {
                const uTypePerms = response?.data?.data?.uTypePerms;
                // console.log("Menus found:", menus);
                return menuList.map(menu => {
                    menu.readPerm = menus.find((item: any) => item.menu_id == menu.menu_id && item.read == true) || 
                                    uTypePerms.find((item: any) => item.menuId == menu.menu_id && item.read == true) || null;
                    menu.writePerm = menus.find((item: any) => item.menu_id == menu.menu_id && item.write == true) || 
                                     uTypePerms.find((item: any) => item.menuId == menu.menu_id && item.write == true) || null;
                    menu.updatePerm = menus.find((item: any) => item.menu_id == menu.menu_id && item.update == true) || 
                                      uTypePerms.find((item: any) => item.menuId == menu.menu_id && item.update == true) || null;
                    menu.deletePerm = menus.find((item: any) => item.menu_id == menu.menu_id && item.delete == true) || 
                                      uTypePerms.find((item: any) => item.menuId == menu.menu_id && item.delete == true) || null;
                    menu.selected = menu.selected;
                    menu.menu_id = menu.menu_id;

                    if (menu.children && menu.children.length > 0) {
                        menu.children = setPermissions(menu.children);
                        menu.children.forEach((child: any) => {
                            if (child.children && child.children.length > 0) {
                                console.log("menu.children", child.children)
                                child.children = setPermissions(child.children); 
                            }
                        });
                    }
                    return menu;
                });
            };

            const updatedMenus = setPermissions(menus);
            setMenuData(updatedMenus);
        }
    };

    const getLibraryData = async () => {
        const response = await api.get(`api/Admin2/GetMemberLibs`);
        const arr = response?.data?.data?.map((item: any) => ({
            label: item?.institutename,
            value: item?.id,
            instId: item?.instId,
            details: item,
        }));
        setLibraryDetails([
            { value: "-1", label: t("text.selectLibrary") },
            ...arr,
        ]);
    };

    const [lang, setLang] = useState<Language>("en");

    const { menuId, menuName } = getMenuData();
    console.log("menuId, menuName", menuId, menuName);
    const instId: any = getinstId();

    const formik = useFormik({
        initialValues: {
            appId: menuId,
            appName: menuName,
            "userTypeId": 0,
            "instId": [],
            "uTypePerms": []
        },
        onSubmit: async (values) => {
            console.log("Current permissionsData:", permissionsData); 
            const uTypePerms = permissionsData.map(p => ({
                menuId: p.menuId,
                menuName: p.menuName,
                read: p.readPerm || false,
                write: p.writePerm || false,
                update: p.updatePerm || false,
                delete: p.deletePerm || false  
            })); 
            const submissionData = {
                ...values,
                uTypePerms
            };
            console.log("Submitting the value", submissionData);
            try {
                const response = await api.post(`api/Admin2/UserTypeMenuPerm`, submissionData);
                if (response.data.isSuccess) {
                    toast.success(response.data.mesg);
                    formik.resetForm();
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

    const handleReset = async () => {
        window.location.reload()
    };

    const handleCheckboxChange = (menuId: number, permission: string) => {
        setMenuData((prevMenus: any[]) => {
            const updateMenuPermissions = (menuList: any[]) => {
                return menuList.map((menu: any) => {
                    if (menu.menu_id === menuId) {
                        menu[permission] = !menu[permission];

                        setPermissionsData((prevPermissions) => {
                            const existingPermission = prevPermissions.find(p => p.menuId === menuId);
                            if (existingPermission) {
                                return prevPermissions.map(p => 
                                    p.menuId === menuId 
                                    ? { 
                                        ...p, 
                                        [permission]: menu[permission],
                                        menuName: menu.menu_name
                                      } 
                                    : p
                                );
                            } else {
                                return [
                                    ...prevPermissions,
                                    {
                                        menuId: menu.menu_id,
                                        menuName: menu.menu_name,
                                        [permission]: menu[permission]
                                    }
                                ];
                            }
                        });
                    }
                    if (menu.children && menu.children.length > 0) {
                        menu.children = updateMenuPermissions(menu.children);
                    }
                    return menu;
                });
            };

            return updateMenuPermissions(prevMenus);
        });
    };

    const updateHeaderCheckboxes = (menus: any[], permission: string) => {
        console.log('menus, permission', menus, permission);
        const allChecked = menus.every(menu => menu[permission] || (menu.children && menu.children.every((child: any) => child[permission])));
        const anyChecked = menus.some(menu => menu[permission] || (menu.children && menu.children.some((child: any) => child[permission])));
        
        setHeaderCheckboxes((prev: any) => ({
            ...prev,
            [permission]: allChecked,
            [`${permission}Indeterminate`]: !allChecked && anyChecked
        }));
    };

    const handleParentCheckboxChange = (menuId: number, permission: string) => {
        const newValue = !headerCheckboxes[permission];
        setHeaderCheckboxes((prev: any) => ({
            ...prev,
            [permission]: newValue
        }));

        setMenuData((prevMenus: any[]) => {
            const updateParentPermissions = (menuList: any[]) => {
                return menuList.map((menu: any) => {
                    if (menu.menu_id === menuId) {
                        menu[permission] = newValue;
                        if (menu.children && menu.children.length > 0) {
                            menu.children.forEach((child: any) => {
                                child[permission] = newValue;
                                if (child.children && child.children.length > 0) {
                                    child.children.forEach((subChild: any) => {
                                        subChild[permission] = newValue;
                                    });
                                }
                            });
                        }
                    }
                    if (menu.children && menu.children.length > 0) {
                        menu.children = updateParentPermissions(menu.children);
                    }
                    return menu;
                });
            };

            const updatedMenus = updateParentPermissions(prevMenus);
            updateHeaderCheckboxes(updatedMenus, permission);
            return updatedMenus;
        });
    };

    const isParentCheckboxChecked = (menu: any, permission: string) => {
        if (menu.children && menu.children.length > 0) {
            return menu.children.every((child: any) => child[permission] || (child.children && child.children.every((subChild: any) => subChild[permission])));
        }
        return menu[permission];
    };

    const renderMenuWithPermissions = (menu: any, index: any, level: number = 0) => {
        const isExpanded = expandedRows.includes(menu.menu_id);
        const isReadPermChecked = isParentCheckboxChecked(menu, 'readPerm');
        const isWritePermChecked = isParentCheckboxChecked(menu, 'writePerm');
        const isUpdatePermChecked = isParentCheckboxChecked(menu, 'updatePerm');
        const isDeletePermChecked = isParentCheckboxChecked(menu, 'deletePerm');
        const isSelectedPermChecked = menu.selected;


        return (
            <>
                <TableRow key={menu.menu_id}>
                    <TableCell
                        sx={{
                            width: menu.children ? "170px" : "150px",
                            paddingLeft: `${level * 20}px`,
                        }}
                    >

                        <Checkbox
                            checked={isSelectedPermChecked || false}
                            onChange={() => handleCheckboxChange(menu.menu_id, "selected")}
                        />
                        {menu.children && menu.children.length > 0 && (
                            <IconButton onClick={() => toggleExpand(menu.menu_id)}>
                                {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </IconButton>
                        )}
                        {level === 0 && <span>📁{" "}</span>}
                        {level === 1 && <span>📂{" "}</span>}
                        {level === 2 && <span>📄{" "}</span>}
                        {" "}{menu.menu_name}
                    </TableCell>
                    {level > 1 && (
                        <>
                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isReadPermChecked || false}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "readPerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isWritePermChecked || false}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "writePerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isUpdatePermChecked || false}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "updatePerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isDeletePermChecked || false}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "deletePerm")}
                                />
                            </TableCell>
                        </>
                    )}
                </TableRow>

                {isExpanded && menu.children && (
                    <TableRow>
                        <TableCell colSpan={5} style={{ padding: 0 }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Table size="small">
                                    <TableBody>
                                        {menu.children.map((child: any) =>
                                            renderMenuWithPermissions(child, index + 1, level + 1)
                                        )}
                                    </TableBody>
                                </Table>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                )}
            </>
        );
    };

    const handleUserTypeChange = async (newValue: any) => {
        console.log("newValue", newValue);
        if (newValue) {
            await getMenuPermissionData(newValue?.value);
            formik.setFieldValue("userTypeId", newValue?.value?.toString());
        }
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
                                {t("text.FormlevelPermission")}
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
                            <Grid item lg={12} md={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={userTypeNameData}
                                    fullWidth
                                    size="small"
                                    value={userTypeNameData.find((opt: any) => opt.value == formik.values.userTypeId) || null}
                                    onChange={(event, newValue: any) => handleUserTypeChange(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectUserType")}
                                                    required={false}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="combo-box-demo"
                                    options={Array.isArray(libraryDetails) ? libraryDetails : []}
                                    fullWidth
                                    size="small"
                                    value={Array.isArray(libraryDetails) ? libraryDetails.filter((opt: any) =>
                                        Array.isArray(formik.values.instId) && formik.values.instId.some((role: any) => role === opt.value)
                                    ) : []}
                                    onChange={(event, newValue: any) => {
                                        console.log("existing values", newValue);
                                        if (newValue) {
                                            const selectedLibraryIds = newValue.map((item: any) => item.value);
                                            console.log("Selected library IDs:", selectedLibraryIds);
                                            formik.setFieldValue("instId", selectedLibraryIds);
                                        }
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

                            {condition === 1 && <Grid item md={12} xs={12} lg={12}>
                                <TableContainer component={Paper} >
                                    <Typography
                                        variant="h6"
                                        textAlign="center"
                                        component="div"
                                        style={{ backgroundColor: "#f1f2f3", padding:"5px" }}
                                    >
                                        Menu Permission Details
                                    </Typography>
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead style={{ backgroundColor: "#f1f2f3" }}>
                                            <TableRow>

                                                <TableCell sx={{ width: "170px" }} align="center">
                                                    {/* <Checkbox
                                                        checked={headerCheckboxes.selected}
                                                        onChange={() => handleParentCheckboxChange(0, "selected")}
                                                    /> */}

                                                    Menu Name
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong>
                                                        {/* <Checkbox
                                                        checked={headerCheckboxes.readPerm}
                                                        onChange={() => handleParentCheckboxChange(0, "readPerm")}
                                                    />  */}
                                                    View</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong>   
                                                        {/* <Checkbox
                                                        checked={headerCheckboxes.writePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "writePerm")}
                                                    />  */}
                                                    Add</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong>
                                                        {/* <Checkbox
                                                        checked={headerCheckboxes.updatePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "updatePerm")}
                                                    />  */}
                                                    Update</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong>
                                                        {/* <Checkbox
                                                        checked={headerCheckboxes.deletePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "deletePerm")}
                                                    />  */}
                                                    Delete</strong>
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {menuData.map((menu, index) => menu.parentId==null && renderMenuWithPermissions(menu, index, 0))}
                                        </TableBody>
                                    </Table>
                                    </div>
                                </TableContainer>
                            </Grid>}

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
                                    onClick={handleReset}
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

export default FormlevelPermission;