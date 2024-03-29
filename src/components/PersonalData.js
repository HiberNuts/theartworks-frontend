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
import { useAccount, useContractRead, useContractWrite, useDisconnect, usePrepareContractWrite } from "wagmi";
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
  const [useless, setuseless] = useState(false);

  const ADDRESS = "0x93442fb4c28Aaecf2D83c9C847dF46D4A3A81135";
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
  const handleDelete = () => {};

  const { config, isError } = usePrepareContractWrite({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "blacklisted",
    args: [address],
  });
  const { disconnect } = useDisconnect();

  const { data: data2, write } = useContractRead(config);
  console.log(data);

  console.log("address", address);
  const logout = () => {
    disconnect();
  };
  React.useEffect(() => {
    if (data2) {
      setuseless(true);
      logout();
      navigate("/dao");
    } else {
      setuseless(false);
    }
  }, [address]);
  // console.log(account);
  return (
    <div className="profileContainer">
      <div className="personalData">
        <div className="backbtn">
          <Button
            startIcon={<ArrowBack />}
            sx={{ color: "black", textTransform: "none" }}
            onClick={() => navigate("/dao")}
          >
            {" "}
            Back
          </Button>
        </div>
        <div className="profile">
          <Avatar sx={{ width: "200px", height: "200px" }} alt="Remy Sharp" src={data.image} />
          <div className="profile-data">
            <h4 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              DAO member Candidacy
              {data.candidacy == "true" ? (
                <img style={{ marginLeft: "5px" }} className="icon" src={accepted} />
              ) : data.candidacy == "false" ? (
                <img style={{ marginLeft: "5px" }} className="icon" src={refused} />
              ) : (
                `( ${data.candidacy} )`
              )}
            </h4>
            <h2 style={{}}>
              {data.name} - {data.job}
            </h2>
            {data.chip == "Active" ? (
              <Chip style={{}} className="chip" label="Active" color="success" sx={{ padding: "10px" }} />
            ) : (
              <Chip
                style={{}}
                className="chip"
                label="Closed"
                // color="primary"
                sx={{ padding: "10px", color: "white", backgroundColor: "rgb(98, 71, 230)" }}
              />
            )}
            {data.sponsor1Name.name || data.sponsor2Name.name ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "-15px" }}>
                <h3>Sponsored By</h3>

                {data.sponsor1Name.name && (
                  <Chip
                    variant="outlined"
                    sx={{ padding: "10px", marginLeft: "10px" }}
                    deleteIcon={
                      data.sponsor1App == true ? (
                        <img className="sicon" src={tick} />
                      ) : (
                        <img className="sicon" src={inprogress} />
                      )
                    }
                    label={data.sponsor1Name.name}
                    onDelete={handleDelete}
                  />
                )}

                {data.sponsor2Name.name && (
                  <Chip
                    variant="outlined"
                    sx={{ padding: "10px", marginLeft: "10px" }}
                    deleteIcon={
                      data.sponsor2App == true ? (
                        <img className="sicon" src={tick} />
                      ) : (
                        <img className="sicon" src={inprogress} />
                      )
                    }
                    label={data.sponsor2Name.name}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            ) : (
              <h3 style={{ marginBottom: "-2px" }}>Not sponsored</h3>
            )}
          </div>
        </div>

        <div className="phone">{data.desc}</div>
        <br />
        <div className="phone">Phone: {data.number}</div>
        <div className="phone">{data.website}</div>

        <div className="phone">{data.email}</div>
        <br />
        <div className="phone">{data.companyName}</div>

        {/* <div className="phone"> {data.postalAddress}</div> */}
        <div className="phone"> {data.postalAddress.split("\n")[0]}</div>
        <div className="phone"> {data.postalAddress.split("\n")[1]}</div>
        <div className="phone"> {data.postalAddress.split("\n")[2]}</div>
      </div>

      <div className="right">
        {data.chip == "Active" && (
          <Card className="right-card">
            <h2>Cast Your Vote</h2>
            <hr
              style={{
                background: "rgb(212, 209, 209)   ",
                color: "rgb(212, 209, 209)    ",
                borderColor: "rgb(212, 209, 209)  ",
                height: "0.5px",
                width: "100%",
                marginLeft: "-10px",
                marginRight: "-10px",
                marginTop: "-20px",
              }}
            />
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
                margin: "5px 0 5px 0",
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
                margin: "5px 0 5px 0",
              }}
              className="btn"
              variant="contained"
              onClick={handleAgainstButtonClick}
            >
              Against
            </Button>
            {data.sponsor1 == address && data.sponsor1App == "inprogress" && (
              <div
                onClick={addSponsor}
                style={{
                  fontSize: "20px",
                  display: "flex",
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
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  cursor: "pointer",
                  margin: "5px 0 5px 0",
                }}
              >
                <Button sx={{ backgroundColor: "white", textTransform: "none", color: "black", fontSize: "20px" }}>
                  Sign sponsorship
                </Button>
                <img className="sicon" src={inprogress} />
              </div>
            )}
            {data.sponsor2 == address && data.sponsor2App == "inprogress" && (
              <div
                onClick={addSponsor}
                style={{
                  fontSize: "20px",
                  display: "flex",
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
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  cursor: "pointer",
                  margin: "5px 0 5px 0",
                }}
              >
                <Button sx={{ backgroundColor: "white", textTransform: "none", color: "black", fontSize: "20px" }}>
                  Sign sponsorship
                </Button>
                <img className="sicon" src={inprogress} />
              </div>
            )}
            <Button
              sx={{
                marginBottom: "25px",

                width: "90%",
                borderRadius: "13px",
                height: "50px",
                testDecoration: "none",
                textTransform: "none",
                marginTop: "5px",
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
                {timeSart.toLocaleString("default", { month: "short" })} {timeSart.getDate()},{timeSart.getFullYear()},{" "}
                {timeSart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </h5>
            </div>
            <div style={{ marginTop: "-30px" }} className="date">
              <h5>End Date</h5>
              <h5>
                {timeEnd.toLocaleString("default", { month: "short" })} {timeEnd.getDate()},{timeEnd.getFullYear()},{" "}
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
