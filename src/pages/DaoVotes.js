import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Avatar, Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import "./DaoVotes.css";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifiedIcon from "@mui/icons-material/Verified";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const DUMMY = [
  {
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    candidacy: "48 hours left",
    chip: "Active",
    name: "John Smith",
    position: "Curator",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu sem integer vitae justo eget magna fermentum iaculis eu. Porttitor leo a diam sollicitudin. Risus sed vulputate odio ut enim blandit volutpat. Pellentesque id nibh vestibulum lectus mauris ultrices eros.",
    spon: "Thedore Curve",
    sponLabel: "progress",
  },
  {
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    candidacy: "true",
    chip: "Closed",
    name: "Sofia Milinaria",
    position: "Artist",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu sem integer vitae justo eget magna fermentum iaculis eu. Porttitor leo a diam sollicitudin. Risus sed vulputate odio ut enim blandit volutpat. Pellentesque id nibh vestibulum lectus mauris ultrices eros.",
    spon: "Marta Ivanov",
    sponLabel: "approved",
  },
];

const DaoVotes = () => {
  const [age, setAge] = React.useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    // <Card className="card" sx={{ padding: "30px", margin: "30px", borderRadius: "20px" }}>
    //   <Avatar
    //     sx={{ width: "150px", height: "150px" }}
    //     alt="Remy Sharp"
    //     src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
    //   />
    //   <div className="details">
    //     <div className="row1 row">
    //       <h4>DAO member Candidacy</h4>
    //       <Chip label="Active" color="success" sx={{ padding: "10px" }} />
    //     </div>
    //     <div className="row2 row">
    //       <h4>John Smith - Curator</h4>
    //     </div>
    //     <div className="row3 row">
    //       <p>
    //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
    //         dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
    //         ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
    //         nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
    //         anim id est laborum.
    //       </p>
    //     </div>
    //     <div className="row4 row">
    //       <h4>Sponsored By</h4>
    //       <Chip label="Theodore Curve" variant="outlined" sx={{ padding: "10px" }} icon={<RotateRightIcon />} />
    //     </div>
    //   </div>
    // </Card>

    <div>
      <Box sx={{ width: "300px", margin: "20px" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="All Votes"
            onChange={handleChange}
          >
            <MenuItem defaultChecked={true} value={10}>
              All Votes
            </MenuItem>
            <MenuItem value={20}>Active Votes</MenuItem>
            <MenuItem value={30}>Closed Votes</MenuItem>
            <MenuItem value={30}>DAO Members</MenuItem>
            <MenuItem value={30}>Refused Members</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {DUMMY.map((data) => (
        <Card className="card" sx={{ padding: "30px", margin: "30px", borderRadius: "20px" }}>
          <Avatar sx={{ width: "150px", height: "150px" }} alt="Remy Sharp" src={data.image} />
          <div className="details">
            <div className="row1 row">
              <h4>
                DAO member Candidacy --{" "}
                {data.candidacy == "true" ? (
                  <VerifiedIcon style={{ color: "blue" }} />
                ) : data.candidacy == "false" ? (
                  <NotInterestedIcon style={{ color: "red" }} />
                ) : (
                  data.candidacy
                )}
              </h4>
              {data.chip == "Active" ? (
                <Chip label="Active" color="success" sx={{ padding: "10px" }} />
              ) : (
                <Chip label="Closed" color="primary" sx={{ padding: "10px" }} />
              )}
            </div>
            <div className="row2 row">
              <h4>
                {data.name} - {data.position}
              </h4>
            </div>
            <div className="row3 row">
              <p>{data.desc}</p>
            </div>
            <div className="row4 row">
              <h4>Sponsored By</h4>
              <Chip
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
        </Card>
      ))}
    </div>
  );
};

export default DaoVotes;
