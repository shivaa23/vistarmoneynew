import React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import SideBarContext from "../store/SideBarContext";
import { whiteColor } from "../theme/setThemeColor";
import { Avatar, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import { femaleAvatar, maleAvatar } from "../iconsImports";
import AuthContext from "../store/AuthContext";

const NavItemSubmenu = ({
  item,
  open,
  index,
  setOpen,
  handleDrawerToggle,
  mobileOpen,
}) => {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const handleClick = () => {
    setSubMenuOpen(!subMenuOpen);
  };
  const { user } = useContext(AuthContext);
  const sidebarCtx = useContext(SideBarContext);
  const setActiveIndex = sidebarCtx.setActiveIndex;
  const location = useLocation();
  const currentPath = location.pathname;
  let isCurrentActive = currentPath === item?.to;
  return (
    <div>
      <List key={item.title}>
        {/* the containing icon */}
        <ListItemButton
          onClick={handleClick}
          sx={{
            border: isCurrentActive ? "1px solid rgba(159, 134, 192, 0.3)" : "",
            backgroundColor: isCurrentActive ? "#00693E" : "",

            justifyContent: open ? "initial" : "center",
            "&:hover": {
              backgroundColor: isCurrentActive ? "#00693E" : "",

              color: whiteColor(),
              // backgroundColor: `gray`,
              backdropFilter: "blur(5px)",

              // "& .menu-title": {
              //   color: whiteColor(),
              // },
            },
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            mx: 1,
          }}
        >
          <Box
            sx={{
              mr: open ? 2 : "auto",
              justifyContent: "center",
            }}
          >
            {/* <Avatar
                    id="user_img"
                    // alt={user.name}
                    src={
                      // !["0", "1"].includes(user.profile_image)?
                      // user.profile_image : 
                      user.gender === "FEMALE" ?
                      femaleAvatar : maleAvatar
                    }
                    sx={{ width: 35, height: 35 }}
                  /> */}
            <img
              width="26px"
              src={user.gender == "MALE" ? item?.icon : item?.icon2}
              alt=""
            />
          </Box>
          <ListItemText
            className="menu-title"
            primary={item.title}
            sx={{
              // color:"#012169",
              opacity: open ? 1 : 0,
              color: isCurrentActive ? "white" : "white",
              fontSize: "16px",
              // fontStyle: "italic",
            }}
          />
          {open ? subMenuOpen ? <ExpandLess /> : <ExpandMore /> : ""}
        </ListItemButton>
        <Collapse in={subMenuOpen} timeout="auto" unmountOnExit>
          {item &&
            item.submenus &&
            item.submenus.map((subMenu, i) => {
              let isCurrentActive = currentPath === subMenu.to;
              return (
                <NavLink
                  to={subMenu.to}
                  key={subMenu.to}
                  onClick={() => {
                    setActiveIndex({ index: index, subIndex: i });
                    if (mobileOpen) {
                      handleDrawerToggle();
                    } else setOpen(false);
                  }}
                  style={({ isActive }) => {
                    return {
                      display: "block",
                      textDecoration: "none",
                      justifyContent: open ? "center" : "end",
                      padding: open ? "0px 8px 6px 6px" : "",
                    };
                  }}
                >
                  <ListItemButton
                    sx={{
                      // pl: open ? 4 : 1.45,
                      justifyContent: open ? "initial" : "center",
                      backgroundColor: isCurrentActive ? `#00693E` : "#fff",
                      backdropFilter: isCurrentActive ? "blur(5px)" : "",
                      "&:hover": {
                        // color: whiteColor(),
                        backgroundColor: `#00693E`,
                        // "& .submenu-title": {
                        //   color: whiteColor(),
                        // },
                      },
                      borderRadius: "4px",
                      boxShadow: isCurrentActive
                        ? "0px 8px 37.5px rgba(55, 69, 87, 0.1)"
                        : "#fff",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        mr: open ? 3 : 3,
                        // ml: open ? 0 : 3.5,
                        justifyContent: "center",
                      }}
                    >
                      <img width="26px" src={subMenu.icon} alt="" />
                    </Box>
                    <ListItemText
                      primary={subMenu.title}
                      sx={{
                        // marginLeft:-4,
                        color: "#012169",

                        "&:hover": {
                          // marginLeft: open && -5,
                          fontSize: "16px",
                          // fontStyle: "italic",
                          color: whiteColor(),
                        },
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              );
            })}
        </Collapse>
      </List>
    </div>
  );
};

export default NavItemSubmenu;
