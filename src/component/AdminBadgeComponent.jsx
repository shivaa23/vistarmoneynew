import { Badge, Grid, styled } from "@mui/material";
import React from "react";
import { complaintsBadgeIcon, creditReqBadgeIcon } from "../iconsImports";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { get } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { useCallback } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 6,
    top: 4,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const AdminBadgeComponent = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const [count, setCount] = useState({
    credit: "0",
    complain: "0",
  });

  const getCount = useCallback(() => {
    get(
      ApiEndpoints.GET_COUNT,
      "",
      () => {},
      (res) => {
        setCount((prev) => ({
          credit: res.data.data.credit,
          complain: res.data.data.complain,
        }));
      },
      (err) => {}
    );
  }, []);

  useEffect(() => {
    getCount();
    return () => {};
  }, [getCount, user]);

  const BadgeButton = ({ Icon, pageUrl }) => {
    return (
      <img
        src={Icon}
        alt="badge"
        style={{ width: "45px" }}
        onClick={() => navigate(pageUrl)}
        className="only-cursor"
      />
    );
  };

  return (
    <Grid>
      {" "}
      <StyledBadge
        badgeContent={count?.credit ?? 0}
        color="error"
        className="mx-2"
      >
        <BadgeButton Icon={creditReqBadgeIcon} pageUrl={"/admin/cred-req"} />
      </StyledBadge>
      <StyledBadge
        badgeContent={count?.complain ?? 0}
        color="warning"
        className="mx-2"
      >
        <BadgeButton Icon={complaintsBadgeIcon} pageUrl={"/admin/complaints"} />
      </StyledBadge>
    </Grid>
  );
};

export default AdminBadgeComponent;
