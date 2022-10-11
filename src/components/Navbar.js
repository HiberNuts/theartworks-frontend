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
import MyWallet from "../pages/MyWallet";
import abi from "../utils/abi";
import { useAccount, useConnect, useDisconnect, useContractRead } from "wagmi";
import { ConnectKitButton } from "connectkit";
import toast, { Toaster } from "react-hot-toast";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";

export default function Navbar() {
  //wagmi connecting contract

  const { address,  isConnected } = useAccount();
  const { Dao, setDao, account } = React.useContext(PagesContext);
  const navigate = useNavigate();
  const [dropdown, setdropdown] = React.useState("account");
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const handleDropChange = (e) => {
    setdropdown(e.target.value);
  };

  const handleChange = (event) => {
    setdropdown(event.target.value);
  };

  const { config, isError } = usePrepareContractWrite({
    addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
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
  }, [address]);

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
            {isConnected ? (
              <Select
                sx={{
                  m: "10px",
                  height: "70px",
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
                    {/* {shortenAddress(address)} */}
                    {/* <ConnectKit /> */}
                    <ConnectKitButton />
                  </Button>
                </MenuItem>
                <MenuItem>
                  {/* <Button
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      marginRight: "40px",
                      "&:hover": { backgroundColor: "black" },
                    }}
                    className="button"
                  > */}
                  <MyWallet />
                  {/* </Button> */}
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
                    onClick={disconnect}
                  >
                    logout
                  </Button>
                </MenuItem>
              </Select>
            ) : (
              // <Login />
              <ConnectKitButton />
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
