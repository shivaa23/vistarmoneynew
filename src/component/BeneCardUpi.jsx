import React from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { randomColors } from "../theme/setThemeColor";
import DeleteBeneficiaryModal from "../modals/DeleteBeneficiaryModal";
import AccountVerificationUpi from "../modals/AccountVerificationUpi";
import RetUpiTransferModal from "../modals/RetUpiTransferModal";

const BeneCardUpi = ({ ben, index, mobile, getRemitterStatus }) => {
  return (
    <TableRow key={index}>
      {/* Avatar Column */}
      <TableCell align="center">
        <Box
          sx={{
            background: randomColors(
              ben?.name?.charAt(0).toUpperCase() || ben.bene_name.charAt(0).toUpperCase()
            ),
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Typography sx={{ fontSize: "24px" }}>
            {ben && ben.name
              ? ben.name.charAt(0).toUpperCase()
              : ben.bene_name.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="left">
        <Typography>{ben.bene_name ||ben.bene_nameb}</Typography>
      </TableCell>

      {/* Beneficiary Details */}
      <TableCell align="left">
        <Typography>{ben.account || ben.bene_acc}</Typography>
      </TableCell>

      {/* Verification Status */}
      <TableCell align="center">
        {ben.last_success_date ? (
          <>
            <Typography sx={{ color: "#1977f2" }}>Verified</Typography>
            <VerifiedIcon sx={{ fontSize: "17px", color: "#1977f2", mr: 0.5 }} />
          </>
        ) : (
          <AccountVerificationUpi rem_number={mobile} ben={ben} />
        )}
      </TableCell>

      {/* Money Transfer Modals */}
      <TableCell align="center">
        <RetUpiTransferModal ben={ben} rem_number={mobile} />
      </TableCell>

      {/* Delete Beneficiary Modal */}
      <TableCell align="center">
        <DeleteBeneficiaryModal
          bene={ben}
          mob={mobile}
          getRemitterStatus={getRemitterStatus}
          apiEnd="ApiEndpoints.REMOVE_BENE_UPI"
          view="expressTransfer"
        />
      </TableCell>
    </TableRow>
  );
};

export default BeneCardUpi;
