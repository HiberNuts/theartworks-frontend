import * as React from "react";
import Card from "@mui/material/Card";

import { Avatar, Button, CircularProgress } from "@mui/material";
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
import { Navigate, Link } from "react-router-dom";
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
import { CalendarViewDayOutlined } from "@mui/icons-material";
import accepted from "../assets/accepted.png";
import refused from "../assets/refused.png";
import tick from "../assets/tick.png";
import inprogress from "../assets/inprogress.png";
import { getDownloadURL, ref } from "firebase/storage";
import storage from "../utils/firebaseConfig";
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

const ADDRESS = "0xB38f8183Ad0110b40F054046B322E04da200E0B2";

const DaoVotes = () => {
  const [dummy, setdummy] = React.useState(DUMMY);
  const [filter, setfilter] = React.useState("All");
  const [allAddress, setallAddress] = React.useState([]);
  const [allSponsorAddress, setallSponsorAddress] = React.useState([]);

  const [allCandidacyData, setallCandidacyData] = React.useState([]);
  const [filterAllData, setfilterAllData] = React.useState(allCandidacyData);
  const [loading, setloading] = React.useState(false);

  const { address } = useAccount();

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

  // const GetData = () => {
  //   const { data, fetchNextPage } = useContractInfiniteReads({
  //     cacheKey: "mlootAttributes",
  //     ...paginatedIndexesConfig(
  //       (index) => ({
  //         ...contractConfig,
  //         functionName: "candidacyData",
  //         args: [allAddress[index]],
  //       }),
  //       { start: 0, perPage: allAddress.length > 0 ? allAddress.length : 0, direction: "increment" }
  //     ),
  //   });
  //   React.useEffect(() => {
  //     if (data) {
  //       data.pages[0].forEach((d) => {
  //         setallCandidacyData([
  //           ...allCandidacyData,
  //           {
  //             name: d[0],
  //             companyName: d[1],
  //             job: d[2],
  //             address: d[3],
  //             Number: d[4],
  //             email: d[5],
  //             website: d[6],
  //             desc: d[7],
  //           },
  //         ]);
  //       });
  //       console.log(allCandidacyData);
  //     }
  //   }, []);
  // };
  const CONTRACT_ADDRESS = ADDRESS;

  const getSponsorName = async (address) => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.candidacyAllData(address);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterData = (sample) => {
    if (sample == "All") {
      console.log("filetr");
      console.log("here", allCandidacyData);
      let samplearray = allCandidacyData;
      return setfilterAllData(samplearray);
      console.log("here2sasfasf", filterAllData);
    } else if (sample == "Active") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "Closed") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "daomem") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "true";
      });
      setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "refmem") {
      let newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "false";
      });
      setfilterAllData(newArray);
      console.log(newArray);
    }
    console.log("nice", sample, allCandidacyData, filterAllData);
  };

  const search = async (e) => {
    let sample = filter;
    let newArray = [];
    if (sample == "All") {
      console.log("filetr");
      console.log("here", allCandidacyData);
      newArray = allCandidacyData;
      // setfilterAllData(samplearray);
      console.log("here2sasfasf", filterAllData);
    } else if (sample == "Active") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      // setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "Closed") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.chip == sample;
      });
      // setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "daomen") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "true";
      });
      // setfilterAllData(newArray);
      console.log(newArray);
    } else if (sample == "refmen") {
      newArray = allCandidacyData.filter((item, index) => {
        return item.candidacy == "false";
      });
      // setfilterAllData(newArray);
      console.log(newArray);
    }

    const blahArray = newArray.filter((item) => {
      return item.name.toString().toLowerCase().includes(e.target.value.toLowerCase());
    });
    console.log("chekkk", sample, blahArray);
    setfilterAllData(blahArray);
  };

  const getDaoMembersAddress = async (address) => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.getDaoMembersAddress();
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getSponsorsApproved = async (sponsorAddress, userAddress) => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.SponsorsApproved(sponsorAddress, userAddress);
      return Txn;
    } catch (err) {
      console.log(err);
    }
  };

  const getBlackListed = async (userAddress) => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
      let Txn = await connectedContract.blacklisted(userAddress);
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
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      setloading(true);

      if (ethereum) {
        console.log(ethereum);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        let data = [];
        let canidacyData = [];
        var i = 0;
        for (i = 0; i < allAddress.length; i++) {
          console.log("asasf");
          let Txn = await connectedContract.candidacyAllData(allAddress[i]);
          data.push({ Txn });
        }

        const date = new Date();

        for (let i = 0; i < data.length; i++) {
          let sponsor = [];
          sponsor = await connectedContract.getSponsors(data[i].Txn.candidate);

          const sponsor1Name = await getSponsorName(sponsor[0]);
          const sponsor2Name = await getSponsorName(sponsor[1]);

          const daoMemberAddress = await getDaoMembersAddress();

          const sponsor1App = await getSponsorsApproved(sponsor[0], data[i].Txn.candidate);
          const sponsor2App = await getSponsorsApproved(sponsor[1], data[i].Txn.candidate);
          const blacklisted = await getBlackListed(data[i].Txn.candidate);
          const dataimage = await getImage(data[i].Txn.candidate);
          console.log("data Image", dataimage);

          canidacyData.push({
            // candidacy:
            //   date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
            //     ? ` ${Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`
            //     : data[i].Txn.forVotes.toNumber() > data[i].Txn.forVotes.toNumber()
            //     ? "true"
            //     : "false",
            candidacy: daoMemberAddress.includes(data[i].Txn.candidate)
              ? "true"
              : blacklisted
              ? "false"
              : ` ${Math.floor((data[i].Txn.timeEnd.toNumber() - date.getTime() / 1000) / 3600)} Hours Left`,

            address: data[i].Txn.candidate,
            image: dataimage,
            name: data[i].Txn.name,
            companyName: data[i].Txn.companyName,
            email: data[i].Txn.email,
            postalAddress: data[i].Txn.postaladdress,
            website: data[i].Txn.weblink,
            desc: data[i].Txn.description,
            job: data[i].Txn.job,
            number: data[i].Txn.number,
            timeStart: data[i].Txn.timeStart.toNumber(),
            timeEnd: data[i].Txn.timeEnd.toNumber(),
            forVotes: data[i].Txn.forVotes.toNumber(),
            againstVotes: data[i].Txn.againstVotes.toNumber(),
            // chip: date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber() ? "Active" : "Closed",
            chip: daoMemberAddress.includes(data[i].Txn.candidate) || blacklisted ? "Closed" : "Active",
            sponsor1: sponsor[0],
            sponsor2: sponsor[1],
            sponsor1Name: sponsor1Name,
            sponsor2Name: sponsor2Name,
            sponsor1App: sponsor1App
              ? sponsor1App
              : date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
              ? "inprogress"
              : false,
            sponsor2App: sponsor2App
              ? sponsor2App
              : date.getTime() / 1000 <= data[i].Txn.timeEnd.toNumber()
              ? "inprogress"
              : false,
            blacklisted: blacklisted,
          });
        }

        setallCandidacyData(canidacyData);
        setfilterAllData(canidacyData);

        console.log(allCandidacyData);
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    askContractToMintNft();
    setfilterAllData(allCandidacyData);
  }, [allAddress]);

  return (
    <div>
      <Box sx={{ width: "60%", margin: "20px", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="All Votes"
            onChange={handleChange}
          >
            <MenuItem value={"All"}>All votes</MenuItem>
            <MenuItem value={"Active"}>Active Votes</MenuItem>
            <MenuItem value={"Closed"}>Closed Votes</MenuItem>
            <MenuItem value={"daomem"}>DAO Members</MenuItem>
            <MenuItem value={"refmem"}>Refused Members</MenuItem>
          </Select>
        </FormControl>
        <input style={{ width: "400px" }} placeholder="Search Members" type="text" onChange={search} />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {filterAllData.map((data, index) => (
        <Link key={index} style={{ textDecoration: "none" }} to="/personalData" state={{ data }}>
          <Card className="card" sx={{ padding: "30px", margin: "30px", borderRadius: "20px" }}>
            <Avatar sx={{ width: "150px", height: "150px" }} alt="Remy Sharp" src={data.image} />
            <div className="details">
              <div className="row1 row">
                <h4>
                  DAO member Candidacy --{" "}
                  {data.candidacy == "true" ? (
                    <img className="icon" src={accepted} />
                  ) : data.candidacy == "false" ? (
                    <img className="icon" src={refused} />
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
                  {data.name} - {data.job}
                </h4>
              </div>
              <div className="row3 row">
                <p>{data.desc}</p>
              </div>
              <div className="row4 row">
                <h4 style={{ marginRight: "10px" }}>Sponsored By</h4>
                {data.sponsor1Name.name || data.sponsor2Name.name ? (
                  <div style={{}} className="row4">
                    {data.sponsor1Name.name && (
                      <Chip
                        label={data.sponsor1Name.name}
                        variant="outlined"
                        sx={{ padding: "10px", margin: "10px" }}
                        icon={
                          data.sponsor1App == true ? (
                            <img className="icon" src={tick} />
                          ) : data.sponsor1App == "inprogress" ? (
                            <img className="icon" src={inprogress} />
                          ) : (
                            <CancelIcon style={{ color: "red" }} />
                          )
                        }
                      />
                    )}
                    {data.sponsor2Name.name && (
                      <Chip
                        label={data.sponsor2Name.name}
                        variant="outlined"
                        sx={{ padding: "10px", margin: "10px" }}
                        icon={
                          data.sponsor2App == true ? (
                            <img className="icon" src={tick} />
                          ) : data.sponsor2App == "inprogress" ? (
                            <img className="icon" src={inprogress} />
                          ) : (
                            <CancelIcon style={{ color: "red" }} />
                          )
                        }
                      />
                    )}
                  </div>
                ) : (
                  "No one"
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
