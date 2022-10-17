import React from "react";
import "./App.css";
import { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

  const { data } = useContractRead({
    address: ADDRESS,
    abi: abi,
    functionName: "blacklisted",
    args: [address],
  });

  const logout = () => {
    disconnect();
  };
  React.useEffect(() => {
    if (data) {
      toast.error("Your address is blacklisted you cannot login");
      logout();
    }

    
  }, [address]);

  return (
    <div className="App">
      <ConnectKitProvider theme="minimal">
        <BrowserRouter>
          <Toaster position="top-center" />
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/dao" element={<DaoVotes />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/personalData" element={<PersonalData />}></Route>
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </div>
  );
}

export default App;
