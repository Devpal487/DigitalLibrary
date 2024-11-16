import { Outlet } from "react-router-dom";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import sizeConfigs from "../../configs/sizeConfigs";
import Sidebar from "../common/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import backgroundimage from "../../assets/images/backgroundimage.jpg";
import { useEffect, useState } from "react";
import "../common/ThemeStyle.css";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBotIcon from "../../assets/images/chatBot1.png";
import ChatBot from "../../pages/ChatBot/ChatBot";
import Draggable from "react-draggable";

const themes = [
  "light-theme",
  "dark-theme",
  "ocean-theme",
  "sunset-theme",
  "forest-theme",
];

const MainLayout = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  

  // const selectedTheme:any = () => {
  //   const storedTheme = localStorage.getItem("theme");
  //   return storedTheme ? storedTheme : themes[0];
  // };

  // useEffect(() => {
  //   document.body.className = selectedTheme;
  //   localStorage.setItem("theme", selectedTheme);
  // }, [selectedTheme]);

  useEffect(() => {
    const menuData = localStorage.getItem("userdata");

    if (menuData === null) {
      navigate("/");
      return;
    }

    const parseMenuItems = (data: any) => {
      return data
        .map((item: any) => {
          const children = item.children ? parseMenuItems(item.children) : [];

          return {
            id: item.menu_id,
            name: item.menu_name,
            label: item.label,
            path: item.href ? item.href.replace(".aspx", "") : "",
            displayNo: item.ordNo,

            items: children,
          };
        })
        .sort(
          (a: { displayNo: number }, b: { displayNo: number }) =>
            a.displayNo - b.displayNo
        );
    };

    const items = JSON.parse(menuData);
    // console.log("🚀 ~ useEffect ~ items:", items)

    if (items.length > 0) {
      const parsedItems = parseMenuItems(items);
      setMenuItems(parsedItems);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleMenuClick = (
    e: any,
    item: { menu_id: any; path: any; menu_name: any }
  ) => {
    var menuId = item.menu_id;
    var menu_name = item.menu_name;
    const path =
      item.path + "?appId=" + menuId + "&Appname=" + menu_name + ".aspx";

    if (!path) {
      window.alert("Path Not Found");
    } else {
      sessionStorage.setItem("menuId", menuId);
      sessionStorage.setItem("menuName", menu_name);
      navigate(path);
    }
  };

  return (
    <div>
      {location.pathname === "/" ? (
        <Outlet />
      ) : (
        <div>
          
            <Box sx={{ display: "flex" }}>
              <Sidebar items={menuItems} onClick={handleMenuClick} />

              <Box
                sx={{
                  flexGrow: 1,
                  px: 5,
                  py: 3,
                  width: `calc(100% - ${sizeConfigs.sidebar.width})`,
                  minHeight: "100vh",
                  backgroundColor: `var(--main-background)`,
                  backgroundImage: `var(--background-image)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <Toolbar />
                <Outlet />

                {/* Chatbot Icon with Image */}
                <Draggable>
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    display: "flex",
                    alignItems: "center",
                    
                  }}
                >
                  {isHovered && (
                    <Typography
                      variant="body2"
                      sx={{
                        marginRight: 1,
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        position: "absolute",
                        bottom: "70px", // Adjust as needed
                        right: "50px", // Adjust as needed
                      }}
                    >
                      Ask Me...
                    </Typography>
                  )}
                  <Box
                    component="img"
                    src={ChatBotIcon}
                    alt="Chatbot"
                    sx={{
                      width: 60,
                      height: 60,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setIsChatBotOpen(true)} // Open chatbot modal
                  />
                </Box>
                </Draggable>
              </Box>
            </Box>
            

            {/* ChatBot Modal */}
            <ChatBot
              open={isChatBotOpen}
              onClose={() => setIsChatBotOpen(false)}
            />
        
        </div>
      )}
    </div>
  );
};

export default MainLayout;
