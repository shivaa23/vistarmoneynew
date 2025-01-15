// CustomDrawer.jsx
import React from 'react';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

const CustomDrawer = ({ open, onClose, rowData }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={onClose} // Close the drawer when clicking inside
        onKeyDown={onClose}
      >
        <Typography variant="h6" sx={{ padding: 2 }}>
          Drawer Content
        </Typography>
        <Typography variant="body1" sx={{ padding: 2 }}>
          {rowData ? JSON.stringify(rowData) : 'No data selected'}
        </Typography>
        {/* You can add more content or components here */}
        <IconButton onClick={onClose} sx={{ color: "#00693E" }}>
          <Icon icon="ic:round-close" width={26} height={26} />
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
