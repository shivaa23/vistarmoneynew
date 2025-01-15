import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Box, Slider } from '@mui/material';
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../store/AuthContext";

function TrafficSources({ graphDuration, graphRequest }) {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [txnDataReq, setTxnDataReq] = useState(false);
  const [txnData, setTxnData] = useState([
    { name: "TOTAL", balance: "0" },
    { name: "SUCCESS", balance: "0" },
    { name: "PENDING", balance: "0" },
    { name: "FAILED", balance: "0" },
  ]);

  const getTxnData = () => {
    postJsonData(
      ApiEndpoints.ADMIN_DASHBOARD_GET_TXN_DATA,
      {
        type: graphDuration,
      },
      setTxnDataReq,
      (res) => {
        const data = res.data.data;
        const newData = [...txnData];
        newData.forEach((oldData) => {
          if (oldData.name === "SUCCESS") {
            oldData.balance = data.SUCCESS;
          }
          if (oldData.name === "PENDING") {
            oldData.balance = data.PENDING;
          }
          if (oldData.name === "FAILED") {
            oldData.balance = data.FAILED;
          }
          if (oldData.name === "TOTAL") {
            oldData.balance = data.TOTAL;
          }
        });
        setTxnData(newData);
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  useEffect(() => {
    if (
      user.role !== "Ret" &&
      user.role !== "Dd" &&
      user.role !== "Asm" &&
      user.role !== "Zsm"
    ) {
      getTxnData();
    }
  }, []);

  const getSliderColor = (name) => {
    switch (name) {
      case 'TOTAL':
        return '#1C2E46';
      case 'SUCCESS':
        return '#00BF78';
      case 'PENDING':
        return '#F08D17';
      default:
        return '#DC5F5F';
    }
  };

  return (
    <Card 
      sx={{ 
        width: { xs: '100%', sm: 400 },  // Responsive width
        height: { xs: 'auto', sm: 400 },  // Responsive height
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'start',
        marginTop: 1.5,
        marginRight: { xs: 0, sm: 5 }, // Adjust margin for smaller screens
        padding: { xs: 1, sm: 2 }, // Responsive padding
      }}
    >
      <CardContent>
        <Typography 
          sx={{ 
            color: "#18181B", 
            fontWeight: "700", 
            fontSize: { xs: '16px', sm: '18px' } // Responsive font size
          }}
        >
          Traffic Sources
        </Typography>
        <Box sx={{ mt: 2 }}>
          {txnData.map((item) => (
            <Box key={item.name} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: getSliderColor(item.name), // Set color dynamically
                    mr: 1 
                  }}
                />
                <Typography variant="body2" sx={{ flex: 1, color:"#18181B", textAlign:"start" }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {item.balance}
                </Typography>
              </Box>
              <Slider
                value={parseFloat(item.balance)}
                aria-labelledby="continuous-slider"
                sx={{
                  color: getSliderColor(item.name),
                  '& .MuiSlider-thumb': {
                    display: 'none',
                  },
                  '& .MuiSlider-rail': {
                    width: '100%',  // Full width for responsiveness
                  },
                  '& .MuiSlider-track': {
                    height: 6, 
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TrafficSources;
