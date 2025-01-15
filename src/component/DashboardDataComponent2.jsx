import React from "react";
import { Avatar, Box, Typography, Card, Tooltip } from "@mui/material";
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { getUserColor } from "../theme/setThemeColor";

const DashboardDataComponent2 = ({ users }) => {
  const avatarColor = getUserColor(users.role); // Get the dynamic color based on user role
  
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        padding: { xs: "0.5rem", sm: "1rem" },
        borderRadius: "10px",
        border: `2px solid ${avatarColor}`,  // Card border
        width: "100%",
        mb: 2,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Avatar for User */}
      <Avatar
        sx={{
          width: { xs: 30, sm: 38 },
          height: { xs: 30, sm: 38 },
          backgroundColor: avatarColor,  // Set the background color
          border: `2px solid ${avatarColor}`,  // Set the border color same as background
          mr: { xs: 0, sm: 1.5 },
        }}
      >
        {users.icon}
      </Avatar>

      {/* User Role and Name */}
      <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
        <Typography
          sx={{
            color: "grey",
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          {/* Display role with Tooltip */}
          {users.role === "Asm" ? (
            <Tooltip title="Area Sales Manager" placement="top">
              <Typography>ASM</Typography>
            </Tooltip>
          ) : users.role === "ZSM" ? (
            <Tooltip title="Zonal Sales Manager" placement="top">
              <Typography>ZSM</Typography>
            </Tooltip>
          ) : users.role === "Ad" ? (
            <Tooltip title="Area Distributors" placement="top">
              <Typography>Ad</Typography>
            </Tooltip>
          ) : users.role === "Md" ? (
            <Tooltip title="Master Distributors" placement="top">
              <Typography>Md</Typography>
            </Tooltip>
          ) : users.role === "Ret" ? (
            "Retailers"
          ) : users.role === "Dd" ? (
            <Tooltip title="Direct Dealer" placement="top">
              <Typography>Dd</Typography>
            </Tooltip>
          ) : users.role === "Api" ? (
            "API"
          ) : (
            ""
          )}
        </Typography>
      </Box>

      {/* User Count */}
      <Typography
        sx={{
          fontSize: { xs: "16px", sm: "18px" },
          fontWeight: "bold",
          textAlign: { xs: "center", sm: "center" },  // Align count to the right
          flexGrow: 1,
        }}
      >
        {users.userCount ?? 0}
      </Typography>

      {/* Percentage Change Indicator */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-end" },
          mt: { xs: 1, sm: 0 },
        }}
      >
        {users.increased ? (
          <NorthIcon sx={{ color: "#00BF78", fontSize: { xs: "14px", sm: "16px" } }} />
        ) : (
          <SouthIcon sx={{ color: "#DC5F5F", fontSize: { xs: "14px", sm: "16px" } }} />
        )}
        <Typography
          sx={{ fontSize: { xs: "10px", sm: "12px" }, ml: 0.5 }}
        >
          54.3%
        </Typography>
      </Box>
    </Card>
  );
};

export default DashboardDataComponent2;
