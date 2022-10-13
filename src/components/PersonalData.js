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
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state;
  const [flag1, setFlag1] = React.useState();
  const [flag2, setFlag2] = React.useState();

  var timeSart = new Date(data.timeStart * 1000);
  var timeEnd = new Date(data.timeEnd * 1000);

  const [progress, setProgress] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleForButtonClick = () => {
    setFlag1(!flag1);
    setFlag2(false);
  };
  const handleAgainstButtonClick = () => {
    setFlag2(!flag2);
    setFlag1(false);
  };

  return (
    <div className="profileContainer">
      <div className="personalData">
        <div className="backbtn">
          <Button variant="outlined" onClick={() => navigate("/dao")}>
            {" "}
            Back
          </Button>
        </div>
        <div className="profile">
          <Avatar sx={{ width: "200px", height: "200px" }} alt="Remy Sharp" src={"https://picsum.photos/200/300"} />
          <div className="profile-data">
            <h4>DAO member Candidacy </h4>
            <h5 style={{ marginTop: "-15px" }}>
              {data.name} - {data.job}
            </h5>
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
            <Chip
              className="chip2"
              label={data.spon}
              variant="outlined"
              sx={{ padding: "10px" }}
              icon={
                data.sponLabel == "approved" ? (
                  <TaskAltIcon style={{ color: "green" }} />
                ) : data.sponLabel == "progress" ? (
                  <RotateRightIcon style={{ color: "orange" }} />
                ) : (
                  <CancelIcon style={{ color: "red" }} />
                )
              }
            />
          </div>
        </div>
        <div className="desc">{data.desc}</div>
        <h5 className="phone">Phone: +{data.number}</h5>
      </div>

      <div className="right">
        <Card className="right-card">
          <h2>Cast Your Vote 👇</h2>
          <Divider />
          <Button
            sx={{ width: "50%" }}
            className="btn"
            variant={flag1 ? "contained" : "outlined"}
            color="success"
            onClick={handleForButtonClick}
          >
            For
          </Button>
          <Button
            sx={{ width: "50%" }}
            className="btn"
            variant={flag2 ? "contained" : "outlined"}
            color="error"
            onClick={handleAgainstButtonClick}
          >
            Against
          </Button>
          <Button sx={{ marginBottom: "20px", marginTop: "30px" }} className="btn" variant="contained">
            Vote
          </Button>
        </Card>

        {data.chip == "Active" && (
          <Card className="right-card2">
            <h2>Current results</h2>
            <Stack sx={{ width: "70%", fontWeight: "500px" }} spacing={2}>
              For
              <LinearProgressWithLabel
                sx={{ height: "8px", borderRadius: "5px" }}
                color="success"
                value={data.forVotes}
              />
              Against
              <LinearProgressWithLabel
                sx={{ height: "8px", borderRadius: "5px" }}
                color="primary"
                value={data.againstVotes}
              />
              <div className="date">
                <h5>Start Date</h5>
                <h5>{timeSart.toDateString()}</h5>
              </div>
              <div style={{ marginTop: "-30px" }} className="date">
                <h5>End Date</h5>
                <h5>{timeEnd.toDateString()}</h5>
              </div>
            </Stack>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalData;
