import { RouteType } from "./config";
import HomeIcon from "@mui/icons-material/Home";
import LoginPage from "../loginPage/LoginPage";
import HomePage from "../pages/home/HomePage";
import Subject_master from "../pages/Subjects";
import InstituteAdd from "../pages/InstituteAdd";
import InstituteEdit from "../pages/InstituteEdit";
import AddDigitalContent from "../pages/AddDigitalContent";
import CreateDigitalContent from "../pages/CreateDigitalContent";
import EditDigitalContent from "../pages/EditDigitalContent";
import Program_Master from "../pages/Program_Master";
import Institutemaster from "../pages/Institutemaster";
import DepartmentMaster2 from "../pages/DepartmentMaster2";
import DepartmentAdd from "../pages/DepartmentAdd";
import DepartmentEdit from "../pages/DepartmentEdit";
import Designation_Master from "../pages/Designation_Master";
import MemberPetronAdd from "../pages/MemberPetronAdd";
import MemberPetronEdit from "../pages/MemberPetronEdit";
import StateMaster from "../pages/StateMaster";
import StateMasterAdd from "../pages/StateMasterAdd";
import StateMasterEdit from "../pages/StateMasterEdit";
import DivisionMasterpage from "../pages/DivisionMasterpage";
import DistrictMasterpage from "../pages/DistrictMasterpage";
import BlockMaster from "../pages/BlockMaster";
import ClusterMasterpage from "../pages/ClusterMasterpage";
import MemberPetron from "../pages/MemberPetron";
import ImageViewer from "../pages/ImageViewer";
import Pdfviewer from "../pages/Pdfviewer";
import VideoAudioViewer from "../pages/VideoAudioViewer";
import EPubViewer from "../pages/EPubViewer";
import ClassPeriods from "../pages/ClassPeriods";

import ProgramSubject from "../pages/ProgramSubject";

import DigitalContentList from "../pages/DigitalContentList";
import ClassTimeTable from "../pages/ClassTimeTable";
import ClassTimeTableAdd from "../pages/ClassTimeTableAdd";
import ClassTimeTableEdit from "../pages/ClassTimeTableEdit";
import StudentDayClass from "../pages/StudentDayClass";
//import StudentDayClassAdd from "../pages/StudentDayClassAdd";
import TeachingStaff from "../pages/TeachingStaff";
import TimeTableStdt from "../pages/TimeTableStdt";
import ClassMaster from "../pages/ClassMaster";
import CategoryLoadingStatus from "../pages/CategoryLoadingStatus";
import Item_Type from "../pages/Item_Type";
import ContentType from "../pages/ContentType";
import UserManageHourlyTrans from "../pages/UserManageHourlyTrans";
import HourlyTransactionDetails from "../pages/HourlyTransactionDetails";
import HourlyIssue from "../pages/HourlyIssue";
import HourlyReturn from "../pages/HourlyReturn";
import ThemeSetting from "../pages/ThemeSetting";
import ThemeSettingAdd from "../pages/ThemeSettingAdd";
import ThemeSettingEdit from "../pages/ThemeSettingEdit";
import WbSetting from "../pages/WbSetting";
import WbSettingAdd from "../pages/WbSettingAdd";
import WbSettingEdit from "../pages/WbSettingEdit";
import CircBookIssue2 from "../pages/CircBookIssue2";
import CircBookReceive2 from "../pages/CircBookReceive2";

import ItemStatus from "../pages/ItemStatus";
import TranslationLanguages from "../pages/TranslationLanguages";
import { CurrencyExchange } from "@mui/icons-material";
import CurrencyExchangeRates from "../pages/CurrencyExchangeRates";
import MediaType from "../pages/MediaType";
//import { Language } from "@mui/icons-material";
import Masscatentry from "../pages/masscatentry";
import Stockledger from "../pages/Stockledger";

import PurchaseOrderMaster from "../pages/PurchaseOrderMaster";
import CreatePurchaseOrder from "../pages/CreatePurchaseOrder";
import EditPurchaseOrder from "../pages/EditPurchaseOrder";

import IssuReturnTrans from "../pages/IssuReturnTrans";
import Frmissuesofuser from "../pages/frmissuesofuser";
import HourlyMemberReport from "../pages/HourlyMemberReport";

