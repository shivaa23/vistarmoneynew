import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
} from "@mui/material";

const BankList = () => {
  const [banks, setBanks] = useState([
    { name: "Bank of America", code: "BOA123" },
    { name: "Chase Bank", code: "CH123" },
    { name: "Citibank", code: "CI123" },
    { name: "Wells Fargo", code: "WF123" },
    { name: "HSBC", code: "HSBC456" },
    { name: "Barclays", code: "BAR123" },
    { name: "Capital One", code: "CO123" },
    { name: "Bank of Canada", code: "BOC789" },
    { name: "Royal Bank of Scotland", code: "RBS654" },
    { name: "TD Bank", code: "TD123" },
  ]);

  return (
    <Box sx={{ padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Grid container alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Bank List
        </Typography>
      </Grid>

      <Grid container spacing={2}>
        {banks.map((bank, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {bank.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Code: {bank.code}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BankList;
