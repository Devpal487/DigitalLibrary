import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Modal,
  Radio,
  Stack,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import id from "../../assets/images/profile1.png";
import settings from "../../assets/images/settings.png";
import trans from "../../assets/images/translation.png";
import logout from "../../assets/images/logout.png";
import logged from "../../assets/images/institute.png";
import logo from "../../assets/images/adlogo1.png";
import loged from "../../assets/images/adlogo1.png";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { Home } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import "./Shine.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import names from "../../assets/images/id-card (2).png";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Checkbox } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/Url";
import help from "../../assets/images/help.png";
import dark from "../../assets/images/darkTheme.png";
import Light from "../../assets/images/lightTheme.png";
import institutionIcon from "../../assets/images/institute.png";
import cityIcon from "../../assets/images/city.png";
import libraryIcon from "../../assets/images/library.png";
import addressIcon from "../../assets/images/address.png";
import instituteIcon from "../../assets/images/institution.png";
import ThemeIcon from "../../assets/images/themes.png";
import ChatBotIcon from "../../assets/images/ChatBotIcon.png";
import "./ThemeStyle.css";

//import { Brightness5, Brightness4, Waves, WbSunny, Forest, Flag } from '@mui/icons-material';

import "./Sidebar.css";
import {
  Brightness5,
  Brightness4,
  Waves,
  WbSunny,
  Forest,
  Flag,
} from "@mui/icons-material";

