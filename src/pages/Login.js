import React, { useContext } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import { PagesContext } from "../context/Context";
import { ConnectKitButton } from "connectkit";
import { useAccount, useConnect } from "wagmi";
import { Avatar, Divider } from "@mui/material";
import "./Login.css"
export default function Login({ setuseless }) {
  const { address, isConnected } = useAccount();
  // const { checkIfWalletConnected, account, connectWallet } = useContext(PagesContext);
  // const navigate = useNavigate();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  console.log("address", address);

  React.useEffect(() => {
    if (address) {
      setuseless(true);
    } else {
      setuseless(false);
    }
  }, [address]);

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 450,top: "60px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        sx={{
          height: "250px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: "40px",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "bold" }} className="avatar">
          <Avatar sx={{ backgroundColor: "rgb(121, 118, 118)", width: "30px", height: "30px", mr: "10px" }} />
          <p className="m-text">My wallet</p>
        </div>
        <div
          style={{
            height: "1px",
            // paddingLeft: "-140px",
            marginLeft: "-40px",
            marginTop: "-100px",
            width: "450px",
            backgroundColor: "rgb(183, 181, 181)",
          }}
        ></div>
        {/* <ConnectKitButton.Custom>
          {({ isConnected, show, truncatedAddress, ensName }) => {
            return (
              <Button
                sx={
                  {
                    // backgroundColor: "black",
                    // color: "white",
                    // borderRadius: "20px",
                    // fontSize: "10px",
                    // width: "120px",
                    // textTransform: "none",
                    // "&:hover": { backgroundColor: "black" },
                    // padding: "10px",
                  }
                }
                onClick={show}
              >
                {isConnected ? (
                  ensName ?? truncatedAddress
                ) : (
                  <img
                    style={{ width: "250px", cursor: "pointer" }}
                    src="https://seeklogo.com/images/M/metamask-logo-531AE40256-seeklogo.com.png?v=637723254950000000"
                  />
                )}
              </Button>
            );
          }}
        </ConnectKitButton.Custom> */}
        {connectors.map((connector) => (
          <button
            style={{
              border: "1px solid rgb(183, 181, 181)",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              width: "100%",
              padding: "0px",
              background: "white",
            }}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", padding: "10px" }}>
                <img
                  style={{
                    width: "33px",
                    height: "30px",
                    background: "white",
                    marginRight: "20px",
                    cursor: "pointer",
                    border: "none",
                  }}
                  src="https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png"
                />
                <h3>MetaMask</h3>
              </div>
            }
            {/* {!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && " (connecting)"} */}
          </button>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <Button
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "20px",
            fontSize: "11px",
            width: "120px",
            textTransform: "none",
            "&:hover": { backgroundColor: "black" },
            padding: "9px",
          }}
          onClick={toggleDrawer("right", true)}
        >
          {"Join DAO"}
        </Button>
        <SwipeableDrawer
          // sx={{ marginTop: "20px", height: "50px" }}
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
