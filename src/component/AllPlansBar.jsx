import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Divider, Tooltip, Typography } from "@mui/material";
import PlanCardComponent from "./PlanCardComponent";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useState } from "react";
import { apiErrorToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import { primaryColor, getEnv } from "../theme/setThemeColor";
import NoDataView from "./NoDataView";
import InfoIcon from "@mui/icons-material/Info";

const AllPlansBar = ({ onClick, operator = "VOD" }) => {
  const [state, setState] = useState({
    right: false,
  });
  const [request, setRequest] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [paginate, setPaginate] = useState(30);
  const envName = getEnv();
  const getPlans = () => {
    get(
      ApiEndpoints.GET_PLANS,
      `paginate=${paginate}&operator=${operator}`,
      setRequest,
      (res) => {
        setPlanList(res.data.data.data);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const toggleDrawer =
    (anchor, open, plan = null) =>
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
      if (open) getPlans();
      if (onClick) onClick(plan);
    };

  const list = (anchor) => (
    <Box
      sx={{
        width: "400px",
        mt: 8,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      role="presentation"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        }}
      >
        <ArrowBackIcon
          onClick={toggleDrawer("right", false, null)}
          sx={{ fontSize: "18px", fontWeight: "bold", color: primaryColor() }}
        />
        <Typography
          sx={{
            ml: 0.5,
            fontSize: "18px",
            fontWeight: "bold",
            color: primaryColor(),
          }}
        >
          {operator} Tariff Plans
        </Typography>
      </div>
      <Box
        sx={{
          fontSize: "10px",
          color: "#851414",
          backgroundColor: "rgba(220, 95, 95, 0.10) !important",
          px: 1.2,
          py: 2,
          fontWeight: "bold",
        }}
      >
        <Tooltip title="Plans may have changed. Kindly verify with your service provider before continuing">
          <InfoIcon sx={{ fontSize: "15px", mr: 0.6 }} />
        </Tooltip>
        Plans may have changed. kindly verify with your service provider before
        continuing
      </Box>
      <Divider color={primaryColor()} />
      <Box className="enable-scroll" sx={{ mt: 0 }}>
        <Loader loading={request} />
        {planList && planList.length > 0 ? (
          <div>
            {planList &&
              planList.map((plan, index) => {
                return (
                  <PlanCardComponent
                    key={index}
                    plan={plan}
                    onClick={toggleDrawer("right", false, plan)}
                  />
                );
              })}
          </div>
        ) : (
          <div>
            <NoDataView msg="No Data Found Please Contact To Your Service Provider!" />
          </div>
        )}
        {/* {planList &&
          planList.length > 0 &&
          planList.map((plan, index) => {
            return (
              <PlanCardComponent
                key={index}
                plan={plan}
                onClick={toggleDrawer("right", false, plan)}
              />
            );
          })} */}
      </Box>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer("right", true)}>Plans</Button>
      <SwipeableDrawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {list("right")}
      </SwipeableDrawer>
    </div>
  );
};

export default AllPlansBar;
