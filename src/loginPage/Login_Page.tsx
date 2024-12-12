import "./index.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import advPics from '../assets/images/headDoc.png';
import logo from '../assets/images/LibLogo1.png';
import { Grid, Divider, DialogTitle, IconButton, DialogContent, Typography, DialogContentText, DialogActions, TextField, Button, Box, ImageList, ImageListItem } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import api, { HOST_URL } from "../utils/Url";
import Draggable from "react-draggable";
import Paper, { PaperProps } from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import LoginImg from "./loginImg.jpg";

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

   const logout = () => {
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
            console.log('checkUserData', res.data.data);
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

   const memberLibsList = (uid: any) => {
      const collectData = {
         uniqueid: uid,
      };
      console.log(collectData);

      api.get(`api/Login/GetMemberLibs`, { params: collectData })
         .then((res) => {
            console.log('GetMemberLibs', res.data.data);
            setInstituteListOption(res.data.data)
            sessionStorage.setItem("memlist", JSON.stringify(res.data.data))
            sessionStorage.setItem("instId", JSON.stringify(res.data.data[0]["id"]))
            sessionStorage.setItem("institute", JSON.stringify(res.data.data[0]["institute"]))
            sessionStorage.setItem("institutename", (res.data.data[0]["institutename"]))
            sessionStorage.setItem("0th", JSON.stringify(res.data.data[0]))
            linkFunction(res.data.data[0]["id"], uid);
         });
   };

   const linkFunction = (instid: any, uid: any) => {
      const collectData = {
         intsid: instid,
         uniqueid: uid,
      };
      console.log(collectData);

      api.post(`api/Basic/UpdatePopupInstid`, collectData)
         .then((res) => {
            console.log(res.data.data);
            menuList(sessionStorage.getItem("id"));
         });
   };

   const menuList = (Id: any) => {
      const collectData = {
         Id: Id
      };
      console.log(collectData);

      api
         .get(`api/Admin/GetPopupNewMenu`, { params: collectData })
         .then((res) => {
            console.log('GetPopupNewMenu', res.data.data);
            // setMenuDetails(res.data.data)
            const nestedData: any = buildTree(res.data.data);
            localStorage.setItem("userdata", JSON.stringify(nestedData));
            console.log("🚀 ~ nestedData:", nestedData);
            let path = `/home`;
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
      } else { console.log("no array", data) }

      return roots;
   }





   return (
      <div style={{ height: "100vh" }}>
         <Grid container sx={{ height: "100vh", justifyContent: "center", backgroundImage: `url(${LoginImg})`, backgroundSize: 'cover', backgroundColor: "#f5dfc9" }}>
            {/* <Grid xs={12} sm={7} lg={7} sx={{ backgroundImage:`url(${LoginImg})`,backgroundSize: 'cover', margin:"1px"}}>
               
            </Grid> */}
            <Grid xs={12} sm={7} md={6} lg={5} sx={{ margin: "auto" }}>
               <div style={{ backgroundColor: "#fff", paddingTop: "2rem", paddingBottom: "2rem", borderRadius: "3rem" }}>
                  <form
                     action="#"
                     onSubmit={handleSubmit}
                     className="sign-in-form loginForm"
                  >
                     <img className="knpimg"
                        alt="Active"
                        src={logo}
                        style={{ height: "20vh", width: "20vh", margin: "5px" }}
                     />
                     <div>
                        <Typography variant="h4" sx={{ textAlign: "center" }}>Spiritual Library</Typography>
                        <br />
                        <i className="title" style={{ marginBottom: "2em" }}>
                           Efficiency Unleashed: Your Documents, Organized.!
                        </i>
                     </div>

                     <TextField
                        id=""
                        label="Username"
                        placeholder="Username"
                        onChange={(event) => {
                           setUserID(event.target.value);
                        }}
                        size="small"
                        fullWidth
                        sx={{ margin: ".5rem" }}
                     />

                     <TextField
                        id=""
                        label="Password"
                        placeholder="Password"
                        type="password"
                        required
                        onChange={(event) => {
                           setPassword(event.target.value);
                        }}
                        size="small"
                        fullWidth
                        sx={{ margin: ".5rem" }}
                     />

                     <Grid>
                        <Button
                           type="submit"
                           style={{
                              backgroundColor: `#003380`,
                              color: "white",
                              marginTop: "10px",
                              marginRight:"5px"
                           }}
                        >
                           Sign In
                        </Button>
                        <Button
                           type="reset"
                           style={{
                              backgroundColor: `#c9521e`,
                              color: "white",
                              marginTop: "10px",
                              marginLeft:"5px"
                           }}
                           onClick={()=>{
                              setUserID("");
                              setPassword("");
                           }}
                        >
                           Reset
                        </Button>
                     </Grid>
                  </form>
               </div>
            </Grid>
         </Grid>
      </div>
   );
}

export default LoginPage;

