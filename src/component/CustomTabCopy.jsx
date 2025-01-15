import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Tabs, Tab, Box, Typography } from '@mui/material';

function CustomTabs({ tabs, value, onChange, heading }) {
  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={onChange}
          variant="fullWidth"
          aria-label="full width tabs example"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#fcde67',
            },
            "& .MuiTab-root": {
      color: "#000",
      "& .MuiSvgIcon-root": {
        color: "#ee6c4d", 
      },
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#FE0000",
      "& .MuiSvgIcon-root": {
        color: "#FE0000", 
      },
    },
            minHeight: '30px', 
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              {...a11yProps(index)}
              sx={{
                bgcolor: 'white',
                color: 'black',
                minHeight: '30px', 
                fontSize: '0.800rem',
                padding: '6px 12px', 
                flexDirection: 'row',
                gap: '8px'
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      {heading && (
        <Box sx={{ p: 1, pb: 0.5 }}> {/* Further reduced padding, especially bottom padding */}
          <Typography variant="h5" component="h1" gutterBottom>
            {heading}
          </Typography>
        </Box>
      )}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1.5, overflow: 'auto' }}> {/* Further reduced padding */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Accessibility props
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  heading: PropTypes.string,
};

export default CustomTabs;
