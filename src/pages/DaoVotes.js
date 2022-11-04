import * as React from "react";
import Card from "@mui/material/Card";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Avatar, Button, CircularProgress, Input, InputAdornment, TextField } from "@mui/material";
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
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import {
  paginatedIndexesConfig,
  useAccount,
  useContractInfiniteReads,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import abi from "../utils/abi.json";

import { ethers } from "ethers";
import { AccountCircle, CalendarViewDayOutlined, ConstructionOutlined, Search } from "@mui/icons-material";
import accepted from "../assets/accepted.png";
import refused from "../assets/refused.png";
import tick from "../assets/tick.png";
import inprogress from "../assets/inprogress.png";
import { getDownloadURL, ref } from "firebase/storage";
import storage from "../utils/firebaseConfig";
import { purple, blue } from "@mui/material/colors";
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
    phone: "123456789",
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
    phone: "123456789",
  },
  {
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    candidacy: "false",
    chip: "Closed",
    name: "Raghav Jindal",
    position: "Artist",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu sem integer vitae justo eget magna fermentum iaculis eu. Porttitor leo a diam sollicitudin. Risus sed vulputate odio ut enim blandit volutpat. Pellentesque id nibh vestibulum lectus mauris ultrices eros.",
    spon: "Marta Ivanov",
    sponLabel: "not approved",
    phone: "123456789",
  },
];

const ADDRESS = "0xf9C559b43f91DCDa9b8fc849Aa4b646C158d00Ea";

