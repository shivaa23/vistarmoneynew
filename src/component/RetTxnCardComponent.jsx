import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";

const RetTxnCardComponent = ({ item }) => {
  return (
    <Box
      className="card-css"
      sx={{
        my: 2,
        p: 2,
        backgroundColor: item.bgColor,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          color: item.color,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: item.color, width: "28px", height: "28px" }}>
          {item.icon}
        </Avatar>
        <Box sx={{ ml: 2 }}>{item.name}</Box>
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChartIcon sx={{ color: item.color }} />
          <Typography sx={{ ml: 0.5, fontSize: "20px" }}>
            {item.balance}
          </Typography>
        </div>

        <Typography sx={{ fontSize: "12px", ml: 0.2 }}>
          ({Number(item.percent).toFixed(2)}%)
        </Typography>
      </Box>
    </Box>
  );
};

export default RetTxnCardComponent;