import ChatBot from "../pages/ChatBot/ChatBot";
import HelpCreation from "../pages/HelpCreation";
import HelpDesk from "../pages/HelpDesk";
import StockLedgerReport from "../pages/StockLedgerReport";

import SaleInvoiceMaster from "../pages/SaleInvoiceMaster";
import CreateSaleInvoice from "../pages/CreateSaleInvoice";
import EditSaleInvoice from "../pages/EditSaleInvoice";
import OrderItemList from "../pages/OrderItemList";
import StockReport from "../pages/StockReport";
import LibraryParameterManagement from "../pages/LibraryParameterManagement";
import UserInstituteMapping from "../pages/UserInstituteMapping";
import FormlevelPermission from "../pages/FormlevelPermission";

import UserType from "../pages/UserType";
import AssignUserTypeToMember from "../pages/AssignUserTypeToMember";
import UserDetails from "../pages/UserDetails";
import CreatePurchaseReturn from "../pages/CreatePurchaseReturn";
import EditPurchaseReturnOrder from "../pages/EditPurchaseReturnOrder";
import PurchaseReturn from "../pages/PurchaseReturn";
import SaleReturn from "../pages/SaleReturn";
import EditSaleReturnInvoice from "../pages/EditSaleReturnInvoice";
import CreateSaleReturnInvoice from "../pages/CreateSaleReturnInvoice";
import Login_Page from "../loginPage/Login_Page";
import Login_Page1 from "../loginPage/Login_Page1";
import Banner from "../pages/Banner";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <Login_Page />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },

  // {
  //   element: <ContentType />,
  //   state: "ContentType",
  //   path: "/home/ContentType",
  //   sidebarProps: {
  //     displayText: "Content Type",
  //   },
  // },

  {
    path: "/Subject_master",
    element: <Subject_master />,
    state: "Subject_master",
    sidebarProps: {
      displayText: "Subjects",
    },
  },
  {
    path: "/Program_Master",
    element: <Program_Master />,
    state: "Program_Master",
    sidebarProps: {
      displayText: "Program Courses",
    },
  },

  {
    path: "/Institutemaster",
    element: <Institutemaster />,
    state: "InstituteMaster",
    sidebarProps: {
      displayText: "Institute Master",
    },
  },

  {
    path: "/InstituteAdd",
    element: <InstituteAdd />,
    state: "InstituteAdd",
  },
  {
    path: "/InstituteEdit",
    element: <InstituteEdit />,
    state: "InstituteEdit",
  },

  {
    path: "/DepartmentMaster2",
    element: <DepartmentMaster2 />,
    state: "DepartmentMaster",
    sidebarProps: {
      displayText: "Department Master",
    },
  },
  {
    path: "/DepartmentAdd",
    element: <DepartmentAdd />,
    state: "DepartmentAdd",
  },
  {
    path: "/DepartmentEdit",
    element: <DepartmentEdit />,
    state: "DepartmentEdit",
  },

  {
    path: "/Designation_Master",
    element: <Designation_Master />,
    state: "Designation_Master",
    sidebarProps: {
      displayText: "Designation Master",
    },
  },

  {
    path: "/UserManagement",
    element: <MemberPetron />,
    state: "UserManagement",
    sidebarProps: {
      displayText: "Member Petron",
    },
  },

  {
    path: "/MemberPetronAdd",
    element: <MemberPetronAdd />,
    state: "MemberPetronAdd",
  },
  {
    path: "/MemberPetronEdit",
    element: <MemberPetronEdit />,
    state: "MemberPetronEdit",
  },

  {
    path: "/StateMaster",
    element: <StateMaster />,
    state: "StateMaster",
    sidebarProps: {
      displayText: "State",
    },
  },
  {
    path: "/StateMasterAdd",
    element: <StateMasterAdd />,
    state: "StateMasterAdd",
  },
  {
    path: "/StateMasterEdit",
    element: <StateMasterEdit />,
    state: "StateMasterEdit",
  },
  {
    path: "/Purchaseorder",
    element: <PurchaseOrderMaster/>,
    state: "Purchaseorder",
    sidebarProps: {
      displayText: "Purchase Order",
    },
  },
  {
    path: "/CreatePurchaseOrder",
    element: <CreatePurchaseOrder/>,
    state: "CreatePurchaseOrder",
  },
  {
    path: "/EditPurchaseOrder",
    element: <EditPurchaseOrder/>,
    state: "EditPurchaseOrder",
  },
  {
    path: "/SaleInvoice",
    element: <SaleInvoiceMaster/>,
    state: "SaleInvoice",
    sidebarProps: {
      displayText: "Sale Invoice",
    },
  },
  {
    path: "/CreateSaleInvoice",
    element: <CreateSaleInvoice/>,
    state: "CreateSaleInvoice",
  },
  {
    path: "/EditSaleInvoice",
    element: <EditSaleInvoice/>,
    state: "EditSaleInvoice",
  },

  {
    path: "/DivisionMasterpage",
    element: <DivisionMasterpage />,
    state: "DivisionMasterpage",
    sidebarProps: {
      displayText: "Division",
    },
  },

  {
    path: "/DistrictMasterpage",
    element: <DistrictMasterpage />,
    state: "DistrictMasterpage",
    sidebarProps: {
      displayText: "District",
    },
  },

  {
    path: "/BlockMaster",
    element: <BlockMaster />,
    state: "BlockMaster",
    sidebarProps: {
      displayText: "Block",
    },
  },

  {
    path: "/Subject_master",
    element: <Subject_master />,
    state: "Subject_master",
    sidebarProps: {
      displayText: "Subjects",
    },
  },
  {
    path: "/ImageViewer",
    element: <ImageViewer />,
    state: "ImageViewer",
    sidebarProps: {
      displayText: "Image Viewer",
    },
  },
  {
    path: "/Pdfviewer",
    element: <Pdfviewer />,
    state: "Pdfviewer",
    sidebarProps: {
      displayText: "Pdf Viewer",
    },
  },
  {
    path: "/EPubViewer",
    element: <EPubViewer />,
    state: "EPubViewer",
    sidebarProps: {
      displayText: "EPub Viewer",
    },
  },
  //VideoAudioViewer   EPubViewer
  {
    path: "/VideoAudioViewer",
    element: <VideoAudioViewer />,
    state: "VideoAudioViewer",
    sidebarProps: {
      displayText: "Video/Audio Viewer",
    },
  },
  {
    path: "/AddDigitalContent",
    element: <AddDigitalContent />,
    state: "AddDigitalContent",
    sidebarProps: {
      displayText: "Add Digital Content",
    },
  },
  {
    path: "/CreateDigitalContent",
    element: <CreateDigitalContent />,
    state: "CreateDigitalContent",
  },
  {
    path: "/EditDigitalContent",
    element: <EditDigitalContent />,
    state: "EditDigitalContent",
  },
  {
    path: "ContentType",
    element: <ContentType />,
    state: "ContentType",
  },
  {
    path: "/ClusterMasterpage",
    element: <ClusterMasterpage />,
    state: "ClusterMasterpage",
    sidebarProps: {
      displayText: "Cluster",
    },
  },

  {
    path: "/ImageViewer",
    element: <ImageViewer />,
    state: "ImageViewer",
    sidebarProps: {
      displayText: "Image Viewer",
    },
  },
  {
    path: "/ClassPeriods",
    element: <ClassPeriods />,
    state: "ClassPeriods",
    sidebarProps: {
      displayText: "Time Table Periods",
    },
  },
  {
    path: "/ProgramSubject",
    element: <ProgramSubject />,
    state: "ProgramSubject",
    sidebarProps: {
      displayText: "Academic Program-Subject",
    },
  },
  //==============Akansha===================
  {
    path: "/loadingstatus",
    element: <ItemStatus />,
    state: "loadingstatus",
    sidebarProps: {
      displayText: "loadingstatus",
    },
  },

  {
    path: "BannerMaster",
    element: <Banner/>,
    state: "BannerMaster",
  },
  {
    path: "/translationlanguages",
    element: <TranslationLanguages />,
    state: "translationlanguages",
    sidebarProps: {
      displayText: "translationlanguages",
    },
    
  },
  {
    path: "/exchangemaster",
    element: <CurrencyExchangeRates />,
    state: "exchangemaster",
    sidebarProps: {
      displayText: "exchangemaster",
    },
    
  },
  {
    path: "/frm_mediatype",
    element: <MediaType />,
    state: "frm_mediatype",
    sidebarProps: {
      displayText: "frm_mediatype",
    },
    
  },
  //=============End=====================
  {
    path: "/DigitalContentList",
    element: <DigitalContentList />,
    state: "DigitalContentList",
    sidebarProps: {
      displayText: "Digital Content List",
    },
  },

  {
    path: "/ClassTimeTable",
    element: <ClassTimeTable />,
    state: "ClassTimeTable",
    sidebarProps: {
      displayText: "Student Class Time Table",
    },
  },
  {
    path: "/ClassTimeTableAdd",
    element: <ClassTimeTableAdd />,
    state: "ClassTimeTableAdd",
  },
  {
    path: "/ClassTimeTableEdit",
    element: <ClassTimeTableEdit />,
    state: "ClassTimeTableEdit",
  },

  {
    path: "/StudentDayClass",
    element: <StudentDayClass />,
    state: "StudentDayClass",
    sidebarProps: {
      displayText: "Student Day Class",
    },
  },

  {
    path: "/TeachingStaff",
    element: <TeachingStaff />,
    state: "TeachingStaff",
    sidebarProps: {
      displayText: "Teaching Staff Panel",
    },
  },

  {
    path: "/TimeTableStdt",
    element: <TimeTableStdt />,
    state: "TimeTableStdt",
    sidebarProps: {
      displayText: "Print Time Table",
    },
  },

  {
    path: "/ClassMaster",
    element: <ClassMaster />,
    state: "ClassMaster",
    sidebarProps: {
      displayText: "Member Group[Faculty/Student]",
    },
  },

  {
    path: "/CategoryLoadingStatus",
    element: <CategoryLoadingStatus />,
    state: "CategoryLoadingStatus",
    sidebarProps: {
      displayText: "Item Category",
    },
  },

  {
    path: "/Item_Type",
    element: <Item_Type />,
    state: "Item_Type",
    sidebarProps: {
      displayText: "Item Type",
    },
  },

  {
    path: "ContentType",
    element: <ContentType/>,
    state: "ContentType",
  },

  {
    path: "/UserManageHourlyTrans",
    element: <UserManageHourlyTrans />,
    state: "UserManageHourlyTrans",
    sidebarProps: {
      displayText: "Item Type",
    },
  },

  {
    path: "/HourlyTransactionDetails",
    element: <HourlyTransactionDetails/>,
    state: "HourlyTransactionDetails",
    sidebarProps: {
      displayText: "Hourly Transaction",
    },
  },

  {
    path: "/HourlyIssue",
    element: <HourlyIssue/>,
    state: "HourlyIssue",
    sidebarProps: {
      displayText: "Hourly Issue",
    },
  },

  {
    path: "/HourlyReturn",
    element: <HourlyReturn/>,
    state: "HourlyReturn",
    sidebarProps: {
      displayText: "Hourly Return",
    },
  },

  {
    path: "/ThemeSetting",
    element: <ThemeSetting/>,
    state: "ThemeSetting",
    sidebarProps: {
      displayText: "Theme Setting",
    },
  },

  {
    path: "/ThemeSettingAdd",
    element: <ThemeSettingAdd/>,
    state: "ThemeSettingAdd",
   
  },

  {
    path: "/ThemeSettingEdit",
    element: <ThemeSettingEdit/>,
    state: "ThemeSettingEdit",
   
  },

  {
    path: "/WbSetting",
    element: <WbSetting/>,
    state: "WbSetting",
    sidebarProps: {
      displayText: "Web Setting",
    },
  },
  
  {
    path: "/WbSettingAdd",
    element: <WbSettingAdd/>,
    state: "WbSettingAdd",
   
  },

  {
    path: "/WbSettingEdit",
    element: <WbSettingEdit/>,
    state: "WbSetting",
   
  },

  {
    path: "/CircBookIssue2",
    element: <CircBookIssue2/>,
    state: "CircBookIssue2",
   
  },

  {
    path: "/CircBookReceive2",
    element: <CircBookReceive2/>,
    state: "CircBookReceive2",
   
  },
  {
    path: "/loadingstatus",
    element: <ItemStatus/>,
    state: "loadingstatus",
    sidebarProps: {
      displayText: "Item Status",
    },
    
  },
  
  {
    path: "/StockLedger",
    element: <Stockledger/>,
    state: "StockLedger",
   
  },

  {
    path: "/Masscatentry",
    element: <Masscatentry/>,
    state: "Masscatentry",
   
  },

  {
    path: "/IssuReturnTrans",
    element: <IssuReturnTrans />,
    state: "IssuReturnTrans",
    sidebarProps: {
      displayText: "Circulation Report",
    },
  },


  {
    path: "/frmissuesofuser",
    element: <Frmissuesofuser />,
    state: "frmissuesofuser",
    sidebarProps: {
      displayText: "Issue Details Of The Member",
    },
  },

  {
    path: "/HourlyMemberReport",
    element: <HourlyMemberReport />,
    state: "HourlyMemberReport",
    sidebarProps: {
      displayText: "Hourly Report",
    },
  },
  
  {
    path: "/HelpCreation",
    element: <HelpCreation/>,
    state: "HelpCreation",
    sidebarProps: {
      displayText: "Help Creation",
    },
  },


   
  {
    path: "/HelpDesk",
    element: <HelpDesk/>,
    state: "HelpDesk",
    sidebarProps: {
      displayText: "Help Desk",
    },
  },


  {
    path: "/StockLedgerReport",
    element: <StockLedgerReport/>,
    state: "StockLedgerReport",
    sidebarProps: {
      displayText: "Stock Ledger Report",
    },
  },

  
  {
    path: "/OrderItemList",
    element: <OrderItemList/>,
    state: "OrderItemList",
    sidebarProps: {
      displayText: "Order ItemList",
    },
  },

  {
    path: "/StockReport",
    element: <StockReport/>,
    state: "StockReport",
    sidebarProps: {
      displayText: "Stock Report",
    },
  },

  {
    path: "/LibraryParameterManagement",
    element: <LibraryParameterManagement/>,
    state: "LibraryParameterManagement",
    sidebarProps: {
      displayText: "Library Parameter Management",
    },
  },


  {
    path: "/UserInstituteMapping",
    element: <UserInstituteMapping/>,
    state: "UserInstituteMapping",
    sidebarProps: {
      displayText: "User Institute Mapping",
    },
  },



  {
    path: "/FormlevelPermission",
    element: <FormlevelPermission/>,
    state: "FormlevelPermission",
    sidebarProps: {
      displayText: "Form level Permission",
    },
  },


  {
    path: "/UserDetails",
    element: <UserDetails/>,
    state: "UserDetails",
    sidebarProps: {
      displayText: "User Details",
    },
  },

  {
    path: "/AssignUserType",
    element: <AssignUserTypeToMember/>,
    state: "AssignUserTypeToMember",
    sidebarProps: {
      displayText: "Assign User Type To Member",
    },

  },


  {
    path: "/UserType",
    element: <UserType/>,
    state: "UserType",
    sidebarProps: {
      displayText: "User Type",
    },
  },

{
    path: "/PurchaseReturn",
    element: <PurchaseReturn/>,
    state: "PurchaseReturn",
    sidebarProps: {
      displayText: "Purchase Return",
    },
  },
  {
    path: "/CreatePurchaseReturn",
    element: <CreatePurchaseReturn/>,
    state: "CreatePurchaseReturn",
  },
  {
    path: "/EditPurchaseReturnOrder",
    element: <EditPurchaseReturnOrder/>,
    state: "EditPurchaseReturnOrder",
  },
  {
    path: "/SaleReturn",
    element: <SaleReturn/>,
    state: "SaleReturn",
    sidebarProps: {
      displayText: "Sale Return",
    },
  },
  {
    path: "/CreateSaleReturnInvoice",
    element: <CreateSaleReturnInvoice/>,
    state: "Create Sale Return Invoice",
  },
  {
    path: "/EditSaleReturnInvoice",
    element: <EditSaleReturnInvoice/>,
    state: "Edit Sale Return Invoice",
  },

];

export default appRoutes;
