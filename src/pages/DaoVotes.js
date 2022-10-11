import * as React from "react";
import Card from "@mui/material/Card";

import { Avatar } from "@mui/material";
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
  useContractInfiniteReads,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import abi from "../utils/abi.json";

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

const DaoVotes = () => {
  const [dummy, setdummy] = React.useState(DUMMY);
  const [filter, setfilter] = React.useState("Active");
  const [allAddress, setallAddress] = React.useState([]);

  const [allCandidacyData, setallCandidacyData] = React.useState([{}]);

  const handleChange = (event) => {
    setfilter(event.target.value);
  };

  const {
    data: candidacyAddress,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
    contractInterface: abi,
    functionName: "getCandidacyAddress",
    onSuccess(data) {
      setallAddress(data);
    },
  });
  console.log(allAddress);
  // setallAddress(candidacyAddress[0]);

  // if (candidacyAddress) {
  //   setallAddress(candidacyAddress[0]);
  // }

  // const GetData = () => {};

  // const { data: candidacyData } = useContractRead({
  //   addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
  //   contractInterface: abi,
  //   functionName: "candidacyData",
  //   args: [allAddress],
  // });

  // console.log(candidacyData);

  // const { config } = usePrepareContractWrite({
  //   addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
  //   contractInterface: abi,
  //   functionName: "candidacyData",
  //   args: ["0xe5cb3b7a6d374f8053c2ccf9d473850f2a4bc51e"],
  // });
  // const { write } = useContractWrite({
  //   ...config,
  //   onSuccess(data) {
  //     console.log("Success", data);
  //   },
  // });

  const contractConfig = {
    addressOrName: "0xaAFb63aB01c8ae76B563E2379a8E650458430d56",
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
        {/* {allAddress.length > 0 ? <GetData /> : <div></div>} */}
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
      </Box>
      {dummy.map((data) => (
        <Link style={{ textDecoration: "none" }} to="/personalData" state={{ data }}>
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
        </Link>
      ))}
    </div>
  );
};

export default DaoVotes;
