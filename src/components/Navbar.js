import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { PagesContext } from "../context/Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import { shortenAddress } from "../utils/shortenAddress";
import { Avatar, MenuItem, Select } from "@mui/material";
import MyWallet from "../pages/MyWallet";
import abi from "../utils/abi";
import { useAccount, useConnect, useDisconnect, useContractRead } from "wagmi";
import { ConnectKitButton } from "connectkit";
import toast, { Toaster } from "react-hot-toast";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { KeyboardArrowDown } from "@mui/icons-material";
export default function Navbar() {
  //wagmi connecting contract

  const ADDRESS = "0xf9C559b43f91DCDa9b8fc849Aa4b646C158d00Ea";
  //
  const { address, isConnected } = useAccount();
  // const { Dao, setDao, account } = React.useContext(PagesContext);
  const navigate = useNavigate();
  const [dropdown, setdropdown] = React.useState("account");
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [dao, setdao] = React.useState(false);
  const [reload, setreload] = React.useState("");
  const [useless, setuseless] = React.useState(false);

  const location = useLocation();

  const handleDropChange = (e) => {
    setdropdown(e.target.value);
  };

  const handleChange = (event) => {
    setdropdown(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  // document.addEventListener("mousedown", () => setOpen(false));

  const { config, isError } = usePrepareContractWrite({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "blacklisted",
    args: [address],
  });

  const { data, write } = useContractRead(config);
  console.log(data);

  console.log("address", address);
  const logout = () => {
    disconnect();
  };
  React.useEffect(() => {
    if (data) {
      setuseless(true);
      logout();
      navigate("/dao");
    }
  }, [address]);

  React.useEffect(() => {
    if (location.pathname == "/dao") {
      setdao(true);
    } else {
      setdao(false);
    }
  }, []);
  React.useEffect(() => {
    if (address) {
      setuseless(true);
    }
  }, []);

  const handleMenuOne = () => {
    // do something
    setOpen(false);
  };

  const handleMenuTwo = () => {
    // do something
    setOpen(false);
  };

  const handleDao = (e) => {
    // handleOpen(e);
    setdao(true);
    navigate("/dao");
  };
  const handleProfile = (e) => {
    handleOpen(e);
    setdao(false);
    navigate("/profile");
  };

  return (
    <Box
      elevation={0}
      sx={{
        flexGrow: 1,
        color: "black",
        fontWeight: "bold",
        margin: "0",
        padding: "0",

        borderBottom: "1px solid black",
      }}
    >
      <AppBar
        elevation={0}
        className="AppBar"
        sx={{
          backgroundColor: "white",
          color: "black",

          height: "70px",
        }}
        position="inherit"
      >
        <Toolbar
          className="toolbar"
          sx={{
            display: "flex",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: "100px",
            marginRight: "100px",
            padding: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            <img style={{ width: "250px" }} src={logo} onClick={() => setdao(false)} />
          </Link>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {!isConnected && (
              <Link style={{ textDecoration: "none" }} to="/dao">
                <Button
                  sx={{
                    padding: 0,
                    minHeight: 0,
                    minWidth: 0,
                    color: "black",
                    marginRight: "60px",
                    " &:hover": {
                      background: "none",
                    },
                    "&:focus": {
                      background: "none",
                    },
                    minWidth: "0px",
                    padding: "0px",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "12px",
                    borderBottom: dao ? "4px solid black" : "",
                  }}
                  onClick={() => setdao(true)}
                >
                  DAO Votes
                </Button>
              </Link>
            )}

            {isConnected ? (
              <div className="dropdown">
                <div
                  onClick={handleOpen}
                  style={{ display: "flex", color: "white", justifyContent: "center", alignItems: "center" }}
                >
                  <Avatar style={{ bgcolor: "black", backgroundColor: "black", width: "25px", height: "25px" }} />
                  <Button
                    sx={{
                      color: "black",
                      fontSize: "10px",

                      " &:hover": {
                        background: "none",
                      },
                      "&:focus": {
                        background: "none",
                      },
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    {"Account"}
                  </Button>
                  <KeyboardArrowDown sx={{ color: "black" }} />
                </div>
                {open ? (
                  <ul className="menu">
                    <li
                      style={{
                        display: "none",
                        color: "black",
                        borderWidth: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "white" },
                        "&:focus": { backgroundColor: "white" },
                        "&&:selected": { backgroundColor: "white" },
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                        textTransform: "none",
                        margin: "20px 20px 20px 20px",
                        fontSize: "18px",
                      }}
                      className="menu-item"
                    >
                      <MyWallet />
                    </li>
                    <li
                      style={{
                        display: "none",
                        color: "black",
                        borderWidth: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "white" },
                        "&:focus": { backgroundColor: "white" },
                        "&&:selected": { backgroundColor: "white" },
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                        textTransform: "none",
                        margin: "0px 20px 20px 20px",
                      }}
                      className="menu-item"
                      onClick={handleDao}
                    >
                      {/* <Link style={{ textDecoration: "none", color: "black" }} to="/dao"> */}{" "}
                      <Button
                        sx={{
                          color: "black",

                          " &:hover": {
                            background: "none",
                          },
                          "&:focus": {
                            background: "none",
                          },
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "25px",
                        }}
                        className="button"
                      >
                        DAO votes
                      </Button>
                      {/* </Link> */}
                    </li>
                    <li
                      style={{
                        display: "none",
                        color: "black",
                        borderWidth: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "white" },
                        "&:focus": { backgroundColor: "white" },
                        "&&:selected": { backgroundColor: "white" },
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                        textTransform: "none",
                        margin: "0px 20px 20px 20px",
                      }}
                      className="menu-item"
                    >
                      {/* <Link style={{ textDecoration: "none", color: "black" }} to="/dao"> */}{" "}
                      <Button
                        sx={{
                          color: "black",

                          " &:hover": {
                            background: "none",
                          },
                          "&:focus": {
                            background: "none",
                          },
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                        className="button"
                        onClick={handleProfile}
                      >
                        My Profile
                      </Button>
                      {/* </Link> */}
                    </li>

                    <li
                      style={{
                        display: "none",
                        color: "black",
                        borderWidth: "90%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:hover": { backgroundColor: "white" },
                        "&:focus": { backgroundColor: "white" },
                        "&&:selected": { backgroundColor: "white" },
                        borderBottom: "2px solid black",
                        fontWeight: "bold",
                        textTransform: "none",
                        margin: "-10px 20px 20px 20px",
                      }}
                      className="menu-item"
                    >
                      <Link style={{ textDecoration: "none" }} to="/dao">
                        <Button
                          sx={{
                            color: "black",
                            " &:hover": {
                              background: "none",
                            },
                            "&:focus": {
                              background: "none",
                            },
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                          className="button"
                          onClick={disconnect}
                        >
                          Log Out
                        </Button>
                      </Link>
                    </li>
                  </ul>
                ) : null}
              </div>
            ) : (
              <Login setuseless={setuseless} />
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

{
  //   <Select
  //   sx={{
  //     color: "white",
  //     height: "70px",
  //     zIndex: "10000",
  //     border: "none",
  //     fontWeight: "bold",
  //     "& fieldset": { border: "none" },
  //     display: "flex",
  //     justifyContent: "center",
  //     alignItems: "center",
  //   }}
  //   MenuProps={{
  //     sx: {
  //       "&& .Mui-selected": {
  //         backgroundColor: "white",
  //       },
  //       "&& .Mui-hover": {
  //         backgroundColor: "white",
  //       },
  //     },
  //   }}
  //   labelId="demo-simple-select-label"
  //   id="demo-simple-select"
  //   label="HIIIII "
  //   value={"account"}
  //   onChange={(e) => handleChange(e)}
  // >
  //   <MenuItem
  //     disabled
  //     hidden
  //     sx={{
  //       display: "none",
  //       color: "black",
  //       borderWidth: "90%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       "&:hover": { backgroundColor: "white" },
  //       "&:focus": { backgroundColor: "white" },
  //       "&&:selected": { backgroundColor: "white" },
  //       borderBottom: "2px solid black",
  //       fontWeight: "bold",
  //       textTransform: "none",
  //       margin: "20px 20px 20px 20px",
  //     }}
  //     value={"account"}
  //   >
  //     <div style={{ display: "flex", color: "white", justifyContent: "center", alignItems: "center" }}>
  //       <Avatar style={{ bgcolor: "black", backgroundColor: "black", width: "25px", height: "25px" }} />
  //       <Button
  //         sx={{
  //           color: "black",
  //           fontSize: "10px",
  //           " &:hover": {
  //             background: "none",
  //           },
  //           "&:focus": {
  //             background: "none",
  //           },
  //           textTransform: "none",
  //           fontWeight: "bold",
  //           fontSize: "20px",
  //         }}
  //       >
  //         {"Account"}
  //       </Button>
  //     </div>
  //   </MenuItem>
  //   <MenuItem
  //     sx={{
  //       color: "black",
  //       borderWidth: "90%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       "&:hover": { backgroundColor: "white" },
  //       "&:focus": { backgroundColor: "white" },
  //       "&&:selected": { backgroundColor: "white" },
  //       borderBottom: "2px solid black",
  //       fontWeight: "bold",
  //       textTransform: "none",
  //       margin: "20px 20px 20px 20px",
  //     }}
  //   >
  //     <MyWallet />
  //   </MenuItem>
  //   <MenuItem
  //     sx={{
  //       color: "black",
  //       borderWidth: "90%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       "&:hover": { backgroundColor: "white" },
  //       "&:focus": { backgroundColor: "white" },
  //       "&&:selected": { backgroundColor: "white" },
  //       borderBottom: "2px solid black",
  //       fontWeight: "bold",
  //       margin: "20px 20px 20px 20px",
  //       textTransform: "none",
  //       fontWeight: "bold",
  //     }}
  //     value={"daovote"}
  //   >
  //     <Link style={{ textDecoration: "none", color: "black" }} to="/dao">
  //       {" "}
  //       <Button
  //         sx={{
  //           color: "black",
  //           " &:hover": {
  //             background: "none",
  //           },
  //           "&:focus": {
  //             background: "none",
  //           },
  //           textTransform: "none",
  //           fontWeight: "bold",
  //         }}
  //         className="button"
  //         onClick={() => setdao(true)}
  //       >
  //         DAO votes
  //       </Button>
  //     </Link>
  //   </MenuItem>
  //   <MenuItem
  //     sx={{
  //       color: "black",
  //       borderWidth: "90%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       "&:hover": { backgroundColor: "white" },
  //       "&:focus": { backgroundColor: "white" },
  //       "&&:selected": { backgroundColor: "white" },
  //       borderBottom: "2px solid black",
  //       fontWeight: "bold",
  //       textTransform: "none",
  //       margin: "20px 20px 20px 20px",
  //     }}
  //     value={"daovote"}
  //   >
  //     <Link style={{ textDecoration: "none" }} to="/profile">
  //       <Button
  //         sx={{
  //           color: "black",
  //           " &:hover": {
  //             background: "none",
  //           },
  //           "&:focus": {
  //             background: "none",
  //           },
  //           textTransform: "none",
  //           fontWeight: "bold",
  //         }}
  //         className="button"
  //         onClick={() => setdao(false)}
  //       >
  //         My Profile
  //       </Button>
  //     </Link>
  //   </MenuItem>
  //   <MenuItem
  //     sx={{
  //       color: "black",
  //       borderWidth: "90%",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //       "&:hover": { backgroundColor: "white" },
  //       "&:focus": { backgroundColor: "white" },
  //       "&&:selected": { backgroundColor: "white" },
  //       borderBottom: "2px solid black",
  //       fontWeight: "bold",
  //       margin: "20px 20px 20px 20px",
  //     }}
  //     value={"daovote"}
  //   >
  //     <Link style={{ textDecoration: "none" }} to="/dao">
  //       <Button
  //         sx={{
  //           color: "black",
  //           " &:hover": {
  //             background: "none",
  //           },
  //           "&:focus": {
  //             background: "none",
  //           },
  //           textTransform: "none",
  //           fontWeight: "bold",
  //         }}
  //         className="button"
  //         onClick={disconnect}
  //       >
  //         Log Out
  //       </Button>
  //     </Link>
  //   </MenuItem>
  // </Select>
  /* <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
               
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

//
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
//
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
//
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
//
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
//
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
