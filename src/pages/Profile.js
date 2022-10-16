import { Button, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

import "./Profile.css";
import storage from "../utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Chip from "@mui/material/Chip";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useAccount } from "wagmi";
import abi from "../utils/abi.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { Sanityclient } from "../client";

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

const ADDRESS = "0xB38f8183Ad0110b40F054046B322E04da200E0B2";

const Profile = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const getImage = async (userAddress) => {
    const storageRef = ref(storage, "files/" + `${userAddress}.jpeg`);

    let image = await getDownloadURL(storageRef);
    return image;
  };

  const [image, setImage] = useState({ preview: getImage(address), raw: "" });

  const [formData, setformData] = useState({
    name: "",
    companyName: "",
    email: "",
    website: "",
    desc: "",
    job: "",
    postalAddress: "",
    number: "",
  });

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [daoMembersAddress, setdaoMembersAddress] = React.useState([]);
  const [daoMembersData, setdaoMembersData] = React.useState([]);
  const [sponsorAddress, setsponsorAddress] = useState([{}]);

  const file = new File(["foo"], "foo.txt", { type: "text/plain" });

  const handleRoleChange = (event) => {
    const { value } = event.target;
    if (value.length > 2) {
      value.pop();
    }

    setPersonName(value);
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });

      const storageRef = ref(storage, `files/${address}.jpeg`);
      const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          // update progress
          // setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
          });
        }
      );
    }
  };

  const CONTRACT_ADDRESS = ADDRESS;

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(ADDRESS, abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.SubmitToDao(
          formData.name,
          formData.website,
          formData.job,
          formData.desc,
          formData.email,
          formData.companyName,
          formData.postalAddress,
          formData.number,
          personName[0] ? personName[0] : "0x0000000000000000000000000000000000000000",
          personName[1] ? personName[1] : "0x0000000000000000000000000000000000000000",

          { gasLimit: 1000000 }
        );

        console.log("Mining...please wait.");
        await nftTxn.wait();
        toast.success("Profile Updted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isError, isLoading } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "candidacyAllData",
    args: [address],
    onSuccess(data) {
      setformData({
        ...formData,
        name: data.name,
        website: data.weblink,
        job: data.job,
        desc: data.description,
        email: data.email,
        companyName: data.companyName,
        postalAddress: data.postaladdress,
        number: data.number,
      });
    },
  });

  const { data: daoMembers } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "getDaoMembersAddress",
    onSuccess(data) {
      setdaoMembersAddress(data);
      getDaoMembersData();
    },
  });

  const getDaoMembersData = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const connectedContract = new ethers.Contract(ADDRESS, abi, provider);

        let data = [];
        let canidacyData = [];
        var i = 0;
        for (i = 0; i < daoMembersAddress.length; i++) {
          let Txn = await connectedContract.candidacyAllData(daoMembersAddress[i]);
          data.push({ Txn });
        }

        data.forEach((d) => {
          if (d.Txn.candidate == "0x0000000000000000000000000000000000000000") {
            return;
          } else if (d.Txn.candidate == address) {
            return;
          } else {
            canidacyData.push({
              address: d.Txn.candidate,
              name: d.Txn.name,
            });
          }
        });
        setdaoMembersData(canidacyData);
        // console.log(daoMembersData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // getDaoMembersData();
    const gettingImage = async () => {
      let mage = await getImage(address);
      setImage({ ...image, preview: mage });
    };
    gettingImage();
  }, []);

  return (
    <div className="profile-container">
      <Toaster position="top-center" />
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
        <form className="profile-form">
          <div className="p-row1">
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
            </div>
          </div>
          <div className="p-row2">
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
            <input
              className="profile-input"
              required
              type="text"
              label="address"
              placeholder="address"
              variant="outlined"
              value={formData.postalAddress}
              onChange={(e) => setformData({ ...formData, postalAddress: e.target.value })}
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
          </div>

          <div className="p-row2">
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
            <InputLabel style={{ marginRight: "10px", fontWeight: "bold" }} id="demo-multiple-chip-label">
              Select Your Sponsors
            </InputLabel>

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
              onChange={handleRoleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box limit={2} sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={daoMembersData?.find((e) => e.address === value).name} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {daoMembersData.map((data) => {
                return (
                  <MenuItem key={data.address} value={data.address}>
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>

          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              marginTop: "30px",
              "&:hover": { backgroundColor: "black" },
            }}
            className="button"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              askContractToMintNft();
            }}
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
