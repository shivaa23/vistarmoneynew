import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Grid, Typography } from "@mui/material";
import RefreshComponent from "./component/RefreshComponent";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrafficSourcesChart = ({
  transactionData = [],
  refreshFunc,
  refresh,
}) => {
  const data = {
    datasets: transactionData.map((item) => ({
      label: item.name,
      data: [item.percent, 100 - item.percent],
      backgroundColor: [item.color, "rgba(211, 211, 211, 1)"],
      borderWidth: 2,
      hoverOffset: 3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    // cutout: "70%",
  };

  return (
    <Grid lg={12} md={12} sm={11.8} xs={11.2}>
    <Box sx={{ width: "85%", m: "auto" }}>
      <Typography variant="h5" component="div" align="center">
        Transaction Status
        <RefreshComponent refresh={refresh} onClick={() => refreshFunc()} />
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Doughnut
          data={data}
          options={options}
          sx={{ width: "80%", my: "auto" }}
        />
      </Box>
    </Box>
  </Grid>
  );
};

export default TrafficSourcesChart;
