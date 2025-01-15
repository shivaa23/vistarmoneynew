import { Grid } from '@mui/material';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Prepaid', lastMonth: 168078, thisMonth: 0, today: 0 },
  { name: 'Utility', lastMonth: 386525.16, thisMonth: 0, today: 0 },
  { name: 'Money Transfer', lastMonth: 5639520, thisMonth: 0, today: 0 },
  { name: 'Nepal Transfer', lastMonth: 318050, thisMonth: 0, today: 0 },
  { name: 'Payments', lastMonth: 7958038, thisMonth: 0, today: 0 },
  { name: 'Aeps', lastMonth: 2217450, thisMonth: 0, today: 0 },
  { name: 'CMS', lastMonth: 0, thisMonth: 0, today: 0 },
  { name: 'Railway', lastMonth: 17934.70, thisMonth: 0, today: 0 },
  { name: 'Settlements', lastMonth: 404262, thisMonth: 0, today: 0 },
  { name: 'Verification', lastMonth: 454, thisMonth: 0, today: 0 },
  { name: 'Mini ATM', lastMonth: 0, thisMonth: 0, today: 0 },
];

const ProductSaleLineChart = () => {
  return (
    <Grid
    container
    xs={12}
    md={12}
    lg={12}
    sx={{
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "1rem",
      boxShadow:
        "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
      width: { lg: "100%", md: "100%", sm: "100%" },
      ml: { lg: "0", md: "0", xs: "0" },
      // mr: { lg: "1.5%", md: 0, xs: 0 },
    }}
  >
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="lastMonth" stroke="#8884d8" activeDot={{ r: 8 }} name="Last Month" />
        <Line type="monotone" dataKey="thisMonth" stroke="#82ca9d" name="This Month" />
        <Line type="monotone" dataKey="today" stroke="#ff7300" name="Today" />
      </LineChart>
    </ResponsiveContainer>
    </Grid>
  );
};

export default ProductSaleLineChart;
