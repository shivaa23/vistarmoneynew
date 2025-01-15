import { Card, Typography } from "@mui/material";
import React from "react";
import { getEnv, secondaryColor } from "../theme/setThemeColor";
import { PROJECTS } from "../utils/constants";

const PlanCardComponent = ({ plan, onClick }) => {
  const envName = getEnv();
  return (
    <Card
      onClick={onClick}
      className="card-css"
      sx={{ position: "relative", mt: 2 }}
    >
      <Typography
        className="text-white pt-1 pb-1 text-center rotate"
        sx={{
          position: "absolute",
          bottom: "0px",
          left: "-1px",
          paddingRight: "2px",
          top: "0px",
          fontSize: "12px",
          height: "101%",
          background: secondaryColor(),
        }}
      >
        Best Seller
      </Typography>
      <div className="d-flex align-items-center justify-content-between py-3 ps-3 pe-3 m-2">
        <Typography
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mr: 2,
            ms: 1.3,
          }}
        >
          <Typography sx={{ fontSize: "13px" }} className="text-secondary">
            Validity
          </Typography>
          <Typography sx={{ fontSize: "10px" }}>
            {plan && plan.validity}
          </Typography>
        </Typography>
        <Typography
          className=""
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            width: "200px",
          }}
        >
          <Typography sx={{ fontSize: "13px" }} className="text-secondary">
            {envName === PROJECTS.moneyoddr ? "Plans" : "Data"}
          </Typography>
          <Typography sx={{ fontSize: "10px" }}>
            {plan && plan.description}
          </Typography>
        </Typography>
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            borderLeft: "2px solid #d3d3d3",
          }}
        >
          <Typography
            className="text-center ps-2 fw-bolder"
            sx={{ color: secondaryColor(), minWidth: "60px" }}
          >
            <span className="diff-font">₹</span> {plan && plan.plan}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default PlanCardComponent;
