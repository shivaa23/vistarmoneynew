import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { TabContext } from '@mui/lab';
import { TrainsImage } from '../../iconsImports';

const TrainTab = () => {
 
  const { tripType } = useSelector((state) => state?.flight);
  const handlClick=()=>{
    window.open("https://www.irctc.co.in/nget/train-search", "_blank");
  }

  return (
    <TabContext value={tripType && tripType}>
      <Box
        sx={{
          backgroundImage: `url(${TrainsImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        {/* Background overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
        />

        {/* Banner Text */}
        <Typography
          variant="h3"
          sx={{ position: 'relative', zIndex: 2, mb: 2 }}
        >
          Your Journey Begins Here
        </Typography>

        {/* Image */}
      

        {/* Button */}
        <Button
          variant="contained"
          color="secondary"
        onClick={handlClick}
          sx={{
            mt: 4,
            px: 4,
            py: 2,
            fontSize: '2.25rem',
            fontWeight: 'bold',
            textTransform: 'none',
            position: 'relative',
            zIndex: 2,
            border: '2px solid white',
            // borderRadius:"5%",
            
            boxShadow: '0px 4px 15px rgba(255, 255, 255, 0.5)', // Add a subtle white shadow
            transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: '#ff5722',
              boxShadow: '0px 6px 20px rgba(255, 87, 34, 0.7)', // Increase shadow on hover for emphasis
            },
          }}
        >
          Book Your Ticket
        </Button>
      </Box>
    </TabContext>
  );
};

export default TrainTab;
