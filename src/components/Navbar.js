import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { PagesContext } from "../context/Context";
import { Link, Navigate } from "react-router-dom";

export default function Navbar() {
  const { Dao, setDao } = React.useContext(PagesContext);

  return (
    <Box sx={{ flexGrow: 1, color: "black" }}>
      <AppBar
        className="AppBar"
        sx={{ backgroundColor: "white", color: "black", display: "flex", justifyContent: "space-between" }}
        position="static"
      >
        <Toolbar className="toolbar" sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link style={{ textDecoration: "none" }} to="/">
            <img style={{ width: "200px" }} src={logo} onClick={() => setDao(false)} />
          </Link>
          <div style={{ display: "flex" }}>
            <Link style={{ textDecoration: "none" }} to="/dao">
              <Button
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  marginRight: "40px",
                  "&:hover": { backgroundColor: "black" },
                }}
                className="button"
                onClick={() => setDao(true)}
              >
                DAO votes
              </Button>
            </Link>
            <Button
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "black" },
                padding: "10px",
              }}
              className="button"
            >
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
