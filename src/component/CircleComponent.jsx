import React from "react";
import { Box, styled } from "@mui/material";

const CircleComponent = ({ img }) => {
  const OuterIcon = styled(Box)(({ theme, bg = "#08509E" }) => ({
    width: "93px",
    height: "93px",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    background: bg,
    marginRight: theme.spacing(2), // Add margin for spacing
  }));

  const InnerIcon = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    width: "60px",
    height: "60px",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.common.white,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  }));

  let imageSrc;
  try {
    imageSrc = require(`../assets/operators/${img}.png`);
  } catch (error) {
    imageSrc = null;
  }

  return (
    <Box display="flex" alignItems="center">
      <InnerIcon>
        <img src={imageSrc} alt="No Image" width="30px" />
      </InnerIcon>
    </Box>
  );
};

export default CircleComponent;
