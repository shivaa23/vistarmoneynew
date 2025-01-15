import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoComponent from "./LogoComponent";
import { getEnv } from "../theme/setThemeColor";
import useCommonContext from "../store/CommonContext";
import { loginPage1 } from "../iconsImports";
import MenuIcon from "@mui/icons-material/Menu";
// Change color on scroll
const theme2 = {
  background: "rgba(255, 255, 255, 0)",
  boxShadow: "none !Important",
  backdropFilter: "blur(0px)",
  color: "#000",
};

const theme = {
  background: "#fff",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  color: "#000",
};

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    style: trigger ? theme : theme2,
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

// Menu items
const pagesLg = [
  { navItems: "HOME", to: "/", sName: "homeSec" },
  { navItems: "ABOUT US", to: "/about-us", id: "about-us", sName: "aboutSec" },
  {
    navItems: "OUR SERVICES",
    to: "/our-services",
    id: "our-services",
    sName: "servicesSec",
  },
  {
    navItems: "CONTACT US",
    to: "/contact-us",
    id: "contact-us",
    sName: "contactSec",
  },
];
const loginPage = { navItems: "LOGIN/SIGN UP", to: "/login", sName: "" };
const pagesSm = [
  { navItems: "HOME", to: "/", sName: "homeSec" },
  { navItems: "ABOUT US", to: "/about-us", sName: "aboutSec" },
  { navItems: "OUR SERVICES", to: "/our-services", sName: "servicesSec" },
  { navItems: "CONTACT US", to: "/contact-us", sName: "contactSec" },
  { navItems: "LOGIN/SIGN UP", to: "/login", sName: "" },
];

if (process.env.REACT_APP_TITLE === "MoneyOddr") {
  pagesLg.unshift({
    navItems: "HOME",
    to: "/",
    id: "landing-intro",
    sName: "homeSec",
  });
}

// Scroll function for MoneyOddr
const handleClickScroll = (id) => {
  // Your scrolling logic here
};

export default function Navbar(props) {
  const { section } = useCommonContext();
  const [env, setEnv] = React.useState(getEnv());
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar sx={{ width: "100%" }}>
          <Toolbar
            sx={{
              justifyContent: "space-between", // Adjusted to space-between for logo and button positioning
              // background: "linear-gradient(to right, #7fb4f9, #ee5f5f)",
            }}
          >
            {/* Logo on the left */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",

                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                transition: "transform .2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <LogoComponent />
            </Typography>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                display: { xs: "flex", md: "none" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                justifyContent: "left",
                textDecoration: "none",
                transition: "transform .2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <img src={loginPage1} width="140px" alt="logo" />
            </Typography>

            {/* Center Menu Items */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              {pagesLg.map((item) => (
                <MenuItem
                  key={item.to}
                  onClick={() => {
                    if (getEnv() === "MoneyOddr") {
                      handleClickScroll(item.id);
                    } else {
                      navigate(item.to);
                    }
                  }}
                >
                  <Link className="navLinks">{item.navItems}</Link>
                </MenuItem>
              ))}
              {/* {process.env.REACT_APP_TITLE !== "MoneyOddr" && (
                <Box
                  component="div"
                  sx={{
                    textAlign: "center",
                    mt: 1,
                    mb: 3,
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    sx={{ mt: 1, marginRight: "0.5rem", color: "#fff" }}
                  >
                    <FacebookRoundedIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    sx={{ mt: 1, marginRight: "0.5rem", color: "#fff" }}
                  >
                    <InstagramIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    sx={{ mt: 1, marginRight: "0.5rem", color: "#fff" }}
                  >
                    <TwitterIcon />
                  </IconButton>
                </Box>
              )} */}
            </Box>

            {/* Login Button on the right */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Button className="button" onClick={() => navigate("/login")}>
                {loginPage.navItems}
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "flex-end",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pagesSm.map((item) => (
                  <MenuItem
                    key={item.to}
                    onClick={handleCloseNavMenu}
                    sx={{
                      background: "#319B88",
                      color: "#fff",
                      "&:hover": {
                        background: "#319B88",
                      },
                    }}
                  >
                    <Link to={item.to} className="navLinks">
                      {item.navItems}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
}
