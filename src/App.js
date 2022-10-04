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

function App() {
  const { checkIfWalletIsConnect, account, checkNetwork } = useContext(PagesContext);
  console.log(account);
  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
