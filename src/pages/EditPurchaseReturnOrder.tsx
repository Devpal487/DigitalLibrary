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

const EditPurchaseReturnOrder = () => {
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
    discount: 0,
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
  const [items, setItems] = useState<any>([{...initialRows}]);
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const location:any = useLocation();
  const [purchaseInvoiceOption, setPurchaseInvoiceOption] = useState<any>([]);
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

  console.log("items", items);

  const back = useNavigate();

  useEffect(() => {
    getPurchaseInvoice();
    getPurchaseOrderById(location.state.id);
    GetDigitalContentData();
    getTaxData();
    GetUnitData();
    getSupliar();
    // getPurchaseInvoicebyId(location.state.id,(location.state.document_No));
    // console.log("location.state.p_InvoiceNo", location.state);
  }, []);
  
  const getPurchaseInvoice = async () => {
    const collectData = {
      id: -1,
    };
    const res = await api.post(
      `api/PurchaseInvoice/GetPurchaseInvoice`,
      collectData
    );
    const arr =
      res?.data?.data?.map((item: any) => ({
        label: item.document_No +'('+ item.supplierName + "--" + item.orderNo +')',
        value: item.id,
        document_No: item.document_No,
        orderNo: item.orderNo,
        supplierName: item.supplierName,
        supplierId: item.supplierId,
      })) || [];

      setPurchaseInvoiceOption([{ value: "-1", label: t("text.PurchaseInvoiceOption"), document_No:"" }, ...arr]);
  };
      console.log("purchaseInvoiceOption",purchaseInvoiceOption);
      console.log(purchaseInvoiceOption.find((opt:any)=> opt.document_No == location.state.document_No))

  const getPurchaseInvoicebyId = async (id:any,docNo:any) => {
    const collectData = {
      id: id,
      "isRequst": true,
  "document_No": docNo
    };
    const result = await api.post(
      `api/PurchaseInvoice/GetPurchaseInvoice`,
      collectData
    );
    const transData = Array.isArray(result?.data?.data[0]?.["purchaseinv"])
        ? result.data.data[0]["purchaseinv"]
        : [];
      console.log("TransData:", transData);

      if (transData.length === 0) {
        // Set initialRows as default if transData is empty
        setItems([{ ...initialRows }]);
        return;
      }
  
      let arr: any = [];
      for (let i = 0; i < transData.length; i++) {
        arr.push({
          id: transData[i]["id"],
          purchaseid: transData[i]["purchaseid"],
          user_Id: transData[i]["user_Id"],
          itemNameId: transData[i]["itemNameId"],
          unit: transData[i]["unit"],
          // retqty:  Number(transData[i]["qty"]),
          retqty: transData[i]["taxId3"],
          qty: 0,
          rate: transData[i]["rate"],
          amount: 0,
          tax1: "",
          taxId1:"0",
          tax2: 'P',
          discount: 0,
          discountAmount: 0,
          netAmount: 0,
          documentNo: transData[i]["documentNo"],
          documentDate: transData[i]["documentDate"],
          invoiceNo: transData[i]["invoiceNo"],
          supplier: transData[i]["supplierId"],
          orderNo: transData[i]["orderNo"],
          mrnNo: transData[i]["mrnNo"],
          mrnDate: transData[i]["mrnDate"],
          taxId3: Number(transData[i]["taxId3"]) - transData[i]['qty'],
          tax3: "",
        });
      }
      setItems(arr);
    // const arr =
    //   res?.data?.data?.map((item: any) => ({
    //     label: item.p_InvoiceNo,
    //     value: item.id,
    //   })) || [];

      //setPurchaseInvoiceOption([{ value: "-1", label: t("text.PurchaseInvoiceOption") }, ...arr]);
  };

  const initializeItemValues = () => {
    const updatedItems = items.map((item:any) => ({
        ...item,
        taxId3: parseFloat(item.qty || 0) * parseFloat(item.tax1 || 0), // Example calculation
    }));

    console.log("item value", updatedItems)
    setItems(updatedItems);
};

// On load or when items change, initialize calculated values
// useEffect(() => {
//     if (items.length > 0) {
//         initializeItemValues();
//     }
// }, [items]);

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

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      p_InvoiceNo:location.state.p_InvoiceNo || null,
      document_No: location.state.document_No || null,
      pR_InvoiceNo: location.state.pR_InvoiceNo || '',
      doc_Date: dayjs(location.state.doc_Date).format("YYYY-MM-DD"),
      pR_InvoiceDate: dayjs(location.state.pR_InvoiceDate).format("YYYY-MM-DD"),
      supplierName: location.state.supplierName || '',
      supplierId:location.state.supplierId || null,
      orderNo: location.state.orderNo || "",
      tax: location.state.tax || null,
      freight: location.state.freight || 0.00,
      amount: location.state.amount || '',
      acc_code: location.state.acc_code || '',
      others: location.state.others || '',
      remark: location.state.remark || '',
      instId: location.state.instId,
      sessionId: location.state.sessionId,
      purReturnChild: [],
    },
    validationSchema: Yup.object().shape({
      orderNo: Yup.string().required(t("Order No. required")),
      pR_InvoiceDate: Yup.date().required(t("Invoice Date required")),
      supplierName: Yup.string().required(t("Supplier Name required"))
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values);
      console.log("Formik errors", formik.errors)

      // const validItems = items.filter((item: any) => validateItem(item));
      const updatedItems = items.map((item: any, index: any) => {

        const baseItem = {
          ...item,
          documentNo: values.document_No,
          documentDate: defaultValuestime,
          invoiceNo: values.pR_InvoiceNo,
          supplier: values.supplierName,
          orderNo: values.orderNo,
          mrnNo: "",
          mrnDate: defaultValuestime,
          // taxId3: "",
          tax3: "",
        };

        if (index === 0) {
          return baseItem;
        }
        return item;
      });
      initializeItemValues();
      values.purReturnChild = updatedItems;

      console.log("Form Submitted with values:", values);
      console.log("Updated Items:", updatedItems);

      try {
        const response = await api.post(
          `api/PurchaseReturn/AddUpdatePurchaseReturn`,
          values
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          navigate("/PurchaseReturn");
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
      }else if (field === 'qty') {
        const qtyValue = value === "" ? 0 : parseFloat(value);
        item.taxId3  = String(Number(item.retqty) - qtyValue);
        // console.log("taxval", taxval);
        // = String(taxval);
        // Validation to ensure qty does not exceed retqty
        if (qtyValue > item.retqty) {
            alert(`Quantity cannot exceed the purchase quantity ${item.retqty}.`);
            return; 
        }
  
        item[field] = qtyValue;
        const selectedTax = taxOption.find((tax: any) => tax.value == item.tax1);
          if (selectedTax) {
              item.tax1 = String(selectedTax.value);
              console.log("check Value", calculateTax(item.amount, Number(selectedTax.label)))
              item.taxId1 = String(calculateTax(item.amount, Number(selectedTax.label)));
          } 


        item.amount = calculateAmount(item.qty, item.rate);
        // item.taxId1 = String(calculateTax(item.amount, Number(item.taxId1)));
    } else if (field === 'rate') {
        item[field] = value === "" ? 0 : parseFloat(value);
        item.amount = calculateAmount(item.qty, item.rate);
        item.taxId1 = String(calculateTax(item.amount, 0));
    } 
      else if (field === 'tax1') {
        const selectedTax = taxOption.find((tax: any) => tax.value === value?.value);
          if (selectedTax) {
              item.tax1 = String(selectedTax.value);
              item.taxId1 = String(calculateTax(item.amount, Number(selectedTax.label)));
          } 
  
          const discountAmount = calculateDiscount(item.amount, item.discount, item.tax2);
          item.discountAmount = discountAmount;
          item.netAmount = calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);
  
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
    
      if (field !== 'discount' && field !== 'tax2') {
        const discountAmount = calculateDiscount(item.amount, item.discount, item.tax2);
        item.discountAmount = discountAmount;
        item.netAmount = calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);
        // console.log("calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);",calculateNetAmount(item.amount, Number(item.taxId1), discountAmount))
      }
    
      updatedItems[index] = item;
      
      if (validateItem(item) && index === updatedItems.length - 1) {
        handleAddItem();
      }
      
      
      // console.log("🚀 ~ Updated items:", updatedItems);
      setItems(updatedItems);
    };

  const calculateAmount = (qty: number, rate: number) => qty * rate;
  
  const calculateTax = (amount: number, taxRate: number) => {
    const tax = (amount * taxRate) / 100;
    return parseFloat(tax.toFixed(2));
  };
  
  const calculateDiscount = (amount: number, discount: number, type: string) => {
    if (type === 'P') { 
      return (amount * discount) / 100;
    } else if (type === 'F') { 
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
          invoiceNo: formik.values.pR_InvoiceNo,
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
      (acc: number, item: any) => acc + (Number(item.netAmount) || 0),
      0
    );

    const getPurchaseOrderById = async (id: any) => {
      const collectData = {
        id: id
      };

      try {  
        const result = await api.post(`api/PurchaseReturn/GetPurchaseReturn`, collectData);
        console.log("API Response:", result);
    
        const transData = Array.isArray(result?.data?.data[0]?.["purReturnChild"])
          ? result.data.data[0]["purReturnChild"]
          : [];
        console.log("TransData:", transData);

        if (transData.length === 0) {
          setItems([{ ...initialRows }]);
          return;
        }
    
        let arr: any = [];
        for (let i = 0; i < transData.length; i++) {
          arr.push({
            id: transData[i]["id"],
            purchaseid: transData[i]["purchaseid"],
            user_Id: transData[i]["user_Id"],
            itemNameId: transData[i]["itemNameId"],
            unit: transData[i]["unit"] ,
            qty: transData[i]["qty"],
            retqty: String(Number(transData[i]["taxId3"]) - transData[i]['qty']),
            rate: transData[i]["rate"],
            amount: transData[i]["amount"],
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
          taxId3: String(Number(transData[i]["taxId3"]) - transData[i]['qty']),
            tax3: transData[i]["tax3"],
          });
        }
        setItems(arr);
        console.log("arr",arr)
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        setItems([{ ...initialRows }]);
      }
    };
    

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
                {t("text.EditPurchaseReturnorder")}
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
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={purchaseInvoiceOption}
                    fullWidth
                    size="small"
                    value={purchaseInvoiceOption.find((opt:any) => opt.document_No === formik.values.p_InvoiceNo) || null}
                    onChange={(event, newValue: any) => {
                      console.log(newValue);
                      if(newValue){
                        getPurchaseInvoicebyId(newValue?.value, newValue?.document_No );
                        formik.setFieldValue("p_InvoiceNo", newValue?.document_No);
                        formik.setFieldValue("supplierId", newValue?.supplierId);
                        formik.setFieldValue("supplierName", newValue?.supplierName);
                        formik.setFieldValue("orderNo", newValue?.orderNo);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <CustomLabel
                            text={t("text.PurchaseInvoiceOption")}
                            required={false}
                          />
                        }
                      />
                    )}
                  />
                </Grid>
              <Grid item lg={4} xs={12}>
                <TextField
                  id="document_No"
                  name="document_No"
                  label={
                    <CustomLabel text={t("text.document_NoPR")} required={true} />
                  }
                  value={formik.values.document_No}
                  placeholder={t("text.document_NoPR")}
                  size="small"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.pR_InvoiceNo")}
                      required={false}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="pR_InvoiceNo"
                  id="pR_InvoiceNo"
                  // type="date"
                  value={formik.values.pR_InvoiceNo}
                  placeholder={t("text.pR_InvoiceNo")}
                  onChange={formik.handleChange}
              />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="pR_InvoiceDate"
                  name="pR_InvoiceDate"
                  label={
                    <CustomLabel
                      text={t("text.pR_InvoiceDate")}
                      required={true}
                      value={formik.values.pR_InvoiceDate}
                    />
                  }
                  value={formik.values.pR_InvoiceDate}
                  placeholder={t("text.pR_InvoiceDate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.pR_InvoiceDate && Boolean(formik.errors.pR_InvoiceDate)
                  }
                  // helperText={formik.touched.pR_InvoiceDate && String(formik.errors.pR_InvoiceDate)}
                  helperText={
                    formik.touched.pR_InvoiceDate && typeof formik.errors.pR_InvoiceDate === "string" 
                      ? formik.errors.pR_InvoiceDate 
                      : "" // Fallback to empty string
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
                        (option: any) => option.value == formik.values.supplierId
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
                        formik.touched.supplierName && Boolean(formik.errors.supplierName)
                      }
                      // helperText={formik.touched.pR_InvoiceDate && String(formik.errors.pR_InvoiceDate)}
                      helperText={
                        formik.touched.supplierName && typeof formik.errors.supplierName === "string" 
                          ? formik.errors.supplierName 
                          : "" // Fallback to empty string
                      }
                      label={
                        <CustomLabel
                          text={t("text.SelectSupplierName")}
                          required={true}
                          value={formik.values.supplierName}
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
      <CustomLabel text={t("text.orderNo")} required={true}  value={formik.values.orderNo || ""}/>
    }
    value={formik.values.orderNo || ""} 
    placeholder={t("text.orderNo")}
    size="small"
    fullWidth
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.orderNo && Boolean(formik.errors.orderNo)}
    //helperText={formik.touched.orderNo && formik.errors.orderNo ? formik.errors.orderNo : ""}
    helperText={
      formik.touched.orderNo && typeof formik.errors.orderNo === "string" 
        ? formik.errors.orderNo 
        : "" // Fallback to empty string
    }
  />
              </Grid>

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
                />
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
                      {/* <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Quantity")}
                      </th> */}
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.retqty")}
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
                                label={
                                  <CustomLabel text={t("text.enteritem")} />
                                }
                              />
                            )}
                          />
                        </td>
                        {/*<td>
                          <TextField
                            type="text"
                            value={item.retqty}
                            size="small"
                          />
                        </td>*/}
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
                                (opt: any) => opt.value == (item.tax1)
                              )
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
                                label={
                                  <CustomLabel
                                    text={t("text.SelectTax")}
                                    required={false}
                                  />
                                }
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

export default EditPurchaseReturnOrder;
