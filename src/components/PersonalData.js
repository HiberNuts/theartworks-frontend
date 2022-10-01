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

  const [progress, setProgress] = useState(10);
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
          <Avatar sx={{ width: "200px", height: "200px" }} alt="Remy Sharp" src={data.image} />
          <div className="profile-data">
            <h4>DAO member Candidacy </h4>
            <h5 style={{ marginTop: "-15px" }}>
              {data.name} - {data.position}
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
        <h5 className="phone">Phone: +{data.phone}</h5>
      </div>

      <div className="right">
        <Card className="right-card">
          <h2>Cast Your Vote 👇</h2>
          <Divider />
          <Button sx={{ width: "50%" }} className="btn" variant="outlined" color="success">
            For
          </Button>
          <Button sx={{ width: "50%" }} className="btn" variant="outlined" color="error">
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
              <LinearProgressWithLabel sx={{ height: "8px", borderRadius: "5px" }} color="success" value={progress} />
              Against
              <LinearProgressWithLabel sx={{ height: "8px", borderRadius: "5px" }} color="primary" value={progress} />
              <div className="date">
                <h5>Start Date</h5>
                <h5>Jul 12 2011</h5>
              </div>
              <div style={{ marginTop: "-30px" }} className="date">
                <h5>End Date</h5>
                <h5>Jul 12 2011</h5>
              </div>
            </Stack>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PersonalData;
