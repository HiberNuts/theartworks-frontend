import React, { useContext } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import { PagesContext } from "../context/Context";
import { ConnectKitButton } from "connectkit";
import { useConnect } from "wagmi";

export default function Login() {
  const { checkIfWalletConnected, account, connectWallet } = useContext(PagesContext);
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

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        sx={{
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <h3>Connect To Wallet</h3>
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
            style={{ border: "0px", padding: "0px", background: "white" }}
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {
              <img
                style={{ width: "250px", background: "white", padding: "0px", cursor: "pointer", border: "none" }}
                src="https://seeklogo.com/images/M/metamask-logo-531AE40256-seeklogo.com.png?v=637723254950000000"
              />
            }
            {!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
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
            fontSize: "14px",
            width: "120px",
            textTransform: "none",
            "&:hover": { backgroundColor: "black" },
            padding: "10px",
          }}
          onClick={toggleDrawer("right", true)}
        >
          {"Join DAO"}
        </Button>
        <SwipeableDrawer
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
