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

        if (Array.isArray(instIds) && instIds.length > 0) {
            formik.setFieldValue("libId", instIds);
        } else {
            formik.setFieldValue("libId", []);
        }

        const menus = response?.data?.data?.menus;
        const uTypePerms = response?.data?.data?.uTypePerms;

        if (menus && menus.length > 0) {
            console.log("Menus found:", menus);

            const setPermissions = (menuList: any[]) => {
                return menuList.map(menu => {
                    const permission = uTypePerms.find((perm:any) => perm.menuId === menu.menu_id);
                    if (permission) {
                        menu.selected = permission.selected;
                        menu.readPerm = permission.read;
                        menu.writePerm = permission.write;
                        menu.updatePerm = permission.update;
                        menu.deletePerm = permission.delete;
                    }
                    if (menu.children) {
                        menu.children = setPermissions(menu.children);
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
        //console.log("arr", arr);
        setLibraryDetails([
            { value: "-1", label: t("text.selectLibrary") },
            ...arr,
        ]);
    };

    const [lang, setLang] = useState<Language>("en");

    const { menuId, menuName } = getMenuData();
    const instId: any = getinstId();

    const formik = useFormik({
        initialValues: {
            appId: menuId,
            appName: menuName,
            "userTypeId": 0,
            "instId": '',
            "uTypePerms": []
        },
        onSubmit: async (values: any) => {
            console.log("Current permissionsData:", permissionsData);
            values.instId = [instIDMenupermission];

            const mapMenuToPermissions = (menuList: any[], addedMenuIds: Set<number> = new Set()): { menuId: number; read: boolean; write: boolean; update: boolean; delete: boolean; selected: boolean; }[] => {
                const permissionsArray = menuList.flatMap((menu: any) => {
                    if (addedMenuIds.has(menu.menu_id)) {
                        return []; 
                    }
                    addedMenuIds.add(menu.menu_id);

                    const currentMenuPermissions = {
                        menuId: menu.menu_id,
                        mneuName: menu.menu_name,
                        read: menu.readPerm,
                        write: menu.writePerm,
                        update: menu.updatePerm,
                        delete: menu.deletePerm,
                        selected: menu.selected
                    };

                    if (menu.children && menu.children.length > 0) {
                        const childPermissions = mapMenuToPermissions(menu.children, addedMenuIds);
                        return [currentMenuPermissions, ...childPermissions]; 
                    }

                    return [currentMenuPermissions]; 
                });

                console.log("Mapped Permissions Structure:", permissionsArray);
                return permissionsArray;
            };


            // const submissionData = {
            //     ...values,
            //     uTypePerms: [...menuPermissionsData, ...permissionsData]
            // };  
            
            values.uTypePerms = mapMenuToPermissions(menuData);



            console.log("Submitting the value", values);
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

    const handleReset = async () => {
        window.location.reload()
    };

    const handleCheckboxChange = (menuId: number, permission: string) => {
        setMenuData((prevMenus: any[]) => {
            const updateMenuPermissions = (menuList: any[]) => {
                return menuList.map((menu: any) => {
                    if (menu.menu_id === menuId) {
                        menu[permission] = !menu[permission]; // Toggle the individual checkbox
                    }
                    if (menu.children && menu.children.length > 0) {
                        menu.children = updateMenuPermissions(menu.children);
                    }
                    return menu;
                });
            };

            const updatedMenus = updateMenuPermissions(prevMenus);
            updateHeaderCheckboxes(updatedMenus, permission);
            return updatedMenus;
        });
    };

    const updateHeaderCheckboxes = (menus: any[], permission: string) => {
        const allChecked = menus.every(menu => menu[permission] || (menu.children && menu.children.every((child: any) => child[permission])));
        setHeaderCheckboxes((prev: any) => ({
            ...prev,
            [permission]: allChecked
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
                        menu[permission] = newValue; // Set the parent permission
                    }
                    if (menu.children && menu.children.length > 0) {
                        menu.children = updateParentPermissions(menu.children);
                    }
                    return menu;
                });
            };

            const updatedMenus = updateParentPermissions(prevMenus);
            updateHeaderCheckboxes(updatedMenus, permission); // Update header checkboxes after changing parent
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
        const isselectedPermChecked = isParentCheckboxChecked(menu, 'selected');
        const isReadPermChecked = isParentCheckboxChecked(menu, 'readPerm');
        const isWritePermChecked = isParentCheckboxChecked(menu, 'writePerm');
        const isUpdatePermChecked = isParentCheckboxChecked(menu, 'updatePerm');
        const isDeletePermChecked = isParentCheckboxChecked(menu, 'deletePerm');

        return (
            <>
                <TableRow key={menu.menu_id}>
                    <TableCell
                        sx={{
                            width: menu.children ? "170px" : "150px",
                            paddingLeft: `${level * 20}px`,
                        }}
                    >
                        {level > 0 && (
                            <Checkbox
                                checked={isselectedPermChecked}
                                onChange={() => handleCheckboxChange(menu.menu_id, "selected")}
                            />
                        )}
                        {menu.children && (
                            <IconButton onClick={() => toggleExpand(menu.menu_id)}>
                                {isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                            </IconButton>
                        )}
                        {level === 0 && <span>📁</span>}
                        {level === 1 && <span>📂</span>}
                        {level === 2 && <span>📄</span>}
                        {menu.menu_name}
                    </TableCell>

                    {level > 0 && (
                        <>
                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isReadPermChecked}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "readPerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isWritePermChecked}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "writePerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isUpdatePermChecked}
                                    onChange={() => handleCheckboxChange(menu.menu_id, "updatePerm")}
                                />
                            </TableCell>

                            <TableCell sx={{ width: "100px" }} align="center">
                                <Checkbox
                                    checked={isDeletePermChecked}
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
                            <Grid item lg={12} md={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={userTypeNameData}
                                    fullWidth
                                    size="small"

                                    onChange={(event, newValue: any) => {
                                        console.log("newValue", newValue);
                                        if (newValue) {
                                            getMenuPermissionData(newValue?.value);
                                        }
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

                            <Grid item lg={12} md={12} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    multiple
                                    id="combo-box-demo"
                                    options={Array.isArray(libraryDetails) ? libraryDetails : []}
                                    fullWidth
                                    size="small"
                                    value={Array.isArray(libraryDetails) ? libraryDetails.filter((opt: any) =>
                                        Array.isArray(formik.values.libId) && formik.values.libId.some((role: any) => role === opt.value)
                                    ) : []}
                                    onChange={(event, newValue: any) => {

                                        console.log("existing values", newValue);

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

                            <Grid item md={12} xs={12} lg={12}>
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
                                                    <strong> <Checkbox
                                                        checked={headerCheckboxes.selected}
                                                        onChange={() => handleParentCheckboxChange(0, "selected")}
                                                    /> Menu Name</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong><Checkbox
                                                        checked={headerCheckboxes.readPerm}
                                                        onChange={() => handleParentCheckboxChange(0, "readPerm")}
                                                    /> View</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong>   <Checkbox
                                                        checked={headerCheckboxes.writePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "writePerm")}
                                                    /> Add</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong><Checkbox
                                                        checked={headerCheckboxes.updatePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "updatePerm")}
                                                    /> Update</strong>
                                                </TableCell>
                                                <TableCell sx={{ width: "100px" }} align="center">
                                                    <strong><Checkbox
                                                        checked={headerCheckboxes.deletePerm}
                                                        onChange={() => handleParentCheckboxChange(0, "deletePerm")}
                                                    /> Delete</strong>
                                                </TableCell>

                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {menuData.map((menu, index) => renderMenuWithPermissions(menu, index, 0))}
                                        </TableBody>
                                    </Table>
                                    </div>
                                </TableContainer>
                            </Grid>

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