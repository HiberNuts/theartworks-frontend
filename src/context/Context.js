import React, { useEffect, useState, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export const PagesContext = React.createContext();
const { ethereum } = window;
export const PagesProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [Dao, setDao] = useState(false);

  //---------CONECTING WALLT
  // const checkIfWalletConnected = async () => {
  //   if (!window.ethereum) return console.log("Install MetaMask");

  //   const accounts = await window.ethereum.request({ method: "eth_accounts" });
  //   setAccount(accounts[0]);

  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();
  //   console.log(signer);
  //   // const contract = fetchFunTokenContract(signer);

  //   // const allTokenHolder = await contract.balanceOf(accounts[0]);
  //   // console.log("owner banalce", allTokenHolder.toNumber());
  //   // setAccountBallanc(allTokenHolder.toNumber());

  //   // const totalHolder = await contract._userId();
  //   // setUserId(totalHolder.toNumber());
  // };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const checkNetwork = async () => {
    const chainId = 80001;
    if (window.ethereum.networkVersion !== chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexlify(chainId) }],
        });
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Polygon Mainnet",
                chainId: ethers.utils.hexlify(chainId),
                nativeCurrency: { name: "MATIC", decimals: 18, symbol: "MATIC" },
                // rpcUrls: ["https://polygon-rpc.com/"],
                rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
              },
            ],
          });
        }
      }
    }
  };

  return (
    <PagesContext.Provider
      value={{ Dao, setDao, checkIfWalletIsConnect, account, connectWallet, setAccount, checkNetwork }}
    >
      {children}
    </PagesContext.Provider>
  );
};
