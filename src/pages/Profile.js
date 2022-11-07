import { Avatar, Button, Card, FormControl, MenuItem, Modal, Select as Sele, Typography } from "@mui/material";
import React, { useState } from "react";
import Select, { components, PlaceholderProps } from "react-select";

import "./Profile.css";
import storage from "../utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import makeAnimated from "react-select/animated";
import Chip from "@mui/material/Chip";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
  useAccount,
  useDisconnect,
} from "wagmi";
import abi from "../utils/abi.json";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import accepted from "../assets/accepted.png";
import refused from "../assets/refused.png";
import tick from "../assets/tick.png";
import inprogress from "../assets/inprogress.png";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

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

const ADDRESS = "0xf9C559b43f91DCDa9b8fc849Aa4b646C158d00Ea";

const Profile = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
  };
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const getImage = async (userAddress) => {
    const storageRef = ref(storage, "files/" + `${userAddress}.jpeg`);

    let image = await getDownloadURL(storageRef);
    return image;
  };

  const [add1, setadd1] = useState("");
  const [add2, setadd2] = useState("");
  const [add3, setadd3] = useState("");
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
    add1: "",
    add2: "",
    add3: "",
  });

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const [daoMembersAddress, setdaoMembersAddress] = React.useState([]);
  const [daoMembersData, setdaoMembersData] = React.useState([]);
  const [sponsorAddress, setsponsorAddress] = useState([{}]);
  const [filter, setfilter] = useState("your");
  const [others, setothers] = useState(false);
  const [useless, setuseless] = useState(false);
  const { disconnect } = useDisconnect();

  console.log(personName);

  const navigate = useNavigate();

  const file = new File(["foo"], "foo.txt", { type: "text/plain" });

  const handleRoleChange = (event) => {
    const { value } = event.target;
    if (value.length > 2) {
      value.pop();
    }

    setPersonName(value);
  };
  console.log("person name", personName);

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
        const postalAddress = ` ${formData.add1} *${formData.add2} *${formData.add3} `;
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

  console.log(formData);

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

  const animatedComponents = makeAnimated();
  const { isError, isLoading } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "candidacyAllData",
    args: [address],
    cacheOnBlock: true,
    // watch: true,
    cacheTime: 100_000,

    onSuccess(data) {
      const date = new Date();
      console.log(data);
      const add = data?.postaladdress?.split("/");

      setformData({
        ...formData,
        name: data.name,
        website: data.weblink,
        job: data.job,
        desc: data.description,
        email: data.email,
        companyName: data.companyName,
        postalAddress: data.postaladdress,
        add1: add[0],
        add2: add[1],
        add3: add[2],
        number: data.number,
        time: data.timeEnd.toNumber() == 0 ? true : date.getTime() / 1000 <= data.timeEnd.toNumber() ? false : true,
      });
    },
  });

  const helperGetDaoData = async (add) => {
    try {
      const { ethereum } = window;
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
        for (i = 0; i < daoMembersAddress.length; i++) {
          const data = await helperGetDaoData(daoMembersAddress[i]);
          if (data.candidate != "0x0000000000000000000000000000000000000000" && data.candidate !== address) {
            canidacyData.push({
              value: data.candidate,
              label: data.name,
            });

            // setdaoMembersData(canidacyData);
          }
        }
        setdaoMembersData(canidacyData);
        console.log(daoMembersData);
        // daoMembersAddress.forEach(async (dma) => {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { config } = usePrepareContractWrite({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "blacklisted",
    args: [address],
  });

  const { data, write } = useContractRead(config);
  const logout = () => {
    disconnect();
  };

  console.log(data);

  React.useEffect(() => {
    if (data) {
      setuseless(true);
      logout();
      navigate("/dao");
    } else {
      setuseless(false);
    }
  }, [address]);

  React.useEffect(() => {
    const gettingImage = async () => {
      let mage = await getImage(address);
      setImage({ ...image, preview: mage });
    };
    readDaoMemberAddress();
    getDaoMembersData();
    gettingImage();
  }, [address]);
  React.useEffect(() => {
    getDaoMembersData();
  }, [daoMembersAddress + 1]);

  React.useEffect(() => {
    if (!isConnected) {
      navigate("/dao");
    }
  }, [address]);

  const handleJobChange = (e) => {
    setfilter(e.target.value);
    setformData({ ...formData, job: e.target.value });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "80%",
    transform: "translate(-50%, -50%)",
    // marginLeft: "120px",
    // marginRight: "120px",
    display: "flex",
    bgcolor: "white",
    border: "3px solid grey",
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
  };

  const [value, setvalue] = useState();
  const handle1Change = (newVal) => {
    console.log("new val", newVal);
    if (newVal.length > 2) {
      newVal.pop();
    }
    setvalue(newVal);
    setPersonName([newVal[0]?.value ? newVal[0]?.value : "", newVal[1]?.value ? newVal[1]?.value : ""]);
  };
  console.log("dao member ", daoMembersData);

  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: "1px dotted pink",
      color: state.selectProps.menuColor,
      padding: 20,
      fontWeight: "bold",

      // border: "2px solid black",
    }),

    control: (_, { selectProps: { width } }) => ({
      display: "flex",
      width: "300px",
      height: "50px",
      border: "2px solid black",
      margin: "0px",
      padding: "-80px",
      fontWeight: "bold",
    }),
    option: (base) => ({
      ...base,
      // backgroundColor: "blue",
      height: "100%",
    }),
    select: () => ({
      height: "50px",
    }),
    indicatorsContainer: () => ({
      display: "none",
    }),
    input: () => ({
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),

    placeholder: () => ({ height: "50px", display: "flex", justifyContent: "flex-start", alignItems: "center" }),

    singleValue: () => ({
      // const opacity = state.isDisabled ? 0.5 : 1;
      // const transition = "opacity 300ms";

      // return { ...provided, opacity, transition };
      height: "20px",
    }),
    multiValue: () => ({
      height: "50px",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "20px",
      fontWeight: "bold",
    }),
    dropdownIndicator: () => ({
      display: "none",
    }),
    clearIndicator: () => ({
      display: "none",
    }),
    control: () => ({
      borderRadius: "50px",
      border: "2px solid black",
    }),
    valueContainer: () => ({
      display: "flex",
    }),
  };

  const Placeholder = (props) => {
    return <components.Placeholder {...props} />;
  };
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div className="profile-container">
        <div className="heading">
          <h1>My Profile</h1>
        </div>

        <div className="data">
          <input
            style={{ marginLeft: "-3px" }}
            className="profile-input"
            placeholder="Name"
            value={formData.name}
            type="text"
            label="Name"
            variant="outlined"
            onChange={(e) => setformData({ ...formData, name: e.target.value })}
          />

          <form className="profile-form">
            <div className="p-row1">
              <input type="file" id="upload-button" style={{ display: "none" }} onChange={handleChange} />

              <label
                htmlFor="upload-button"
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {image.preview.length > 0 ? (
                  <img
                    style={{
                      border: "2px solid black",
                      height: "250px",
                      width: "250px",

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

              <div className="column">
                <input
                  className="profile-input"
                  type="text"
                  value={formData.companyName}
                  placeholder="Company Name"
                  label="Company Name"
                  variant="outlined"
                  onChange={(e) => setformData({ ...formData, companyName: e.target.value })}
                />
                <input
                  className="profile-input"
                  type="text"
                  label="number"
                  placeholder="Phone"
                  variant="outlined"
                  value={formData.number}
                  onChange={(e) => setformData({ ...formData, number: e.target.value })}
                />
                <input
                  className="profile-input"
                  type="email"
                  placeholder="Email"
                  label="Email"
                  value={formData.email}
                  variant="outlined"
                  onChange={(e) => setformData({ ...formData, email: e.target.value })}
                />
                <FormControl sx={{ display: "flex", flexDirection: "row" }}>
                  <Sele
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter}
                    label="Your job"
                    onChange={handleJobChange}
                    sx={{
                      border: "none",
                      fontSize: "20px",
                      marginLeft: "10px",
                      fontWeight: "bold",
                      "& fieldset": { border: "none" },
                    }}
                  >
                    <MenuItem sx={{ fontWeight: "bold" }} value={"your"}>
                      Your job
                    </MenuItem>
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
                  </Sele>
                </FormControl>
              </div>
              <div className="column">
                <input
                  className="profile-input"
                  type="text"
                  label="Web Link"
                  placeholder="Web Link"
                  variant="outlined"
                  value={formData.website}
                  onChange={(e) => setformData({ ...formData, website: e.target.value })}
                />
                <textarea
                  style={{ width: "auto", maxHeight: "5rem", minHeight: "2rem" }}
                  className="profile-input"
                  rows="3"
                  cols="20"
                  wrap="hard"
                  type="text"
                  label="address"
                  placeholder="Postal Address "
                  variant="outlined"
                  value={formData.postalAddress}
                  onChange={(e) => setformData({ ...formData, postalAddress: e.target.value })}
                />
                {filter == "others" && (
                  <input
                    type="text"
                    onChange={(e) => setformData({ ...formData, job: e.target.value })}
                    placeholder="type job here"
                  />
                )}
                {/* <input
                  style={{}}
                  className="profile-input"
                  type="text"
                  label="address 2"
                  placeholder="Postal Address 2"
                  variant="outlined"
                  value={formData.add2}
                  onChange={(e) => setformData({ ...formData, add2: e.target.value })}
                />
                <input
                  style={{}}
                  className="profile-input"
                  type="text"
                  label="address 3"
                  placeholder="Postal Address 3"
                  variant="outlined"
                  value={formData.add3}
                  onChange={(e) => setformData({ ...formData, add3: e.target.value })}
                /> */}
              </div>

              <div className="column">
                <textarea
                  id="textarea"
                  className="profile-input"
                  type="text"
                  maxLength="12000"
                  placeholder="Describe your motivation to become a DAO member. (12 000 characters max)"
                  variant="outlined"
                  value={formData.desc}
                  onChange={(e) => setformData({ ...formData, desc: e.target.value })}
                />
              </div>
            </div>

            <div className="p-row2">
              <div>
                {/* <InputLabel style={{ marginRight: "10px", fontWeight: "bold" }} id="demo-multiple-chip-label">
                  Add a sponsor name
                </InputLabel> */}
                <Select
                  components={{ Placeholder }}
                  placeholder={"Add a sponsor name"}
                  label={"Add a spnsor name"}
                  styles={customStyles}
                  value={value}
                  onChange={handle1Change}
                  isMulti
                  name="colors"
                  options={daoMembersData}
                />

                {/* <Sele
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
                </Sele> */}
              </div>

              <div>
                <button className="daoview" onClick={handleOpen}>
                  DAO votes view
                </button>
              </div>

              <Modal
                // hideBackdrop={true}
                sx={{ width: "100%" }}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    width: "100%",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card sx={style} elevation={0} className="card">
                    <Avatar sx={{ width: "170px", height: "170px" }} alt="Remy Sharp" src={image.preview} />

                    <div style={{ marginTop: "10px" }} className="details">
                      <div className="row1 ">
                        <h4>DAO member Candidacy (48 hours left)</h4>

                        <Chip label="Active" color="success" sx={{ padding: "10px" }} />
                      </div>
                      <div className="row2 ">
                        <h4>
                          {formData.name} - {formData.job}
                        </h4>
                      </div>
                      <div className="row3 row">
                        <div id="short">{formData.desc}</div>
                      </div>
                      <div className="row4 row">
                        {personName[0]?.length > 0 || personName[1]?.length > 0 ? (
                          <div className="row4">
                            <h4 style={{ marginRight: "10px" }}>Sponsored By</h4>
                            {/* {personName.map((value) => (
                              <Chip
                                label={daoMembersData?.find((e) => e.value == value)?.label}
                                variant="outlined"
                                sx={{ padding: "10px", margin: "10px" }}
                                onDelete={() => {}}
                                deleteIcon={
                                  <img style={{ height: "20px", width: "20px" }} className="icon" src={inprogress} />
                                }
                              />
                            ))} */}
                            {personName[0] != "" > 1 && (
                              <Chip
                                label={daoMembersData?.find((e) => e.value == personName[0])?.label}
                                variant="outlined"
                                sx={{ padding: "10px", margin: "10px" }}
                                onDelete={() => {}}
                                deleteIcon={
                                  <img style={{ height: "20px", width: "20px" }} className="icon" src={inprogress} />
                                }
                              />
                            )}
                            {personName[1] != "" > 1 && (
                              <Chip
                                label={daoMembersData?.find((e) => e.value == personName[1])?.label}
                                variant="outlined"
                                sx={{ padding: "10px", margin: "10px" }}
                                onDelete={() => {}}
                                deleteIcon={
                                  <img style={{ height: "20px", width: "20px" }} className="icon" src={inprogress} />
                                }
                              />
                            )}
                          </div>
                        ) : (
                          <h4 style={{ marginRight: "10px" }}>Not sponsored</h4>
                        )}
                      </div>
                    </div>
                  </Card>
                </Box>
              </Modal>
            </div>
          </form>
        </div>
        {formData.time && (
          <Button
            sx={{
              backgroundColor: "black",
              color: "white",
              width: "180px",
              marginTop: "30px",
              fontSize: "18px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "black" },
              left: "0",
              height: "70px",
              borderRadius: "50px",
              textTransform: "none",
            }}
            className="button"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              askContractToMintNft();
            }}
          >
            Submit to DAO
          </Button>
        )}
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
