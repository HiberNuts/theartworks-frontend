import { Button, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

import "./Profile.css";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Chip from "@mui/material/Chip";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useAccount } from "wagmi";
import abi from "../utils/abi.json";
import { ethers } from "ethers";

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
  const [formData, setformData] = useState({
    name: "",
    companyName: "",
    email: "",
    website: "",
    desc: "",
    job: "",
    address: "",
    number: "",
  });
  console.log(formData.name);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const { address, isConnecting, isDisconnected } = useAccount();

  const handlePersonChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  // const { config } = usePrepareContractWrite({
  //   addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
  //   contractInterface: abi,
  //   functionName: "SubmitToDao",
  //   args: [
  //     formData.name,
  //     formData.website,
  //     formData.website,
  //     formData.desc,
  //     formData.email,
  //     formData.companyName,
  //     formData.name,
  //     formData.name,
  //   ],
  // });
  // const { write } = useContractWrite(config);

  // // write?.({
  // //   overrides: { gasLimit: 1e7 },
  // // });

  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const CONTRACT_ADDRESS = "0xaAFb63aB01c8ae76B563E2379a8E650458430d56";

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log(ethereum);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.SubmitToDao(
          formData.name,
          formData.website,
          formData.job,
          formData.desc,
          formData.email,
          formData.companyName,
          formData.address,
          formData.number,
          { gasLimit: 1000000 }
        );

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isError, isLoading } = useContractRead({
    addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
    contractInterface: abi,
    functionName: "candidacyData",
    args: [address],
    onSuccess(data) {
      console.log("Success", data);
      setformData({
        ...formData,
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        job: data.job,
        number: data.number,
        address: data.postaladdress,
        website: data.weblink,
        desc:data.description
      });
    },
  });

  return (
    <div className="profile-container">
      <div className="heading">
        <h1>My Profile</h1>
      </div>
      <div className="data">
        <form className="profile-form">
          <div className="p-row1">
            <label htmlFor="upload-button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {image.preview ? (
                <img
                  style={{
                    border: "2px solid black",
                    height: "250px",
                    width: "250px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                >
                  Upload your photo
                </h5>
              )}
            </label>
            <div>
              <input type="file" id="upload-button" style={{ display: "none" }} onChange={handleChange} />
              <input
                className="profile-input"
                placeholder="Name"
                value={formData.name}
                required
                type="text"
                label="Name"
                variant="outlined"
                onChange={(e) => setformData({ ...formData, name: e.target.value })}
              />
              <input
                className="profile-input"
                required
                type="text"
                value={formData.companyName}
                placeholder="Company Name"
                label="Company Name"
                variant="outlined"
                onChange={(e) => setformData({ ...formData, companyName: e.target.value })}
              />
              <div>
                <input
                  className="profile-input"
                  required
                  type="email"
                  placeholder="Email"
                  label="Email"
                  value={formData.email}
                  variant="outlined"
                  onChange={(e) => setformData({ ...formData, email: e.target.value })}
                />
                <input
                  className="profile-input"
                  required
                  type="text"
                  placeholder="job"
                  label="job"
                  value={formData.job}
                  variant="outlined"
                  onChange={(e) => setformData({ ...formData, job: e.target.value })}
                />
                <input
                  className="profile-input"
                  required
                  type="text"
                  label="Web Link"
                  placeholder="Web Link"
                  variant="outlined"
                  value={formData.website}
                  onChange={(e) => setformData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="p-row2"></div>
          <input
            className="profile-input"
            required
            type="text"
            label="address"
            placeholder="address"
            variant="outlined"
            value={formData.address}
            onChange={(e) => setformData({ ...formData, address: e.target.value })}
          />
          <input
            className="profile-input"
            required
            type="text"
            label="number"
            placeholder="number"
            variant="outlined"
            value={formData.number}
            onChange={(e) => setformData({ ...formData, number: e.target.value })}
          />
          <textarea
            className="profile-input"
            sx={{ width: "300px", height: "55px" }}
            required
            type="text"
            placeholder="Describe your motivation to become DAO member"
            variant="outlined"
            value={formData.desc}
            onChange={(e) => setformData({ ...formData, desc: e.target.value })}
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
              marginTop: "30px",
              "&:hover": { backgroundColor: "black" },
            }}
            className="button"
            type="submit"
            onClick={askContractToMintNft}
          >
            Submit to Dao
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Profile;

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
