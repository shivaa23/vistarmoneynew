import React from "react";
import {
  Box,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import RetExpresTransferModal from "../modals/RetExpresTransferModal";
import ApiEndpoints from "../network/ApiEndPoints";
import DeleteBeneficiaryModal from "../modals/DeleteBeneficiaryModal";
import AccountVerificationModal from "../modals/AccountVerificationModal";
import { capitalize1 } from "../utils/TextUtil";
import { randomColors } from "../theme/setThemeColor";
import VerifiedIcon from "@mui/icons-material/Verified";
import PortBeneficiaries from "../modals/PortBeneficiaries";
import RetMoneyTransferModal from "./RetMoneyTransferModal";

const BeneTableComponent = ({
  ben,
  index,
  type,
  mobile,
  remitterStatus,
  getRemitterStatus,
  dmtValue,
  view,
}) => {
  console.log("view", view);
  return (
    <TableRow key={index}>
      {/* Avatar Column */}
      <TableCell align="center">
        <Box
          sx={{
            background: randomColors(
              ben?.name?.charAt(0).toUpperCase() ||
                ben?.bene_name.charAt(0).toUpperCase()
            ),
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Typography sx={{ fontSize: "15px" }}>
            {ben?.name?.charAt(0).toUpperCase() ||
              ben?.bene_name.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      </TableCell>

      {/* Beneficiary Details */}
      <TableCell>
        <Typography style={{ fontSize: "15px" }}>
          {ben?.name ? capitalize1(ben?.name) : capitalize1(ben?.bene_name)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography style={{ fontSize: "15px" }}>
          {ben?.account || ben?.bene_acc}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography style={{ fontSize: "15px" }}>{ben.ifsc}</Typography>
      </TableCell>

      {/* Actions */}
      <TableCell align="center">
        {/* Verified or Account Verification Modal */}
        {(ben?.verificationDt && ben?.verificationDt !== null) ||
        ben?.verified === "1" ||
        ben?.status === 1 ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <VerifiedIcon
              sx={{ fontSize: "15px", color: "#1977f2", mr: 0.5 }}
            />
            <Typography sx={{ color: "#1977f2" }}>Verified</Typography>
          </Box>
        ) : (
          <AccountVerificationModal
            ben={ben}
            rem_number={mobile}
            remitterStatus={remitterStatus}
            getRemitterStatus={getRemitterStatus}
            type={dmtValue}
          />
        )}
      </TableCell>

      {/* Money Transfer Modals */}
      <TableCell align="center">
        {/* <Box sx={{ display: "flex", gap: 1.3 }}>
          <RetExpresTransferModal
            dmtValue={dmtValue}
            type="NEFT"
            ben={ben}
            rem_number={mobile}
            rem_details={remitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
            remDailyLimit={remitterStatus?.limitDetails?.availableDailyLimit}
          />
     
          <RetExpresTransferModal
            type="IMPS"
            ben={ben}
            rem_number={mobile}
            rem_details={remitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
          />
          <PortBeneficiaries
            ben={ben}
            dmtValue={type}
            remitterStatus={remitterStatus}
            getRemitterStatus={getRemitterStatus}
            view={view}
          />
        </Box> */}

        <Box sx={{ display: "flex", gap: 1.3 }}>
          <RetMoneyTransferModal
            type="NEFT"
            ben={ben}
            rem_number={mobile && mobile}
            rem_details={remitterStatus}
            dmtValue={type}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
          />
          <RetMoneyTransferModal
            type="IMPS"
            ben={ben}
            dmtValue={type}
            rem_number={mobile && mobile}
            rem_details={remitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.DMR_MONEY_TRANSFER
                : ApiEndpoints.DMT2_MT
            }
            view="Money Transfer"
            limit_per_txn={
              remitterStatus.limitPerTransaction
                ? remitterStatus.limitPerTransaction
                : 5000
            }
          />
          <PortBeneficiaries
            ben={ben}
            dmtValue={type}
            remitterStatus={remitterStatus}
            getRemitterStatus={getRemitterStatus}
            view={view}
          />
        </Box>
      </TableCell>

      {/* Delete Beneficiary Modal */}
      <TableCell align="center">
        <Box sx={{ display: "flex", gap: 1 }}>
          <DeleteBeneficiaryModal
            dmtValue={type}
            bene={ben}
            mob={mobile}
            getRemitterStatus={getRemitterStatus}
            apiEnd={
              type === "dmt1"
                ? ApiEndpoints.REMOVE_BENE
                : ApiEndpoints.DMT2_REM_BENE
            }
            view="moneyTransfer"
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default BeneTableComponent;
