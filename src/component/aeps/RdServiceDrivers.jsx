import { Icon } from "@iconify/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import React from "react";

const RdServiceDrivers = () => {
  return (
    <Box sx={{ mt: 4, mb: { xs: 8, lg: 0 } }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon icon="material-symbols:expand-circle-down" />}
          aria-controls="driver-download-content"
          id="driver-download-header"
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            RD Service Drivers
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "left",
                mt: 2,
              }}
            >
              <Button
                onClick={() => {
                  window.open(
                    "http://download.mantratecapp.com/Forms/DownLoadFiles",
                    "_blank"
                  );
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#dc5f5f25",
                  color: "#DC5F5F",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#DC5F5F",
                    color: "#fff",
                  },
                }}
              >
                MANTRA
              </Button>
              <Button
                onClick={() => {
                  window.open("https://acpl.in.net/RdService.html", "_blank");
                }}
                variant="contained"
                sx={{
                  ml: 2,
                  backgroundColor: "#dc5f5f25",
                  color: "#DC5F5F",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#DC5F5F",
                    color: "#fff",
                  },
                }}
              >
                STARTEK
              </Button>
              <Button
                onClick={() => {
                  window.open("https://rdserviceonline.com/", "_blank");
                }}
                variant="contained"
                sx={{
                  ml: 2,
                  backgroundColor: "#dc5f5f25",
                  color: "#DC5F5F",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#DC5F5F",
                    color: "#fff",
                  },
                }}
              >
                MORPHO
              </Button>
            </Box>
            <Typography sx={{ mt: 3 }}>
              <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
                Step1:{" "}
              </span>
              After successfully registering your device, copy & paste the below
              link in your Chrome browser:
              chrome://flags/#allow-insecure-localhost
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <span style={{ fontWeight: "bold", color: "#DC5F5F" }}>
                Step2:{" "}
              </span>
              Click on "Enable" and re-launch Chrome browser.
            </Typography>
          </>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RdServiceDrivers;
