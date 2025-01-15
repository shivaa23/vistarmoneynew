import { Grid, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import DataListCard from "../component/DataListCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AuthContext from "../store/AuthContext";

const AccountDashboard = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  // eslint-disable-next-line no-unused-vars
  const [cardData, setCardData] = useState([
    {
      name: "Download Users",
      title: "Active Users",
      count: "18000",
      percent: "100",
      icon: <GroupIcon />,
      color: "rgb(153, 102, 255)",
      bgColor: "#D77FA1",
      hoverbgColor: "rgb(153, 102, 255 , 0.10)",
    },
    {
      name: "Download Account Users",
      title: "Active Users",
      count: "18000",
      percent: "100",
      icon: <SwitchAccountIcon />,
      color: "rgba(255, 99, 133)",
      bgColor: "#00bf78",
      hoverbgColor: "rgb(255, 99, 133 , 0.10)",
    },

    {
      name: "Download Leadger",
      title: "All Leadger",
      count: "1500",
      percent: "0",
      icon: <EqualizerIcon />,
      color: "rgba(255, 204, 86)",
      bgColor: "#1a598d",
      hoverbgColor: "rgb(255, 204, 86 , 0.10)",
    },
    {
      name: "Download Bank Transactions",
      title: "Bank Txn",
      count: "10000",
      percent: "0",
      icon: <AccountBalanceIcon />,
      color: "rgba(255, 99, 133)",
      bgColor: "#579BB1",
      hoverbgColor: "rgb(255, 99, 133 , 0.10)",
    },
    {
      name: "Download Transactions",
      title: "All Txn",
      count: "386975",
      percent: "0",
      icon: <SyncAltIcon />,
      color: " rgb(75, 192, 192)",
      bgColor: "#FD8A8A",
      hoverbgColor: "rgb(75, 192, 192 , 0.10)",
    },
  ]);

  return (
    <>
      <Typography
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "left",
          fontFamily: "Arial !important",
        }}
      >
        Welcome, {user && user.name} Ji
      </Typography>

      <Grid container sx={{ mt: 3 }} className="flex-hc-vc">
        {cardData &&
          cardData.map((item, index) => {
            return (
              <Grid
                lg={3.5}
                md={4}
                sm={12}
                xs={12}
                sx={{ p: { md: 2 }, mt: 5 }}
              >
                <DataListCard item={item} index={index} />
              </Grid>
            );
          })}
        {/* <Box
            sx={{
              backgroundColor: "#d35400",
              color: "#fff",
              width: "100%",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              position: "relative",
              pt: 3,
            }}
          >
            <Box>
              <span className="icon-part">
                <Add />
              </span>
              <Typography sx={{ color: "#fff", mt: 3, mb: 2 }}>
                Bank Transactions
              </Typography>
            </Box>

            <Box className="glass-bg">
              <Typography>
                <DownloadIcon /> Dowload Excel
              </Typography>
            </Box>
          </Box> */}
      </Grid>
    </>
  );
};

export default AccountDashboard;
