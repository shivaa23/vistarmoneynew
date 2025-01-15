import React, { useState } from 'react';
import CustomTabs from '../CustomTabs';
import { adminTab, adTab, asmTab, mdTab, zsmTab } from '../../utils/constants';

// Helper function to convert string to Sentence Case
const toSentenceCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const AdminUserTab = ({ setQuery, user,setRefreshTab,refreshTab }) => {
  // const [refreshTab, setRefreshTab] = useState(0);
  setRefreshTab(refreshTab)
  // Helper function to get the appropriate tab array based on user role
  const getTabByRole = (role) => {
    switch (role) {
      case "Admin":
        return adminTab;
      case "Asm":
        return asmTab;
      case "Zsm":
        return zsmTab;
      case "Md":
        return mdTab;
    
      default:
        return [];
    }
  };
 

  const handleChange = (event, newValue) => {
    setRefreshTab(newValue);
   
    const currentTabs = getTabByRole(user?.role);
    const selectedTab = currentTabs.find((tab) => tab.value === newValue);
    const selectedTabLabel = selectedTab ? selectedTab.label : "";

    // Set query based on label, convert to Sentence Case
    if (selectedTabLabel === "All") {
      setQuery("");
    } else if (selectedTabLabel === "Corporates") {
      setQuery("role=Api");
    } else {
      const sentenceCaseLabel = toSentenceCase(selectedTabLabel);
      setQuery(`role=${sentenceCaseLabel}`);
    }
  };

  const tabs = getTabByRole(user?.role);

  return (
    <CustomTabs
      tabs={tabs}
      value={refreshTab}
      onChange={handleChange}
    />
  );
};

export default AdminUserTab;
