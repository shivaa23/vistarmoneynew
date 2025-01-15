import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import AuthContext from "../store/AuthContext";
import CustomTabs from "../component/CustomTabs"
import AdminOperatorView from "./AdminOperatorView";
import AdminPlanView from "./AdminPlanView";
import AdminRoutesView from "./AdminRoutesView";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RouterIcon from '@mui/icons-material/Router';
import StreetviewIcon from '@mui/icons-material/Streetview';
const AdminServices = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [value, setValue] = useState(0); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: "Operators", content: <AdminOperatorView/>,icon:< MyLocationIcon/> },
  // { label: "APiServices", content: <AdminApiServices />,icon:< DisplaySettingsIcon/>  },
    
    { label: "Plans", content: <AdminPlanView />,icon:<StreetviewIcon />  },
    { label: "Routes", content: <AdminRoutesView />,icon:<RouterIcon/>  },
   

 

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

export default AdminServices;
