// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import logo from "../assets/logo.png";
// import "./Navbar.css";
// import { PagesContext } from "../context/Context";
// import { useNavigate } from "react-router-dom";
// import Login from "../pages/Login";
// import { shortenAddress } from "../utils/shortenAddress";
// import { MenuItem, Select } from "@mui/material";

// export default function Navbar() {
//   const { Dao, setDao, account } = React.useContext(PagesContext);
//   const navigate = useNavigate();
//   const [dropdown, setdropdown] = React.useState("account");

//   const handleChange = (event) => {
//     setdropdown(event.target.value);
//   };

//   return (
//     <Box sx={{ flexGrow: 1, color: "black" }}>
//       <AppBar
//         className="AppBar"
//         sx={{ backgroundColor: "white", color: "black", display: "flex", justifyContent: "space-between" }}
//         position="static"
//       >
//         <Toolbar className="toolbar" sx={{ display: "flex", justifyContent: "space-between" }}>
//           <img style={{ width: "200px" }} src={logo} onClick={() => setDao(false)} />

//           <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <Button
//               sx={{
//                 backgroundColor: "black",
//                 color: "white",
//                 marginRight: "40px",
//                 "&:hover": { backgroundColor: "black" },
//               }}
//               className="button"
//               onClick={navigate("/dao")}
//             >
//               DAO votes
//             </Button>

//             {account ? (
//               <Select
//                 sx={{
//                   m: "10px",
//                   height: "45px",
//                   borderWidth: "0",
//                   color: "white",
//                 }}
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 value={dropdown}
//                 onChange={(e) => handleChange(e)}
//               >
//                 <MenuItem value={"account"}>
//                   {" "}
//                   <Button
//                     sx={{
//                       backgroundColor: "black",
//                       color: "white",
//                       marginRight: "40px",

//                       "&:hover": { backgroundColor: "black" },
//                     }}
//                     className="button"
//                     // onClick={}
//                   >
//                     {shortenAddress(account)}
//                   </Button>
//                 </MenuItem>
//                 <MenuItem value={"MyWallet"}>
//                   {" "}
//                   <Button
//                     sx={{
//                       backgroundColor: "black",
//                       color: "white",
//                       marginRight: "40px",
//                       "&:hover": { backgroundColor: "black" },
//                     }}
//                     className="button"
//                     // onClick={}
//                   >
//                     My Wallet
//                   </Button>
//                 </MenuItem>
//                 <MenuItem value={"Dao Votes"}>
//                   {" "}
//                   <Button
//                     sx={{
//                       backgroundColor: "black",
//                       color: "white",
//                       marginRight: "40px",
//                       "&:hover": { backgroundColor: "black" },
//                     }}
//                     className="button"
//                     // onClick={}
//                   >
//                     Dao Votes
//                   </Button>
//                 </MenuItem>
//                 <MenuItem value={"My Profile"}>
//                   <Button
//                     sx={{
//                       backgroundColor: "black",
//                       color: "white",
//                       marginRight: "40px",
//                       "&:hover": { backgroundColor: "black" },
//                     }}
//                     className="button"
//                     // onClick={navigate("/profile")}
//                   >
//                     My Profile
//                   </Button>
//                 </MenuItem>
//                 <MenuItem value={"logout"}>
//                   <Button
//                     sx={{
//                       backgroundColor: "black",
//                       color: "white",
//                       marginRight: "40px",
//                       "&:hover": { backgroundColor: "black" },
//                     }}
//                     className="button"
//                   >
//                     logout
//                   </Button>
//                 </MenuItem>
//               </Select>
//             ) : (
//               <Login />
//             )}
//           </div>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// }

