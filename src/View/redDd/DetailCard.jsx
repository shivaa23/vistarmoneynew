import React, { useState } from "react";
import { Box, Grid, Drawer, IconButton, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { currencySetter } from "../../utils/Currencyutil";

const DetailCard = ({ row, role }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to open the drawer
  const handleOpen = () => {
    setDrawerOpen(true);
  };

  // Function to close the drawer
  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div>
      {/* Button to open the drawer */}
      <IconButton onClick={handleOpen}>
        <Icon icon="dashicons:welcome-view-site" width={26} height={26} />
      </IconButton>

      {/* Drawer Component */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '350px', 
            backgroundColor: '#f5f5f5', 
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#d48628",
          }}
        >
          <Icon icon="ic:round-close" width={24} height={24} />
        </IconButton>

    
        <Box
          sx={{
            padding: '1rem',
            textAlign: 'center',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Shadow effect for card appearance
            margin: '20px', // Margin around the box
            backgroundColor: 'white', // Background color for the card
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#d48628',
              fontSize: '1.5rem', // Increased font size
            }}
          >
            Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                Return Charge:
              </Typography>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                {currencySetter(row.ret_charge)}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                Commission:
              </Typography>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                {currencySetter(role === "ad" ? row.ad_comm : row.ret_comm)}
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                TDS:
              </Typography>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                {currencySetter(role === "ad" ? row.ad_tds : row.ret_tds)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                GST:
              </Typography>
              <Typography variant="body1" sx={{ color: "black", fontWeight: "bold", fontSize: '1.2rem' }}>
                {currencySetter(row.gst)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </div>
  );
};

export default DetailCard;
