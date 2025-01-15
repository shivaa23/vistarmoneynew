import React, { useContext } from "react";
import { Box, Grid, Typography, IconButton ,Tooltip} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download"; // MUI download icon
import QRCode from "react-qr-code";
import AuthContext from "../store/AuthContext";
import { upiWeb } from "../iconsImports";
import html2pdf from "html2pdf.js"; //


const RetQrModal = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const vqr = user && user.vqr;

  const selfqrValue =
    vqr && vqr
      ? `VPA=` + vqr + `&pn=Dillipay Technologies Limited`
      : "if you want to use our qr ";

  const downloadAsPDF = () => {
    const element = document.getElementById("qrContent");
    const options = {
      filename: "qr_code.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <Grid
      container
      sx={{
        mt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        item
        md={12}
        sm={12}
        xs={12}
        sx={{
          fontWeight: "bold",

          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", fontSize: "30px" }}
          >
            Scan the QR Code Below
          </Typography>
          <Tooltip title="Download" placement="bottom">
            <IconButton
              sx={{
                cursor: "pointer",
                ml: 6, // Adjust as needed for spacing
              }}
              onClick={downloadAsPDF}
            >
              <DownloadIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          id="qrContent"
          sx={{
            textAlign: "center",
            padding: 2,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          {/* User's Name */}
          <Box sx={{ fontWeight: "bold", fontSize: "26px" }}>{user?.name}</Box>

          {/* QR Code Value */}
          <Box sx={{ fontSize: "16px", color: "gray", marginBottom: "12px" }}>
            {selfqrValue}
          </Box>

          {/* QR Code */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <QRCode value={selfqrValue} size={250} />
          </Box>

          <Box sx={{ fontWeight: "bold", marginTop: "12px", fontSize: "28px" }}>
            Scan this code & pay me
          </Box>

          {/* UPI Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "12px",
            }}
          >
            <img src={upiWeb} alt="upi apps" />
          </Box>

          {/* Note Section */}
          {/* <Typography
            sx={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "600",

              padding: 2.2,
              paddingBottom: 0,
              marginTop: "14px",
            }}
          >
            *Note: This Payment will be added to W2
          </Typography> */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default RetQrModal;
