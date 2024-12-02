import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
// import api from "../../../utils/Url";
import api from "../utils/Url";
import Card from "@mui/material/Card";
import {
    Box,
    Divider,
    Stack,
    Grid,
    Typography,
    Input,
    Autocomplete,
    TextField,
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
import { getId } from "../utils/Constant";
import ButtonWithLoader from "../utils/ButtonWithLoader";
import CustomLabel from "../utils/CustomLabel";
import Languages from "../utils/Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../utils/TranslateTextField";
// import CustomDataGrids from "../../../utils/CustomDataGrids";
// import CustomDataGrid from "../../../utils/CustomDatagrid";
import dayjs from "dayjs";
import CustomDataGrid from "../utils/CustomDatagrid";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}

export default function Stockledger() {
    const { t } = useTranslation();
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
    const [taxOptions, setTaxOptions] = useState<any>([
        { value: "-1", label: t("text.SelectTaxId"), pcent:0 },
    ]);
    const [unitOptions, setUnitOptions] = useState([
        { value: "-1", label: t("text.SelectUnitId") },
    ]);
    const [contentOptions, setContentOptions] = useState([
        { value: "-1", label: t("text.SelectContentId") },
    ]);


    useEffect(() => {
        GetDigitalContentData();
        GetTaxData();
        GetUnitData()
        fetchStockData();
    }, []);


    const GetTaxData = async () => {
        const collectData = {
            taxId: -1,
        };
        const response = await api.post(`api/TaxMaster/GetTaxMaster`, collectData);
        const data = response.data.data;
        const arr:any = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["taxName"],
                value: data[index]["taxId"],
                pcent:data[index]['taxPercentage']
            });
        }
        setTaxOptions(arr);
    };

    const GetUnitData = async () => {
        const collectData = {
            unitId: -1,
        };
        const response = await api.post(`api/UnitMaster/GetUnitMaster`, collectData);
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


    const GetDigitalContentData = async () => {
        const collectData = {
            title: "",
            description: "",
            fileNames: "",
            accnos: [""],
            memberCodes: [""],
            groupName: "",
        };
        const response = await api.post(`api/DigitalOperate/GetDigitalContent`, collectData);
        const data = response.data.data;
       // console.log('Item',data)
        const arr = [];
        for (let index = 0; index < data.length; index++) {
            arr.push({
                label: data[index]["title"],
                value: data[index]["id"],
                rate:data[index]["exRate"],
                unitId:data[index]["unitId"]
            });
        }
        setContentOptions(arr);
    };



    const routeChangeEdit = (row: any) => {
        console.log("🚀 ~ routeChangeEdit ~ row:", row)
        formik.setFieldValue("entryNo", row.entryNo);
        formik.setFieldValue("batchNo", row.batchNo);
        formik.setFieldValue("itemId", row.itemId);
        formik.setFieldValue("unitId", row.unitId);
        formik.setFieldValue("rate", row.rate);
        formik.setFieldValue("inQty", row.inQty);
        formik.setFieldValue("outQty", row.outQty);
        formik.setFieldValue("voucherId", row.voucherId);
        formik.setFieldValue("stockBinId", row.stockBinId);
        formik.setFieldValue("voucherType", row.voucherType);
        formik.setFieldValue("voucherDate", dayjs(row.voucherDate).format("YYYY-MM-DD"));
        formik.setFieldValue("expiryDate", dayjs(row.expiryDate).format("YYYY-MM-DD"));
        formik.setFieldValue("companyId", row.companyId);
        formik.setFieldValue("gstRate", row.gstRate);
        formik.setFieldValue("cgst", row.cgst);
        formik.setFieldValue("sgst", row.sgst);
        formik.setFieldValue("igst", row.igst);
        formik.setFieldValue("gstid", row.gstid);
        formik.setFieldValue("sgstid", row.sgstid);
        formik.setFieldValue("igstid", row.igstid);
        formik.setFieldValue("fyearId", row.fyearId);
        formik.setFieldValue("isActive", row.isActive);
        setEditId(row.id);
    };
   


    let delete_id = "";

    const accept = () => {
        api.post(`api/StockLedger/DeleteStockLedger`, {}, { headers: { EntryNo: delete_id } })
            .then((response) => {
                if (response.data.status ===1) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
                fetchStockData();
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

    const fetchStockData = async () => {
        try {

            const response = await api.post(`api/StockLedger/GetStockLedger`, {}, { headers: { EntryNo: -1 } });
            const data = response.data.data;
            console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.entryNo,
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        // headerClassName: "MuiDataGrid-colCell",
                        headerName: t("text.Action"),
                        width: 100,

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

                                </Stack>,
                            ];
                        },
                    },

                    // {
                    //     field: "entryNo",
                    //     headerName: t("entryNo"),
                    //     flex: 1,

                    // },
                    {
                        field: "voucherType",
                        headerName: t("text.vouchertype"),
                        flex: 1,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "titleName",
                        headerName: t("text.item"),
                        flex: 1,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "unitName",
                        headerName: t("text.unit"),
                        flex: .80,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "rate",
                        headerName: t("text.rate"),
                        flex: 1,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "inQty",
                        headerName: t("text.inQty"),
                        flex: .80,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    {
                        field: "outQty",
                        headerName: t("text.OutQty"),
                        flex: 1,
                        // headerClassName: "MuiDataGrid-colCell",
                    },
                    // {
                    //     field: "voucherDate",
                    //     headerName: t("text.voucherDate"),
                    //     flex: 1,
                    //     renderCell(params: any) {
                    //         // {console.log(params)}
                    //         return dayjs(params.row.voucherDate).format("DD-MM-YYYY");
                    //     },
                    //     // headerClassName: "MuiDataGrid-colCell",
                    // },
                    {
                        field: "expiryDate",
                        headerName: t("text.expiryDate"),
                        flex: 1,
                        renderCell(params: any) {
                            // {console.log(params)}
                            return dayjs(params.row.expiryDate).format("DD-MM-YYYY");
                        },
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

    const formik = useFormik({
        initialValues: {
            entryNo: 0,
            batchNo: "",
            itemId: 0,
            unitID: 0,
            rate: '',
            inQty: '',
            outQty: 0,
            voucherId: 0,
            stockBinId: 0,
            voucherType: "",
            voucherDate: new Date().toISOString().slice(0, 10),
            expiryDate: new Date().toISOString(),
            companyId: 0,
            gstRate: '',
            cgst: '',
            sgst: '',
            igst: '',
            gstid: 0,
            cgstid: 0,
            sgstid: 0,
            igstid: 0,
            fyearId: 0,
            srn: 0,
            bal: 0,
            itemName: "",
            TitleName:"",
            unitName: "",
            openning: 0,
            partyCode: "",
            createdBy: Userid,
            updatedBy: Userid,
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        },

        // validationSchema: validationSchema,
        onSubmit: async (values) => {
            const response = await api.post("api/StockLedger/AddUpdateStockLedger", values);
            if (response.data.status === 1) {
                formik.resetForm();
                fetchStockData();
                toast.success(response.data.message);
                setEditId(-1);
            } else {
                toast.error(response.data.message);
            }
        },
    });



    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    useEffect(() => {
        const selectedOption = taxOptions.find((opt:any) => opt.value === formik.values.gstid);
        console.log("🚀 ~ useEffect ~ selectedOption:", selectedOption);
        
        if (selectedOption) {
            formik.setFieldValue("gstRate", selectedOption.pcent);
            
            const cgstResult = (Number(formik.values.rate) * Number(formik.values.inQty) * (selectedOption.pcent / 2)) / 100;
            formik.setFieldValue('cgst', cgstResult);
            formik.setFieldValue('sgstid', formik.values.gstid);
            formik.setFieldValue('cgstid', formik.values.gstid);
            formik.setFieldValue('sgst', cgstResult);
            formik.setFieldValue('igst', 0);
        } else {
            console.warn("GST rate not found for gstid:", formik.values.gstid);
        }
    }, [formik.values.gstid, formik.values.rate, formik.values.inQty, taxOptions]);



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
                                {t("text.OpeningStockOfItems")}
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
                        {/* <Grid container spacing={2}> */}
                        {/* First Row */}
                        <Grid container item xs={12} spacing={2}>
                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.EntryNo")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="entryNo"
                                    id="entryNo"
                                    value={formik.values.entryNo}
                                    placeholder={t("text.EntryNo")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.batchNo")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="batchNo"
                                    id="batchNo"
                                    value={formik.values.batchNo}
                                    placeholder={t("text.batchNo")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={contentOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue:any) => { 
                                        console.log(newValue?.value);
                                        formik.setFieldValue("itemId", newValue?.value);
                                        formik.setFieldValue("itemName", newValue?.label);
                                        formik.setFieldValue("rate",newValue?.rate)
                                        formik.setFieldValue("unitID",newValue?.unitId)
                                    }}
                                    value={
                                        contentOptions.find(
                                            (opt: any) => opt.value === formik.values.itemId
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.enteritem")}
                                                />
                                            }
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
                                    onChange={(event, newValue:any) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("unitID", newValue?.value);
                                       
                                    }}
                                    value={
                                        unitOptions.find(
                                            (opt: any) => opt.value === formik.values.unitID
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.enterunit")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterrate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="rate"
                                    id="rate"
                                    value={formik.values.rate}
                                    placeholder={t("text.enterrate")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterinQty")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="inQty"
                                    id="inQty"
                                    value={formik.values.inQty}
                                    placeholder={t("text.enterinQty")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>
                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enteroutQty")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="outQty"
                                    id="outQty"
                                    value={formik.values.outQty}
                                    placeholder={t("text.enteroutQty")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}

                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={taxOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("voucherId", newValue?.value);
                                    }}
                                    value={
                                        taxOptions.find(
                                            (opt) => opt.value === formik.values.voucherId
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.entervoucherId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid> */}

                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={itemCategoryOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue) => {
                                        console.log(newValue?.value);
                                        formik.setFieldValue("stockBinId", newValue?.value);
                                    }}
                                    value={
                                        itemCategoryOptions.find(
                                            (opt) => opt.value === formik.values.stockBinId
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.stockBinId")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid> */}

                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entervoucherType")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="voucherType"
                                    id="voucherType"
                                    value={formik.values.voucherType}
                                    placeholder={t("text.entervoucherType")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entervoucherDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="voucherDate"
                                    id="voucherDate"
                                    type="date"
                                    value={formik.values.voucherDate}
                                    placeholder={t("text.entervoucherDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterexpiryDate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="expiryDate"
                                    id="expiryDate"
                                    type="date"
                                    value={formik.values.expiryDate}
                                    placeholder={t("text.enterexpiryDate")}
                                    onChange={formik.handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>




                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entergstRate")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="gstRate"
                                    id="gstRate"
                                    value={formik.values.gstRate}
                                    placeholder={t("text.entergstRate")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}
                            <Grid item xs={12} sm={4} lg={4}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={taxOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event, newValue:any) => {
                                        console.log(newValue);
                                        formik.setFieldValue("gstRate", newValue?.pcent);
                                        formik.setFieldValue("gstid", newValue?.value);
                                        if(newValue){
                                        let cgstresult = (Number(formik.values.rate) * Number(formik.values.inQty) *( newValue?.pcent / 2)) / 100
                                        formik.setFieldValue('cgst', cgstresult);
                                        formik.setFieldValue('sgstid', newValue?.value);
                                        formik.setFieldValue('cgstid', newValue?.value);
                                        formik.setFieldValue('sgst', cgstresult);
                                        formik.setFieldValue('igst', 0);
                                        }
                                    }}
                                    value={
                                        taxOptions.find(
                                            (opt: any) => opt.value === formik.values.gstid
                                        ) || null
                                    }
                                    // value={}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.entergstRate")}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entercgst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="cgst"
                                    id="cgst"
                                    value={formik.values.cgst}
                                    placeholder={t("text.entercgst")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entersgst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="sgst"
                                    id="sgst"
                                    value={formik.values.sgst}
                                    placeholder={t("text.entersgst")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterigst")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="igst"
                                    id="igst"
                                    value={formik.values.igst}
                                    placeholder={t("text.enterigst")}
                                    onChange={formik.handleChange}
                                />
                            </Grid>


                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entergstid")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="gstid"
                                    id="gstid"
                                    value={formik.values.gstid}
                                    placeholder={t("text.entergstid")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}



                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entersgstid")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="sgstid"
                                    id="sgstid"
                                    value={formik.values.sgstid}
                                    placeholder={t("text.entersgstid")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}
                            {/* <Grid item xs={12} sm={4} lg={4}>
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.enterigstid")}
                                            required={false}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="igstid"
                                    id="igstid"
                                    value={formik.values.igstid}
                                    placeholder={t("text.enterigstid")}
                                    onChange={formik.handleChange}
                                />
                            </Grid> */}



                            <Grid item xs={12} sm={4} lg={4}></Grid>

                            <Grid container item xs={4}>
                                {editId === -1 && (
                                    // {editId === -1 && permissionData?.isAdd && (
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

                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <CustomDataGrid
                            isLoading={isLoading}
                            rows={zones}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />
                    )}
                </Paper>
            </Card>
            <ToastApp />
        </>
    );
};