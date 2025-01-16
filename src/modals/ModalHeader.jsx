import React from "react";
import { Typography, IconButton, Box } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"; // Using a rounded close icon
import Mount from "../component/Mount";

const ModalHeader = ({
  title = "Modal heading",
  subtitle = "Start your journey with VistarMoney.",
  handleClose,
  hideCloseBtn,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "16px", // Adjust the padding
        // backgroundColor: "#1a78f20a", // Light purple background similar to the image
        // backgroundColor: "#FFE6E6",
        // backgroundColor: "#FFD580", 
        backgroundColor: "rgba(232, 212, 149, 0.2)",
        // // A lighter orange shade

        borderRadius: "12px 12px 0 0", // Rounded corners at the top
        display: "flex",
        flexDirection: "column", // Stacks title and subtitle vertically
        alignItems: "center", // Center-aligns the text
        position: "relative",
        mb: 3,
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#000000", // Black color
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}

      <Typography
        sx={{
          fontSize: "14px",
          color: "#6b6b6b", // Grey color similar to the image
          marginTop: "4px", // Space between title and subtitle
        }}
      >
        {subtitle}
      </Typography>

      {/* Close Button */}

      {!hideCloseBtn && (
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#757575", // Gray color for the close icon
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ModalHeader;
