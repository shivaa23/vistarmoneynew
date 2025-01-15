import React, { useState, useContext } from "react";
import { Box } from "@mui/material";
import AdminInMassegeView from "./AdminInMassegeView";
import AdminOutMassegeView from "./AdminOutMassegeView";
import AdminWebhookView from "./AdminWebhookView";
import AuthContext from "../store/AuthContext";
import CustomTabs from "../component/CustomTabs";
import AdminNotificationsView from "./AdminNotificationsView";
import MessageIcon from '@mui/icons-material/Message';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdminNews from "./AdminNews";
const AdminMessageView = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const [value, setValue] = useState(0); 

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = [
    { label: "In Message", content: <AdminInMassegeView />,icon:<MessageIcon sx={{ color: "#ee6c4d" }} /> },
    ...(user?.id.toString() === "1" ? [{ label: "Out Message", content: <AdminOutMassegeView  /> }] : []),
    { label: "WebHook", content: <AdminWebhookView />,icon:<LinkIcon sx={{ color: "#ee6c4d" }}/> },
    { label: "Notification", content: <AdminNotificationsView />,icon:<NotificationsIcon sx={{ color: "#ee6c4d" }}/>},
    { label: "News", content: <AdminNews />,icon:<NotificationsIcon sx={{ color: "#ee6c4d" }}/>},

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

export default AdminMessageView;
