import { Button, FormControl, MenuItem, Select } from "@mui/material";
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

const ADDRESS = "0x92c67df198E17bae61B6A92576a8ec9d52516690";

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
  const [filter, setfilter] = useState("Artist");
  const [others, setothers] = useState(false);

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
            toast.success("image uploaded successfully");
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
        toast.success("Profile Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const readDaoMemberAddress = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        const connectedContract = new ethers.Contract(ADDRESS, abi, provider);
        let nftTxn = await connectedContract.getDaoMembersAddress();
        console.log(nftTxn);
        setdaoMembersAddress(nftTxn);
        await getDaoMembersData();
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
      const date = new Date();
      console.log(data);
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
        time: data.timeEnd.toNumber() == 0 ? true : date.getTime() / 1000 <= data.timeEnd.toNumber() ? true : false,
      });
    },
  });

  const helperGetDaoData = async (add) => {
    try {
      const { ethereum } = window;
      let canidacyData = [];
      const provider = new ethers.providers.Web3Provider(ethereum);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.candidacyAllData(add);
      console.log(Txn);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getDaoMembersData = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const connectedContract = new ethers.Contract(ADDRESS, abi, provider);

        let canidacyData = [];
        var i = 0;
        daoMembersAddress.map(async (dma) => {
          const data = await helperGetDaoData(dma);
          if (data.candidate != "0x0000000000000000000000000000000000000000" && data.candidate !== address) {
            canidacyData.push({
              address: data.candidate,
              name: data.name,
            });

            setdaoMembersData(canidacyData);
          }
          console.log(daoMembersData);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const gettingImage = async () => {
      let mage = await getImage(address);
      setImage({ ...image, preview: mage });
    };
    readDaoMemberAddress();
    getDaoMembersData();
    gettingImage();
  }, []);
  React.useEffect(() => {
    getDaoMembersData();
  }, [daoMembersAddress + 1]);

  const handleJobChange = (e) => {
    setfilter(e.target.value);
    setformData({ ...formData, job: e.target.value });
  };
  // console.log(formData);
  return (
    <div className="profile-container">
      <Toaster position="top-center" />
      <div className="heading">
        <h1>My Profile</h1>
      </div>
      <div className="data">
        <label htmlFor="upload-button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {image.preview.length > 0 ? (
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
                border: "none",

                fontWeight: "bold",
              }}
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
          <FormControl>
            <InputLabel id="demo-simple-select-label">Select Job</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              label="Select Job"
              onChange={handleJobChange}
              sx={{ border: "none", fontWeight: "bold", "& fieldset": { border: "none" } }}
            >
              <MenuItem value={"Artist"}>Artist</MenuItem>
              <MenuItem value={"Gallery director"}>Gallery director</MenuItem>
              <MenuItem value={"Curators"}>Curators</MenuItem>
              <MenuItem value={"Museum director"}>Museum director</MenuItem>
              <MenuItem value={"Art space director"}>Art space director</MenuItem>
              <MenuItem value={"Collector"}>Collector</MenuItem>
              <MenuItem value={"Art dealer"}>Art dealer</MenuItem>
              <MenuItem value={"Art critic"}>Art critic</MenuItem>
              <MenuItem value={"Foundation director"}>Foundation director</MenuItem>
              <MenuItem value={"others"}>others</MenuItem>
            </Select>
            {filter == "others" && (
              <input
                type="text"
                onChange={(e) => setformData({ ...formData, job: e.target.value })}
                placeholder="type job here"
              />
            )}
          </FormControl>
          {formData.time && (
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
          )}
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
