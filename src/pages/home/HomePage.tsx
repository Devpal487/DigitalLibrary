import { useEffect, useState, useCallback, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Card,
  Grid,
  CardContent,
  Divider,
  TextField,
  Button,
  DialogTitle,
  IconButton,
  DialogContent,
  Typography,
  DialogContentText,
} from "@mui/material";
import Chart from "react-google-charts";
import "./style.css";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Navigate, useNavigate } from "react-router-dom";
import Paper, { PaperProps } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import api from "../../utils/Url";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { useTranslation } from "react-i18next";
import Collapse from "@mui/material/Collapse";
import { toast } from "react-toastify";
import React from "react";
import DynamicTable from "./TableContainer";



function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.blue,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function HomePage() {
  const { t } = useTranslation();
  const [activeMemberOption, setActiveMemberOption] = useState(false);
  const [activeMemberData, setActiveMemberData] = useState<any[]>([]);
  const [userRecentActivity, setUserRecentActivity] = useState<any>("");
  const [userRecentOption, setUserRecentOption] = useState(false);
  const [studentEnrolledOption, setStudentEnrolledOption] = useState(false);
  const [recentlyIssueTransactionOption, setRecentlyIssueTransactionOption] = useState(false);
  const [recentlyReturnTransactionOption, setRecentlyReturnTransactionOption] = useState(false);
  const [recentlyCataloguedItemsOption, setRecentlyCataloguedItemsOption] = useState(false);
  const [seeDigitalLogsState, setSeeGigitalLogsState] = useState(false);
  const [heirarchalUsersActivityState, setHeirarchalUsersActivityState] =
    useState(false);
  const [overDueChargeOption, setOverDueChargeOption] = useState(false);
  const [recentlyCatalogue, setRecentlyCatalogue] = useState(false);
  const [fullWidth, setFullWidth] = useState<any>("lg");
  const [stateOption, setStateOption] = useState<any>("");
  const [divisionOption, setDivisionOption] = useState<any>("");
  const [districtOption, setDistrictOption] = useState<any>("");
  const [blockOption, setBlockOption] = useState<any>("");
  const [clusterOption, setClusterOption] = useState<any>("");
  const [stateData, setStateData] = useState<any>("");
  const [divisionData, setDivisionData] = useState<any>("");
  const [districtData, setDistrictData] = useState<any>("");
  const [blockData, setBlockData] = useState<any>("");
  const [clusterData, setClusterData] = useState<any>("");
  const [selectedState, setSelectedState] = useState(null);
  const [childData, setChildData] = useState<any>("");
  const [openRowId, setOpenRowId] = useState(null);
  const [openInstituteId, setOpenInstituteId] = useState(null);
  const [instituteChildData, setInstituteChildData] = useState([]);
  const [openUserNameId, setOpenUserNameId] = useState(null);
  const [userNameChildData, setUserNameChildData] = useState([]);
  const [state2Option, setState2Option] = useState<any>("");
  const [division2Option, setDivision2Option] = useState<any>("");
  const [district2Option, setDistrict2Option] = useState<any>("");
  const [block2Option, setBlock2Option] = useState<any>("");
  const [state2Data, setState2Data] = useState<any>("");
  const [division2Data, setDivision2Data] = useState<any>("");
  const [district2Data, setDistrict2Data] = useState<any>("");
  const [block2Data, setBlock2Data] = useState<any>("");
  const [librariesOptionRowId, setLibrariesOptionRowId] = useState(null);
  const [childDatas, setChildDatas] = useState<any>({
    loginRecList: [],
    appRecList: [],
    loginRecSumm: [],
  });
  const [selectLibraryName, setSelectLibraryName] = useState<any>("");
  const [chartLibData, setChartLibData] = useState<any>({
    membProgramSummary: [],
  });
  const [classNameDistribution, setClassNameDistribution] = useState<any>({
    membClassSummary: [],
  });
  const [categorySummary, setCategorySummary] = useState<any>({
    categSummary: [],
  });
  const [memberFines, setMemberFines] = useState<any>({ memberFine: [] });
  const [itemStatusSum, setItemStatusSum] = useState<any>({
    itemStatusSummary: [],
  });
  const [itemProgramSum, setItemProgramSum] = useState<any>({
    itemProgramSummary: [],
  });
  const [dashboardData, setDashboardData] = useState<any>("");
  const [stateWiseData, setStateWiseData] = useState<{
    programStateWise: any[];
    subjectStateWise: any[];
    visitorStateWise: any[];
  }>({
    programStateWise: [],
    subjectStateWise: [],
    visitorStateWise: [],
  });

  const [heirarchicalData, setHeirarchicalData] = useState<{
    apps: { name: string; label: string; nos?: number; value: number }[];
    libs: { label: string; value: number }[];
    users: { label: string; nos?: number; value: number }[];
  }>({
    apps: [],
    libs: [],
    users: [],
  });
  const [recentCateItem, setRecentCateItem] = useState<any[]>([]);
  const [studentEnrolled, setStudentEnrolled] = useState<any[]>([]);
  const [recentlyIssueTransaction, setRecentlyIssueTransaction] = useState<any[]>([]);
  const [recentlyReturnTransaction, setRecentlyReturnTransaction] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleActiveMember = () => {
    setActiveMemberOption(!activeMemberOption);
  };

  const handleOverDueCHarge = () => {
    setOverDueChargeOption(!overDueChargeOption);
  };

  const handleRecentlyCatalogue = () => {
    setRecentlyCatalogue(!recentlyCatalogue);
  };

  const handleSeeDigitalLog = () => {
    setSeeGigitalLogsState(!seeDigitalLogsState);
  };

  const handleSeeDigitalLogClose = () => {
    setSeeGigitalLogsState(!seeDigitalLogsState);
  };

  const handleheirarchalUsersActivity = () => {
    setHeirarchalUsersActivityState(!heirarchalUsersActivityState);
  };

  const handleheirarchalUsersActivityState = () => {
    setHeirarchalUsersActivityState(!heirarchalUsersActivityState);
  };

  const handleUserRecentActivity = () => {
    setUserRecentOption(!userRecentOption);
  };
  
  const handlerecentlyCataloguedItemsOption = () => {
    setRecentlyCataloguedItemsOption(!recentlyCataloguedItemsOption);
  };

  const handlestudentEnrolledOption = () => {
    setStudentEnrolledOption(!studentEnrolledOption);
  };
  
  const handlerecentlyIssueTransactionOption = () => {
    setRecentlyIssueTransactionOption(!recentlyIssueTransactionOption);
  };
  const handlerecentlyReturnTransactionOption = () => {
    setRecentlyReturnTransactionOption(!recentlyReturnTransactionOption);
  };

  let navigate = useNavigate();

  const handleTotalCategoryClick = () => {
    let path = "/DigitalContentList";
    navigate(path);
  };

  const handlenavigatepage = () => {
    let path = "/TeachingStaff";
    navigate(path);
  };

  useEffect(() => {
    getUserRecentActivity();
    getStateData();
    getHirerchicalData(-1, "state");
    getLibraryGraph();
    getDashboardData();
  }, []);

  const getActiveMember = async (days:any) => {
    const response = await api.get(`api/CircUser/GetLatestMember`, {
      params: { Days: days},
    });
    console.log("active member",response.data.data);
    setActiveMemberData(response.data.data);
  };

  const getUserRecentActivity = async () => {
    const response = await api.get(`api/Admin/UserActivity`);
    setUserRecentActivity(response.data.data);
  };

  const getStateData = async () => {
    const res = await api.post(`api/StateMaster/GetStateMaster`, {
      stateId: -1,
      countryId: -1,
    });
    const arr: any = [];
    for (let index = 0; index < res.data.data.length; index++) {
      arr.push({
        label: res.data.data[index]["stateName"],
        value: res.data.data[index]["stateId"],
      });
    }
    setStateOption(arr);
    const defaultState = res.data.data.find(
      (item: any) => item.stateName === "Uttar Pradesh"
    );
    if (defaultState) {
      setSelectedState(defaultState.stateName);
      getDivisionData(defaultState.stateId);
      getDashBoardDatalogData();
    }
  };

  const getDivisionData = async (id: any) => {
    const res = await api.post(`api/DivisionMaster/GetDivisionMaster`, {
      divisionId: -1,
      stateId: id,
    });
    const arr: any = [];
    for (let index = 0; index < res.data.data.length; index++) {
      arr.push({
        label: res.data.data[index]["divisionName"],
        value: res.data.data[index]["divisionId"],
      });
    }
    setDivisionOption(arr);
  };

  const getDistrictData = async (id1: any, id2: any) => {
    const res = await api.post(`api/DistrictMaster/GetDistrictMaster`, {
      districtId: -1,
      stateId: id1,
      divisionId: id2,
    });
    const arr: any = [];
    console.log("result" + JSON.stringify(res.data.data));
    for (let index = 0; index < res.data.data.length; index++) {
      arr.push({
        label: res.data.data[index]["districtName"],
        value: res.data.data[index]["districtId"],
      });
    }
    setDistrictOption(arr);
  };

  const getBlockData = async (stateid: any, divid: any, distid: any) => {
    const res = await api.post(`api/BlockMaster/GetBlockMaster`, {
      blockId: -1,
      stateId: stateid,
      divisionId: divid,
      districtId: distid,
      instId: -1,
    });
    const arr: any = [];
    console.log("result" + JSON.stringify(res.data.data));
    for (let index = 0; index < res.data.data.length; index++) {
      arr.push({
        label: res.data.data[index]["blockName"],
        value: res.data.data[index]["blockId"],
      });
    }
    setBlockOption(arr);
  };

  const getDashBoardDatalogData = async () => {
    const res = await api.post(`api/DigitalOperate/GetDashboardDataLog`, {
      groupby: "stateId",
    });
    setStateWiseData({
      programStateWise: res.data.data.programStateWise,
      subjectStateWise: res.data.data.subjectStateWise || [],
      visitorStateWise: res.data.data.visitorStateWise,
    });
  };

  const getDashBoardDatalogDataDiv = async (divisionId: any, name: any) => {
    const res = await api.post(`api/DigitalOperate/GetDashboardDataLog`, {
      groupby: "divId",
    });

    if (res.data.isSuccess && res.data.data) {
      const data = res.data.data;

      const filteredProgramDivWise = data.programDivWise.filter(
        (item: any) => item.divid === divisionId
      );
      const filteredVisitorDivWise = data.visitorDivWise.filter(
        (item: any) => item.devisionName === name
      );
      const filteredSubjectDivWise = data.subjectDivWise.filter(
        (item: any) => item.divid === divisionId
      );

      setStateWiseData({
        programStateWise: filteredProgramDivWise,
        visitorStateWise: filteredVisitorDivWise,
        subjectStateWise: filteredSubjectDivWise,
      });
    }
  };

  const getDashBoardDatalogdataDistrict = async (
    divisionId: any,
    name: any
  ) => {
    const res = await api.post(`api/DigitalOperate/GetDashboardDataLog`, {
      groupby: "districtId",
    });

    if (res.data.isSuccess && res.data.data) {
      const data = res.data.data;
      const filteredProgramDivWise = data.programDistrictWise.filter(
        (item: any) => item.districtid === divisionId
      );
      const filteredVisitorDivWise = data.visitorDistrictWise.filter(
        (item: any) => item.devisionName === name
      );
      const filteredSubjectDivWise = data.subjectDistrictWise.filter(
        (item: any) => item.districtid === divisionId
      );
      setStateWiseData({
        programStateWise: filteredProgramDivWise,
        visitorStateWise: filteredVisitorDivWise,
        subjectStateWise: filteredSubjectDivWise,
      });
    }
  };

  const getDashBoardDatalogdataBlock = async (divisionId: any, name: any) => {
    const res = await api.post(`api/DigitalOperate/GetDashboardDataLog`, {
      groupby: "BlockId",
    });
    if (res.data.isSuccess && res.data.data) {
      const data = res.data.data;
      const filteredProgramDivWise = data.programBlockWise.filter(
        (item: any) => item.blockid === divisionId
      );
      const filteredVisitorDivWise = data.visitorBlockWise.filter(
        (item: any) => item.devisionName === name
      );
      const filteredSubjectDivWise = data.subjectBlockWise.filter(
        (item: any) => item.blockid === divisionId
      );

      setStateWiseData({
        programStateWise: filteredProgramDivWise,
        visitorStateWise: filteredVisitorDivWise,
        subjectStateWise: filteredSubjectDivWise,
      });
    }

    const resInst = await api.post(`api/Basic/GetInstitutes`, {
      name: "",
      all: true,
    });
    if (resInst.data.isSuccess && resInst.data.data) {
      const result = resInst.data.data;
      const filterOption = result.filter(
        (item: any) => item.blockId === divisionId
      );
      let arr: any = [];
      for (let index = 0; index < filterOption.length; index++) {
        arr.push({
          label: filterOption[index]["instituteName"],
          value: filterOption[index]["instituteCode"],
        });
      }
      setClusterOption(arr);
    }
  };

  const getDashBoardDatalogdataInst = async (divisionId: any, name: any) => {
    const res = await api.post(`api/DigitalOperate/GetDashboardDataLog`, {
      groupby: "InstId",
    });

    if (res.data.isSuccess && res.data.data) {
      const data = res.data.data;
      const filteredProgramDivWise = data.programInstWise.filter(
        (item: any) => item.instid === divisionId
      );
      const filteredVisitorDivWise = data.visitorAllWise.filter(
        (item: any) => item.devisionName === name
      );
      const filteredSubjectDivWise = data.subjectInstWise.filter(
        (item: any) => item.instid === divisionId
      );

      setStateWiseData({
        programStateWise: filteredProgramDivWise,
        visitorStateWise: filteredVisitorDivWise,
        subjectStateWise: filteredSubjectDivWise,
      });
    }
  };

  const getChildData = async (contentTypeId: any) => {
    if (openRowId === contentTypeId) {
      setOpenRowId(null);
      setChildData([]);
      return;
    }

    const initialValues = {
      instid: null,
      subjectId: null,
      contentId: contentTypeId,
      memberid: null,
      stateId: null,
      divId: null,
      distId: null,
    };

    try {
      const res = await api.post(
        "api/DigitalOperate/GetDashboardVisitor",
        initialValues
      );
      if (res.data.isSuccess && res.data.data) {
        setChildData(res.data.data);
        setOpenRowId(contentTypeId);
      } else {
        setChildData([]);
        toast.error("No Data available");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const getInstituteData = async (instituteId: any) => {
    console.log("🚀 ~ getInstituteData ~ instituteId:", instituteId);
    if (openInstituteId === instituteId?.insutid) {
      setOpenInstituteId(null);
      setInstituteChildData([]);
      return;
    }

    const initialValues = {
      instid: instituteId?.insutid,
      subjectId: null,
      contentId: instituteId?.contentId,
      memberid: null,
      stateId: null,
      divId: null,
      distId: null,
    };

    try {
      const res = await api.post(
        "api/DigitalOperate/GetDashboardVisitor",
        initialValues
      );
      if (res.data.isSuccess && res.data.data) {
        setInstituteChildData(res.data.data);
        setOpenInstituteId(instituteId?.insutid);
      } else {
        setInstituteChildData([]);
        toast.error("No Data available");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const getUserNameData = async (userdetails: any) => {
    console.log("🚀 ~ getInstituteData ~ instituteId:", userdetails);
    if (openUserNameId === userdetails?.userName) {
      setOpenUserNameId(null);
      setUserNameChildData([]);
      return;
    }

    const initialValues = {
      instid: userdetails?.insutid,
      subjectId: null,
      contentId: userdetails?.contentId,
      memberid: userdetails?.userName,
      stateId: null,
      divId: null,
      distId: null,
    };

    try {
      const res = await api.post(
        "api/DigitalOperate/GetDashboardVisitor",
        initialValues
      );
      if (res.data.isSuccess && res.data.data) {
        setUserNameChildData(res.data.data);
        setOpenUserNameId(userdetails?.userName);
      } else {
        setUserNameChildData([]);
        toast.error("No Data available");
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  const formatTime = (timeStr: any) => {
    const [hours, minutes, seconds] = timeStr.split(":");
    const [sec] = seconds.split(".");
    return `${hours}h ${minutes}m ${sec}s`;
  };

  const getHirerchicalData = async (id: any, stateDiv: any) => {
    try {
      const res = await api.post(`api/Admin2/DdlStateDiv`, {
        id,
        stateDivision: stateDiv,
      });
      const data = res.data.data || {};
      const { states = [], divisions = [], districts = [], blocks = [] } = data;
      const statesArray = (states || []).map((state: any) => ({
        label: state.label,
        value: state.value,
      }));
      console.log("🚀 ~ statesArray ~ statesArray:", statesArray);

      if (stateDiv === "state") {
        if (statesArray.length > 0) {
          setState2Data(statesArray[0]);
        } else {
          setState2Data(null);
        }

        const divisionsArray = (divisions || []).map((division: any) => ({
          label: division.label,
          value: division.value,
        }));
        setDivision2Option(divisionsArray);
        getDashBoardSummary(-1, "state");
      } else if (stateDiv === "district") {
        setDistrict2Option(statesArray);
      } else if (stateDiv === "block") {
        setBlock2Option(statesArray);
      }
    } catch (error) {
      console.error("Error fetching hierarchical data:", error);
    }
  };

  const getDashBoardSummary = async (id: any, stateDiv: any) => {
    const res = await api.post(`api/Admin2/DashBoardSummary`, {
      id: id,
      stateDivision: stateDiv,
    });
    let result: any = res.data.data;

    if (res.data.isSuccess && res.data.data) {
      const data = res.data.data;

      // Process apps
      const appsProcessed = data.apps.map(
        (app: { loginName: any; name: any; nos: any; id: any }) => ({
          label: app.loginName,
          name: app.name,
          nos: app.nos,
          value: app.id,
        })
      );

      // Process libs
      const libsProcessed = data.libs.map((lib: { name: any; id: any }) => ({
        label: lib.name,
        value: lib.id,
      }));

      // Process users
      const usersProcessed = data.users.map(
        (user: { name: any; nos: any; id: any }) => ({
          label: user.name,
          nos: user.nos,
          value: user.id,
        })
      );

      // Update state
      setHeirarchicalData({
        apps: appsProcessed,
        libs: libsProcessed,
        users: usersProcessed,
      });
      console.log("heirarchicalData", heirarchicalData);
    }
  };

  const getLibrariesChildData = useCallback(
    async (id: any) => {
      console.log("🚀 ~ id:", id);
      setSelectLibraryName(id.label);
      try {
        if (librariesOptionRowId === id?.value) {
          setLibrariesOptionRowId(null);
          setChildDatas([]);
          return;
        }
        const res = await api.post("api/Admin/UserActivityLib", {
          libId: id?.value,
          requserid: "",
        });
        setChildDatas(res.data.data);
        setLibrariesOptionRowId(id?.value);
        console.log("🚀 ~ res.data.data:", res.data.data.loginRecList);
        console.log("🚀 ~ setChildDatas:", childDatas);
      } catch (error) {
        console.error("Failed to fetch library data", error);
      }
    },
    [librariesOptionRowId]
  );

  const getLibraryGraph = async () => {
    try {
      const collectData = {
        membDetails: false,
        recentCatalogue: false,
        issueReturnStat: false,
        memberFine: false,
        userId: false,
        chartSubject: false,
        categSummary: false,
        membProgramSummary: false,
        membClassSummary: false,
        itemStatusSummary: false,
        itemProgramSummary: false,
      };

      const res = await api.post(
        "api/Admin/GetWSwindowServiceData",
        collectData
      );
      let result = res.data.data.membProgramSummary.filter(
        (item: any) => item.nos > 0
      );
      let resMembClassSummary = res.data.data.membClassSummary.filter(
        (item: any) => item.nos > 0
      );
      let resCategorySummary = res.data.data.categSummary.filter(
        (item: any) => item.nos > 0
      );
      let reschartSubject = res.data.data.chartSubject.filter(
        (item: any) => item.nos > 0
      );
      let resitemStatusSummary = res.data.data.itemStatusSummary.filter(
        (item: any) => item.nos > 0
      );
      let resitemProgramSummary = res.data.data.itemProgramSummary.filter(
        (item: any) => item.nos > 0
      );
      let formattedData: any,
        membClassSummaryData: any,
        categorySummaryData: any,
        subjectSummaryData: any,
        itemStatusSummaryData: any,
        itemProgramNameData: any;

      if (result.length > 0) {
        formattedData = [
          ["Program Name", "Number", { role: "style" }],
          ...result.map((item: any) => [
            item.membProgramName,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      if (resMembClassSummary.length > 0) {
        membClassSummaryData = [
          ["Class Name", "Number", { role: "style" }],
          ...resMembClassSummary.map((item: any) => [
            item.membClassName,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      if (resCategorySummary.length > 0) {
        categorySummaryData = [
          ["Category Distribution", "Number", { role: "style" }],
          ...resCategorySummary.map((item: any) => [
            item.categoryName,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      if (reschartSubject.length > 0) {
        subjectSummaryData = [
          ["Subject Distribution", "Number", { role: "style" }],
          ...reschartSubject.map((item: any) => [
            item.subject1,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      if (resitemStatusSummary.length > 0) {
        itemStatusSummaryData = [
          ["Item Type Distribution", "Number", { role: "style" }],
          ...resitemStatusSummary.map((item: any) => [
            item.statusName,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      if (resitemProgramSummary.length > 0) {
        itemProgramNameData = [
          ["Item Type Distribution", "Number", { role: "style" }],
          ...resitemProgramSummary.map((item: any) => [
            item.itemProgramName,
            item.nos,
            item.rgbaColor,
          ]),
        ];
      }

      setChartLibData(formattedData);
      setClassNameDistribution(membClassSummaryData);
      setCategorySummary(categorySummaryData);
      setMemberFines(subjectSummaryData);
      setItemStatusSum(itemStatusSummaryData);
      setItemProgramSum(itemProgramNameData);
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  const getRecentlyCataloguedItems = async (days: any) => {
    api.get(`/api/Catalog/GetLatestItems?Days=${days}`).then((res: any) => {
      setRecentCateItem(res.data.data);
    });
  };

  const getStudentEnrolled = async (days: any) => {
    api.get(`/api/CircUser/GetLatestMember?Days=${days}`).then((res: any) => {
      setStudentEnrolled(res.data.data);
    });
  };

  const getRecentlyIssueTransaction = async (days: any) => {
    api.get(`/api/Transaction/GetLatestIssues?Days=${days}`).then((res: any) => {
      setRecentlyIssueTransaction(res.data.data);
    });
  };

  const getRecentlyReturnTransaction = async (days: any) => {
    api.get(`/api/Transaction/GetLatestReturns?Days=${days}`).then((res: any) => {
      setRecentlyReturnTransaction(res.data.data);
    });
  };

  const getDashboardData = () => {
    api.get(`api/UserPermission/DashBoardUser`).then((res) => {
      if (res.data.isSuccess) {
        let arr: any = [];
        for (let i = 0; i < res.data.data.length; i++) {
          arr.push({
            label: res.data.data[i]["boardName"],
            day: res.data.data[i]["noOfDays"],
            boardId: res.data.data[i]["boardId"],
            userDashId: res.data.data[i]["userDashId"],
            userTypeId: res.data.data[i]["userTypeId"],
            chartOnly: res.data.data[i]["chartOnly"],
            defaultCount: res.data.data[i]["defaultCount"],
            usertypename: res.data.data[i]["usertypename"],
            instId: res.data.data[i]["instId"],
          });
        }
        setDashboardData(arr);
      } else {
        toast.error("Network Failure.... Please try again");
      }
    });
  };

  const handleCardClick = (cardData: any) => {
    console.log("🚀 ~ handleCardClick ~ cardData:", cardData);
    switch (cardData.label) {
      case "Recently Catalogue":
        if (cardData?.day) {
          handlerecentlyCataloguedItemsOption();
          getRecentlyCataloguedItems(cardData?.day);
        } else {
          toast.error("Please try again.... Not working ");
        }
        break;
      case "Student Enrolled":
        if (cardData?.day) {
          handlestudentEnrolledOption();
          getStudentEnrolled(cardData?.day);
        } else {
          toast.error("Please try again.... Not working ");
        }
        break;
      case "Recently Issue Transaction":
        if (cardData?.day) {
          handlerecentlyIssueTransactionOption();
          getRecentlyIssueTransaction(cardData?.day);
        } else {
          toast.error("Please try again.... Not working ");
        }
        break;
      case "Recently Return Transaction":
        if (cardData?.day) {
          handlerecentlyReturnTransactionOption();
          getRecentlyReturnTransaction(cardData?.day);
        } else {
          toast.error("Please try again.... Not working ");
        }
        break;
      case "Digital Content":
        handleTotalCategoryClick();
        break;
      case "User's Recent Activity":
        handleUserRecentActivity();
        break;
      case "Over Due Charge":
        handleOverDueCHarge();
        break;
      case "Active Members":
        if (cardData?.day) {
          handleActiveMember();
          getActiveMember(cardData?.day)
        } else {
          toast.error("Please try again.... Not working ");
        }
        break;
      case "Teaching Staff Panel":
        handlenavigatepage();
        break;
      case "See Digital Logs":
        handleSeeDigitalLog();
        break;
      case "Heirarchical users Activity":
        handleheirarchalUsersActivity();
        break;
      default:
        break;
    }
  };

  const glassmorphismStyle = {
    backdropFilter: "blur(20px)",
    borderRadius: "15px",
    border: "1px solid transparent",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    transition: "opacity 0.5s ease, transform 0.5s ease",
  };

  const gradientBorderStyle = {
    border: "1px solid transparent",
    //borderImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4))',
    borderImageSlice: 1,
  };

  const getBackgroundColor = (index: any) => {
    const colors = [
      "#FFDDC1",
      "#FFABAB",
      "#FFC3A0",
      "#B9FBC0",
      "#A0E8AF",
      "#B9FBC0",
      "#B9D9EB",
    ];
    return colors[index % colors.length];
  };

  const handleMouseMove = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (ref.current) {
      const card = ref.current;
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const deltaX = e.clientX - cardCenterX;
      const deltaY = e.clientY - cardCenterY;

      const rotateX = -(deltaY / cardRect.height) * 15;
      const rotateY = (deltaX / cardRect.width) * 15;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const card = ref.current;
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  };

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div>
      <Grid
        container
        spacing={2}
        style={{
          marginTop: "2vh",
        }}
      >
        <Grid container lg={12} md={12} xs={12} spacing={3}>
          {dashboardData.length > 0 &&
            dashboardData.map((x: any, index: number) => (
              <Grid xs={12} sm={6} md={4} item key={x.boardId}>
                <div className="card-container">
                  <Card
                    className="card-tilt glassmorphism"
                    elevation={4}
                    style={{
                      backgroundColor: getBackgroundColor(index),
                      backgroundSize: "cover",
                      ...gradientBorderStyle,
                    }}
                    ref={(el) => (cardRefs.current[index] = el)}
                    onMouseMove={(e) =>
                      handleMouseMove(e, { current: cardRefs.current[index] })
                    }
                    onMouseLeave={() =>
                      handleMouseLeave({ current: cardRefs.current[index] })
                    }
                    onClick={() => handleCardClick(x)}
                  >
                    <CardContent>
                      <Typography
                        fontWeight={500}
                        fontSize={17}
                        noWrap
                        color={"blue"}
                      >
                        {x.label}
                      </Typography>
                      <span
                        style={{
                          float: "left",
                          marginTop: "1vh",
                          fontSize: "2.5vh",
                        }}
                      >
                        <b>Days: {x.day}</b>
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
            ))}
        </Grid>

        <div
          style={{
            opacity: userRecentOption ? 1 : 0,
            transform: userRecentOption ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {userRecentOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography>User Recent Activity</Typography>
              </Grid>
              <Grid item xs={5.9} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8", height: "50px" }}>
                        <StyledTableCell align="center">
                          Sr. No.
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Login Name/Id
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Login Time-In{" "}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Logout Time-Out
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          IP Address
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userRecentActivity.loginRecList.map(
                        (row: any, index: any) => (
                          <StyledTableRow key={row.userid}>
                            <StyledTableCell
                              align="left"
                              sx={{ width: "50px" }}
                            >
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.loginName}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {dayjs(row.loginTime).format(
                                "DD-MMM-YYYY h:mm:ss A"
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.logOutTime
                                ? dayjs(row.logOutTime).format(
                                    "DD-MMM-YYYY h:mm:ss A"
                                  )
                                : "--"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.ipAddress}
                            </StyledTableCell>
                          </StyledTableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={0.1} sx={{ height: "80vh" }}></Grid>

              <Grid item xs={5.9} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8" }}>
                        <StyledTableCell align="center">
                          Sr. No.
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Application
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Page Name{" "}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Start Time
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userRecentActivity.appRecList.map(
                        (row: any, index: any) => (
                          <StyledTableRow key={row.userid}>
                            <StyledTableCell
                              align="left"
                              sx={{ width: "50px" }}
                            >
                              {index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.application}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {row.pageName}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              {dayjs(row.opTime).format(
                                "DD-MMM-YYYY h:mm:ss A"
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </div>


        <div
          style={{
            opacity: recentlyCataloguedItemsOption ? 1 : 0,
            transform: recentlyCataloguedItemsOption ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {recentlyCataloguedItemsOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2, mx:2 }}
              >
                <Typography>Recently Catalogued Items</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8", height: "50px" }}>
                        <StyledTableCell align="center">Sr. No.</StyledTableCell>
                        <StyledTableCell align="center">Title</StyledTableCell>
                        <StyledTableCell align="center">Author</StyledTableCell>
                        <StyledTableCell align="center">Catalog Date</StyledTableCell>
                        <StyledTableCell align="center">Call No</StyledTableCell>
                        <StyledTableCell align="center">Publisher</StyledTableCell>
                        <StyledTableCell align="center">Control 001</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {recentCateItem.map((row: any, index: any) => (
              <StyledTableRow key={row.userid}>
                <StyledTableCell align="right" sx={{ width: 'auto' }}>{index + 1}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.title}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.auth}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.sCatalogDate}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.callno}</StyledTableCell> 
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.publ}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.control001}</StyledTableCell>
              </StyledTableRow>
            ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              
            </Grid>
          )}
        </div>

        <div
          style={{
            opacity: studentEnrolledOption ? 1 : 0,
            transform: studentEnrolledOption ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {studentEnrolledOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2, mx:2 }}
              >
                <Typography>Recently Enrolled Members</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8", height: "50px" }}>
                        <StyledTableCell align="center">Sr. No.</StyledTableCell>
                        <StyledTableCell align="center">Member Code</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Program</StyledTableCell>
                        <StyledTableCell align="center">Class Name</StyledTableCell>
                        <StyledTableCell align="center">Phone</StyledTableCell>
                        <StyledTableCell align="center">DOJ</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {studentEnrolled.map((row: any, index: any) => (
              <StyledTableRow key={row.userid}>
                <StyledTableCell align="right" sx={{ width: 'auto' }}>{index + 1}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.userid}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.name}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.program}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.classname}</StyledTableCell> 
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.phone1}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.doj?dayjs(row.doj).format("DD-MMM-YYYY") :<>'--'</>}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.email1}</StyledTableCell>
              </StyledTableRow>
            ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              
            </Grid>
          )}
        </div>

        <div
          style={{
            opacity: recentlyIssueTransactionOption ? 1 : 0,
            transform: recentlyIssueTransactionOption ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {recentlyIssueTransactionOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2, mx:2 }}
              >
                <Typography>Recently Issue Transaction</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8", height: "50px" }}>
                        <StyledTableCell align="center">Sr. No.</StyledTableCell>
                        <StyledTableCell align="center">Member Code</StyledTableCell>
                        <StyledTableCell align="center">Accn No</StyledTableCell>
                        <StyledTableCell align="center">Issue Date</StyledTableCell>
                        <StyledTableCell align="center">Due Date</StyledTableCell>
                        <StyledTableCell align="center">Member</StyledTableCell>
                        <StyledTableCell align="center">Title</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {recentlyIssueTransaction.map((row: any, index: any) => (
              <StyledTableRow key={row.userid}>
                <StyledTableCell align="right" sx={{ width: 'auto' }}>{index + 1}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.userid}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.accno}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.issuedate ? dayjs(row.issuedate).format("DD-MMM-YYYY"):<>'--'</>}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.issuedate ? dayjs(row.duedate).format("DD-MMM-YYYY"):<>'--'</>}</StyledTableCell> 
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.member}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.title}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.status}</StyledTableCell>
              </StyledTableRow>
            ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              
            </Grid>
          )}
        </div>

        <div
          style={{
            opacity: recentlyReturnTransactionOption ? 1 : 0,
            transform: recentlyReturnTransactionOption ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {recentlyReturnTransactionOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2, mx:2 }}
              >
                <Typography>Recently Return Transaction</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8", height: "50px" }}>
                        <StyledTableCell align="center">Sr. No.</StyledTableCell>
                        <StyledTableCell align="center">Member Code</StyledTableCell>
                        <StyledTableCell align="center">Accn No</StyledTableCell>
                        <StyledTableCell align="center">Issue Date</StyledTableCell>
                        <StyledTableCell align="center">Due Date</StyledTableCell>
                        <StyledTableCell align="center">Receive Date</StyledTableCell>
                        <StyledTableCell align="center">Member</StyledTableCell>
                        <StyledTableCell align="center">Title</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {recentlyReturnTransaction.map((row: any, index: any) => (
              <StyledTableRow key={row.userid}>
                <StyledTableCell align="right" sx={{ width: 'auto' }}>{index + 1}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.userid}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.accno}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.issuedate ? dayjs(row.issuedate).format("DD-MMM-YYYY"):<>'--'</>}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.issuedate ? dayjs(row.duedate).format("DD-MMM-YYYY"):<>'--'</>}</StyledTableCell> 
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.receivingdate ? dayjs(row.receivingdate).format("DD-MMM-YYYY"):<>'--'</>}</StyledTableCell> 
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.member}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.title}</StyledTableCell>
                <StyledTableCell align="left" sx={{ width: 'auto' }}>{row.status}</StyledTableCell>
              </StyledTableRow>
            ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              
            </Grid>
          )}
        </div>

        <div
          style={{
            opacity: activeMemberOption ? 1 : 0,
            transform: activeMemberOption
              ? "translateY(0)"
              : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {activeMemberOption && (
            <Grid container item spacing={2}>
              <Grid item md={12} xs={12} lg={12} sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2 }} justifyContent={"center"} alignItems={"center"}>
                <Typography>Active Members</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8" }}>
                        <StyledTableCell align="center">Sr. No.</StyledTableCell>
                        <StyledTableCell align="center">Member Code</StyledTableCell>
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Phone</StyledTableCell>
                        <StyledTableCell align="center">Class Name</StyledTableCell>
                        <StyledTableCell align="center">Program/Course</StyledTableCell>
                        <StyledTableCell align="center">DOJ</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeMemberData?.map((row: any, index: any) => (
                        <StyledTableRow key={row.userid}>
                          <StyledTableCell align="left" sx={{ width: "100px" }}>{index + 1}</StyledTableCell>
                          <StyledTableCell align="left">{row.userid}</StyledTableCell>
                          <StyledTableCell align="left">{row.name}</StyledTableCell>
                          <StyledTableCell align="left">{row.phone1}</StyledTableCell>
                          <StyledTableCell align="left">{row.classname}</StyledTableCell>
                          <StyledTableCell align="left">{row.program}</StyledTableCell>
                          <StyledTableCell align="left">{dayjs(row.doj).format("DD-MMM-YYYY")}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}?
        </div>

        <div
          style={{
            opacity: overDueChargeOption ? 1 : 0,
            transform: overDueChargeOption
              ? "translateY(0)"
              : "translateY(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            overflow: "hidden",
          }}
        >
          {overDueChargeOption && (
            <Grid container item spacing={2}>
              <Grid
                item
                md={12}
                xs={12}
                lg={12}
                sx={{ borderBottom: "1px solid grey", borderRadius: 12, my: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography> Over Due Charge</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: "80vh" }}>
                <TableContainer
                  component={Paper}
                  sx={{ height: "97%", overflow: "auto" }}
                >
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow sx={{ background: "#249bc8" }}>
                        <StyledTableCell align="center">
                          Sr. No.
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Member Code
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Member Type
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Fine Amount
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          paid Amount
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          waive Amount
                        </StyledTableCell>
                        <StyledTableCell align="center">DOJ</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeMemberData.map((row: any, index: any) => (
                        <StyledTableRow key={row.userid}>
                          <StyledTableCell align="left" sx={{ width: "100px" }}>
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.userid}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.name}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.phone1}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.classname}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {row.program}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {dayjs(row.doj).format("DD-MMM-YYYY")}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </div>

        <Dialog
          open={seeDigitalLogsState}
          fullWidth={fullWidth}
          maxWidth="lg"
          // fullScreen
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            sx={{
              backgroundColor: "#00009c",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
              marginBottom: "2px",
            }}
          >
            <Typography fontWeight="600" fontSize={17}>
              <i>See Digital Logs</i>
            </Typography>

            <IconButton
              edge="end"
              onClick={handleSeeDigitalLogClose}
              aria-label="close"
              sx={{
                color: "#fff",
                position: "absolute",
                right: 20,
                top: 10,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f4f4f5", height: "25%" }}>
            <Divider />

            <DialogContentText>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ marginTop: 2, color: "#000" }}
              >
                <Grid xs={12} md={2} sm={2} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={stateOption}
                    fullWidth
                    size="small"
                    value={selectedState}
                    onChange={(event: any, newValue: any) => {
                      console.log(newValue?.value);
                      if (newValue) {
                        setStateData(newValue?.value);
                        getDivisionData(newValue?.value);
                      } else {
                        setStateData("");
                      }
                    }}
                    renderInput={(params: any) => (
                      <TextField {...params} label="Select State" />
                    )}
                  />
                </Grid>

                {stateData === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={divisionOption}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setDivisionData(newValue?.value);
                          getDashBoardDatalogDataDiv(
                            newValue?.value,
                            newValue?.label
                          );
                          getDistrictData(stateData, newValue?.value);
                        } else {
                          setDivisionData("");
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select Division" />
                      )}
                    />
                  </Grid>
                )}

                {divisionData === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={districtOption}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setDistrictData(newValue?.value);
                          getDashBoardDatalogdataDistrict(
                            newValue?.value,
                            newValue?.label
                          );
                          getBlockData(
                            stateData,
                            divisionData,
                            newValue?.value
                          );
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select District" />
                      )}
                    />
                  </Grid>
                )}

                {districtData === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={blockOption}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setBlockData(newValue?.value);
                          getDashBoardDatalogdataBlock(
                            newValue?.value,
                            newValue?.label
                          );
                          //getClusterData(stateData,divisionData,districtData,newValue?.value )
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select Block" />
                      )}
                    />
                  </Grid>
                )}

                {blockData === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={clusterOption}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        if (newValue) {
                          setClusterData(newValue?.value);
                          getDashBoardDatalogdataInst(
                            newValue?.value,
                            newValue?.label
                          );
                          // getClusterData(stateData,divisionData,districtData,newValue?.value )
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select Cluster" />
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ margin: "10px" }}
                md={12}
                lg={12}
                xs={12}
              >
                <Grid
                  md={12}
                  lg={12}
                  xs={12}
                  sx={{
                    padding: "5px",
                    border: "0.5px solid grey",
                    margin: "2px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography fontWeight={600} fontSize={17} align="center">
                    User Visited Content Wise
                  </Typography>
                </Grid>
                <TableContainer
                  component={Paper}
                  id="tabcont"
                  sx={{
                    maxHeight: "65vh",
                    marginBottom: "10px",
                    border: "0.5px solid grey",
                  }}
                >
                  <Table
                    aria-label="customized  table"
                    style={{
                      border: "1px gray solid",
                      borderCollapse: "collapse",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <TableHead
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        position: "sticky",
                        backgroundColor: "#1DCAD1",
                        color: "#fff",
                      }}
                    >
                      <TableRow>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          Sr No
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          Content Type
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            // color:"black",
                            padding: "10px",
                          }}
                        >
                          Most Visited
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateWiseData?.programStateWise?.length > 0 ? (
                        stateWiseData.programStateWise.map(
                          (item: any, index: any) => (
                            <React.Fragment key={item.contentTypeId}>
                              <StyledTableRow
                                key={index}
                                sx={{ border: "1px gray solid" }}
                              >
                                <TableCell
                                  style={{ border: "1px gray solid" }}
                                  align="center"
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px gray solid",
                                    cursor: "pointer",
                                    textDecoration:
                                      openRowId === item.contentTypeId
                                        ? "underline"
                                        : "none",
                                    color:
                                      openRowId === item.contentTypeId
                                        ? "blue"
                                        : "inherit",
                                  }}
                                  onClick={() =>
                                    getChildData(item.contentTypeId)
                                  }
                                >
                                  {item.contentType}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px gray solid",
                                    wordWrap: "break-word",
                                  }}
                                  align="right"
                                >
                                  {item.mostvisited}
                                </TableCell>
                              </StyledTableRow>

                              <TableRow>
                                <TableCell
                                  style={{
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    margin: "5px",
                                  }}
                                  colSpan={3}
                                >
                                  <Collapse
                                    in={openRowId === item.contentTypeId}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    {childData.length > 0 ? (
                                      <Box
                                        sx={{ marginTop: 1, marginBottom: 1 }}
                                      >
                                        <Table
                                          aria-label="purchases"
                                          style={{
                                            border: "1px gray solid",
                                            borderCollapse: "collapse",
                                            width: "100%",
                                            borderRadius: "15px",
                                          }}
                                        >
                                          <TableHead
                                            style={{
                                              border: "1px gray solid",
                                              borderCollapse: "collapse",
                                              backgroundColor: "#0249bc",
                                            }}
                                          >
                                            <TableRow>
                                              <StyledTableCell
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 500,
                                                  border: "1px gray solid",
                                                  padding: "5px",
                                                }}
                                                align="center"
                                              >
                                                Sr. No.
                                              </StyledTableCell>
                                              <StyledTableCell
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 500,
                                                  border: "1px gray solid",
                                                  padding: "5px",
                                                }}
                                                align="center"
                                              >
                                                Institute Name
                                              </StyledTableCell>
                                              <StyledTableCell
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 500,
                                                  border: "1px gray solid",
                                                  padding: "5px",
                                                }}
                                                align="center"
                                              >
                                                Visitor Count
                                              </StyledTableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {childData.map(
                                              (tran: any, index: any) => (
                                                <React.Fragment
                                                  key={tran.insutid}
                                                >
                                                  <StyledTableRow
                                                    key={index}
                                                    style={{
                                                      border: "1px gray solid",
                                                      padding: "5px",
                                                    }}
                                                  >
                                                    <TableCell
                                                      style={{
                                                        border:
                                                          "1px gray solid",
                                                        padding: "5px",
                                                      }}
                                                      align="center"
                                                    >
                                                      {index + 1}
                                                    </TableCell>
                                                    <TableCell
                                                      style={{
                                                        border:
                                                          "1px gray solid",
                                                        padding: "5px",
                                                        cursor: "pointer",
                                                        textDecoration:
                                                          openInstituteId ===
                                                          tran.insutid
                                                            ? "underline"
                                                            : "none",
                                                        color:
                                                          openInstituteId ===
                                                          tran.insutid
                                                            ? "blue"
                                                            : "inherit",
                                                      }}
                                                      onClick={() =>
                                                        getInstituteData(tran)
                                                      }
                                                    >
                                                      {tran.instituteName}
                                                    </TableCell>
                                                    <TableCell
                                                      style={{
                                                        border:
                                                          "1px gray solid",
                                                        padding: "5px",
                                                      }}
                                                      align="right"
                                                    >
                                                      {tran.visitCount}
                                                    </TableCell>
                                                  </StyledTableRow>

                                                  <StyledTableRow>
                                                    <TableCell
                                                      style={{
                                                        paddingBottom: 0,
                                                        paddingTop: 0,
                                                        margin: "5px",
                                                      }}
                                                      colSpan={3}
                                                    >
                                                      <Collapse
                                                        in={
                                                          openInstituteId ===
                                                          tran.insutid
                                                        }
                                                        timeout="auto"
                                                        unmountOnExit
                                                      >
                                                        {instituteChildData.length >
                                                        0 ? (
                                                          <Box
                                                            sx={{
                                                              marginTop: 1,
                                                              marginBottom: 1,
                                                            }}
                                                          >
                                                            <Table
                                                              aria-label="instituteDetails"
                                                              style={{
                                                                border:
                                                                  "1px gray solid",
                                                                borderCollapse:
                                                                  "collapse",
                                                                width: "100%",
                                                                borderRadius:
                                                                  "15px",
                                                              }}
                                                            >
                                                              <TableHead
                                                                style={{
                                                                  border:
                                                                    "1px gray solid",
                                                                  borderCollapse:
                                                                    "collapse",
                                                                  backgroundColor:
                                                                    "#0249bc",
                                                                }}
                                                              >
                                                                <StyledTableRow>
                                                                  <StyledTableCell
                                                                    style={{
                                                                      fontSize: 14,
                                                                      fontWeight: 500,
                                                                      border:
                                                                        "1px gray solid",
                                                                      padding:
                                                                        "5px",
                                                                    }}
                                                                    align="center"
                                                                  >
                                                                    Sr. No.
                                                                  </StyledTableCell>
                                                                  <StyledTableCell
                                                                    style={{
                                                                      fontSize: 14,
                                                                      fontWeight: 500,
                                                                      border:
                                                                        "1px gray solid",
                                                                      padding:
                                                                        "5px",
                                                                    }}
                                                                    align="center"
                                                                  >
                                                                    User Name
                                                                  </StyledTableCell>
                                                                  <StyledTableCell
                                                                    style={{
                                                                      fontSize: 14,
                                                                      fontWeight: 500,
                                                                      border:
                                                                        "1px gray solid",
                                                                      padding:
                                                                        "5px",
                                                                    }}
                                                                    align="center"
                                                                  >
                                                                    Visit Count
                                                                  </StyledTableCell>
                                                                </StyledTableRow>
                                                              </TableHead>
                                                              <TableBody>
                                                                {instituteChildData.map(
                                                                  (
                                                                    detail: any,
                                                                    index: any
                                                                  ) => (
                                                                    <React.Fragment
                                                                      key={
                                                                        detail.insutid
                                                                      }
                                                                    >
                                                                      <StyledTableRow
                                                                        key={
                                                                          index
                                                                        }
                                                                        style={{
                                                                          border:
                                                                            "1px gray solid",
                                                                          padding:
                                                                            "5px",
                                                                        }}
                                                                      >
                                                                        <TableCell
                                                                          style={{
                                                                            border:
                                                                              "1px gray solid",
                                                                            padding:
                                                                              "5px",
                                                                          }}
                                                                          align="center"
                                                                        >
                                                                          {index +
                                                                            1}
                                                                        </TableCell>
                                                                        <TableCell
                                                                          style={{
                                                                            border:
                                                                              "1px gray solid",
                                                                            padding:
                                                                              "5px",
                                                                            cursor:
                                                                              "pointer",
                                                                            textDecoration:
                                                                              openUserNameId ===
                                                                              detail?.userName
                                                                                ? "underline"
                                                                                : "none",
                                                                            color:
                                                                              openUserNameId ===
                                                                              detail?.userName
                                                                                ? "blue"
                                                                                : "inherit",
                                                                          }}
                                                                          onClick={() =>
                                                                            getUserNameData(
                                                                              detail
                                                                            )
                                                                          }
                                                                          // align="center"
                                                                        >
                                                                          {
                                                                            detail.userName
                                                                          }
                                                                        </TableCell>
                                                                        <TableCell
                                                                          style={{
                                                                            border:
                                                                              "1px gray solid",
                                                                            padding:
                                                                              "5px",
                                                                          }}
                                                                          align="right"
                                                                        >
                                                                          {
                                                                            detail.visitCount
                                                                          }
                                                                        </TableCell>
                                                                      </StyledTableRow>
                                                                      <TableRow>
                                                                        <TableCell
                                                                          style={{
                                                                            paddingBottom: 0,
                                                                            paddingTop: 0,
                                                                            margin:
                                                                              "5px",
                                                                          }}
                                                                          colSpan={
                                                                            3
                                                                          }
                                                                        >
                                                                          <Collapse
                                                                            in={
                                                                              openUserNameId ===
                                                                              detail?.userName
                                                                            }
                                                                            timeout="auto"
                                                                            unmountOnExit
                                                                          >
                                                                            {userNameChildData.length >
                                                                            0 ? (
                                                                              <Box
                                                                                sx={{
                                                                                  marginTop: 1,
                                                                                  marginBottom: 1,
                                                                                }}
                                                                              >
                                                                                <Table
                                                                                  aria-label="userDetails"
                                                                                  style={{
                                                                                    border:
                                                                                      "1px gray solid",
                                                                                    borderCollapse:
                                                                                      "collapse",
                                                                                    width:
                                                                                      "100%",
                                                                                    borderRadius:
                                                                                      "15px",
                                                                                  }}
                                                                                >
                                                                                  <TableHead
                                                                                    style={{
                                                                                      border:
                                                                                        "1px gray solid",
                                                                                      borderCollapse:
                                                                                        "collapse",
                                                                                      backgroundColor:
                                                                                        "#0249bc",
                                                                                    }}
                                                                                  >
                                                                                    <StyledTableRow>
                                                                                      <StyledTableCell
                                                                                        style={{
                                                                                          fontSize: 14,
                                                                                          fontWeight: 500,
                                                                                          border:
                                                                                            "1px gray solid",
                                                                                          padding:
                                                                                            "5px",
                                                                                        }}
                                                                                        align="center"
                                                                                      >
                                                                                        Sr.
                                                                                        No.
                                                                                      </StyledTableCell>
                                                                                      <StyledTableCell
                                                                                        style={{
                                                                                          fontSize: 14,
                                                                                          fontWeight: 500,
                                                                                          border:
                                                                                            "1px gray solid",
                                                                                          padding:
                                                                                            "5px",
                                                                                        }}
                                                                                        align="center"
                                                                                      >
                                                                                        File
                                                                                        Name
                                                                                      </StyledTableCell>
                                                                                      <StyledTableCell
                                                                                        style={{
                                                                                          fontSize: 14,
                                                                                          fontWeight: 500,
                                                                                          border:
                                                                                            "1px gray solid",
                                                                                          padding:
                                                                                            "5px",
                                                                                        }}
                                                                                        align="center"
                                                                                      >
                                                                                        Watch
                                                                                        Time
                                                                                      </StyledTableCell>
                                                                                    </StyledTableRow>
                                                                                  </TableHead>
                                                                                  <TableBody>
                                                                                    {userNameChildData.map(
                                                                                      (
                                                                                        row: any,
                                                                                        index: any
                                                                                      ) => (
                                                                                        <StyledTableRow
                                                                                          key={
                                                                                            index
                                                                                          }
                                                                                          style={{
                                                                                            border:
                                                                                              "1px gray solid",
                                                                                            padding:
                                                                                              "5px",
                                                                                          }}
                                                                                        >
                                                                                          <TableCell
                                                                                            style={{
                                                                                              border:
                                                                                                "1px gray solid",
                                                                                              padding:
                                                                                                "5px",
                                                                                            }}
                                                                                            align="center"
                                                                                          >
                                                                                            {index +
                                                                                              1}
                                                                                          </TableCell>
                                                                                          <TableCell
                                                                                            style={{
                                                                                              border:
                                                                                                "1px gray solid",
                                                                                              padding:
                                                                                                "5px",
                                                                                            }}
                                                                                            //  align="center"
                                                                                          >
                                                                                            {
                                                                                              row.fieldName
                                                                                            }
                                                                                          </TableCell>
                                                                                          <TableCell
                                                                                            style={{
                                                                                              border:
                                                                                                "1px gray solid",
                                                                                              padding:
                                                                                                "5px",
                                                                                            }}
                                                                                            align="right"
                                                                                          >
                                                                                            {formatTime(
                                                                                              row.diffTime
                                                                                            )}
                                                                                          </TableCell>
                                                                                        </StyledTableRow>
                                                                                      )
                                                                                    )}
                                                                                  </TableBody>
                                                                                </Table>
                                                                              </Box>
                                                                            ) : (
                                                                              <div
                                                                                style={{
                                                                                  marginTop: 10,
                                                                                  marginBottom: 10,
                                                                                }}
                                                                              >
                                                                                No
                                                                                data
                                                                                available
                                                                              </div>
                                                                            )}
                                                                          </Collapse>
                                                                        </TableCell>
                                                                      </TableRow>
                                                                    </React.Fragment>
                                                                  )
                                                                )}
                                                              </TableBody>
                                                            </Table>
                                                          </Box>
                                                        ) : (
                                                          <div
                                                            style={{
                                                              marginTop: 10,
                                                              marginBottom: 10,
                                                            }}
                                                          >
                                                            {/* No data available */}
                                                          </div>
                                                        )}
                                                      </Collapse>
                                                    </TableCell>
                                                  </StyledTableRow>
                                                </React.Fragment>
                                              )
                                            )}
                                          </TableBody>
                                        </Table>
                                      </Box>
                                    ) : (
                                      <div
                                        style={{
                                          marginTop: 10,
                                          marginBottom: 10,
                                        }}
                                      >
                                        No data available
                                      </div>
                                    )}
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          )
                        )
                      ) : (
                        <StyledTableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            style={{ border: "1px gray solid" }}
                          >
                            No data available
                          </TableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ margin: "10px" }}
                md={12}
                lg={12}
                xs={12}
              >
                <Grid
                  md={12}
                  lg={12}
                  xs={12}
                  sx={{
                    padding: "5px",
                    border: "0.5px solid grey",
                    margin: "2px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography fontWeight={600} fontSize={17} align="center">
                    User Visited Subject
                  </Typography>
                </Grid>

                <TableContainer
                  component={Paper}
                  id="tabcont"
                  sx={{
                    maxHeight: "65vh",
                    marginBottom: "10px",
                    border: "0.5px solid grey",
                  }}
                >
                  <Table
                    aria-label="customized  table"
                    style={{
                      border: "1px gray solid",
                      borderCollapse: "collapse",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <TableHead
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        position: "sticky",
                        backgroundColor: "#1DCAD1",
                        color: "#fff",
                      }}
                    >
                      <TableRow>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black",
                          }}
                        >
                          Sr No
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            // color:"black",
                            padding: "10px",
                          }}
                        >
                          Subject Name
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black",
                          }}
                        >
                          Content Type
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          Most Visited
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateWiseData?.subjectStateWise?.length > 0 ? (
                        stateWiseData.subjectStateWise.map(
                          (item: any, index: any) => (
                            <StyledTableRow
                              key={index}
                              sx={{ border: "1px gray solid" }}
                            >
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                align="center"
                                width="50px"
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                // align="center"
                              >
                                {item.subjectName}
                              </TableCell>
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                // align="center"
                              >
                                {item.contentType}
                              </TableCell>
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                align="right"
                              >
                                {item.mostvisited}
                              </TableCell>
                            </StyledTableRow>
                          )
                        )
                      ) : (
                        <StyledTableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            style={{ border: "1px gray solid" }}
                          >
                            No data available
                          </TableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ margin: "10px" }}
                md={12}
                lg={12}
                xs={12}
              >
                <Grid
                  md={12}
                  lg={12}
                  xs={12}
                  sx={{
                    padding: "5px",
                    border: "0.5px solid grey",
                    margin: "2px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography fontWeight={600} fontSize={17} align="center">
                    Visitor
                  </Typography>
                </Grid>

                <TableContainer
                  component={Paper}
                  id="tabcont"
                  sx={{
                    maxHeight: "65vh",
                    marginBottom: "10px",
                    border: "0.5px solid grey",
                  }}
                >
                  <Table
                    aria-label="customized  table"
                    style={{
                      border: "1px gray solid",
                      borderCollapse: "collapse",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                  >
                    <TableHead
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        position: "sticky",
                        backgroundColor: "#1DCAD1",
                        color: "#fff",
                      }}
                    >
                      <TableRow>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          Sr No
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          Division Name
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black"
                          }}
                        >
                          State Name
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            border: "1px gray solid",
                            padding: "10px",
                            // color:"black",
                          }}
                        >
                          Visit
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateWiseData?.visitorStateWise?.length > 0 ? (
                        stateWiseData.visitorStateWise.map(
                          (item: any, index: any) => (
                            <StyledTableRow sx={{ border: "1px gray solid" }}>
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                align="center"
                                width="50px"
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell style={{ border: "1px gray solid" }}>
                                {item.devisionName}
                              </TableCell>
                              <TableCell style={{ border: "1px gray solid" }}>
                                {item.stateName}
                              </TableCell>
                              <TableCell
                                style={{ border: "1px gray solid" }}
                                align="right"
                                width='70px'
                              >
                                {item.visit}
                              </TableCell>
                            </StyledTableRow>
                          )
                        )
                      ) : (
                        <StyledTableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            style={{ border: "1px gray solid" }}
                          >
                            No data available
                          </TableCell>
                        </StyledTableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={heirarchalUsersActivityState}
          fullWidth={fullWidth}
          maxWidth="lg"
          // fullScreen
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            sx={{
              backgroundColor: "#00009c",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
              marginBottom: "2px",
            }}
          >
            <Typography fontWeight="600" fontSize={17}>
              <i>Heirarchical Users Activity</i>
            </Typography>

            <IconButton
              edge="end"
              onClick={handleheirarchalUsersActivityState}
              aria-label="close"
              sx={{
                color: "#fff",
                position: "absolute",
                right: 20,
                top: 10,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f4f4f5", height: "25%" }}>
            <Divider />

            <DialogContentText>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ marginTop: 2, marginBottom: 2, color: "#000" }}
              >
                <Grid xs={12} md={2} sm={2} item>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={state2Option}
                    fullWidth
                    size="small"
                    value={state2Data?.label}
                    onChange={(event: any, newValue: any) => {
                      console.log(newValue?.value);
                      if (newValue) {
                        setState2Data(newValue?.value);
                        // getDivisionData(newValue?.value);
                      } else {
                        setState2Data("");
                      }
                    }}
                    renderInput={(params: any) => (
                      <TextField {...params} label="Select State" />
                    )}
                  />
                </Grid>

                {state2Data === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={division2Option}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setDivision2Data(newValue?.value);
                          getDashBoardSummary(newValue?.value, "division");
                          getHirerchicalData(newValue?.value, "district");
                        } else {
                          setDivision2Data("");
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select Division" />
                      )}
                    />
                  </Grid>
                )}

                {division2Data === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={district2Option || []}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setDistrict2Data(newValue?.value);
                          getDashBoardSummary(newValue?.value, "district");
                          getHirerchicalData(newValue?.value, "block");
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select District" />
                      )}
                    />
                  </Grid>
                )}

                {district2Data === "" ? (
                  ""
                ) : (
                  <Grid xs={12} md={2} sm={2} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={block2Option || []}
                      fullWidth
                      size="small"
                      onChange={(event: any, newValue: any) => {
                        console.log(newValue?.value);
                        if (newValue) {
                          setBlock2Data(newValue?.value);
                          getDashBoardSummary(newValue?.value, "block");
                        }
                      }}
                      renderInput={(params: any) => (
                        <TextField {...params} label="Select Block" />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContentText>

            <Grid sx={{ marginTop: 1, marginBottom: 2 }}>
              <Typography fontSize={14} fontWeight={600} align="left">
                Last 30 Days :
              </Typography>
            </Grid>
            <DialogContentText>
              <Grid
                container
                spacing={1}
                alignItems="flex-start"
                // sx={{ margin: "1px" }}
                // justifyContent="space-between"
                //gap={1}
                // md={12}
                // lg={12}
                // xs={12}
                // item
              >
                <Grid
                  spacing={1}
                  alignItems="center"
                  // sx={{ margin: "2px" }}
                  md={4}
                  // lg={3.5}
                  // xs={12}
                  item
                >
                  <Grid
                    md={12}
                    // lg={12}
                    // xs={12}
                    sx={{
                      padding: "5px",
                      border: "0.5px solid grey",
                      margin: "2px",
                    }}
                  >
                    <Typography fontWeight={600} fontSize={15} align="center">
                      Applicable Organizations(Lib.)
                    </Typography>
                  </Grid>
                  <TableContainer
                    component={Paper}
                    id="tabcont"
                    sx={{
                      maxHeight: "65vh",
                      marginBottom: "10px",
                      border: "0.5px solid grey",
                    }}
                  >
                    <Table
                      aria-label="customized  table"
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        width: "100%",
                      }}
                    >
                      <TableHead
                        style={{
                          border: "1px gray solid",
                          borderCollapse: "collapse",
                          position: "sticky",
                          backgroundColor: "#1DCAD1",
                          color: "#fff",
                        }}
                      >
                        <TableRow>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                              border: "1px gray solid",
                              padding: "10px",
                              // color:"black"
                              width: "100px",
                            }}
                          >
                            Libraries
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {heirarchicalData?.libs?.length > 0 ? (
                          heirarchicalData.libs.map((item: any, index: any) => (
                            <React.Fragment key={item.value}>
                              <StyledTableRow
                                key={index}
                                sx={{ border: "1px gray solid" }}
                              >
                                <TableCell
                                  style={{
                                    border: "1px gray solid",
                                    cursor: "pointer",
                                    width: "120px",
                                    textDecoration:
                                      librariesOptionRowId === item.value
                                        ? "underline"
                                        : "none",
                                    color:
                                      librariesOptionRowId === item.value
                                        ? "blue"
                                        : "inherit",
                                  }}
                                  onClick={() => getLibrariesChildData(item)}
                                >
                                  {item.label}
                                </TableCell>
                              </StyledTableRow>
                            </React.Fragment>
                          ))
                        ) : (
                          <StyledTableRow>
                            <TableCell
                              colSpan={4}
                              align="center"
                              style={{ border: "1px gray solid" }}
                            >
                              No data available
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid
                  spacing={1}
                  alignItems="center"
                  // sx={{ margin: "2px" }}
                  md={4}
                  // lg={3.3}
                  // xs={12}
                  item
                >
                  <Grid
                    md={12}
                    lg={12}
                    xs={12}
                    sx={{
                      padding: "5px",
                      border: "0.5px solid grey",
                      margin: "2px",
                    }}
                  >
                    <Typography fontWeight={600} fontSize={15} align="center">
                      Users Logged
                    </Typography>
                  </Grid>

                  <TableContainer
                    component={Paper}
                    id="tabcont"
                    sx={{
                      maxHeight: "65vh",
                      marginBottom: "10px",
                      border: "0.5px solid grey",
                    }}
                  >
                    <Table
                      aria-label="customized  table"
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        width: "100%",
                      }}
                    >
                      <TableHead
                        style={{
                          border: "1px gray solid",
                          borderCollapse: "collapse",
                          position: "sticky",
                          backgroundColor: "#1DCAD1",
                          color: "#fff",
                        }}
                      >
                        <TableRow>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                              border: "1px gray solid",
                              // color:"black",
                              padding: "10px",
                            }}
                          >
                            Name
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                              border: "1px gray solid",
                              padding: "10px",
                              // color:"black",
                            }}
                          >
                            Number
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {heirarchicalData?.users?.length > 0 ? (
                          heirarchicalData.users.map(
                            (item: any, index: any) => (
                              <StyledTableRow
                                key={index}
                                sx={{ border: "1px gray solid" }}
                              >
                                <TableCell
                                  style={{
                                    border: "1px gray solid",
                                    width: "90px",
                                  }}
                                  // align="center"
                                >
                                  {item.label}
                                </TableCell>
                                <TableCell
                                  style={{
                                    border: "1px gray solid",
                                    width: "70px",
                                  }}
                                  align="right"
                                >
                                  {item.nos}
                                </TableCell>
                              </StyledTableRow>
                            )
                          )
                        ) : (
                          <StyledTableRow>
                            <TableCell
                              colSpan={4}
                              align="center"
                              style={{ border: "1px gray solid" }}
                            >
                              No data available
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid
                  spacing={1}
                  alignItems="center"
                  // sx={{ margin: "2px" }}
                  md={4}
                  // lg={3.3}
                  // xs={12}
                  item
                >
                  <Grid
                    md={12}
                    lg={12}
                    xs={12}
                    sx={{
                      padding: "5px",
                      border: "0.5px solid grey",
                      margin: "2px",
                    }}
                  >
                    <Typography fontWeight={600} fontSize={17} align="center">
                      Application Opened
                    </Typography>
                  </Grid>

                  <TableContainer
                    component={Paper}
                    id="tabcont"
                    sx={{
                      maxHeight: "65vh",
                      marginBottom: "10px",
                      border: "0.5px solid grey",
                    }}
                  >
                    <Table
                      aria-label="customized  table"
                      style={{
                        border: "1px gray solid",
                        borderCollapse: "collapse",
                        width: "100%",
                      }}
                    >
                      <TableHead
                        style={{
                          border: "1px gray solid",
                          borderCollapse: "collapse",
                          position: "sticky",
                          backgroundColor: "#1DCAD1",
                          color: "#fff",
                        }}
                      >
                        <TableRow>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              border: "1px gray solid",
                              padding: "10px",
                              // color:"black"
                            }}
                          >
                            Name
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              border: "1px gray solid",
                              padding: "10px",
                              // color:"black",
                            }}
                          >
                            User
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              border: "1px gray solid",
                              padding: "10px",
                              // color:"black"
                            }}
                          >
                            Number
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {heirarchicalData?.apps?.length > 0 ? (
                          heirarchicalData.apps.map((item: any, index: any) => (
                            <StyledTableRow sx={{ border: "1px gray solid" }}>
                              <TableCell
                                style={{
                                  border: "1px gray solid",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {item.name}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px gray solid",
                                  width: "110px",
                                }}
                                align="left"
                              >
                                {item.label}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px gray solid",
                                  width: "110px",
                                }}
                                align="right"
                              >
                                {item.nos}
                              </TableCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <TableCell
                              colSpan={4}
                              align="center"
                              style={{ border: "1px gray solid" }}
                            >
                              No data available
                            </TableCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Divider />

              <Collapse
                in={!!librariesOptionRowId}
                timeout="auto"
                unmountOnExit
              >
                <Grid container spacing={1}>
                  <Grid item spacing={2} md={12} lg={12} xs={12}>
                    <Typography fontSize={14} fontWeight={600} align="left">
                      {selectLibraryName}
                    </Typography>
                  </Grid>
                  {/* <Grid container  item md={12}
                      //display="flex" justifyContent="space-between" 
                     > */}

                  <Grid item spacing={1} md={4} lg={4}>
                    {childDatas.loginRecList?.length > 0 ? (
                      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                        <TableContainer
                          component={Paper}
                          id="tabcont"
                          sx={{
                            maxHeight: "65vh",
                            marginBottom: "10px",
                            border: "0.5px solid grey",
                          }}
                        >
                          <Table
                            aria-label="purchases"
                            style={{
                              border: "1px gray solid",
                              borderCollapse: "collapse",
                              width: "100%",
                              borderRadius: "15px",
                            }}
                          >
                            <TableHead
                              style={{
                                border: "1px gray solid",
                                borderCollapse: "collapse",
                                backgroundColor: "#0249bc",
                              }}
                            >
                              <TableRow>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Login Name
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Login Time-in
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Login Time-out
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  IP Address
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {childDatas?.loginRecList?.map(
                                (tran: any, index: any) => (
                                  <React.Fragment key={index}>
                                    <StyledTableRow
                                      key={index}
                                      style={{
                                        border: "1px gray solid",
                                        padding: "5px",
                                      }}
                                    >
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                      >
                                        {tran.loginName}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {tran.loginTime
                                          ? dayjs(tran.loginTime).format(
                                              "DD-MMM-YYYY h:mm"
                                            )
                                          : "--"}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {tran.logOutTime
                                          ? dayjs(tran.logOutTime).format(
                                              "DD-MMM-YYYY h:mm"
                                            )
                                          : "--"}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {tran.ipAddress}
                                      </TableCell>
                                    </StyledTableRow>
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <div style={{ marginTop: 10, marginBottom: 10 }}>
                        No data available
                      </div>
                    )}
                  </Grid>

                  <Grid item spacing={1} md={4} lg={4}>
                    {childDatas.loginRecSumm?.length > 0 ? (
                      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                        <TableContainer
                          component={Paper}
                          id="tabcont"
                          sx={{
                            maxHeight: "65vh",
                            marginBottom: "10px",
                            border: "0.5px solid grey",
                          }}
                        >
                          <Table
                            aria-label="purchases"
                            style={{
                              border: "1px gray solid",
                              borderCollapse: "collapse",
                              width: "100%",
                              borderRadius: "15px",
                            }}
                          >
                            <TableHead
                              style={{
                                border: "1px gray solid",
                                borderCollapse: "collapse",
                                backgroundColor: "#0249bc",
                              }}
                            >
                              <TableRow>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Sr. No.
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Login Name
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Worked Time
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {childDatas?.loginRecSumm?.map(
                                (tran: any, index: any) => (
                                  <React.Fragment key={index}>
                                    <StyledTableRow
                                      key={index}
                                      style={{
                                        border: "1px gray solid",
                                        padding: "5px",
                                      }}
                                    >
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                      >
                                        {tran.loginName}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {tran.workedTime}
                                      </TableCell>
                                    </StyledTableRow>
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <div style={{ marginTop: 10, marginBottom: 10 }}>
                        No data available
                      </div>
                    )}
                  </Grid>

                  <Grid item spacing={1} md={4} xs={12} lg={4}>
                    {childDatas.appRecList?.length > 0 ? (
                      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
                        <TableContainer
                          component={Paper}
                          id="tabcont"
                          sx={{
                            maxHeight: "65vh",
                            marginBottom: "10px",
                            border: "0.5px solid grey",
                          }}
                        >
                          <Table
                            aria-label="purchases"
                            style={{
                              border: "1px gray solid",
                              borderCollapse: "collapse",
                              width: "100%",
                              borderRadius: "15px",
                            }}
                          >
                            <TableHead
                              style={{
                                border: "1px gray solid",
                                borderCollapse: "collapse",
                                backgroundColor: "#0249bc",
                              }}
                            >
                              <TableRow>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Sr. No.
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Application
                                </StyledTableCell>
                                <StyledTableCell
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    border: "1px gray solid",
                                    padding: "5px",
                                  }}
                                  align="center"
                                >
                                  Start Time
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {childDatas?.appRecList?.map(
                                (tran: any, index: any) => (
                                  <React.Fragment key={index}>
                                    <StyledTableRow
                                      key={index}
                                      style={{
                                        border: "1px gray solid",
                                        padding: "5px",
                                      }}
                                    >
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                      >
                                        {tran.application}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          border: "1px gray solid",
                                          padding: "5px",
                                        }}
                                        align="center"
                                      >
                                        {tran.opTime
                                          ? dayjs(tran.opTime).format(
                                              "DD-MMM-YYYY h:mm"
                                            )
                                          : "--"}
                                      </TableCell>
                                    </StyledTableRow>
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <div style={{ marginTop: 10, marginBottom: 10 }}>
                        No data available
                      </div>
                    )}
                  </Grid>
                  {/* </Grid> */}
                </Grid>
              </Collapse>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Divider />

        {itemStatusSum !== undefined &&
          itemStatusSum !== "" &&
          itemStatusSum !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Item Type Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    // width={'100%'}
                    height={"90%"}
                    chartType="PieChart"
                    data={itemStatusSum}
                    options={{
                      title: "Item Type Distribution",
                      pieHole: 0.4,
                      // slices: {
                      //     0: {offset: 0.1},
                      //     1: {offset: 0.2},
                      legend: { position: "bottom" },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}

        {itemProgramSum !== undefined &&
          itemProgramSum !== "" &&
          itemProgramSum !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Program Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    width={"100%"}
                    height={"90%"}
                    chartType="PieChart"
                    data={itemProgramSum}
                    options={{
                      pieSliceText: "label",
                      title: "Program Distribution",
                      pieHole: 0.4,
                      slices: {
                        0: { offset: 0.1 },
                      },
                      legend: {
                        position: "bottom",
                      },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}

        {chartLibData !== undefined &&
          chartLibData !== "" &&
          chartLibData !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Member Program Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    // width={'100%'}
                    height={"90%"}
                    chartType="PieChart"
                    data={chartLibData}
                    options={{
                      title: "Program Distribution",
                      pieHole: 0.4,
                      // slices: {
                      //     0: {offset: 0.1},
                      //     1: {offset: 0.2},
                      legend: { position: "bottom" },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}

        {classNameDistribution !== undefined &&
          classNameDistribution !== "" &&
          classNameDistribution !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Member ClassName Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    // width={'100%'}
                    height={"90%"}
                    chartType="PieChart"
                    data={classNameDistribution}
                    options={{
                      title: "ClassName Distribution",
                      pieHole: 0.4,
                      // slices: {
                      //     0: {offset: 0.1},
                      //     1: {offset: 0.2},
                      legend: { position: "bottom" },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}

        {categorySummary !== undefined &&
          categorySummary !== "" &&
          categorySummary !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Category Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    // width={'100%'}
                    height={"90%"}
                    chartType="PieChart"
                    data={categorySummary}
                    options={{
                      title: "Category Distribution",
                      pieHole: 0.4,
                      // slices: {
                      //     0: {offset: 0.1},
                      //     1: {offset: 0.2},
                      legend: { position: "bottom" },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}

        {memberFines !== undefined &&
          memberFines !== "" &&
          memberFines !== null && (
            <Grid xs={12} sm={6} md={6} item>
              <Card
                elevation={4}
                style={{
                  marginLeft: "0.5%",
                  border: ".5px solid transparent",
                  borderRadius: "10px",
                }}
              >
                <Grid
                  style={{
                    width: "100%",
                    height: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      padding: "17px",
                      background: "linear-gradient(to right, #7fd1eb, blue )",
                      backgroundColor: "#7fd1eb",
                    }}
                  >
                    Subject Distribution
                  </Typography>
                  {/* <div style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}> */}
                  <Chart
                    // width={'100%'}
                    height={"90%"}
                    chartType="PieChart"
                    data={memberFines}
                    options={{
                      title: "Subject Distribution",
                      pieHole: 0.4,
                      // slices: {
                      //     0: {offset: 0.1},
                      //     1: {offset: 0.2},
                      legend: { position: "bottom" },
                    }}
                  />
                  {/* </div> */}
                </Grid>
              </Card>
            </Grid>
          )}
      </Grid>
    </div>
  );
};