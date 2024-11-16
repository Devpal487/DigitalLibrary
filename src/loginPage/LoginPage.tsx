import "./index.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import advPics from '../assets/images/headDoc.png';
import logo from '../assets/images/adlogo1.png';
import { Grid,Divider, DialogTitle,IconButton, DialogContent,Typography, DialogContentText, DialogActions } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import api, { HOST_URL } from "../utils/Url";
import Draggable from "react-draggable";
import Paper, { PaperProps } from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";

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

function LoginPage() {
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [instituteOpen, setInstituteOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [instituteListOption, setInstituteListOption] = useState<any>([]);
  const [menuDetails, setMenuDetails] = useState<any>("");
  console.log("🚀 ~ LoginPage ~ menuDetails:", menuDetails)

  let navigate = useNavigate();
  console.log(Array.isArray(instituteListOption))

  const instituteClose = () => {
    setInstituteOpen(false);
  };

  const logout =()=>{
    localStorage.clear();
    sessionStorage.clear();
    setInstituteOpen(false);
    setPassword("");
    setUserID("");
    navigate("/");
  }

  useEffect(() => {
  localStorage.clear();
  sessionStorage.clear();
  }, []);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const collectData = {
      login: userID,
      password: password,
    };
    console.log(collectData);


    axios.post(`${HOST_URL}api/Login/Login`, collectData)
      .then((res) => {
        console.log('checkUserData',res.data.data);
        if (res.data.isSuccess) {
          // setInstituteOpen(true);
          localStorage.setItem("userdata", JSON.stringify(res.data.data));
          sessionStorage.setItem("uniqueId", JSON.stringify(res.data.data.uniqueId));
          sessionStorage.setItem("id", JSON.stringify(res.data.data.id));
          sessionStorage.setItem("userid", JSON.stringify(res.data.data.userid));
          // linkFunction(instid, res.data.data.uniqueId);userid

          // menuList(res.data.data.id);
          memberLibsList(res.data.data.uniqueId);
          setUserID("");
          setPassword("");
         // let path =`/home`; 
         // navigate(path);
        } else {
          alert("Login Failed");
        }
      });
  };

  const memberLibsList = (uid:any) => {
    const collectData = {
      uniqueid:uid,
    };
    console.log(collectData);

    api.get(`api/Login/GetMemberLibs`, {params:collectData})
      .then((res) => {
        console.log('GetMemberLibs',res.data.data);
        setInstituteListOption(res.data.data)
        sessionStorage.setItem("memlist", JSON.stringify(res.data.data))
        sessionStorage.setItem("instId", JSON.stringify(res.data.data[0]["id"]))
        sessionStorage.setItem("institute", JSON.stringify(res.data.data[0]["institute"]))
        sessionStorage.setItem("institutename",(res.data.data[0]["institutename"]))
        sessionStorage.setItem("0th", JSON.stringify(res.data.data[0]))
        linkFunction(res.data.data[0]["id"], uid);
      });
  };

  const linkFunction = (instid:any,uid:any) => {
    const collectData = {
      intsid:instid,
      uniqueid:uid,
    };
    console.log(collectData);

    api.post(`api/Basic/UpdatePopupInstid`, collectData)
      .then((res) => {
        console.log(res.data.data);
        menuList(sessionStorage.getItem("id"));
      });
  };

  const menuList = (Id:any) => {
    const collectData = {
      Id:Id
    };
    console.log(collectData);

    api
    .get(`api/Admin/GetPopupNewMenu`,{params:collectData})
      .then((res) => {
        console.log('GetPopupNewMenu',res.data.data);
        // setMenuDetails(res.data.data)
        const nestedData:any = buildTree(res.data.data);
        localStorage.setItem("userdata",JSON.stringify(nestedData));
        console.log("🚀 ~ nestedData:", nestedData);
           let path =`/home`; 
         navigate(path);
      });
  };

  function buildTree(data: any[]) {
    const map = new Map();
    const roots: any[] = [];
    if (Array.isArray(data)) {
      data.forEach((item: { children: never[]; menu_id: any; parentId: null; }) => {
      item.children = [];
      map.set(item.menu_id, item);
  
      if (item.parentId === null) {
        roots.push(item);
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(item);
        }
      }
    });
  }else{console.log("no array", data)}
  
    return roots;
  }
  

  


  return (
    <div className={`loginContainer ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container"  >
        <div className="signin-signup" >
          <form
            action="#"
            onSubmit={handleSubmit}
            className="sign-in-form loginForm"
          >
            <img className="knpimg"
              alt="Active"
              src={logo}
              style={{ height: "15vh", width: "15vh", margin: "10px" }}
            />
            <div>
              <h3 className="loginh3">Spritual Library</h3>
            </div>
            <br />
            <i className="title">
              "Efficiency Unleashed: Your Documents, Organized.!"
            </i>
            {/* <h2 className="title">Sign in</h2> */}
            <div className="input-field">
              <FontAwesomeIcon
                icon={faUser}
                className="my-auto mx-auto"
                style={{ alignSelf: "center", paddingLeft: "1%", color:"blue" }}
              />

              <input
                className="LoginInput"
                type="text"
                required
                placeholder="Username"
                onChange={(event) => {
                  setUserID(event.target.value);
                }}
              />
            </div>
           
            <div className="input-field">
              <FontAwesomeIcon
                icon={faLock}
                className="my-auto mx-auto"
                style={{ alignSelf: "center", paddingLeft: "1%",color:"blue" }}
              />
              <input
                className="LoginInput"
                type="password"
                required
                placeholder="Password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
            <button type="submit" className="btn">
              Sign In
            </button>

            {/* <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
           */}
            <br />
            {/* <Divider/>
           <br/> */}
            {/* <hr/> */}
      
          </form>
        </div>
      </div>

      <Grid container spacing={1}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <div className="panels-container">
    <div className="panel left-panel">
      <div className="content">
        <img
          className="logoimg"
          alt="Active"
          src={advPics}
        />
      </div>
      </div>
    </div>
  </Grid>

  {/* <Dialog
                  open={instituteOpen}
                  fullWidth={fullWidth}
                  maxWidth="md"
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
                      
                      <i>
                        Institue List
                      </i>
                    </Typography>
                    
                    <IconButton
                      edge="end"
                      onClick={instituteClose}
                      aria-label="close"
                      sx={{
                        color: "#fff",
                        position: "absolute",
                        right: 20,
                        top: 10
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent
                    sx={{ backgroundColor: "#f4f4f5", height: "25%" }}
                  >
                    <Typography fontWeight="600" fontSize={12} align="right" sx={{cursor:"pointer"}}>
                      <a onClick={logout} style={{color:"#000"}}>Logout</a>
                    </Typography>

                    <Divider/>
                    
                    <DialogContentText>
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ marginTop: 2, color:"#000" }}
                      >
                         <form>
                          {instituteListOption?.map((option: { label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Iterable<React.ReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                            <div key={index}>
                              <input
                                type="checkbox"
                                id={`checkbox-${index}`} // Unique ID for each checkbox
                                name={`vehicle-${index}`}
                              />
                              <label htmlFor={`checkbox-${index}`}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>

                      </Grid>
                    </DialogContentText>
                  </DialogContent>
                </Dialog> */}

</Grid>
    </div>
    
  );
}

export default LoginPage;