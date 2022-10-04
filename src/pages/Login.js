import React, { useContext } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import { PagesContext } from "../context/Context";

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
        <img
          onClick={() => connectWallet()}
          style={{ width: "250px", cursor: "pointer" }}
          src="https://seeklogo.com/images/M/metamask-logo-531AE40256-seeklogo.com.png?v=637723254950000000"
        />
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
            "&:hover": { backgroundColor: "black" },
            padding: "10px",
          }}
          onClick={toggleDrawer("right", true)}
        >
          {"Join Dao"}
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
