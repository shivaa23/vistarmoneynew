import React, { useContext } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AuthContext from './store/AuthContext';
import { useLocation } from 'react-router-dom';


const StatusDisplay = ({ sumData = {}, setSumData }) => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const location = useLocation();
  setSumData(true);
  console.log("sumData", sumData);

  const labelMapping = {
    a_comm: 'A Comm',
    ad_comm: 'Ad Comm',
    ad_tds: 'Ad TDS',
    amount: 'Amount',
    ret_comm: 'Ret Comm',
    ret_tds: 'Ret TDS',
  };

  const labelMappingRet = {
    amount: 'Amount',
    ret_comm: 'Ret Comm',
    ret_tds: 'Ret TDS',
  };

  const getBorderColor = (label) => {
    switch (label) {
      case 'a_comm':
      case 'ret_comm':
        return 'green';
      case 'ad_comm':
      case 'ret_tds':
        return 'blue';
      case 'ad_tds':
        return 'red';
      case 'amount':
        return 'yellow';
      default:
        return '#ccc';
    }
  };

  const getBackgroundColor = (label) => {
    switch (label) {
      case 'a_comm':
      case 'ret_comm':
        return '#ccffcc';
      case 'ad_comm':
      case 'ret_tds':
        return '#cce5ff';
      case 'ad_tds':
        return '#ffcccc';
      case 'amount':
        return '#ffffcc';
      default:
        return '#f0f0f0';
    }
  };

  if (Object.keys(sumData).length === 0) {
    return <Typography variant="h6">No data available</Typography>;
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent={
        [
          "/ad/cred-req",
          "/dd/cred-req",
          "/md/cred-req",
          "/customer/cred-req",
          "/admin/cred-req",
          "/asm/cred-req",
          "/zsm/cred-req",
        ].includes(location.pathname)
          ? 'flex-end'
          : 'space-around'
      }
      alignItems="flex-end"
      p={1}
    >
      {Object.keys(sumData).map((key, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
          mx={1}
          border={`2px solid ${getBorderColor(key)}`}
          backgroundColor={getBackgroundColor(key)}
          borderRadius={2}
          width="auto"
          height="40px"
          minWidth="150px" // Optional: ensures consistent width
        >
          <Typography
            variant="subtitle2"
            style={{ color: '#000', fontWeight: 'bold', marginRight: '8px' }}
          >
            {user.role === "Admin"
              ? labelMapping[key] || key
              : user.role === "Dd"
              ? labelMappingRet[key] || key
              : key}
          </Typography>
          <Typography variant="body2" style={{ color: '#000' }}>
            ₹ {sumData[key]}
          </Typography>
        </Box>
      ))}
    </Grid>
  );
};


export default StatusDisplay;