// {
//   /* <Button
//               sx={{
//                 backgroundColor: "black",
//                 color: "white",
//                 borderRadius: "20px",
//                 "&:hover": { backgroundColor: "black" },
//                 padding: "10px",
//               }}
//               className="button"
//               onClick={() => navigate("/login")}
//             >
//               Login
//             </Button> */
// }

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { PagesContext } from "../context/Context";
import { Link, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import { shortenAddress } from "../utils/shortenAddress";
import { MenuItem, Select } from "@mui/material";

export default function Navbar() {
  const { Dao, setDao, account } = React.useContext(PagesContext);
  const navigate = useNavigate();
  const [dropdown, setdropdown] = React.useState("account");

  const handleDropChange = (e) => {
    setdropdown(e.target.value);
  };

  const handleChange = (event) => {
    setdropdown(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, color: "black" }}>
      <AppBar
        className="AppBar"
        sx={{ backgroundColor: "white", color: "black", display: "flex", justifyContent: "space-between" }}
        position="static"
      >
        <Toolbar className="toolbar" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link style={{ textDecoration: "none" }} to="/">
            <img style={{ width: "200px" }} src={logo} onClick={() => setDao(false)} />
          </Link>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Link style={{ textDecoration: "none" }} to="/dao">
              <Button
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  marginRight: "40px",
                  "&:hover": { backgroundColor: "black" },
                }}
                className="button"
              >
                DAO votes
              </Button>
            </Link>
            {account ? (
              <Select
                sx={{
                  m: "10px",
                  height: "45px",
                  borderWidth: "0",
                  color: "white",
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dropdown}
                onChange={(e) => handleChange(e)}
              >
                <MenuItem value={"account"}>
                  {" "}
                  <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      marginRight: "40px",

                      "&:hover": { backgroundColor: "black" },
                    }}
                    className="button"
                    // onClick={}
                  >
                    {shortenAddress(account)}
                  </Button>
                </MenuItem>
                <MenuItem value={"MyWallet"}>
                  {" "}
                  <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      marginRight: "40px",
                      "&:hover": { backgroundColor: "black" },
                    }}
                    className="button"
                    // onClick={}
                  >
                    My Wallet
                  </Button>
                </MenuItem>
                <MenuItem value={"Dao Votes"}>
                  <Link style={{ textDecoration: "none" }} to="/dao">
                    {" "}
                    <Button
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        marginRight: "40px",
                        "&:hover": { backgroundColor: "black" },
                      }}
                      className="button"
                      // onClick={}
                    >
                      Dao Votes
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem value={"My Profile"}>
                  <Link style={{ textDecoration: "none" }} to="/profile">
                    <Button
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        marginRight: "40px",
                        "&:hover": { backgroundColor: "black" },
                      }}
                      className="button"
                    >
                      My Profile
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem value={"logout"}>
                  <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      marginRight: "40px",
                      "&:hover": { backgroundColor: "black" },
                    }}
                    className="button"
                  >
                    logout
                  </Button>
                </MenuItem>
              </Select>
            ) : (
              <Login />
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

{
  /* <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "black" },
                padding: "10px",
              }}
              className="button"
              onClick={() => navigate("/login")}
            >
              Login
            </Button> */
}

// account ? (
//   <Select
//     sx={{
//       m: "10px",
//       height: "45px",
//       borderWidth: "0",
//       color: "white",
//     }}
//     labelId="demo-simple-select-label"
//     id="demo-simple-select"
//     value={dropdown}
//     onChange={(e) => handleChange(e)}
//   >
//     <MenuItem value={"account"}>
//       {/* {" "}
//       <Button
//         sx={{
//           backgroundColor: "black",
//           color: "white",
//           marginRight: "40px",

//           "&:hover": { backgroundColor: "black" },
//         }}
//         className="button"
//         // onClick={}
//       > */}
//       {shortenAddress(account)}
//       {/* </Button> */}
//     </MenuItem>
//     <MenuItem value={"MyWallet"}>
//       {" "}
//       {/* <Button
//         sx={{
//           backgroundColor: "black",
//           color: "white",
//           marginRight: "40px",
//           "&:hover": { backgroundColor: "black" },
//         }}
//         className="button"
//         // onClick={}
//       > */}
//       My Wallet
//       {/* </Button> */}
//     </MenuItem>
//     <MenuItem value={"Dao Votes"}>
//       {" "}
//       {/* <Button
//         sx={{
//           backgroundColor: "black",
//           color: "white",
//           marginRight: "40px",
//           "&:hover": { backgroundColor: "black" },
//         }}
//         className="button"
//         // onClick={}
//       > */}
//       Dao Votes
//       {/* </Button> */}
//     </MenuItem>
//     <MenuItem value={"My Profile"}>
//       {/* <Button
//         sx={{
//           backgroundColor: "black",
//           color: "white",
//           marginRight: "40px",
//           "&:hover": { backgroundColor: "black" },
//         }}
//         className="button"
//         // onClick={navigate("/profile")}
//       > */}
//       My Profile
//       {/* </Button> */}
//     </MenuItem>
//     <MenuItem value={"logout"}>
//       {/* <Button
//         sx={{
//           backgroundColor: "black",
//           color: "white",
//           marginRight: "40px",
//           "&:hover": { backgroundColor: "black" },
//         }}
//         className="button"
//       > */}
//       logout
//       {/* </Button> */}
//     </MenuItem>
//   </Select>
// ) : (
//   <Login />
// )
