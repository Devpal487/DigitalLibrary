
import {
  Button,
  CardContent,
  Grid,
  Divider,
  TextField,
  Typography,
  Table,
  Select,
  MenuItem,
  Paper,
  Autocomplete,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../ToastApp";
import CustomLabel from "../utils/CustomLabel";
import api from "../utils/Url";
import { Language } from "react-transliterate";
import Languages from "../utils/Languages";
import { getISTDate } from "../utils/Constant";
import dayjs from "dayjs";

const EditPurchaseOrder = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const initialRows :any = {
    id: -1,
    purchaseid: -1,
    user_Id: 0,
    itemNameId:'',
    unit: "",
    qty: '',
    rate: '',
    amount: '',
    tax1: "",
    taxId1: "",
    tax2: "P",
    discount: '',
    discountAmount: '',
    netAmount: '',
    documentNo: "",
    documentDate: "",
    invoiceNo: "",
    supplier: "",
    orderNo: "",
    mrnNo: "",
    mrnDate: "",
    taxId3: "",
    tax3: "",
  };
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const location = useLocation();


  console.log('location',location );
  const [items, setItems] = useState<any>([{...initialRows}]);
  const [taxOption, setTaxOption] = useState([
    { value: "-1", label: t("text.tax") },
  ]);
  const [unitOptions, setUnitOptions] = useState([
    { value: "-1", label: t("text.SelectUnitId") },
  ]);
  const [contentOptions, setContentOptions] = useState([
    { value: "-1", label: t("text.SelectContentId") },
  ]);

  const [Option, setOption] = useState([
    { value: "-1", label: t("text.SelectSupplierName") },
  ]);

  const back = useNavigate();

  useEffect(() => {
    getPurchaseOrderById(location.state.id, location.state.document_No);
    GetDigitalContentData();
    getTaxData();
    GetUnitData();
    getSupliar();
  }, []);

  const getSupliar = async () => {
    const collectData = {
      supplierId: -1,
    };
    const res = await api.post(
      `api/SupplierMaster/GetSupplierMaster`,
      collectData
    );
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.name,
        value: item.supplierId,
      })) || [];

    setOption(arr);
  };

  const getTaxData = async () => {
    const res = await api.post(`api/TaxMaster/GetTaxMaster`, { taxId: -1 });
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: `${item.taxName}`,
        value: item.taxId,
      })) || [];

    setTaxOption(arr);
  };

  const GetUnitData = async () => {
    const collectData = {
      unitId: -1,
    };
    const response = await api.post(
      `api/UnitMaster/GetUnitMaster`,
      collectData
    );
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
    const response = await api.post(
      `api/DigitalOperate/GetDigitalContent`,
      collectData
    );
    const data = response.data.data;
    const arr = [];
    for (let index = 0; index < data.length; index++) {
      arr.push({
        label: data[index]["title"],
        value: data[index]["id"],
        rate: data[index]["exRate"],
        unitId: data[index]["unitId"],
        unitname: data[index]["unitname"],
        taxId: data[index]["taxId"],
        taxName: data[index]["taxName"],
      });
    }
    setContentOptions(arr);
  };

  const validateItem = (item: any) => {
    // console.log("🚀 ~ validateItem ~ item:", item);
    return (
      item.itemNameId &&
      item.unit &&
      item.qty &&
      item.rate &&
      item.amount &&
      item.tax1 &&
      item.taxId1 
    );
  };