const drawerWidth = 225;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`,
  },
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "85%",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface MenuItem {
  Icon: any;
  displayNo: number;
  id: number;
  items: MenuItem[];
  label: string;
  name: string;
  path: string;
}

function getGreeting() {
  const hour = new Date().getHours();

  let greeting;
  if (hour < 12) {
    greeting = {
      text: "Good Morning",
      color: "#FFFFE0",
      icon: "🌅", // Sunrise emoji
    };
  } else if (hour < 17) {
    greeting = {
      text: "Good Afternoon",
      color: "#FFE4B5",
      icon: "🌞", // Sun emoji
    };
  } else {
    greeting = {
      text: "Good Evening",
      color: "#FFDAB9",
      icon: "🌜", // Crescent moon emoji
    };
  }

  return greeting;
}

export default function MiniDrawer({ items }: any) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(!isMobile);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
  // const [collapseIndex2, setCollapseIndex2] = React.useState<any>(-1);
  const [openlogo, setOpenlogo] = React.useState(!isMobile);
  const [homeColor, setHomeColor] = React.useState("inherit");
  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);

  const greeting = getGreeting();

  let navigate = useNavigate();

  const searchMenuItems = (items: any[], searchValue: string): any[] => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
  
    // Recursive function focusing only on the `name` field
    const searchRecursive = (menuItems: any[]): any[] => {
      return menuItems.reduce((acc: any[], item: any) => {
        // Check if the current item's name matches the search value
        if (item.name && item.name.toLowerCase().includes(lowerCaseSearchValue)) {
          acc.push(item); // Push matching item
        }
  
        // Search recursively in child items
        if (item.items && item.items.length > 0) {
          acc.push(...searchRecursive(item.items));
        }
  
        return acc;
      }, []);
    };
  
    return searchRecursive(items);
  };
  

  const handleNavigation = (path: any) => {
    navigate(path);
  };

  const handleAutocompleteChange = (event: any, value: any) => {
    const findItemByName = (items: any[], name: string): any | null => {
      for (const item of items) {
        if (item.name === name) return item;
        if (item.items && item.items.length > 0) {
          const found = findItemByName(item.items, name);
          if (found) return found;
        }
      }
      return null;
    };
  
    const selectedSubItem = findItemByName(items, value);
  
    if (selectedSubItem) {
      // console.log("Selected Item:", selectedSubItem);
  
      if (selectedSubItem.path && selectedSubItem.path.trim() !== "") {
        handleNavigation(selectedSubItem.path);
      } else {
        // console.warn("Path not found for the selected item. No action taken.");
        // Optionally, provide feedback or navigation to a default page.
      }
    } else {
      // console.warn("Item not found for value:", value);
    }
  };

  
  

  const themes = [
    { name: "light-theme", icon: <Brightness5 /> },
    { name: "dark-theme", icon: <Brightness4 /> },
    { name: "ocean-theme", icon: <Waves /> },
    { name: "sunset-theme", icon: <WbSunny /> },
    { name: "forest-theme", icon: <Forest /> },
    { name: "bhagwa-theme", icon: <Flag /> },
  ];

  // console.log("items", items);

  const handleSearchInputChange = (e: any) => {
    const value = e.target.value;
    console.log("handleSearchInputChange", value);  
    setSearchValue(value);
  
    const filtered = searchMenuItems(items, value); 
    setFilteredItems(filtered);
  };

  var [date, setDate] = React.useState(new Date());

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  const location = useLocation();

  const [menuData, setMenuData] = React.useState<any>("");

  React.useEffect(() => {
    const dataString = localStorage.getItem("userdata");
    if (dataString) {
      const data = JSON.parse(dataString);
      if (data && data.length > 0) {
        const userPermissionData = data[0]?.userPermission;
        if (userPermissionData && userPermissionData.length > 0) {
          const menudata = userPermissionData[0]?.parentMenu;
          for (let index = 0; index < menudata.length; index++) {
            const childMenudata = menudata[index]?.childMenu;
            const pathrow = childMenudata.find(
              (x: any) => x.path === location.pathname
            );

            if (pathrow) {
              setMenuData(pathrow.menuId);
              break;
            }
          }
        }
      }
    }
  }, [location.pathname]);

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });



  const resetHomeColor = () => {
    setHomeColor("#FF0000");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setHomeColor("inherit");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const routeChangeHome = () => {
    let path = `/home`;
    navigate(path);
  };

  React.useEffect(() => {
    setOpen(!isMobile);
    setOpenlogo(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
    setOpenlogo(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenlogo(false);
  };

  const Logout = () => {
    const collectData = {
      userId: userName,
      ipAddress: "",
      uniqueId: uniqueId,
      logInOut: true,
    };
    api.post(`api/Login/UsrLogOut`, collectData).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  function onClick(item: any) {
    console.log("🚀 ~ onClick ~ item:", item);

    var menuId = item.id;
    var menu_name = item.path;
    const path2 =
      item.path + "?appId=" + menuId + "&Appname=" + menu_name + ".aspx";
    const path = item.path;
    console.log(path)

    if (path == "" || path == null || path == "undefind") {
    } else {
      sessionStorage.setItem("menuId", menuId);
      sessionStorage.setItem("menuName", menu_name);
      sessionStorage.setItem("path", path2);
      navigate(path);
    }
  }

  let nodeName = sessionStorage.getItem("institutename");
  let userName: any = sessionStorage.getItem("userid");

  if (userName) {
    userName = userName.replace(/"/g, "");
  }

  const defaultSelectedNodeId = parseInt(sessionStorage.getItem("instId") + "");

  React.useEffect(() => {
    // setuserName(userName);
    if (defaultSelectedNodeId) {
      setnodeId(defaultSelectedNodeId);
    }
  }, [defaultSelectedNodeId]);

  const removeDynamicId = (id: any) => {
    return id.replace(/ /g, "");
  };

  var key = removeDynamicId("uniqueId");
  var uniqueId = sessionStorage.getItem(key);

  if (uniqueId) {
    uniqueId = uniqueId.replace(/"/g, "");
  }


  const [nodeData, setNodeData] = React.useState<any>([]);

  const getNode = () => {
    api.get(`api/Login/GetMemberLibs?uniqueid=${uniqueId}`).then((res) => {
      const arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          id: res.data.data[index]["id"],
          institutename: res.data.data[index]["institutename"],
        });
      }
      setNodeData(arr);
    });
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handlePermissionClick = () => {
    getNode();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (id: any, name: any) => {
    setnodeId(id);
    setnodeNames(name);
  };

  const [nodeNames, setnodeNames] = React.useState<any>("");

  const [nodeId, setnodeId] = React.useState<any>();

  const handleSave = () => {
    if (nodeId && nodeNames) {
      sessionStorage.setItem("instId", nodeId);

      sessionStorage.setItem("institutename", nodeNames);
    } else {
    }
    handleCloseModal();
  };

  const { i18n } = useTranslation();

  const changeLanguage = (language: any) => {
    // console.log("check", language);

    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
  };
  var currentLanguage = localStorage.getItem("preferredLanguage");
  var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

  const handleMyProfileClick = () => {

    //setShowThemeMenu((prevState) => !prevState);

    setProfileDrawerOpen(!profileDrawerOpen);
  };

  const currentPathname = window.location.pathname;
  const segments = currentPathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;

  function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
  }

  const handleClickhome = () => {
    let path = `/home`;
    navigate(path);
  };

  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  const [selectedTheme, setSelectedTheme] = React.useState(() => {
    const storedTheme = localStorage.getItem("theme");

    return storedTheme ? storedTheme : themes[0]["name"];
  });

  React.useEffect(() => {
    //console.log(selectedTheme);
    document.body.className = selectedTheme;

    localStorage.setItem("theme", selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (theme: any) => {
    setSelectedTheme(theme);
    setShowThemeMenu(false);
  };

  const handleCloseSelect = () => {
    setShowThemeMenu(false);
  };

  const headerColor1 = `var(--header-background)`;
  const drawerStyles = `var(--drawer-background)`;

  const renderItem = (icon: any, label: any, value: any) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: "10px",
      }}
    >
      <img src={icon} alt={label} width={25} />
      <strong>{label}:</strong> {value}
    </div>
  );

  const data: any = JSON.parse(sessionStorage.getItem("0th") || "{}");

  const { institutename, libraryname, address, city, institute } = data;

    const [selectedMenu, setSelectedMenu] = React.useState<any | null>(null);
    const [collapseIndexs, setCollapseIndexs] = React.useState<number | null>(null);
    const [collapseIndexs2, setCollapseIndexs2] = React.useState<number | null>(null);
    
    React.useEffect(() => {
      const savedMenu = localStorage.getItem("selectedMenu");
      if (savedMenu) {
        const parsedMenu = JSON.parse(savedMenu);
        setSelectedMenu(parsedMenu);
    
        // Automatically expand the saved menu hierarchy
        setCollapseIndexs(parsedMenu.parentIndex ?? null);
        setCollapseIndexs2(parsedMenu.childIndex ?? null);
      }
    }, []);
    
    const handleMenuClick = (menu: any) => {
      if (!menu) return;
    
      const { parentIndex, childIndex, subchildIndex, child, subchild } = menu;
    
      // Check if we're opening a new page or staying within the same structure
      const isNewPage =
        selectedMenu?.parentIndex !== parentIndex ||
        selectedMenu?.childIndex !== childIndex ||
        selectedMenu?.subchildIndex !== subchildIndex;
    
      // Update selected menu only for new page
      const newSelectedMenu = {
        parentIndex: parentIndex ?? null,
        childIndex: childIndex ?? null,
        subchildIndex: subchildIndex ?? null,
        ...(subchild ? { subchild } : child ? { child } : {}),
      };
    
      // Navigate to new page if a path exists
      if (subchild?.path) {
        onClick(subchild);
      } else if (child?.path && (!child.items || !child.items.length)) {
        onClick(child);
      }
    
      // Reset state only if navigating to a new page
      if (isNewPage) {
        setSelectedMenu(newSelectedMenu);
        localStorage.setItem("selectedMenu", JSON.stringify(newSelectedMenu));
    
        // Reset menu expansion based on the new page
        setCollapseIndexs(parentIndex);
        // setCollapseIndexs2(childIndex ?? null);
      }
    };
    
    
    const collapseHandle = (index: number) => {
      setCollapseIndexs(collapseIndexs === index ? null : index);
      // setCollapseIndexs2(null); 
    };
    
    
  const collapseHandle2 = (index: number) => {
    // console.log(index)
    setCollapseIndexs2(collapseIndexs2 === index ? null : index);
  };
  
  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      <AppBar position="fixed" open={open} style={{}}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: `var(--header-background1)`,
            color: "var(--header-color1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                // marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {!openlogo && <img src={logo} width={80} height={60} />}
          </div>

          <div style={{ fontSize: "3vw" }}>Spritual Library </div>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {/* {displayInitial} */}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            // onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: "var(--menu-background)",
                color: "var(--menu-color)",
                overflow: "auto",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                paddingRight: "10px",
                paddingLeft: "10px",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              {/* <ListItemIcon>
                <img src={logged} width={40} height={40} />
              </ListItemIcon>{" "} */}
              {/* {displayInitial} */}
            </MenuItem>
            {/* <MenuItem > */}
            <MenuItem onClick={handleMyProfileClick}>
              <ListItemIcon>
                <img src={id} width={30} height={30} />
              </ListItemIcon>
              {userName}
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                localStorage.getItem("preferredLanguage") == "hi"
                  ? changeLanguage("en")
                  : changeLanguage("hi");
              }}
            >
              <ListItemIcon>
                <img src={trans} width={30} height={30} />
              </ListItemIcon>
              Translate -- {newLanguage}
            </MenuItem>

            <MenuItem onClick={(e) => setShowThemeMenu(!showThemeMenu)}>
              <ListItemIcon>
                <img src={ThemeIcon} width={30} height={30} />
              </ListItemIcon>
              Select Theme
            </MenuItem>

            {/* <MenuItem
              onClick={() => {
                navigate("/ChatBot");
              }}
            >
              <ListItemIcon>
                <img src={ChatBotIcon} width={30} height={30} />
              </ListItemIcon>
              ChatBot
            </MenuItem> */}

            {/* <MenuItem onClick={() => {}}>
              <ListItemIcon>
                <img src={FontIcon} width={30} height={30} />
              </ListItemIcon>
              Select Font
            </MenuItem> */}

            <MenuItem
              onClick={() => {
                let path = "/HelpDesk";
               // localStorage.setItem("menuData", menuData.toString());
                window.open(path, "_blank");
              }}
            >
              <ListItemIcon>
                <img src={help} width={30} height={30} alt="Help Desk" />
              </ListItemIcon>
              Help Desk
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={settings} width={30} height={30} />
              </ListItemIcon>
              Settings
            </MenuItem>

            <MenuItem onClick={handlePermissionClick}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} alt="Permission" />
              </ListItemIcon>
              Institute
            </MenuItem>

            
            <Divider />
            <MenuItem onClick={Logout}>
              <ListItemIcon>
                <img src={logout} width={30} height={30} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        <Dialog open={showThemeMenu} onClose={handleCloseSelect}>
          <DialogTitle>Select a Theme</DialogTitle>
          <DialogContent>
            <List>
              {themes.map((theme) => (
                <ListItem
                  button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  selected={selectedTheme === theme.name}
                >
                  {theme.icon}
                  <span style={{ marginLeft: "10px" }}>{theme.name}</span>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSelect}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: headerColor1 || "#42AEEE",
            borderBottomRightRadius: "15px",
          }}
        >
          <div
            role="presentation"
            onClick={handleClicked}
            // style={{  borderBottomRightRadius: "15px" }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
              {/* <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link> */}
              <Typography
                sx={{
                  display: "flex",
                  color: "#fff",
                  alignItems: "center",
                }}
              >
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  color="inherit"
                  onClick={handleClickhome}
                >
                  <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
                  Home
                </Link>
              </Typography>

              {/* Render the rest of the breadcrumb path */}
              {segments.slice(1).map((segment, index) => (
                <Typography
                  key={index}
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                  }}
                >
                  {/* {" / "} */}
                  {index > 0 && " / "}
                  {index === segments.length - 2 ? (
                    <span>
                      {" "}
                      {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </span>
                  ) : (
                    <Link
                      underline="hover"
                      sx={{
                        display: "flex",
                        color: "#fff",
                        alignItems: "center",
                      }}
                      color="inherit"
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                    >
                      {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </Link>
                  )}
                </Typography>
              ))}
            </Breadcrumbs>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              paddingRight: "15px",
            }}
          >
            <p style={{ fontSize: "1.2vw", color: greeting.color }}>
              {greeting.icon} {greeting.text}
            </p>

            <p>Institute : {nodeName}</p>
            <p> Time : {date.toLocaleTimeString()}</p>
            <p> Date : {formattedDate}</p>
          </div>
        </div>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: drawerStyles,
            color: `var(--drawer-color)`,
          },
        }}
      >
        <DrawerHeader>
          <>
            <Stack
              sx={{ width: "100%", height: "16vh" }}
              direction="row"
              justifyContent="center"
            >
              {openlogo ? (
                <div
                  style={{
                    paddingTop: "25px",
                    paddingBottom: "25px",
                  }}
                >
                  <img src={loged} width={110} height={90} />
                </div>
              ) : (
                <div style={{ padding: 0 }}></div>
              )}
            </Stack>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
            <br />
            <br />
          </>
        </DrawerHeader>

        <br />
        <br />
        <Divider />
        {openlogo && (
          <Paper
            component="form"
            sx={{
              m: "5px 5px",
              p: "0px 2px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              freeSolo
              fullWidth
              size="small"
             options={filteredItems.map((item) => item.name)}
              onChange={handleAutocompleteChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  //label="Search Menu"
                  placeholder="Search Menu"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleSearchInputChange}
                />
              )}
            />
          </Paper>
        )}
        <Divider />

        <React.Fragment>
          <List sx={{ padding: 0 }}>
            {["Home"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 0,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "lightgray",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    // minHeight: 30,
                    justifyContent: open ? "initial" : "center",
                    px: 4.5,
                  }}
                  // onClick={routeChangeHome}
                  onClick={() => {
                    routeChangeHome();
                    resetHomeColor();

                    setCollapseIndexs(null); // Close all parent menus
                    setCollapseIndexs2(null); // Close all child menus
                    setSelectedMenu({ // Reset selected menu to no highlight
                      parentIndex: null,
                      childIndex: null,
                      subchildIndex: null,
                      subchild: null,
                      child: null,
                    });
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                      color: homeColor,
                    }}
                  >
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <List sx={{ padding: 0 }}>
  {items.map((parent: any, parentIndex: number) => (
    <React.Fragment key={parentIndex}>
      <Divider />
      {/* Parent Item */}
      <ListItem
        onClick={() => collapseHandle(parentIndex)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          backgroundColor:
            selectedMenu?.parentIndex === parentIndex &&
            selectedMenu?.childIndex === null &&
            selectedMenu?.subchildIndex === null
              ? "#FF9933" // Saffron color for active parent menu
              : "#f5f5f5",
          fontWeight:
            selectedMenu?.parentIndex === parentIndex ? 600 : "normal", // Bold active menu
          color:
            selectedMenu?.parentIndex === parentIndex ? "#2B4593" : "inherit", // Contrast text
          borderRadius: "6px", // Optional rounded corners
          margin: "5px", // Maintain consistent spacing
          cursor: "pointer",
          paddingRight: open ? "16px" : "32px", // Add more padding on the right when open is false
        }}
        title={parent.name} 
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Conditionally show folder icon */}
          {open && (
            <span
              style={{
                fontSize: "1.2rem",
                backgroundColor: "#f0f0f0", // Background color when closed
                padding: "6px",
                borderRadius: "10px", // Round corners when closed
              }}
            >
              📁
            </span>
          )}
          <ListItemText
            primary={
              open
                ? parent.name // Show full name if open is true
                : parent.name
                    .split(" ") // Split name by space
                    .map((word:any) => word.charAt(0).toUpperCase()) // Take the first char of each word
                    .join("") // Join them into a single string
            }
            primaryTypographyProps={{ fontWeight: "500", fontSize: "1rem" }}
          />
        </div>
        <ListItemIcon>
          {parent.items && parent.items.length > 0 ? (
            collapseIndexs === parentIndex ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )
          ) : null}
        </ListItemIcon>
      </ListItem>

      <Divider />

      {/* Child Items */}
      <Collapse
        in={collapseIndexs === parentIndex}
        timeout="auto"
        unmountOnExit
        sx={{ paddingLeft: "16px" }}
      >
        <List>
          {parent.items.map((child: any, childIndex: number) => (
            <React.Fragment key={childIndex}>
              <ListItem
                onClick={() => {
                  // If child has subitems, toggle collapse; if not, prevent it
                  if (child.items && child.items.length > 0) {
                    collapseHandle2(childIndex);
                  }
                  handleMenuClick({
                    child,
                    parentIndex,
                    childIndex,
                  });
                }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor:
                    selectedMenu?.parentIndex === parentIndex &&
                    selectedMenu?.childIndex === childIndex &&
                    selectedMenu?.subchildIndex === null
                      ? ""
                      : child.items && child.items.length > 0
                      ? "#e9f7ff" // Light blue for menus with sub-items
                      : "#fff3e0", // Light orange for regular items
                  fontWeight:
                    selectedMenu?.parentIndex === parentIndex &&
                    selectedMenu?.childIndex === childIndex
                      ? 600
                      : "normal", // Bold active child menu
                  color:
                    selectedMenu?.parentIndex === parentIndex &&
                    selectedMenu?.childIndex === childIndex
                      ? "#2B4593"
                      : "inherit",
                  margin: "5px",
                  cursor: "pointer",
                  paddingRight: open ? "16px" : "32px", // Add more padding on the right when open is false
                }}
                title={child.name} 
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Conditionally show folder icon for child */}
                  {open && (
                    <span
                      style={{
                        fontSize: "1.2rem",
                        backgroundColor: "#f0f0f0", // Background color when closed
                        padding: "6px",
                        borderRadius: "10px", // Round corners when closed
                      }}
                    >
                      {child.items && child.items.length > 0 ? "📂" : "📄"}
                    </span>
                  )}
                  <ListItemText
                    primary={
                      open
                        ? child.name // Show full name if open is true
                        : child.name
                            .split(" ") // Split name by space
                            .map((word:any) => word.charAt(0).toUpperCase()) // Take the first char of each word
                            .join("") // Join them into a single string
                    }
                    primaryTypographyProps={{ fontSize: "0.95rem" }}
                  />
                </div>
                {child.items && child.items.length > 0 && (
                  <ListItemIcon>
                    {collapseIndexs2 === childIndex ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ListItemIcon>
                )}
              </ListItem>

              <Collapse
                in={collapseIndexs2 === childIndex}
                timeout="auto"
                unmountOnExit
                sx={{ paddingLeft: "16px" }}
              >
                <List>
                  {child.items.map((subchild: any, subchildIndex: number) => (
                    <ListItem
                      key={subchildIndex}
                      onClick={() =>
                        handleMenuClick({
                          subchild,
                          parentIndex,
                          childIndex,
                          subchildIndex,
                        })
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "6px 16px",
                        borderRadius: "6px",
                        backgroundColor:
                          selectedMenu?.parentIndex === parentIndex &&
                          selectedMenu?.childIndex === childIndex &&
                          selectedMenu?.subchildIndex === subchildIndex
                            ? "#FF9933" 
                            : "#fff3e0",
                        fontWeight:
                          selectedMenu?.parentIndex === parentIndex &&
                          selectedMenu?.childIndex === childIndex &&
                          selectedMenu?.subchildIndex === subchildIndex
                            ? 600
                            : "normal", 
                        color:
                          selectedMenu?.parentIndex === parentIndex &&
                          selectedMenu?.childIndex === childIndex &&
                          selectedMenu?.subchildIndex === subchildIndex
                            ? "#2B4593"
                            : "inherit",
                        margin: "5px",
                        cursor: "pointer",
                      }}
                      title={subchild.name} 
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {open && (
                    <span
                      style={{
                        fontSize: "1.2rem",
                        backgroundColor: "#f0f0f0", 
                        padding: "6px",
                        borderRadius: "10px",
                      }}
                    >
                      📄
                    </span>
                  )}
                      <ListItemText
                        primary={
                          open
                            ? subchild.name
                            : subchild.name
                                .split(" ") 
                                .map((word:any) => word.charAt(0).toUpperCase()) 
                                .join("")
                        }
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                      />
                      </div>
                    </ListItem>
                    
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  ))}
</List>




        </React.Fragment>
      </Drawer>

      <SwipeableDrawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onOpen={() => {}}
        style={{
          zIndex: 1300,
        }}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <IconButton
            edge="end"
            onClick={() => setProfileDrawerOpen(false)}
            aria-label="close"
            sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <p
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
              textAlign: "center",
              backgroundImage:
                "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
              color: "whitesmoke",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              fontSize: "20px",
            }}
          >
            Institution Details
          </p>
          <div style={{ margin: "15px" }}>
            {renderItem(id, "User Name", userName)}
            {renderItem(instituteIcon, "Institute", institute)}
            {renderItem(libraryIcon, "Library Name", libraryname)}
            {renderItem(addressIcon, "Address", address)}
            {renderItem(cityIcon, "City", city)}
          </div>
        </Box>
      </SwipeableDrawer>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        style={{ overflow: "hidden" }}
      >
        <Box
          sx={{
            ...style,

            overflow: "auto",
          }}
        >
          <Typography fontWeight={500} fontSize={20} noWrap align="center">
            Institutes
          </Typography>

          {nodeData?.map((item: any) => (
            <div>
              <Grid container spacing={1}>
                <Grid item xs={3} key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={nodeId === item.id}
                        onChange={() =>
                          handleCheckboxChange(item.id, item.institutename)
                        }
                      />
                    }
                    label={item.institutename}
                  />
                </Grid>
              </Grid>
            </div>
          ))}

          <Grid xs={3} item alignItems="center" justifyContent="center">
            <Button
              type="submit"
              fullWidth
              style={{
                backgroundColor: "#059669",
                color: "white",
                marginTop: "10px",
              }}
              onClick={handleSave}
            >
              save
            </Button>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}
