// import * as React from "react";
// import PropTypes from "prop-types";
// import { useTheme } from "@mui/material/styles";
// import AppBar from "@mui/material/AppBar";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import SearchTransaction from "../../../component/prabhu_transfer/SearchTransaction";
// import UnvirifiedCustomers from "../../../component/prabhu_transfer/UnverifiedCustomers";
// import PrabhuCharge from "./PrabhuCharge";

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && (

//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `prabhu-transfer-tab-${index}`,
//     "aria-controls": `prabhu-transfer-tabpanel-${index}`,
//   };
// }

// export default function FullWidthTabs() {
//   const theme = useTheme();
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const handleChangeIndex = (index) => {
//     setValue(index);
//   };

//   return (
//     <Box sx={{ bgcolor: "background.paper" }}>
//       <AppBar position="static" className="table-container">
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           // indicatorColor="secondary"
//           sx={{
//             backgroundImage : `linear-gradient(90deg, #0077c0 0%, #00aaff 100%);`,
//             maxHeight:"60px",
//           }}
//           textColor="inherit"
//           variant="fullWidth"
          
//           aria-label="prabhu-transfer tabs"
//         >
//           <Tab label="Search Transactions" {...a11yProps(0)} />
//           <Tab label="Unverified Customers" {...a11yProps(1)} />
//           <Tab label="Unverified Transactions" {...a11yProps(2)} />
//           <Tab label="Prabhu Charges" {...a11yProps(3)} />
//         </Tabs>
//       </AppBar>
//       <TabPanel value={value} index={0} dir={theme.direction}>
//         <SearchTransaction />
//       </TabPanel>
//       <TabPanel value={value} index={1} dir={theme.direction}>
//         <UnvirifiedCustomers />
//       </TabPanel>
//       <TabPanel value={value} index={2} dir={theme.direction}>
//         Unverified Transactions
//       </TabPanel>
//       <TabPanel value={value} index={3} dir={theme.direction}>
//         <PrabhuCharge />
//       </TabPanel>
//     </Box>
//   );
// }
import React, { useState } from 'react';
import CustomTabs from '../../../component/CustomTabs';
import { mt_tab_value } from '../../../utils/constants';
import SearchTransaction from "../../../component/prabhu_transfer/SearchTransaction";
 import UnvirifiedCustomers from "../../../component/prabhu_transfer/UnverifiedCustomers";
 import PrabhuCharge from "./PrabhuCharge";
 import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
 import NoAccountsRoundedIcon from '@mui/icons-material/NoAccountsRounded';
 import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded';
 import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
 export default function AdminPrabhuTrans() {
  const [value, setValue] = useState(0);
const [currentType, setCurrentType] = useState()
  const tabs = [
    { label: "SEARCH TRANSACTIONS", content: <SearchTransaction type={currentType} />,icon:<ManageSearchRoundedIcon  sx={{ color: "#ee6c4d" }}/> },
    { label: "UNVERIFIED CUSTOMERS", content: <UnvirifiedCustomers type={currentType} />,icon:<NoAccountsRoundedIcon  sx={{ color: "#ee6c4d" }}/>  },
    { label: "UNVERIFIED TRANSACTIONS",icon:<RemoveModeratorIcon  sx={{ color: "#ee6c4d" }}/>},
    { label: "PRABHU CHARGES", content:<PrabhuCharge type={currentType} /> ,icon:<DataUsageRoundedIcon  sx={{ color: "#ee6c4d" }}/>},

  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentType(mt_tab_value[newValue])
  };
console.log("type",currentType);
  return (
    <CustomTabs
      tabs={tabs}
      value={value}
      onChange={handleChange}

    />
  );
}

