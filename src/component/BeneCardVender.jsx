import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import RetExpresTransferModal from "../modals/RetExpresTransferModal";
import ApiEndpoints from "../network/ApiEndPoints";
import DeleteBeneficiaryModal from "../modals/DeleteBeneficiaryModal";
import AccountVerificationModal from "../modals/AccountVerificationModal";
import { capitalize1 } from "../utils/TextUtil";
import { randomColors } from "../theme/setThemeColor";
import VerifiedIcon from "@mui/icons-material/Verified";

const BeneCardVender = ({
  ben,
  index,
  type,
  mobile,
  remitterStatus,
  getRemitterStatus,
  dmtValue,
  view,
}) => {
  return (
    <>
      <TableRow key={index}>
        {/* Avatar Column */}
        <TableCell align="center">
          <Box
            sx={{
              background: randomColors(
                ben?.name?.charAt(0).toUpperCase() ||
                  ben.bene_name.charAt(0).toUpperCase()
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
            <Typography sx={{ fontSize: "40px" }}>
              {ben && ben.name
                ? ben.name.charAt(0).toUpperCase()
                : ben.bene_name.charAt(0).toUpperCase()}
            </Typography>
          </Box>
        </TableCell>

        {/* Beneficiary Details */}
        <TableCell>
          <Typography>
            {ben.name ? capitalize1(ben.name) : capitalize1(ben.bene_name)}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography>{ben.account ? ben.account : ben.bene_acc}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{ben.ifsc}</Typography>
        </TableCell>

        {/* Actions */}
        <TableCell align="center">
          {/* Verified or Account Verification Modal */}
          {ben.last_success_date && ben.last_success_date !== null ? (
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <VerifiedIcon
                sx={{ fontSize: "17px", color: "#1977f2", mr: 0.5 }}
              />
              <Typography sx={{ color: "#1977f2" }}>Verified</Typography>
            </Box>
          ) : (
            <AccountVerificationModal
              ben={ben}
              rem_number={mobile}
              remitterStatus={remitterStatus}
              getRemitterStatus={getRemitterStatus}
              view={type === "express" ? "express" : "super"}
            />
          )}
        </TableCell>

        {/* Money Transfer Modals */}
        <TableCell align="center">
          <Box sx={{ display: "flex", gap: 1 }}>
            <RetExpresTransferModal
              type="NEFT"
              ben={ben}
              dmtValue={type}
              rem_number={mobile && mobile}
              rem_details={remitterStatus}
              apiEnd={
                type === "express"
                  ? ApiEndpoints.EXP_TRANSFER
                  : ApiEndpoints.SUPER_TRANSFER
              }
              view={type === "express" ? "Wallet Transfer" : "Vendor Transfer"}
            />

            <RetExpresTransferModal
              type="IMPS"
              ben={ben}
              rem_number={mobile && mobile}
              rem_details={remitterStatus}
              apiEnd={
                type === "express"
                  ? ApiEndpoints.EXP_TRANSFER
                  : ApiEndpoints.SUPER_TRANSFER
              }
              view={type === "express" ? "Wallet Transfer" : "Vendor Transfer"}
            />
            <Box sx={{ display: { md: "none", sm: "block", xs: "block" } }}>
              {ben.verificationDt && ben.verificationDt !== null ? (
                <Button
                  size="small"
                  sx={{
                    fontSize: "10px",
                    padding: "0px 5px !important",
                    textTransform: "uppercase",
                    minWidth: "59px !important",
                    color: "#00bf78",
                    fontWeight: "bold",
                  }}
                >
                  Already Verified
                </Button>
              ) : null}
            </Box>
          </Box>
        </TableCell>

        {/* Delete Beneficiary Modal */}
        <TableCell align="center">
          <DeleteBeneficiaryModal
            bene={ben}
            mob={mobile && mobile}
            getRemitterStatus={getRemitterStatus}
            apiEnd={ApiEndpoints.REMOVE_BENE_EXPRESS}
            view="expressTransfer"
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default BeneCardVender;
