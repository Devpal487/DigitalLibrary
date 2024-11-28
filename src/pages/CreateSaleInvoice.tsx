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
import { useNavigate } from "react-router-dom";
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

const CreateSaleInvoice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  const [toaster, setToaster] = useState(false);
  const initialRows :any = {
    id: -1,
    saleid: -1,
    user_Id: 0,
    itemNameId:'',
    unit: "",
    qty: '',
    rate: '',
    amount: '',
    tax1: "",
    taxId1: "",
    tax2: "P",
    discount: 0.00,
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
  const [taxOption, setTaxOption] = useState([
    { value: "-1", label: t("text.SelectTax") },
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

  // console.log("items", items);

  const back = useNavigate();

  useEffect(() => {
    GetDigitalContentData();
    getTaxData();
    GetUnitData();
    getSupliar();
    getDocNo();
  }, []);

  const getDocNo = async () => {
    const res = await api.post(`api/SaleInvoice/GetMaxInvoiceNo`);
    formik.setFieldValue("s_InvoiceNo", res?.data?.data[0]?.s_InvoiceNo);
  };

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
        label: `${item.taxName} `,
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
    item.taxId1 = String(calculateTax(item.amount, Number(item.tax1)));
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
    const discountAmount:any = calculateDiscount(item.amount, item.discount, item.tax2);
    item.discountAmount = discountAmount;
    item.netAmount = calculateNetAmount(item.amount, Number(item.taxId1), discountAmount);
  }

  // Recalculate dependent fields
  if (field !== 'discount' && field !== 'tax2') {
    const discountAmount:any = calculateDiscount(item.amount, item.discount, item.tax2);
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
const calculateAmount = (qty: number, rate: number) => {
  const amount = qty * rate;
  return (amount.toFixed(2));
};

const calculateTax = (amount: number, taxRate: number) => {
  const tax = (amount * taxRate) / 100;
  return (tax.toFixed(2));
};

const calculateDiscount = (amount: number, discount: number, type: string) => {
  let discountValue = 0;
  if (type === 'P') {
    discountValue = (amount * discount) / 100;
  } else if (type === 'F') {
    discountValue = discount;
  }
  return (discountValue.toFixed(2));
};

const calculateNetAmount = (amount: number, tax: number, discount: number) => {
  const netAmount = amount + tax - discount;
  return (netAmount.toFixed(2));
};

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
        saleid: -1,
        user_Id: 0,
        itemNameId: "",
        unit: "",
        qty: '',
        rate: '',
        amount: '',
        tax1: "",
        taxId1: "",
        tax2: "P",
        discount: 0.00,
        discountAmount: '',
        netAmount: '',
        documentNo: formik.values.document_No,
        documentDate: formik.values.doc_Date,
        invoiceNo: formik.values.s_InvoiceNo,
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
    (acc: any, item: any) => acc + Number(item.netAmount),
    0
  );

  const formik = useFormik({
    initialValues: {
      id: -1,
      document_No: "",
      s_InvoiceNo: "",
      doc_Date: new Date().toISOString().slice(0, 10),
      s_InvoiceDate: new Date().toISOString().slice(0, 10),
      supplierName: "",
      supplierId: 0,
      orderNo: "",
      tax: "",
      freight: 0,
      amount: 0,
      acc_code: "",
      others: "",
      remark: "",
      instId: 0,
      sessionId: 0,
      saleinv: [],
    },
    validationSchema: Yup.object().shape({
      // document_No: Yup.string().required(t("Document No. required")),
      orderNo: Yup.string().required(t("Order No. required")),
      // doc_Date: Yup.date().required(t("Order Date required")),
      s_InvoiceDate: Yup.date().required(t("Invoice Date required")),
      supplierName: Yup.string().required(t("text.supNameReq")),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted with values:", values);
      console.log("Formik Errors:", formik.errors);
      values.amount = totalAmount;

      const validItems = items.filter((item: any) => validateItem(item));
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
          invoiceNo: values.s_InvoiceNo,
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
      values.saleinv = updatedItems;

      console.log("Form Submitted with values:", values);
      console.log("Updated Items:", updatedItems);

      try {
        const response = await api.post(
          `api/SaleInvoice/AddUpdateSaleInvoice`,
          values
        );
        if (response.data.isSuccess) {
          setToaster(false);
          toast.success(response.data.mesg);
          setTimeout(() => {
            navigate("/SaleInvoice");
          }, 700);
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
                {t("text.saleinvoice")}
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
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.s_InvoiceNo")}
                      required={true}
                      value={formik.values.s_InvoiceNo}
                    />
                  }
                  variant="outlined"
                  fullWidth
                  size="small"
                  name="s_InvoiceNo"
                  id="s_InvoiceNo"
                  // type="date"
                  value={formik.values.s_InvoiceNo}
                  placeholder={t("text.s_InvoiceNo")}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="s_InvoiceDate"
                  name="s_InvoiceDate"
                  label={
                    <CustomLabel
                      text={t("text.s_InvoiceDate")}
                      required={true}
                      value={formik.values.s_InvoiceDate}
                    />
                  }
                  value={formik.values.s_InvoiceDate}
                  placeholder={t("text.s_InvoiceDate")}
                  size="small"
                  type="date"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.s_InvoiceDate &&
                    Boolean(formik.errors.s_InvoiceDate)
                  }
                  helperText={
                    formik.touched.s_InvoiceDate && formik.errors.s_InvoiceDate
                  }
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Option}
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
                        formik.touched.supplierName && formik.errors.supplierName
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
                  helperText={formik.touched.orderNo && formik.errors.orderNo}
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
                      <th
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        {t("text.Unit")}
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
                            onChange={(event, newValue: any) => {
                              handleItemChange(
                                index,
                                "itemNameId",
                                newValue
                              );
                              
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <CustomLabel text={t("text.enteritem")} />
                                }

                                // placeholder={t("text.enteritem")} 
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
                                label={
                                  <CustomLabel
                                    text={t("text.unit")}
                                    required={false}
                                  />
                                }

                                // placeholder={t("text.unit")}
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
                            // onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
                            size="small"
                          />
                        </td>
                        <td>{item.amount}</td>
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
                              );}}
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
                            onFocus={(e) => e.target.select()}
                            size="small"
                          />
                        </td>
                        <td>{item.discountAmount}</td>
                        <td>{item.netAmount}</td>
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
                          {totalAmount}
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

export default CreateSaleInvoice;
