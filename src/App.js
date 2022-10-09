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

import { WagmiConfig, createClient, chain, defaultChains, configureChains } from "wagmi";

import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";

function App() {
  const alchemyId = process.env.ALCHEMY_ID;
  const chains = [chain.mainnet, chain.goerli, chain.polygon, chain.optimism, chain.arbitrum];

  const client = createClient(
    getDefaultClient({
      appName: "Your App Name",
      alchemyId,
      chains,
    })
  );
  const { checkIfWalletIsConnect, account, checkNetwork } = useContext(PagesContext);

  return (
    <div className="App">
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <BrowserRouter>
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
      </WagmiConfig>
    </div>
  );
}

export default App;