const handleItemChange = (index: number, field: string, value: any) => {
  const updatedItems = [...items];
  let item = { ...updatedItems[index] };

  if (field === 'itemNameId') {
    const itemNameDetails = value;
    if (itemNameDetails) {
      item = {
        ...item,
        itemNameId: itemNameDetails.value || "",
        rate: itemNameDetails.rate || "",
        unit: String(itemNameDetails.unitId) || "",
        tax1: String(itemNameDetails.taxId) || "",
        taxId1: String(itemNameDetails.taxName) || "",
      };
    }
  } else if (field === 'qty' || field === 'rate') {
    item[field] = value === "" ? 0 : parseFloat(value);
    item.amount = calculateAmount(item.qty, item.rate);
    item.taxId1 = String(calculateTax(item.amount, Number(item.taxId1)));
  } else if (field === 'tax1') {
    const selectedTax = taxOption.find((tax: any) => tax.value === value?.value);
    if (selectedTax) {
      item.tax1 = String(selectedTax.value);
      item.taxId1 = String(calculateTax(item.amount, Number(selectedTax.label)));
    }
  } else if (field === 'tax2') {
    item.tax2 = value || '';
  }else if (field === 'unit') {
    item[field] = value ;
  } else if (field === 'discount') {
    item.discount = value === '' ? 0 : parseFloat(value);
    const discountAmount = calculateDiscount(item.amount, item.discount, item.tax2);
    item.discountAmount = discountAmount;
    item.netAmount = calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);
  }

  // Recalculate dependent fields
  if (field !== 'discount' && field !== 'tax2') {
    const discountAmount = calculateDiscount(item.amount, item.discount, item.tax2);
    item.discountAmount = discountAmount;
    item.netAmount = calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);
  }

  updatedItems[index] = item;
  setItems(updatedItems);

  if (validateItem(item) && index === updatedItems.length - 1) {
    handleAddItem();
  }


  console.log("🚀 ~ Updated items:", updatedItems);
};

const calculateAmount = (qty: number, rate: number) => qty * rate;

const calculateTax = (amount: number, taxRate: number) => {
  const tax = (amount * taxRate) / 100;
  return parseFloat(tax.toFixed(2));
};

const calculateDiscount = (amount: number, discount: number, type: string) => {
  if (type === 'P') { // Percentage-based discount
    return (amount * discount) / 100;
  } else if (type === 'F') { // Fixed discount
    return discount;
  }
  return 0; 
};

