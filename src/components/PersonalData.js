import { Avatar, Button, Card, Chip, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifiedIcon from "@mui/icons-material/Verified";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import "./PersonalData.css";
import LinearProgress from "@mui/material/LinearProgress";
import { Stack } from "@mui/system";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import abi from "../utils/abi.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import accepted from "../assets/accepted.png";
import refused from "../assets/refused.png";
import tick from "../assets/tick.png";
import inprogress from "../assets/inprogress.png";
import { ArrowBack } from "@mui/icons-material";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const PersonalData = () => {
  const { account } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state;
  console.log(data);
  const [flag1, setFlag1] = React.useState();
  const [flag2, setFlag2] = React.useState();
  const [voteValue, setvoteValue] = React.useState();

  const ADDRESS = "0xf9C559b43f91DCDa9b8fc849Aa4b646C158d00Ea";
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log(address);

  var timeSart = new Date(data.timeStart * 1000);
  var timeEnd = new Date(data.timeEnd * 1000);

  const [progress, setProgress] = useState(0);

  const handleForButtonClick = () => {
    setFlag1(!flag1);
    setFlag2(false);
    setvoteValue(true);
  };
  const handleAgainstButtonClick = () => {
    setFlag2(!flag2);
    setFlag1(false);
    setvoteValue(false);
  };

  // console.log(data.address);

  const voteToDao = async () => {
    try {
      console.log("hii");
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(ADDRESS, abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let Txn = await connectedContract.VoteForCandidacyProposal(data.address, voteValue, { gasLimit: 1000000 });

        console.log("Mining...please wait.");
        await Txn.wait();
        console.log(Txn);
        toast.success("Your vote have been noted Thank you");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occured");
    }
  };

  const handleVote = () => {
    console.log("bye");
    voteToDao();
  };

  const addSponsor = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(ADDRESS, abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let Txn = await connectedContract.signSponsorship(data.address);

        console.log("Mining...please wait.");
        await Txn.wait();
        console.log(Txn);
        setFlag1(false);
        setFlag2(false);

        toast.success("Sponsor has been approved");
      }
    } catch (error) {
      console.log(error);
      toast.success("Looks like you already voted");
      setFlag1(false);
      setFlag2(false);
    }
  };
  // console.log(account);
  return (
    <div className="profileContainer">
      <div className="personalData">
        <div className="backbtn">
          <Button startIcon={<ArrowBack />} sx={{ color: "black" }} onClick={() => navigate("/dao")}>
            {" "}
            Back
          </Button>
        </div>
        <div className="profile">
          <Avatar sx={{ width: "200px", height: "200px" }} alt="Remy Sharp" src={data.image} />
          <div className="profile-data">
            <h2>DAO member Candidacy </h2>
            <h2 style={{ marginTop: "-15px" }}>
              {data.name} - {data.job}
            </h2>
            {data.chip == "Active" ? (
              <Chip
                style={{ marginTop: "-15px" }}
                className="chip"
                label="Active"
                color="success"
                sx={{ padding: "10px" }}
              />
            ) : (
              <Chip
                style={{ marginTop: "-15px" }}
                className="chip"
                label="Closed"
                color="primary"
                sx={{ padding: "10px" }}
              />
            )}
            {data.sponsor1Name.name || data.sponsor2Name.name ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p>Sponsored BY</p>
                {data.sponsor1Name.name && (
                  <Chip
                    label={data.sponsor1Name.name}
                    variant="outlined"
                    sx={{ padding: "10px", marginLeft: "10px" }}
                    icon={
                      data.sponsor1App == true ? (
                        <img className="sicon" src={tick} />
                      ) : data.sponsor1App == "inprogress" ? (
                        <img className="sicon" src={inprogress} />
                      ) : (
                        <CancelIcon style={{ color: "red" }} />
                      )
                    }
                  />
                )}
                {data.sponsor2Name.name && (
                  <Chip
                    label={data.sponsor2Name.name}
                    variant="outlined"
                    sx={{ padding: "10px", marginLeft: "10px" }}
                    icon={
                      data.sponsor2App == true ? (
                        <img className="sicon" src={tick} />
                      ) : data.sponsor2App == "inprogress" ? (
                        <img className="sicon" src={inprogress} />
                      ) : (
                        <CancelIcon style={{ color: "red" }} />
                      )
                    }
                  />
                )}
              </div>
            ) : (
              "Not sponsored"
            )}
          </div>
        </div>

        <div className="phone">{data.desc}</div>
        <br />
        <div className="phone">{data.website}</div>

        <div className="phone">{data.email}</div>

        <div className="phone"> {data.postalAddress}</div>
      </div>

      <div className="right">
        {data.chip == "Active" && (
          <Card className="right-card">
            <h2>Cast Your Vote 👇</h2>
            <Divider />
            <Button
              sx={{
                width: "90%",
                borderRadius: "15px",
                height: "50px",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
                border: flag1 ? "1px solid black" : "1px solid grey",
                color: "black",
                textTransform: "none",
              }}
              className="btn"
              variant="contained"
              // color="success"
              onClick={handleForButtonClick}
            >
              For
            </Button>
            <Button
              sx={{
                width: "90%",
                borderRadius: "15px",
                height: "50px",
                backgroundColor: "#ffffff",
                "&:hover": {
                  backgroundColor: "#ffffff",
                },
                textTransform: "none",
                border: flag2 ? "1px solid black" : "1px solid grey",
                color: "black",
              }}
              className="btn"
              variant="contained"
              onClick={handleAgainstButtonClick}
            >
              Against
            </Button>
            {data.sponsor1 == address && data.sponsor1App == "inprogress" && (
              <Button
                sx={{
                  width: "90%",
                  borderRadius: "15px",
                  height: "50px",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                  textTransform: "none",
                  border: "1px solid grey",
                  color: "black",
                }}
                onClick={addSponsor}
                variant="contained"
                color="warning"
              >
                Sign sponsorship
              </Button>
            )}
            {data.sponsor2 == address && data.sponsor2App == "inprogress" && (
              <div
                style={{
                  width: "90%",
                  borderRadius: "13px",
                  height: "50px",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#ffffff",
                  },
                  textTransform: "none",
                  border: "1px solid grey",
                  color: "black",
                }}
              >
                <Button onClick={addSponsor} variant="contained" color="warning">
                  Sign Sponsorship
                </Button>
                <img className="sicon" src={inprogress} />
              </div>
            )}
            <Button
              sx={{
                marginBottom: "20px",
                marginTop: "30px",
                width: "90%",
                borderRadius: "13px",
                height: "50px",
                testDecoration: "none",
                textTransform: "none",
              }}
              className="btn"
              variant="contained"
              onClick={(e) => {
                if (address) {
                  e.preventDefault();
                  handleVote();
                }
              }}
            >
              Vote
            </Button>
          </Card>
        )}

        <Card className="right-card2">
          {data.chip == "Active" ? <h2>Current results</h2> : <h2>Results</h2>}

          <hr
            style={{
              background: "rgb(212, 209, 209)   ",
              color: "rgb(212, 209, 209)    ",
              borderColor: "rgb(212, 209, 209)  ",
              height: "0.5px",
              width: "100%",
            }}
          />
          <Stack sx={{ width: "70%", fontWeight: "500px" }} spacing={2}>
            <p style={{ marginBottom: "-18px" }}>For</p>
            <LinearProgressWithLabel
              sx={{ height: "8px", borderRadius: "5px", colorPrimary: "blue", backgroundColor: "rgb(189, 187, 187)" }}
              color="primary"
              value={data.forVotes}
            />
            <p style={{ marginBottom: "-18px" }}>Against</p>
            <LinearProgressWithLabel
              sx={{ height: "8px", borderRadius: "5px", backgroundColor: "rgb(189, 187, 187)" }}
              color="primary"
              value={data.againstVotes}
            />
            <div className="date">
              <h5>Start Date</h5>
              <h5>
                {timeSart.toLocaleString("default", { month: "short" })} {timeSart.getDay()},{timeSart.getFullYear()},{" "}
                {timeSart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </h5>
            </div>
            <div style={{ marginTop: "-30px" }} className="date">
              <h5>End Date</h5>
              <h5>
                {timeEnd.toLocaleString("default", { month: "short" })} {timeEnd.getDay()},{timeEnd.getFullYear()},{" "}
                {timeEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </h5>
            </div>
          </Stack>
        </Card>
      </div>
    </div>
  );
};

export default PersonalData;
