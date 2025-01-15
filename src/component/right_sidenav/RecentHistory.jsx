import React from "react";
import useCommonContext from "../../store/CommonContext";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Grid, Button, Tooltip, Link } from "@mui/material";
import RefreshComponent from "../RefreshComponent";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../../utils/FormattingUtils";
import { currencySetter } from "../../utils/Currencyutil";
import { datemonthYear } from "../../utils/DateUtils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/ArrowDownward";
import DoneIcon from "@mui/icons-material/ArrowUpward"; // Add this import

const RecentHistory = () => {
  const { getRecentData, recentData, recentLoading } = useCommonContext();
  const navigate = useNavigate();

  return (
    <Box
      className="card-css"
      sx={{ mt: 2, px: 1, py: 1.5, borderRadius: "10px" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "500",
          fontSize: "20px",
          position: "relative",
          color: "#008ecc",
          // ml: -1,
        }}
      >
        Recent Transactions
        <RefreshComponent
          progressColor="#000"
          color="#0000ff"
          refresh={recentLoading}
          onClick={() => {
            getRecentData();
          }}
          size="1rem"
        />
      </Box>

      <Box
        style={{
          marginTop: "12px",
          overflowY: "scroll",
          overflowX: "hidden",
          paddingBottom: "0.2rem",
        }}
      >
        {recentData.map((data, index) => {
          const walletBal = Number(data.amount).toFixed(2);
          return (
            <Grid
              container
              sx={{
                borderRadius: 3,
                px: 1,
                py: 1,
                mb: 0.5,
                border: "1px solid #909090",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              key={index}
              wrap="nowrap"
            >
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {data.status === "FAILED" ? (
                  <Icon
                    title="Failed"
                    icon={
                      <CloseIcon
                        sx={{
                          fontSize: "25px",

                          color: "#ff2c2c",
                        }}
                      />
                    }
                    onClick={() => console.log("Failed clicked")}
                  />
                ) : data.status === "SUCCESS" ? (
                  <Icon
                    title="Success"
                    icon={
                      <DoneIcon sx={{ fontSize: "25px", color: "	#259625" }} />
                    }
                    onClick={() => console.log("Success clicked")}
                  />
                ) : data.status === "REFUND" ? (
                  <Icon
                    title="Refund"
                    icon={
                      <SyncIcon sx={{ fontSize: "25px", color: "#E87204" }} />
                    }
                    onClick={() => console.log("Refund clicked")}
                  />
                ) : (
                  <Icon
                    title="Pending"
                    icon={
                      <PriorityHighIcon
                        sx={{ fontSize: "25px", color: "#f48f26" }}
                      />
                    }
                    onClick={() => console.log("Other status clicked")}
                  />
                )}
              </Grid>

              <Grid
                item
                xs={7}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  color: "#004080",
                }}
              >
                <Tooltip
                  title={
                    data.operator === "Vendor Payments"
                      ? "settlements"
                      : data.operator
                  }
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100px",
                      textAlign: "left",
                      marginLeft: "6px",
                    }}
                  >
                    {data.operator === "Vendor Payments"
                      ? "settlements"
                      : data.operator}
                  </div>
                </Tooltip>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#787879",
                    marginLeft: "6px",
                    display: "flex",
                  }}
                >
                  {data.number}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#787879",
                    marginLeft: "6px",
                    display: "flex",
                  }}
                >
                  {datemonthYear(data.created_at)}
                </div>
              </Grid>

              <Grid
                item
                xs={4}
                sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
              >
                <div
                  style={{
                    color:
                      data.status === "SUCCESS"
                        ? "#478778"
                        : data.status === "PENDING"
                        ? "#f48f26"
                        : data.status === "REFUND"
                        ? "#E87204"
                        : "#ff2316",
                    fontWeight: "bold",
                    fontSize: "13px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  className="diff-font"
                >
                  <span>{data.txn_type === "DR" ? "- " : "+ "}</span>
                  {currencySetter(walletBal)}
                </div>
                <div
                  style={{
                    color:
                      data.status === "SUCCESS"
                        ? "#478778"
                        : data.status === "PENDING"
                        ? "#f48f26"
                        : data.status === "REFUND"
                        ? "#E87204"
                        : "#ff2316",
                    fontWeight: "bold",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {data.status && capitalize(data.status)}
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Box>
      <div className="flex-he-vc">
        <Link
          onClick={() => {
            navigate("/customer/transactions");
          }}
          className="link-style"
        >
          More
        </Link>
      </div>
    </Box>
  );
};

export default RecentHistory;

function Icon({ title = "Success", bgColor = "", icon, onClick }) {
  return (
    <div
      style={{
        borderRadius: "25px",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        background: bgColor,
        marginTop: "0.3rem",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Tooltip title={title}>{icon}</Tooltip>
    </div>
  );
}
