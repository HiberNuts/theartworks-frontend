import React, { useContext } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import { PagesContext } from "../context/Context";
import { Avatar, Card, CardContent, Divider, IconButton, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import "./MyWallet.css";
import { useAccount, useContractRead } from "wagmi";
import abi from "../utils/abi.json";
import ReplayIcon from "@mui/icons-material/Replay";
import axios from "axios";
import { ethers } from "ethers";
import { shortenAddress } from "../utils/shortenAddress";

export default function MyWallet() {
  const ADDRESS = "0x93442fb4c28Aaecf2D83c9C847dF46D4A3A81135";

  const { address, isConnecting, isDisconnected } = useAccount();

  const { checkIfWalletConnected, account, connectWallet } = useContext(PagesContext);

  // const navigate = useNavigate();
  const [state, setState] = React.useState({
    right: false,
  });
  const [userName, setuserName] = React.useState("Name");
  const [score, setscore] = React.useState("");
  const [token, settoken] = React.useState("");
  const [matic, setmatic] = React.useState(0);
  const [maticInUsd, setmaticInUsd] = React.useState(0);

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

  const { data: govToken } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "getTokenBalance",
    onSuccess(data) {
      settoken(data.toString());
      console.log("Token balance", data.toString());
    },
  });

  React.useEffect(() => {
    const { ethereum } = window;

    const provider = new ethers.providers.Web3Provider(ethereum);
    provider.getBalance(address).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance);
      setmatic(balanceInEth);
      // convert.MAT.USD(1);
      console.log(`balance: ${balanceInEth} ETH`);
    });
    axios.get(`https://api.coinconvert.net/convert/matic/usd?amount=${parseFloat(matic)}`).then((data) => {
      setmaticInUsd(data.data.USD);
      console.log("valeu in usd", data.data.USD);
    });
  });

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(address);
  };
  // console.log(userName);

  const lists = (anchor) => (
    <Box
      elevation={0}
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 450 }}
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

          <IconButton onClick={handleCopy}>
            <ReplayIcon sx={{ width: "40px", transform: "scale(-1, 1)", "&:hover": { background: "none" } }} />
          </IconButton>
        </div>
        <hr
          style={{
            background: "rgb(173, 169, 169)   ",
            color: "rgb(173, 169, 169)    ",
            borderColor: "rgb(173, 169, 169)  ",
            height: "0.5px",
            width: "100%",
          }}
        />
        <Divider sx={{ background: "black" }} />
        <div className="score">
          <h2 className="score-h">Score</h2>
          <p> {score.toString()}</p>
          <h2 className="score-h">Governance Token</h2>
          <p>{token}</p>
        </div>
        <hr
          style={{
            background: "rgb(173, 169, 169)   ",
            color: "rgb(173, 169, 169)    ",
            borderColor: "rgb(173, 169, 169)  ",
            height: "0.5px",
            width: "100%",
          }}
        />
        <Card sx={{ mt: 5, width: "80%", alignItems: "center", display: "flex", justifyContent: "center" }}>
          <CardContent>
            <Typography sx={{ mt: -1, fontSize: 20 }} gutterBottom>
              Total Balance
            </Typography>
            <Typography sx={{ mb: 1.5, fontWeight: "bold" }} color="text">
              $ {parseFloat(maticInUsd).toFixed(2)} USD
            </Typography>
            <Typography
              sx={{ mb: -1, alignContent: "center", alignItems: "center", display: "flex" }}
              color="text.secondary"
            >
              {shortenAddress(address)}{" "}
              <ContentCopyIcon onClick={handleCopy} sx={{ marginLeft: "10px", cursor: "pointer" }} />
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            width: "80%",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            color="text.secondary"
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                style={{ height: "20px", width: "20px", marginRight: "10px" }}
                src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=023"
              />
              <p>Matic</p>
            </div>
            <Typography sx={{ fontWeight: "bold" }} color="text.primary">
              {parseFloat(matic).toFixed(2)}
            </Typography>
          </div>

          <div
            style={{
              fontWeight: "bold",
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-20px",
            }}
            px
            color="text.secondary"
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p style={{ marginLeft: "30px", fontSize: "15px", color: "grey" }}>Polygon</p>
            </div>
            <Typography sx={{ fontWeight: "bold" }} color="text.secondary">
              $ {parseFloat(maticInUsd).toFixed(2)} USD
            </Typography>
          </div>
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
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "17px",
          }}
          onClick={toggleDrawer("right", true)}
        >
          {"My Wallet"}
        </Button>
        <SwipeableDrawer
          PaperProps={{
            sx: {
              width: 450,
              marginTop: 8.8,
              zIndex: 0,
              boxShadow: "none",
              borderLeft: "2px solid grey",
              borderTop: "1px solid black",
            },
          }}
          BackdropProps={{ invisible: true }}
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
