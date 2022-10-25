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
import { Avatar, MenuItem, Select } from "@mui/material";
import MyWallet from "../pages/MyWallet";
import abi from "../utils/abi";
import { useAccount, useConnect, useDisconnect, useContractRead } from "wagmi";
import { ConnectKitButton } from "connectkit";
import toast, { Toaster } from "react-hot-toast";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

export default function Navbar() {
  //wagmi connecting contract

  const ADDRESS = "0x92c67df198E17bae61B6A92576a8ec9d52516690";

  const { address, isConnected } = useAccount();
  const { Dao, setDao, account } = React.useContext(PagesContext);
  const navigate = useNavigate();
  const [dropdown, setdropdown] = React.useState("account");
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [dao, setdao] = React.useState(false);
  const [reload, setreload] = React.useState("");

  const handleDropChange = (e) => {
    setdropdown(e.target.value);
  };

  const handleChange = (event) => {
    setdropdown(event.target.value);
  };

  const { config, isError } = usePrepareContractWrite({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "blacklisted",
    args: [address],
  });

  const { data, write } = useContractRead(config);
  const logout = () => {
    disconnect();
  };
  React.useEffect(() => {
    if (data) {
      toast.error("Your address is blacklisted you cannot login");
      logout();
    }
  }, [address, isConnected]);
  // React.useEffect(() => {
  //   setdropdown("account");
  //   // if (isConnected == true) {
  //   //   window.location.reload(false);
  //   // }
  // }, [isConnected]);

  console.log(account);
  console.log(isConnected);

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

          // height: "80px",
          // marginLeft: "120px",
          // marginRight: "120px",
          // width: "100%",
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
            {isConnected ? (
              <Select
                sx={{
                  color: "white",
                  height: "70px",

                  border: "none",
                  fontWeight: "bold",
                  "& fieldset": { border: "none" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                MenuProps={{
                  sx: {
                    "&& .Mui-selected": {
                      backgroundColor: "white",
                    },
                    "&& .Mui-hover": {
                      backgroundColor: "white",
                    },
                  },
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dropdown}
                onChange={(e) => handleChange(e)}
              >
                <MenuItem
                  sx={{
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
                    margin: "20px 20px 20px 20px",
                  }}
                  value={"account"}
                >
                  <ConnectKitButton.Custom>
                    {({ isConnected, show, truncatedAddress, ensName }) => {
                      return (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <Avatar
                            style={{ bgcolor: "black", backgroundColor: "black", width: "25px", height: "25px" }}
                          />
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
                            onClick={show}
                          >
                            {"Account"}
                          </Button>
                        </div>
                      );
                    }}
                  </ConnectKitButton.Custom>
                  {/* Account */}
                </MenuItem>
                <MenuItem
                  sx={{
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
                    margin: "20px 20px 20px 20px",
                  }}
                >
                  <MyWallet />
                </MenuItem>
                <MenuItem
                  sx={{
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
                    margin: "20px 20px 20px 20px",
                  }}
                  value={"Dao Votes"}
                >
                  <Link style={{ textDecoration: "none", color: "black" }} to="/dao">
                    {" "}
                    <Button
                      sx={{
                        color: "black",

                        " &:hover": {
                          background: "none",
                        },
                        "&:focus": {
                          background: "none",
                        },
                      }}
                      className="button"
                      onClick={() => setdao(true)}
                    >
                      Dao Votes
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem
                  sx={{
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
                    margin: "20px 20px 20px 20px",
                  }}
                  value={"My Profile"}
                >
                  <Link style={{ textDecoration: "none" }} to="/profile">
                    <Button
                      sx={{
                        color: "black",

                        " &:hover": {
                          background: "none",
                        },
                        "&:focus": {
                          background: "none",
                        },
                      }}
                      className="button"
                      onClick={() => setdao(false)}
                    >
                      My Profile
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem
                  sx={{
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
                    margin: "20px 20px 20px 20px",
                  }}
                  value={"logout"}
                >
                  <Button
                    sx={{
                      color: "black",
                      " &:hover": {
                        background: "none",
                      },
                      "&:focus": {
                        background: "none",
                      },
                    }}
                    className="button"
                    onClick={disconnect}
                  >
                    logout
                  </Button>
                </MenuItem>
              </Select>
            ) : (
              <Login  />
              // <ConnectKitButton.Custom>
              //   {({ isConnected, show, truncatedAddress, ensName }) => {
              //     return (
              //       <Button
              //         sx={{
              //           backgroundColor: "black",
              //           color: "white",
              //           borderRadius: "20px",
              //           fontSize: "10px",
              //           width: "120px",
              //           textTransform: "none",
              //           "&:hover": { backgroundColor: "black" },
              //           padding: "10px",
              //         }}
              //         onClick={show}
              //       >
              //         {isConnected ? ensName ?? truncatedAddress : "Join DAO"}
              //       </Button>
              //     );
              //   }}
              // </ConnectKitButton.Custom>
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
