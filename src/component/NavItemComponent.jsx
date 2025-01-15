import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SideBarContext from "../store/SideBarContext";
import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import AuthContext from "../store/AuthContext";

const NavItemComponent = ({
  item,
  open,
  index,
  setOpen,
  handleDrawerToggle,
  mobileOpen,
}) => {
  const sidebarCtx = useContext(SideBarContext);
  const authCtx = useContext(AuthContext);
  const setActiveIndex = sidebarCtx.setActiveIndex;
  const location = useLocation();
  const currentPath = location.pathname;
  let isCurrentActive = currentPath === item?.to;
  const userRole = authCtx.user.role;
  const user = authCtx.user;
  const setCurrentView = authCtx.setCurrentView;
  if (
    currentPath.includes("/admin/accountStatement") &&
    item?.to === "/admin/accounts"
  ) {
    isCurrentActive = true;
  } else if (
    currentPath.includes("/admin/bankStatement") &&
    item?.to === "/admin/banks"
  ) {
    isCurrentActive = true;
  }

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const handleItemClick = () => {
    setActiveIndex({
      index: index,
      subIndex: -1,
    });
    if (mobileOpen) {
      handleDrawerToggle();
    } else setOpen(false);
    if (item.to === "/customer/dashboard") {
      setCurrentView(null);
    }
  };
  if (
    (user.role !== "Admin" &&
      user.role !== "Asm" &&
      user.role !== "Zsm" &&
      user?.aggreement !== 1) ||
    (item.title === "Fund Request" && user?.c_req !== 1)
  ) {
    return null;
  }
  if (
    user.role === "Admin" &&
    user?.aggreement !== 1 &&
    ((item.title === "Fund Request" && user?.c_req !== 1) ||
      (item.title === "Transactions" && user?.transactions !== 1) ||
      //  ||
      //  (item.title === "Dashboard" && user?.dashboard !== 1)
      //  ||
      //  (item.title === "Complaint" && user?.complaints !== 1)
      (item.title === "Users" && user?.users !== 1) ||
      (item.title === "Banking" && user?.banking !== 1) ||
      (item.title === "Messages" && user?.messages !== 1) ||
      (item.title === "Services" && user?.services !== 1) ||
      (item.title === "Sett. Accounts" && user?.s_accounts !== 1) ||
      (item.title === "Scheme" && user?.scheme !== 1))
    //  ||
    //  (item.title === "Login History" && user?.login_history !== 1)
    //  ||
    //  (item.title === "Account Ledger" && user?.a_ladger !== 1)
  ) {
    return null;
  }

  console.log("item is define here ", item);

  return (
    <ListItem
      key={item.title}
      disablePadding
      sx={{
        display: "block",
        mt: 2,
      }}
      onClick={handleItemClick}
    >
      <NavLink
        to={item.to}
        key={item.to}
        target={item.title === "IRCTC" && "_blank"}
        style={({ isActive }) => ({
          display: "block",
          margin: "0.2rem 0",
          textDecoration: "none",
          padding: open ? "0px 8px 0px 8px" : "0px 8px 0px 8px",
        })}
      >
        <ListItemButton
          className="icon-hover"
          sx={{
            justifyContent: open ? "initial" : "center",
            backgroundColor: isCurrentActive ? "#D48628" : "",
            backdropFilter: isCurrentActive ? "blur(5px)" : "",

            border: isCurrentActive ? "1px solid rgba(159, 134, 192, 0.3)" : "",
            "&:hover": {
              backgroundColor: isCurrentActive ? "#212b5a" : "",
              color: "white",
            },
            "& img": {
              transform: "scale(1.07)",
              animation: "pulse 1s infinite",
            },
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
          }}
        >
          <Box
            sx={{
              mr: open ? 2 : "auto",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <img
              width="25px"
              src={item.icon}
              alt=""
              style={{
                filter: isCurrentActive
                  ? "brightness(0) saturate(100%) invert(100%)"
                  : "",
              }}
            />
          </Box>

          <ListItemText
            className="menu-title"
            primary={item.title}
            disableTypography
            sx={{
              opacity: open ? 1 : 0,
              color: isCurrentActive ? "#fff" : "#fff",
              fontSize: "16px",
              fontFamily: "Montserrat, sans-serif",
              "&:hover": {
                color: isCurrentActive ? "white" : "white",
              },
            }}
          />
        </ListItemButton>
      </NavLink>
    </ListItem>
  );
};

export default NavItemComponent;
