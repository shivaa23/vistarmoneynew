import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";

const CommonCardDashBoard = ({ name, img, onClick }) => {
  return (
    <>
      <Tooltip title={name} placement="top">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", 
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(-65deg, var(--bg) 50%, var(--accent) 50%)",
            textAlign: "center",
            cursor: "pointer",
            transition: "box-shadow 0.3s ease-in-out",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            padding: { xs: "8px", sm: "12px" }, // Add padding for extra space
          }}
          onClick={onClick}
        >
          <Box
            sx={{
              width: { xs: "100px", sm: "100px" },
              height: { xs: "100px", sm: "100px" },
              mt: 1,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 2,
              background: "white",
              mb: 1,
              transition:
                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
               boxShadow: "0px 4px 1px rgba(0, 176, 89, 0.5)",
              },
            }}
          >
            <img
              src={img}
              alt={name}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "30%", 
              }}
            />
          </Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              textAlign: "center", 
              overflow: "hidden",
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
              maxWidth: "100%", 
              fontSize: { xs: "12px", sm: "14px" }, 
            }}
          >
            {name}
          </Typography>
        </Box>
      </Tooltip>
    </>
  );
};

export default CommonCardDashBoard;
