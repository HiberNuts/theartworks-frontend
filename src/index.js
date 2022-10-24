import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PagesProvider } from "./context/Context";
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
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
const alchemyId = process.env.ALCHEMY_ID;
const chains = [chain.polygonMumbai];

const root = ReactDOM.createRoot(document.getElementById("root"));

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  // provider,
  // webSocketProvider,
});
root.render(
  <PagesProvider>
    <React.StrictMode>
      <WagmiConfig client={client}>
        <App />
      </WagmiConfig>
    </React.StrictMode>
  </PagesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
