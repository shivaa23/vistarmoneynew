import { Box, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import CustomTabs from "../component/CustomTabs";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import AdminAccountLimit from "./AdminAccountLimit";
import { useTheme } from "@mui/material/styles";
import AdminBlockedAc from "./AdminBlockedAc";
import { mt_tab_value } from "../utils/constants";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}

let refreshFilter;

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
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
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

const AdminRiskView = () => {
  const theme = useTheme();
  const [query, setQuery] = useState();
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState();
  console.log("set value is hear",value)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentType(mt_tab_value[newValue]);
  };

  const tabs = [
    { label: "Account",icon:<LabelImportantIcon/>, content: <AdminAccountLimit />, },
    
    // { label: "Settelments",icon:<SettingsInputAntennaIcon/>, content: <AdminSettelments />,  },
    // { label: "Virtual transaction",icon:<SettingsInputAntennaIcon/>, content: <AdminVirtualAccounts/>,  },
    { label: "Blocked Account",icon:<SettingsInputAntennaIcon/>, content: <AdminBlockedAc />,  },
    // {
    //   label: "VIRTUAL ACCOUNTS",
    //   content: <AdminVirtualAccounts value={value}/>,
    //   icon: <ManageAccountsRoundedIcon  />,
    // },
    // { label: "VIRTUAL TRANSACTIONS", content: <AdminVirtualAccounts value={value}/>, icon: <CurrencyRupeeIcon /> },
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

export default AdminRiskView;