const calculateNetAmount = (amount: number, tax: number, discount: number) =>
  amount + tax - discount;


  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      setItems([{ ...initialRows }]);
    } else {
      const newData = items.filter((_:any, i:any) => i !== index);
      setItems(newData);
    }
    // updateTotalAmounts(tableData);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: -1,
        purchaseid: -1,
        user_Id: 0,
        itemNameId: "",
        unit: "",
        qty: '',
        rate: '',
        amount: '',
        tax1: "",
        taxId1: "",
        tax2: "P",
        discount: '',
        discountAmount: '',
        netAmount: '',
        documentNo: formik.values.document_No,
        documentDate: formik.values.doc_Date,
        invoiceNo: formik.values.p_InvoiceNo,
        supplier: formik.values.supplierName,
        orderNo: formik.values.orderNo,
        mrnNo: "",
        mrnDate: defaultValuestime,
        taxId3: "",
        tax3: "",
      },
    ]);
  };

  const totalAmount = items.reduce(
    (acc: any, item: any) => acc + item.netAmount,
    0
  );
  const getPurchaseOrderById = async (id: any, docNo:any) => {

    const collectData = {
      id: id
    };

    const result = await api.post(`api/PurchaseInvoice/GetPurchaseInvoice`, collectData);
    const transData = result?.data?.data[0]["purchaseinv"];

    let arr: any = [];
    for (let i = 0; i < transData.length; i++) {
      arr.push({
        id: transData[i]["id"],
        purchaseid: transData[i]["purchaseid"],
        user_Id: transData[i]["user_Id"],
        itemNameId: transData[i]["itemNameId"],
        unit: transData[i]["unit"],
        qty: transData[i]["qty"] - transData[i]['returnQty'],
        rate: transData[i]["rate"],
        amount: transData[i]["amount"],
        tax1: transData[i]["tax1"],
        taxId1: transData[i]["taxId1"],
        tax2: transData[i]["tax2"],
        discount: transData[i]["discount"],
        discountAmount: transData[i]["discountAmount"],
        netAmount: transData[i]["netamount"],
        documentNo: transData[i]["documentNo"],
        documentDate: transData[i]["documentDate"],
        invoiceNo: transData[i]["invoiceNo"],
        supplier: transData[i]["supplierId"],
        orderNo: transData[i]["orderNo"],
        mrnNo: transData[i]["mrnNo"],
        mrnDate: transData[i]["mrnDate"],
        taxId3: transData[i]["taxId3"],
        tax3: transData[i]["tax3"],
      });
    }
    arr.push({ ...initialRows });
    setItems(arr);
  };

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      document_No: location.state.document_No,
      p_InvoiceNo: location.state.p_InvoiceNo,
      doc_Date: dayjs(location.state.doc_Date).format("YYYY-MM-DD"),
      p_InvoiceDate: dayjs(location.state.p_InvoiceDate).format("YYYY-MM-DD"),
      supplierName: location.state.supplierName,
      supplierId:location.state.supplierId,
      orderNo: location.state.orderNo,
      tax: location.state.tax,
      freight: location.state.freight,
      amount: location.state.amount,
      acc_code: location.state.acc_code,
      others: location.state.others,
      remark: location.state.remark,
      instId: location.state.instId,
      sessionId: location.state.sessionId,
      purchaseinv: [],
    },
    validationSchema: Yup.object().shape({
      orderNo: Yup.string().required(t("Order No. required")),
      doc_Date: Yup.date().required(t("Order Date required")),
      p_InvoiceDate: Yup.date().required(t("Invoice Date required")),
      supplierName: Yup.string().required(t("text.supNameReq")),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values);
      console.log("Formik Errors:", formik.errors);
      values.amount = totalAmount

      const validItems = items.filter((item: any) => validateItem(item));


      if (validItems.length === 0) {
        alert("Please fill  data in tabel");
        return;
      }
      //console.log("🚀 ~ onSubmit: ~ validateItem(item):", validateItem(item))

      // Check if there are valid items
      // if (validItems.length === 0) {
      //     console.log("🚀 ~ onSubmit: ~ validItems:", validItems)
      //     alert("Please fill in at least one valid item.");
      //     return;
      // }

      // Map the valid items, setting values at the first index
      const updatedItems = validItems.map((item: any, index: any) => {
        const baseItem = {
          ...item,
          documentNo: values.document_No,
          documentDate: defaultValuestime,
          invoiceNo: values.p_InvoiceNo,
          supplier: values.supplierName,
          orderNo: values.orderNo,
          mrnNo: "",
          mrnDate: defaultValuestime,
          taxId3: "",
          tax3: "",
        };
        

        if (index === 0) {
          return baseItem;
        }
        return item;
      });
      values.purchaseinv = updatedItems;

      console.log("Form Submitted with values:", values);
      console.log("Updated Items:", updatedItems);

      try {
        const response = await api.post(
          `api/PurchaseInvoice/AddUpdatePurchaseInvoice`,
          values
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          navigate("/Purchaseorder");
        } else {
          setToaster(true);
          toast.error(response.data.mesg);
        }
      } catch (error) {
        setToaster(true);
        toast.error(t("error.network"));
      }
    },
  });

  return (
    <div>
      <div
        style={{
          padding: "5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
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
                {t("text.editPurchaseorder")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l: any) => (
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
            {toaster && <ToastApp />}
            <Grid item xs={12} container spacing={2}>
            <Grid item lg={4} xs={12}>
                <TextField
                  id="document_No"
                  name="document_No"
                  label={
                    <CustomLabel text={t("text.document_No")} required={false} />
                  }
                  value={formik.values.document_No}
                  placeholder={t("text.document_No")}
                  size="small"
                  fullWidth
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.p_InvoiceNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="p_InvoiceNo"
                  id="p_InvoiceNo"
                  // type="date"
                  value={formik.values.p_InvoiceNo}
                  placeholder={t("text.p_InvoiceNo")}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel text={t("text.doc_Date")} required={false} />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="doc_Date"
                  id="doc_Date"
                  type="date"
                  value={formik.values.doc_Date}
                  placeholder={t("text.doc_Date")}
                  onChange={formik.handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}

<Grid item lg={4} xs={12}>
                <TextField
                  id="p_InvoiceDate"
                  name="p_InvoiceDate"
                  label={
                    <CustomLabel
                      text={t("text.p_InvoiceDate")}
                      required={true}
                      value={formik.values.p_InvoiceDate}
                    />
                  }
                  value={formik.values.p_InvoiceDate}
                  placeholder={t("text.p_InvoiceDate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.p_InvoiceDate &&
                    Boolean(formik.errors.p_InvoiceDate)
                  }
                  helperText={
                    formik.touched.p_InvoiceDate && formik.errors.p_InvoiceDate
                  }
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Option}
                    value={
                      Option.find(
                        (option: any) => option.value === formik.values.supplierId
                      ) || null
                    }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("supplierId", newValue?.value);
                    formik.setFieldValue("supplierName", newValue?.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={
                        formik.touched.supplierName &&
                        Boolean(formik.errors.supplierName)
                      }
                      helperText={
                        formik.touched.supplierName && String(formik.errors.supplierName)
                      }
                      label={
                        <CustomLabel
                          text={t("text.SelectSupplierName")}
                          required={false}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="orderNo"
                  name="orderNo"
                  label={
                    <CustomLabel text={t("text.orderNo")} required={true} value={formik.values.orderNo}/>
                  }
                  value={formik.values.orderNo}
                  placeholder={t("text.orderNo")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.orderNo && Boolean(formik.errors.orderNo)
                  }
                  helperText={formik.touched.orderNo && String(formik.errors.orderNo)}
                />
              </Grid>

              {/* <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={taxOption}
                                     value={
                                        taxOption.find(
                                            (option: any) => option.value +"" === formik.values.tax
                                        ) || null
                                    }
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue?.value);

                                        formik.setFieldValue("tax", newValue?.value?.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label={<CustomLabel text={t("text.tax")} required={false} />} />
                                    )}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="freight"
                                    name="freight"
                                    label={<CustomLabel text={t("text.freight")} required={false} />}
                                    value={formik.values.freight}
                                    placeholder={t("text.freight")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                // error={formik.touched.freight && Boolean(formik.errors.freight)}
                                // helperText={formik.touched.freight && formik.errors.freight}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="amount"
                                    name="amount"
                                    label={<CustomLabel text={t("text.amount")} required={false} />}
                                    value={formik.values.amount}
                                    placeholder={t("text.amount")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                // error={formik.touched.amount && Boolean(formik.errors.amount)}
                                // helperText={formik.touched.amount && formik.errors.amount}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="acc_code"
                                    name="acc_code"
                                    label={<CustomLabel text={t("text.acc_code")} required={false} />}
                                    value={formik.values.acc_code}
                                    placeholder={t("text.acc_code")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                // error={formik.touched.acc_code && Boolean(formik.errors.acc_code)}
                                // helperText={formik.touched.acc_code && formik.errors.acc_code}
                                />
                            </Grid>

                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="others"
                                    name="others"
                                    label={<CustomLabel text={t("text.others")} required={false} />}
                                    value={formik.values.others}
                                    placeholder={t("text.others")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                // error={formik.touched.others && Boolean(formik.errors.others)}
                                // helperText={formik.touched.others && formik.errors.others}
                                />
                            </Grid> */}

              <Grid item lg={4} xs={12}>
                <TextField
                  id="remark"
                  name="remark"
                  label={
                    <CustomLabel text={t("text.remark")} required={false} />
                  }
                  value={formik.values.remark}
                  placeholder={t("text.remark")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  //error={formik.touched.remark && Boolean(formik.errors.remark)}
                  //helperText={formik.touched.remark && formik.errors.remark}
                />
              </Grid>

              <Grid item lg={12} md={12} xs={12} textAlign={"center"}>
                {/* <Typography variant="h6" textAlign="center">
                  {t("text.EditPurchaseorder")}
                </Typography> */}
              </Grid>

              <Grid item lg={12} md={12} xs={12}>
                {/* <TableContainer> */}
                <Table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid black",
                  }}
                >
                  <thead
                    style={{ backgroundColor: "#2B4593", color: "#f5f5f5" }}
                  >
                    <tr>
                      {/* <TableCell style={{ color: '#fff' }}>Sr. No.</TableCell> */}
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.ItemName")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.unit")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Quantity")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Rate")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Amount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Tax")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.TaxAmount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.DiscountType")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Discount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.DiscountAmount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.NetAmount")}
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any, index: any) => (
                      <tr key={item.id} style={{ border: "1px solid black" }}>
                        {/* <TableCell>{index + 1}</TableCell> */}
                        <td style={{ width: "180px", padding:"5px" }}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={contentOptions}
                            size="small"
                            value={
                              contentOptions.find(
                                (opt: any) =>
                                  opt.value == (item.itemNameId)
                              ) || null
                            }
                            onChange={(event, newValue: any) => {
                              handleItemChange(index,"itemNameId",newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("text.enteritem")}
                              />
                            )}
                          />
                        </td>
                        <td>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={unitOptions}
                            size="small"
                            value={
                              unitOptions.find(
                                (opt: any) => opt.value == item.unit
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              handleItemChange(
                                index,
                                "unit",
                                newValue?.value?.toString()
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("text.unit")}
                              />
                            )}
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "qty",
                                (e.target.value)
                              )
                            }
                            size="small"
                          />
                        </td>
                        <td>
                          <TextField
                            type="text"
                            value={item.rate}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "rate",
                                (e.target.value)
                              )
                            }
                            size="small"
                          />
                        </td>
                        <td>{item.amount ? item.amount.toFixed(2) : 0}</td>
                        <td>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={taxOption}
                            size="small"
                            value={
                              taxOption.find(
                                (opt: any) => opt.value == item.tax1
                              ) || null
                            }
                            onChange={(event, newValue: any) => {
                              handleItemChange(
                                index,
                                "tax1",
                                newValue 
                              );
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("text.SelectTax")}
                              />
                            )}
                          />
                        </td>
                        <td>{item.taxId1}</td>
                        <td>
                          <Select
                            value={item.tax2}
                            onChange={(e) =>
                              handleItemChange(index, "tax2", e.target.value)
                            }
                            size="small"
                          >
                            <MenuItem value="P">Pct(%)</MenuItem>
                            <MenuItem value="F">Fix</MenuItem>
                          </Select>
                        </td>
                        <td>
                          <TextField
                            type="text"
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "discount",
                                (e.target.value)
                              )
                            }
                            size="small"
                          />
                        </td>
                        <td>{item.discountAmount ? item.discountAmount.toFixed(2) : 0}</td>
                        <td>{item.netAmount ? item.netAmount.toFixed(2) : 0}</td>
                        <td>
                          <Button
                            onClick={() => handleRemoveItem(index)}
                            variant="text"
                            color="secondary"
                          >
                            <DeleteIcon />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#2B4593" }}>
                      <td colSpan={10} style={{ textAlign: "right" }}>
                        <strong style={{ color: "#fff" }}>
                          {t("text.totalAmount")}:
                        </strong>
                      </td>
                      <td colSpan={3}>
                        <strong style={{ color: "#fff" }}>
                        {isNaN(totalAmount) ? '0.00' : Number(totalAmount).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {/* </TableContainer> */}
              </Grid>

              <Grid item xs={12}>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: `var(--header-background)`,
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default EditPurchaseOrder;
