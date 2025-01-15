import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RightNavbar from "./RightNavbar";
import AuthContext from "../store/AuthContext";
import { smLogo } from "../iconsImports";
import {
  account_nav,
  Admin_nav,
  Ad_nav,
  Api_nav,
  Asm_nav,
  customer_nav,
  nav,
} from "../_nav";
import NavItemComponent from "./NavItemComponent";
import NavItemSubmenu from "./NavItemSubmenu";
import { setTitleFunc } from "../utils/HeaderTitleUtil";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, Button, Grid, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RightNavBarMob from "./RightNavBarMob";
import Notifications from "./Notifications";
import {
  getHoverInActive,
  secondaryColor,
  whiteColor,
} from "../theme/setThemeColor";
import LogoComponent from "./LogoComponent";
import { useEffect } from "react";
import { useContext } from "react";
import ComputerIcon from "@mui/icons-material/Computer";
import AdminBadgeComponent from "./AdminBadgeComponent";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const WebAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: "999",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const WebDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// let filterCNav = customer_nav_super;
export default function SideNav(props) {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  // const [authUser, setAuthUser] = React.useState(user);
  // const access = authCtx.token;
  const [activeIndex, setActiveIndex] = React.useState({
    index: 0,
    subIndex: -1,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const location = useLocation();
  const title = setTitleFunc(location.pathname, location.state);
  const [open, setOpen] = React.useState(false);

  // defining alias here
  const { window: SideWindow } = props;
  const container =
    SideWindow !== undefined ? () => SideWindow().document.body : undefined;

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isBig, setIsBig] = React.useState(
    window.innerWidth < 900 ? false : true
  );

  // ##############################
  // not used for now don't delete
  // ##############################
  // eslint-disable-next-line no-unused-vars
  const [filterCNav, setFilterCNav] = React.useState(customer_nav);
  const changeApply = () => {
    if (window.innerWidth < 900) setIsBig(false);
    else if (window.innerWidth > 900) setIsBig(true);
  };

  // ####################################
  // useEffect to apply window size event
  // ####################################
  useEffect(() => {
    window.addEventListener("resize", changeApply);
    return () => {
      window.removeEventListener("resize", changeApply);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    authCtx.logout();
    setAnchorEl(null);
  };

  // const leftNav =
  //   user && user.role === "Admin"
  //     ? Admin_nav
  //     : user && user.role === "Asm"
  //     ? Asm_nav
  //     : user && user.role === "Ad"
  //     ? Ad_nav
  //     : user && user.role === "Api"
  //     ? Api_nav
  //     : user && user.role === "Acc"
  //     ? account_nav
  //     : user && (user.role === "Ret" || user.role === "Dd")
  //     ? user?.st === 0 || user?.nepal_transfer === 0 || user?.acst === 0
  //       ? customer_nav
  //           .filter((item) => {
  //             if (user?.st === 0) {
  //               return item.title !== "Super Transfer";
  //             } else {
  //               return customer_nav;
  //             }
  //           })
  //           .filter((item) => {
  //             if (user?.nepal_transfer === 0) {
  //               return item.title !== "Nepal Transfer";
  //             } else {
  //               return customer_nav;
  //             }
  //           })
  //           .filter((item) => {
  //             if (user?.acst === 0) {
  //               return item.title !== "Account Ledger";
  //             } else {
  //               return customer_nav;
  //             }
  //           })
  //       : customer_nav
  //     : nav;

  const leftNav =
    user && user.role === "Admin"
      ? Admin_nav
      : user && user.role === "Asm"
      ? Asm_nav
      : user && user.role === "Ad"
      ? Ad_nav
      : user && user.role === "Api"
      ? Api_nav
      : user && user.role === "Acc"
      ? account_nav
      : user && (user.role === "Ret" || user.role === "Dd")
      ? user?.st === 0 ||
        user?.nepal_transfer === 0 ||
        user?.acst === 0 ||
        user?.username !== 7011256694
        ? customer_nav.map((item) => {
            // if we want to do filter in reports
            if (user?.acst === 0 && item?.title === "Reports") {
              let newsub = item?.submenus?.filter((subitem) => {
                if (user?.acst === 0) {
                  return subitem.title !== "Account Ledger";
                } else {
                  return subitem;
                }
              });

              return {
                title: "Reports",
                to: "#",
                icon: item.icon,
                submenus: newsub,
              };
            } else {
              // do not delete
              // if (user?.st === 0 && item.title === "Super Transfer") {
              //   return undefined;
              // }
              if (user?.username !== 7011256694 && item.title === "Travel") {
                return undefined;
              }
              if (
                user?.nepal_transfer === 0 &&
                item.title === "Nepal Transfer"
              ) {
                return undefined;
              }
              //  do not delete
              // if (user?.dmt4 === 0 && item.title === "Express Transfer") {
              //   return undefined;
              // }
              if (user?.aeps === 0 && item.title === "AEPS") {
                return undefined;
              }
              if (user?.upi_transfer === 0 && item.title === "UPI Transfer") {
                return undefined;
              } else {
                return item;
              }
            }
          })
        : customer_nav
      : nav;

  const outletBoxStyle = {
    width: {
      lg:
        user?.role === "Admin"
          ? "100%"
          : user?.role === "Asm"
          ? "100%"
          : // : user?.role === "Api"
          // ? "100%"
          location.pathname !== "/customer/transactions" &&
            location.pathname !== "/api-user/transactions" &&
            location.pathname !== "/account/dashboard" &&
            location.pathname !== "/ad/transactions" &&
            location.pathname !== "/ad/sale" &&
            location.pathname !== "/ad/purchase"
          ? "75%"
          : "100%",
      xs: "100%",
    },
    justifyContent: "start",
    alignContent: "left",
    marginLeft: { md: "1rem", sm: "0.5rem", xs: "0.5rem" },
    marginRight: { md: "1rem", sm: "0.5rem", xs: "0.5rem" },
    marginTop: "1rem",
  };

  const drawer = (
    <div>
      <DrawerHeader sx={{ justifyContent: "space-between", pr: 1 }}>
        {(open || mobileOpen) && (
          <LogoComponent
            style={{
              padding: "4px",
              display: "block",
              margin: "0 auto",
              backgroundColor: whiteColor(),
            }}
          />
        )}
        {!open && !mobileOpen && (
          <img
            src={smLogo}
            width="35px"
            alt="c_logo"
            style={{
              padding: "4px",
              display: "block",
              margin: "0 auto",
              backgroundColor: whiteColor(),
            }}
          />
        )}
      </DrawerHeader>
      <Divider
      // sx={{
      //   backgroundColor: "#ffffff",
      // }}
      />
      <List
        sx={{
          height: { xs: "80vh", sm: "100vh" },
          overflowY: "scroll",
        }}
      >
        {leftNav.map((item, index) => {
          return item && item.submenus ? (
            <NavItemSubmenu
              item={item}
              open={open || mobileOpen}
              setOpen={setOpen}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              key={index}
            />
          ) : (
            item && (
              <NavItemComponent
                item={item}
                open={open || mobileOpen}
                setOpen={setOpen}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
                index={index}
                key={index}
              />
            )
          );
        })}
        {open && (
          <Typography
            sx={{ textAlign: "left", pl: 5, mt: 2, color: whiteColor() }}
          >
            <span
              style={{
                opacity: "0.9",
                fontSize: "14px",
                fontWeight: "600",
                marginRight: "5px",
              }}
            >
              VERSION:
            </span>
            <span style={{ fontSize: "13px" }}>
              {process.env.REACT_APP_VERSION}
            </span>
            <ComputerIcon sx={{ ml: 2, fontSize: "17px", opacity: "0.8" }} />
          </Typography>
        )}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex", fontFamily: "Poppins" }}>
      <CssBaseline />
      {/* the top bar  */}
      <WebAppBar
        position="fixed"
        open={open}
        sx={{
          paddingRight: "0px !important",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: { xs: 0, md: 1 },
          }}
          className="nav"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: { xs: 0, sm: 5 },
                ...(open && { display: "none" }),
              }}
            ></IconButton>
            {user?.layout === 1 && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: { md: 2, sm: 0, xs: 0 }, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <div
              className="col"
              onClick={() => navigate("/customer/services")}
              style={{ marginBottom: "-8px" }}
              hidden={user?.layout === 1}
            >
              <div className="con">
                <div className="bar arrow-top-r"></div>
                <div className="bar arrow-middle-r"></div>
                <div className="bar arrow-bottom-r"></div>
              </div>
            </div>
            <Typography
              variant="h6"
              component="div"
              sx={{
                textAlign: "left",
                fontFamily: "Poppins",
                fontWeight: "bold",
                marginLeft: { md: 3, sm: 3 },
                fontSize: { md: "20px", sm: "15px", xs: "15px" },
              }}
            >
              {title}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {user && user.role === "Admin" && <AdminBadgeComponent />}
            <Notifications />
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ color: "#000", mr: { xs: -2, sm: 0, md: 1 } }}
            />
            <Button
              sx={{
                borderRadius: "0px",
                p: 0,
                textAlign: "right",
              }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Tooltip title="MY Profile" placement="bottom">
                {user && user.profile_image !== "0" ? (
                  <Avatar
                    id="user_img"
                    alt="Remy Sharp"
                    src={user && user.profile_image}
                    sx={{ width: 35, height: 35 }}
                  />
                ) : (
                  <AccountCircle sx={{ fontSize: "36px" }} />
                )}
              </Tooltip>
              <Grid sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                <Typography
                  component="span"
                  sx={{
                    padding: 1,
                    textTransform: "capitalize",
                  }}
                >
                  {user && user.name}
                </Typography>
              </Grid>
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <div
                style={{
                  margin: 0,
                  paddingTop: "0rem",
                  width: "250px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <MenuItem
                  disableRipple
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "-8px",
                    "&:hover": { cursor: "default", background: "#fff" },
                  }}
                >
                  {user && user.profile_image !== "0" ? (
                    <Avatar
                      id="user_img"
                      alt="Remy Sharp"
                      src={user && user.profile_image}
                      sx={{ width: 80, height: 80 }}
                    />
                  ) : (
                    <AccountCircle
                      sx={{ fontSize: "80px", color: secondaryColor() }}
                    />
                  )}

                  <span
                    style={{
                      fontWeight: "550",
                      fontSize: "0.9rem",
                      marginTop: "0.3rem",
                    }}
                  >
                    {user && user.name}
                  </span>

                  <span
                    onClick={() => {
                      if (user && user.role === "Admin") {
                        navigate("/admin/my-profile");
                      } else if (user && user.role === "Asm") {
                        navigate("/asm/my-profile");
                      } else if (user && user.role === "Ad") {
                        navigate("/ad/my-profile");
                      } else if (
                        user &&
                        (user.role === "Ret" || user.role === "Dd")
                      ) {
                        navigate("/customer/my-profile");
                      } else if (user && user.role === "Api") {
                        navigate("/api-user/my-profile");
                      } else {
                        navigate("/other/my-profile");
                      }
                      handleClose();
                    }}
                    style={{
                      border: "1px solid #3f3f3f",
                      borderRadius: "16px",
                      padding: "0.2rem 1rem",
                      fontSize: "0.9rem",
                      margin: "1rem 0",
                    }}
                    className="simple-hover"
                  >
                    Manage your Profile
                  </span>
                </MenuItem>

                <div className="profile-dropdown-divider-new"></div>
                <MenuItem
                  disableRipple
                  onClick={() => {
                    handleLogout();
                    navigate("/");
                  }}
                  sx={{
                    width: "100%",
                    marginBottom: "-8px",
                    textAlign: "center",
                    py: 2,
                    display: "flex",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: getHoverInActive(),
                      color: "#fff",
                    },
                  }}
                >
                  Logout <LogoutIcon className="ms-2" fontSize="small" />
                </MenuItem>
              </div>
            </Menu>
          </div>
        </Toolbar>
      </WebAppBar>

      {/* mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          position: "absolute",
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            background: "rgba(35, 25, 66, 0.8)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(35, 25, 66, 0.3)",
          },
          zIndex: "1000",
        }}
      >
        {drawer}
      </Drawer>

      {/* web drawer the side one small one*/}
      {user?.layout ? (
        user?.layout * 1 === 1 && (
          <>
            <WebDrawer
              variant="permanent"
              open={open}
              onMouseOver={handleDrawerOpen}
              onMouseLeave={handleDrawerClose}
              sx={{
                position: "absolute",
                zIndex: "1000",
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  background: "rgba(35, 25, 66, 0.8)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(35, 25, 66, 0.3)",
                },
              }}
              className=""
            >
              {drawer}
            </WebDrawer>
          </>
        )
      ) : (
        <>
          <WebDrawer
            variant="permanent"
            open={open}
            onMouseOver={handleDrawerOpen}
            onMouseLeave={handleDrawerClose}
            sx={{
              position: "absolute",
              zIndex: "1000",
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
              },
            }}
            className=""
          >
            {drawer}
          </WebDrawer>
        </>
      )}

      <Box
        component="main"
        sx={{
          width: "100%",
          display: "block",
          margin: "0 auto",
          paddingLeft: user?.layout
            ? user.layout === 1
              ? "58px"
              : "0px"
            : "58px",
        }}
        className="rm-pd-sm"
      >
        <DrawerHeader />

        {/* ############################ */}
        <div
          className={
            location?.pathname === "/customer/services"
              ? "grey-bg"
              : "outlet-bg"
          }
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={outletBoxStyle}>
            <Outlet />
          </Box>
          {user?.role === "Admin"
            ? ""
            : user?.role === "Asm"
            ? ""
            : user?.role === "Acc"
            ? ""
            : // : user?.role === "Api"
              // ? ""
              location.pathname !== "/customer/transactions" &&
              location.pathname !== "/api-user/transactions" &&
              location.pathname !== "/ad/transactions" &&
              location.pathname !== "/ad/sale" &&
              location.pathname !== "/ad/purchase" && (
                <>{isBig ? <RightNavbar /> : <RightNavBarMob />}</>
              )}
        </div>
      </Box>
    </Box>
  );
}
