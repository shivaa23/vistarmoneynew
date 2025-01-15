import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import AuthContext from "../store/AuthContext";
import CustomTabs from "../component/CustomTabs";

import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AdminUtility from "./AdminUtility";
import AdminDmtSchema from "./AdminDmtSchema";
import AdminPayoutSchema from "./AdminPayoutSchema";
import AdminAepsSchema from "./AdminAepsSchema";
import AdminCardSchema from "./AdminCardSchema";
import AdminBankSchema from "./AdminBankSchema";
const AdminSchema = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [value, setValue] = useState(0); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: "Utility Scheme", content: <AdminUtility/> ,icon:<AssuredWorkloadIcon />},
    { label: "Dmt Scheme", content: <AdminDmtSchema />,icon:<AssignmentIndIcon/> },

    { label: "Payout Scheme", content: <AdminPayoutSchema />,icon:<AssignmentIndIcon/> },
    { label: "Aeps Scheme", content: <AdminAepsSchema />,icon:<AssignmentIndIcon/> },
    { label: "Card Scheme", content: <AdminCardSchema />,icon:<AssignmentIndIcon/> },
    { label: "Bank Scheme", content: <AdminBankSchema />,icon:<AssignmentIndIcon/> },
    // { label: "Prabhu Transfer", content: <AdminPraBhu  /> },
 

  ];

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTabs
        tabs={tabs}
        value={value}
        onChange={handleChange}
       
      />
    </Box>
  );
};

export default AdminSchema;
