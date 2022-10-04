import { Button, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

import "./Profile.css";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const Profile = () => {
  const [image, setImage] = useState({ preview: "", raw: "" });

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handlePersonChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", image.raw);

  //   await fetch("YOUR_URL", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: formData,
  //   });
  // };

  return (
    <div className="profile-container">
      <div className="heading">
        <h1>My Profile</h1>
      </div>
      <div className="data">
        <label htmlFor="upload-button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {image.preview ? (
            <img
              style={{
                border: "2px solid black",
                height: "250px",
                width: "250px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              src={image.preview}
              alt="dummy"
              width="300"
              height="300"
            />
          ) : (
            <h5
              className="text-center"
              style={{
                border: "2px solid black",
                height: "250px",
                width: "250px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Upload your photo
            </h5>
          )}
        </label>
        <form className="profile-form">
          <input type="file" id="upload-button" style={{ display: "none" }} onChange={handleChange} />
          <div className="p-row1">
            <input
              className="profile-input"
              placeholder="Name"
              required
              type="text"
              
              label="Name"
              variant="outlined"
            />
            <input
              className="profile-input"
              required
              type="text"
              
              placeholder="Company Name"
              label="Company Name"
              variant="outlined"
            />
          </div>
          <div className="p-row2">
            <input
              className="profile-input"
              required
              type="email"
              
              placeholder="Email"
              label="Email"
              variant="outlined"
            />
            <input
              className="profile-input"
              required
              type="text"
              
              label="Web Link"
              placeholder="Web Link"
              variant="outlined"
            />
          </div>

          <textarea
            className="profile-input"
            sx={{ width: "500px", height: "55px" }}
            required
            type="text"
            placeholder="Describe your motivation to become DAO member"
            
            
            variant="outlined"
          />
          <input
            id="address"
            className="profile-input"
            required
            type="text"
             
            placeholder="Postal Address"
            variant="outlined"
          />
          {/* <label>
            Sponsor list
            <select value={value} onChange={handleValueChange}>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="meat">Meat</option>
            </select>
          </label> */}

          <InputLabel id="demo-multiple-chip-label">Select Your Sponsors</InputLabel>

          <Select
            sx={{
              marginBottom: "10px",
              color: "black",
              minWidth: "200px",
            }}
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={personName}
            onChange={handlePersonChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>

          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              marginRight: "40px",
              "&:hover": { backgroundColor: "black" },
            }}
            className="button"
            type="submit"
          >
            Submit to Dao
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
