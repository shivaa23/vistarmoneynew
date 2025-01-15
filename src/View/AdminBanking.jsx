import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import AuthContext from "../store/AuthContext";
import CustomTabs from "../component/CustomTabs";
import AdminBanksView from "./AdminBanksView";
import AdminAccountsView from "./AdminAccountsView";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import UnclaimedEntries from "../component/UnclaimedEntries";
const AdminBanking = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    {
      label: "Banks",
      content: <AdminBanksView />,
      icon: <AssuredWorkloadIcon />,
    },

    {
      label: "Accounts",
      content: <AdminAccountsView />,
      icon: <AssignmentIndIcon />,
    },
    {
      label: "Pending Entries",
      content: <UnclaimedEntries />,
      icon: <AssignmentIndIcon />,
    },
    // { label: "Prabhu Transfer", content: <AdminPraBhu  /> },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTabs tabs={tabs} value={value} onChange={handleChange} />
    </Box>
  );
};

export default AdminBanking;
