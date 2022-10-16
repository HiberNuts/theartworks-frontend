import React, { useContext } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import { PagesContext } from "../context/Context";
import { Avatar, Card, CardContent, CardHeader, Divider, IconButton, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import "./MyWallet.css";
import { useAccount, useContractRead } from "wagmi";
import abi from "../utils/abi.json";

export default function MyWallet() {
  const ADDRESS = "0xB38f8183Ad0110b40F054046B322E04da200E0B2";
  const { address, isConnecting, isDisconnected } = useAccount();

  const { checkIfWalletConnected, account, connectWallet } = useContext(PagesContext);

  // const navigate = useNavigate();
  const [state, setState] = React.useState({
    right: false,
  });
  const [userName, setuserName] = React.useState("");
  const [score, setscore] = React.useState("");

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const {
    data: User,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "candidacyAllData",
    args: [address],
    onSuccess(data) {
      setuserName(data.name);
      
    },
  });
  const { data: Score } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "score",
    args: [address],
    onSuccess(data) {
      setscore(data.toString());
      // console.log(data.toString());
    },
  });
  // console.log(userName);

  const lists = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 350 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          //   justifyContent: "space-evenly",
          flexDirection: "column",
        }}
      >
        <div className="m-row1">
          <div className="avatar">
            <Avatar />
            <p className="m-text">{userName}</p>
          </div>
          <IconButton>
            <CachedIcon />
          </IconButton>
        </div>
        <hr
          style={{
            background: "grey   ",
            color: "grey    ",
            borderColor: "grey  ",
            height: "0.5px",
            width: "100%",
          }}
        />
        <Divider sx={{ background: "black" }} />
        <div className="score">
          <h2 className="score-h">Score</h2>
          <p> {score.toString()}</p>
          <h2 className="score-h">Governance Token</h2>
          <p>0</p>
        </div>
        <Card sx={{ width: "80%", alignItems: "center", display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} gutterBottom>
              Total Balance
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              $ 26,09 USD
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              account
            </Typography>
          </CardContent>
        </Card>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"right"}>
        <Button
          sx={{
            color: "black",
            height: "30px",
          }}
          onClick={toggleDrawer("right", true)}
        >
          {"My Wallet"}
        </Button>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
          style={{ zIndex: "10000" }}
        >
          {lists("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
