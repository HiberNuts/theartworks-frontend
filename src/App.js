import "./App.css";
import { useContext } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { PagesContext } from "./context/Context";
import DaoVotes from "./pages/DaoVotes";
function App() {
  const { Dao, setDao } = useContext(PagesContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {Dao ? <Route path="/" element={<DaoVotes />}></Route> : <Route path="/" element={<Home />}></Route>}
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
