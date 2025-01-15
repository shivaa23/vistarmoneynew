import { TabContext } from '@mui/lab'
import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { back, BusesImage } from '../../iconsImports';
const BusTab = ({resetView}) => {
    const { tripType } = useSelector((state) => state?.flight);
    const handleBack=()=>{
      resetView(false)
    }
  return (
   <> 
   <TabContext value={tripType && tripType}>
   <Grid
                   
                   item xs={12} sm="auto"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
            mr:2,
                mt:1
                  }}
                >
                  <Button
                    size="small"
                    id="verify-btn"
                    className="button-props"
                    onClick={handleBack}
                  >
                    <span style={{ marginRight: "5px" }}>Home</span>
                    <img
                      src={back}
                      alt="back"
                      style={{ width: "18px", height: "20px" }}
                    />
                  </Button>
                  </Grid>

   <Box
        sx={{
          backgroundImage: `url(${BusesImage})`,
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
     
     <Grid>
     <Typography
      variant="h3"
      sx={{
        position: 'relative',
        zIndex: 2,
        mb: 2,
        color: '#ff5722', // Highlight color
        fontWeight: 'bold', // Bold text
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // Text shadow
        textTransform: 'uppercase', // Optional: Uppercase text
        transition: 'transform 0.3s ease, color 0.3s ease', // Transition effects
        '&:hover': {
          transform: 'scale(1.05)', // Slight scale on hover
          color: '#ffab40', // Change color on hover
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)', // Increase shadow on hover
        },
      }}
    >
      Coming Soon
    </Typography>


     </Grid>
     </Box>

   </TabContext>
   </>
  )
}

export default BusTab
