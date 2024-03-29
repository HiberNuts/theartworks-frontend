import React from "react";
import "./App.css";
import { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { PagesContext } from "./context/Context";
import DaoVotes from "./pages/DaoVotes";
import PersonalData from "./components/PersonalData";
import Profile from "./pages/Profile";
import toast, { Toaster } from "react-hot-toast";
import abi from "./utils/abi.json";
import {
  WagmiConfig,
  createClient,
  chain,
  usePrepareContractWrite,
  useContractRead,
  useDisconnect,
  useConnect,
  useAccount,
} from "wagmi";

import { ConnectKitProvider, getDefaultClient } from "connectkit";
import storage from "./utils/firebaseConfig";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
function App() {
  const ADDRESS = "0xB38f8183Ad0110b40F054046B322E04da200E0B2";

  const alchemyId = process.env.ALCHEMY_ID;
  const chains = [chain.polygonMumbai];

  const { address } = useAccount();

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const [image, setimage] = React.useState("");

  let currentAddress = "";

  const client = createClient(
    getDefaultClient({
      appName: "Your App Name",
      alchemyId,
      chains,
    })
  );
  const { checkIfWalletIsConnect, account, checkNetwork } = useContext(PagesContext);

  // const { config, isError } = usePrepareContract({
  //   addressOrName: ADDRESS,
  //   contractInterface: abi,
  //   functionName: "blacklisted",
  //   args: [address],
  // });

  const { config, isError } = usePrepareContractWrite({
    addressOrName: ADDRESS,
    contractInterface: abi,
    functionName: "blacklisted",
    args: [address],
  });

  // const { data, write } = useContractRead(config);
  // console.log(data);

  // console.log("address", address);
  // const logout = () => {
  //   disconnect();
  // };

  // React.useEffect(() => {
  //   if (data) {
  //     logout();
  //   }
  // }, [address]);

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div className="App">
      <ConnectKitProvider theme="minimal">
        <BrowserRouter>
          <Toaster position="top-center" />
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/dao" element={<DaoVotes />}></Route>
            <Route path="/login" render={(props) => <Login {...props} toggleDrawer={toggleDrawer} />} />
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/personalData" element={<PersonalData toggleDrawer={toggleDrawer} state={state} />}></Route>
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </div>
  );
}

export default App;