const DaoVotes = () => {
  const [dummy, setdummy] = React.useState(DUMMY);
  const [filter, setfilter] = React.useState("All");
  const [allAddress, setallAddress] = React.useState([]);
  const [allSponsorAddress, setallSponsorAddress] = React.useState([]);

  const [allCandidacyData, setallCandidacyData] = React.useState([]);
  const [filterAllData, setfilterAllData] = React.useState(allCandidacyData);
  const [loading, setloading] = React.useState(false);

  const { address } = useAccount();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setfilter(event.target.value);
    console.log(event.target.value == "All");
    handleFilterData(event.target.value);
  };

  const {
    data: candidacyAddress,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "getCandidacyAddress",
    onSuccess(data) {
      setallAddress(data);
    },
  });

  const contractConfig = {
    addressOrName: ADDRESS,
    contractInterface: abi,
  };
  const length = allAddress.length;

  const CONTRACT_ADDRESS = ADDRESS;

  const getSponsorName = async (address) => {
    try {
      const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
      const network = ethers.providers.getNetwork("maticmum");
      const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.candidacyAllData(address);
      console.log(Txn);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterData = (sample) => {
    if (sample == "All") {
      let samplearray = allCandidacyData;
      return setfilterAllData(samplearray);
    } else if (sample == "Active") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      setfilterAllData(newArray);
    } else if (sample == "Closed") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      setfilterAllData(newArray);
    } else if (sample == "daomem") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "true";
      });
      setfilterAllData(newArray);
    } else if (sample == "refmem") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "false";
      });
      setfilterAllData(newArray);
    }
    console.log("nice", sample, allCandidacyData, filterAllData);
  };

  const search = async (e) => {
    let sample = filter;
    let newArray = [];
    if (sample == "All") {
      newArray = allCandidacyData;
      // setfilterAllData(samplearray);
      console.log("here2sasfasf", filterAllData);
    } else if (sample == "Active") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
    } else if (sample == "Closed") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
    } else if (sample == "daomen") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "true";
      });
    } else if (sample == "refmen") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "false";
      });
    }

    const blahArray = newArray.filter((item) => {
      return item.name.toString().toLowerCase().includes(e.target.value.toLowerCase());
    });
    console.log("chekkk", sample, blahArray);
    setfilterAllData(blahArray);
  };

  const getDaoMembersAddress = async (address) => {
    try {
      const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
      const network = ethers.providers.getNetwork("maticmum");
      const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.getDaoMembersAddress();
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getSponsorsApproved = async (sponsorAddress, userAddress) => {
    try {
      const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
      const network = ethers.providers.getNetwork("maticmum");
      const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.SponsorsApproved(sponsorAddress, userAddress);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getBlackListed = async (userAddress) => {
    try {
      const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
      const network = ethers.providers.getNetwork("maticmum");
      const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.blacklisted(userAddress);
      console.log(Txn);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getImage = async (userAddress) => {
    try {
      const storageRef = ref(storage, "files/" + `${userAddress}.jpeg`);

      let image = await getDownloadURL(storageRef);
      if (image) {
        return image;
      }
      return "";
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  const askContractToMintNft = async () => {
    try {
      // const { ethereum } = window;
      setloading(true);

      // if (ethereum) {
      // const provider = new ethers.providers.Web3Provider(ethereum);
      // const api = "U7NGCG8H3WXNQVD1VGPFIF6Z7WI4CPSNQ8";
      const infuraApi = "a1533553e9ad40c4ba194fc973392104";
      const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
      const network = ethers.providers.getNetwork("maticmum");
      const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");

      // const provider = new ethers.providers.CloudflareProvider("maticmum");
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      let data = [];
      let canidacyData = [];
      var i = 0;
      for (i = 0; i < allAddress.length; i++) {
        let Txn = await connectedContract.getAllData(allAddress[i]);
        // console.log({ Txn });
        data.push({ Txn });
        // console.log(data[0].Txn[1].name);
      }

      for (let i = 0; i < data.length; i++) {
        const date = new Date();
        console.log("ashfjka");
        // let sponsor = [];
        // sponsor = await connectedContract.getSponsors(data[i].Txn.candidate);

        const sponsor1Name = await getSponsorName(data[i].Txn[1].sponsors[0]);
        const sponsor2Name = await getSponsorName(data[i].Txn[1].sponsors[1]);

        const dataimage = await getImage(data[i].Txn[1].candidate);
        console.log(data[i]);
        canidacyData.push({
          candidacy:
            date.getTime() / 1000 <= data[i].Txn[1].timeEnd.toNumber()
              ? ` ${Math.floor((data[i].Txn[1].timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`
              : data[i].Txn[0]
              ? "true"
              : "false",

          address: data[i].Txn[1].candidate,
          image: dataimage,
          name: data[i].Txn[1].name,
          companyName: data[i].Txn[1].companyName,
          email: data[i].Txn[1].email,
          postalAddress: data[i].Txn[1].postaladdress,
          website: data[i].Txn[1].weblink,
          desc: data[i].Txn[1].description,
          job: data[i].Txn[1].job,
          number: data[i].Txn[1].number,
          timeStart: data[i].Txn[1].timeStart.toNumber(),
          timeEnd: data[i].Txn[1].timeEnd.toNumber(),
          forVotes: data[i].Txn[1].forVotes.toNumber(),
          againstVotes: data[i].Txn[1].againstVotes.toNumber(),
          // chip: date.getTime() / 1000 <= data[i].Txn[1].timeEnd.toNumber() ? "Active" : "Closed",
          chip: date.getTime() / 1000 <= data[i].Txn[1].timeEnd.toNumber() ? "Active" : "Closed",
          sponsor1: data[i].Txn[1].sponsors[0],
          sponsor2: data[i].Txn[1].sponsors[1],
          sponsor1Name: sponsor1Name,
          sponsor2Name: sponsor2Name,
          sponsor1App: data[i].Txn[2]
            ? true
            : date.getTime() / 1000 <= data[i].Txn[1].timeEnd.toNumber()
            ? "inprogress"
            : false,
          sponsor2App: data[i].Txn[3]
            ? true
            : date.getTime() / 1000 <= data[i].Txn[1].timeEnd.toNumber()
            ? "inprogress"
            : false,
          blacklisted: data[i].Txn[4],
        });
      }

      setallCandidacyData(canidacyData);
      localStorage.setItem("items", JSON.stringify(filterAllData));
      setfilterAllData(canidacyData.reverse());

      console.log(allCandidacyData);
      setloading(false);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {};

  React.useEffect(() => {
    askContractToMintNft();
  }, [allAddress]);

  return (
    <div style={{ marginTop: "20px", marginLeft: "120px", marginRight: "120px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <FormControl sx={{ border: "none", "& fieldset": { border: "none" }, fontWeight: "bold", mb: "10px" }}>
          <Select
            sx={{
              border: "none",
              "& fieldset": { border: "none" },
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&.MuiOutlinedInput-input:hover": {
                backgroundColor: "white",
              },
              "&:hover": { backgroundColor: "grey" },
              "&:focus": { backgroundColor: "grey" },
              "&:selected": { backgroundColor: "grey" },
              "&:clicked": { backgroundColor: "grey" },
              width: "100%",
              "&$selected": {
                backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "green"
                   }
                },
            }}
            MenuProps={{
              sx: {
                "&& .Mui-selected": {
                  backgroundColor: "grey",
                },
                "&& .Mui-hover": {
                  backgroundColor: "grey",
                },
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&:selected": { backgroundColor: "grey" },
                "&$selected": {
                  backgroundColor: "red",
                    "&:hover": {
                      backgroundColor: "green"
                     }
                  },
              },
            }}
            value={filter}
            label="All Votes"
            onChange={handleChange}
          >
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&&:selected": { backgroundColor: "grey" },
                "&:selected": { backgroundColor: "grey" },
                borderBottom: "2px solid black",

                fontWeight: "bold",
                margin: "20px 20px 20px 20px",
                "&$selected": {
                  backgroundColor: "red",
                    "&:hover": {
                      backgroundColor: "green"
                     }
                  },
              }}
              value={"All"}
            >
              All votes
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&&:selected": { backgroundColor: "grey" },
                borderBottom: "2px solid black",

                fontWeight: "bold",
                margin: "20px 20px 20px 20px",
              }}
              value={"Active"}
            >
              Active Votes
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&&:selected": { backgroundColor: "grey" },
                borderBottom: "2px solid black",

                fontWeight: "bold",
                margin: "20px 20px 20px 20px",
              }}
              value={"Closed"}
            >
              Closed Votes
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&&:selected": { backgroundColor: "grey" },
                borderBottom: "2px solid black",

                fontWeight: "bold",
                margin: "20px 20px 20px 20px",
              }}
              value={"daomem"}
            >
              DAO Members
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "grey" },
                "&:focus": { backgroundColor: "grey" },
                "&&:selected": { backgroundColor: "grey" },
                borderBottom: "2px solid black",

                fontWeight: "bold",
                margin: "20px 20px 20px 20px",
              }}
              value={"refmem"}
            >
              Refused Members
            </MenuItem>
          </Select>
        </FormControl>

        <div className="i-wrapper">
          <Search className="i-icon" sx={{ color: "black", paddingLeft: "20px" }} />

          <input
            className="search"
            style={{ width: "400px", paddingLeft: "50px", border: "1px solid grey" }}
            type="text"
            onChange={search}
          />
        </div>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {filterAllData.map((data, index) => (
        <Link key={index} style={{ textDecoration: "none" }} to="/personalData" state={{ data }}>
          <Card
            elevation={1}
            className="card"
            sx={{
              padding: "20px 30px 10px 30px",
              // paddingBottom: "-10px",
              marginBottom: "20px",
              borderRadius: "20px",
              border: "1px solid black",
            }}
          >
            <Avatar sx={{ width: "170px", height: "170px", marginTop: "-10px" }} alt="Remy Sharp" src={data.image} />

            <div className="details">
              <div className="row1 row">
                <h4>
                  DAO member Candidacy
                  {data.candidacy == "true" ? (
                    <img style={{ marginLeft: "5px" }} className="icon" src={accepted} />
                  ) : data.candidacy == "false" ? (
                    <img style={{ marginLeft: "5px" }} className="icon" src={refused} />
                  ) : (
                    `( ${data.candidacy} )`
                  )}
                </h4>

                {data.chip == "Active" ? (
                  <Chip label="Active" color="success" sx={{ padding: "10px" }} />
                ) : (
                  <Chip label="Closed" color="primary" sx={{ padding: "10px", backgroundColor: "rgb(98, 71, 230)" }} />
                )}
              </div>
              <div className="row2 row">
                <h4>
                  {data.name} - {data.job}
                </h4>
              </div>
              <div className="row3 row">
                <p style={{ marginTop: "5px" }} id="short">
                  {data.desc}
                </p>
              </div>
              <div className="row4 row">
                {data.sponsor1Name.name || data.sponsor2Name.name ? (
                  <div style={{ width: "600px" }} className="row4">
                    <h4 style={{ marginRight: "10px", marginTop: "-10px", marginBottom: "-10px" }}>Sponsored By</h4>
                    {data.sponsor1Name.name && (
                      <Chip
                        variant="outlined"
                        sx={{ padding: "10px", marginRight: "5px", marginTop: "0px" }}
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
                        sx={{ padding: "10px", marginTop: "0px" }}
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
                  <h4 style={{ marginRight: "10px" }}>Not sponsored</h4>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DaoVotes;

// const askContractToMintNft = async () => {
//   try {
//     // const { ethereum } = window;
//     setloading(true);

//     // if (ethereum) {
//     // const provider = new ethers.providers.Web3Provider(ethereum);
//     // const api = "U7NGCG8H3WXNQVD1VGPFIF6Z7WI4CPSNQ8";
//     const infuraApi = "a1533553e9ad40c4ba194fc973392104";
//     const alchemyApi = "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M";
//     const network = ethers.providers.getNetwork("maticmum");
//     const provider = new ethers.providers.AlchemyProvider(network, "j7okfDkgOj5cvjTR2ZBadkj7Dr7HDu7M");
//     console.log(provider);
//     // const provider = new ethers.providers.CloudflareProvider("maticmum");
//     const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

//     let data = [];
//     let canidacyData = [];
//     var i = 0;
//     for (i = 0; i < allAddress.length; i++) {
//       let Txn = await connectedContract.candidacyAllData(allAddress[i]);
//       data.push({ Txn });
//     }

//     const date = new Date();

//     for (let i = 0; i < data.length; i++) {
//       let sponsor = [];
//       sponsor = await connectedContract.getSponsors(data[i].Txn.candidate);

//       const sponsor1Name = await getSponsorName(sponsor[0]);
//       const sponsor2Name = await getSponsorName(sponsor[1]);

//       const daoMemberAddress = await getDaoMembersAddress();

//       const sponsor1App = await getSponsorsApproved(sponsor[0], data[i].Txn.candidate);
//       const sponsor2App = await getSponsorsApproved(sponsor[1], data[i].Txn.candidate);
//       const blacklisted = await getBlackListed(data[i].Txn.candidate);
//       const dataimage = await getImage(data[i].Txn.candidate);

//       canidacyData.push({
//         // candidacy:
//         //   date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
//         //     ? ` ${Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`
//         //     : data[i].Txn.forVotes.toNumber() > data[i].Txn.forVotes.toNumber()
//         //     ? "true"
//         //     : "false",
//         candidacy: daoMemberAddress.includes(data[i].Txn.candidate)
//           ? "true"
//           : blacklisted
//           ? "false"
//           : Math.floor((date.getTime() / 1000 - data[i].Txn.timeEnd.toNumber()) / 3600) <= 0
//           ? `${Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`
//           : data[i].Txn.forVotes.toNumber() > data[i].Txn.againstVotes.toNumber()
//           ? "false"
//           : Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600) == 0
//           ? "48 Hours left"
//           : Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600) <= 0
//           ? "false"
//           : `${Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`,

//         address: data[i].Txn.candidate,
//         image: dataimage,
//         name: data[i].Txn.name,
//         companyName: data[i].Txn.companyName,
//         email: data[i].Txn.email,
//         postalAddress: data[i].Txn.postaladdress,
//         website: data[i].Txn.weblink,
//         desc: data[i].Txn.description,
//         job: data[i].Txn.job,
//         number: data[i].Txn.number,
//         timeStart: data[i].Txn.timeStart.toNumber(),
//         timeEnd: data[i].Txn.timeEnd.toNumber(),
//         forVotes: data[i].Txn.forVotes.toNumber(),
//         againstVotes: data[i].Txn.againstVotes.toNumber(),
//         // chip: date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber() ? "Active" : "Closed",
//         chip: date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber() ? "Active" : "Closed",
//         sponsor1: sponsor[0],
//         sponsor2: sponsor[1],
//         sponsor1Name: sponsor1Name,
//         sponsor2Name: sponsor2Name,
//         sponsor1App: sponsor1App
//           ? sponsor1App
//           : date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
//           ? "inprogress"
//           : false,
//         sponsor2App: sponsor2App
//           ? sponsor2App
//           : date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
//           ? "inprogress"
//           : false,
//         blacklisted: blacklisted,
//       });
//     }

//     setallCandidacyData(canidacyData);
//     localStorage.setItem("items", JSON.stringify(filterAllData));
//     setfilterAllData(canidacyData);

//     console.log(allCandidacyData);
//     setloading(false);
//     // }
//   } catch (error) {
//     console.log(error);
//   }
// };
