import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Grid } from "@mui/material";
import LabelComponent from "./LabelComponent";
import DetailsComponent from "./DetailsComponent";

export default function NepalAdditionalInfo({ receiverDetails }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Typography
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoOutlinedIcon fontSize="small" sx={{ ml: 1, mb: 0.5 }} />
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item md={6}>
            <LabelComponent label="Bank Name" />
            <DetailsComponent detail={receiverDetails?.BankName} />
          </Grid>
          <Grid item md={6}>
            <LabelComponent label="Account Number" />
            <DetailsComponent detail={receiverDetails?.AcNumber} />
          </Grid>
          <Grid item md={6}>
            <LabelComponent label="Branch Id" />
            <DetailsComponent detail={receiverDetails?.BankBranchId} />
          </Grid>
          <Grid item md={6}>
            <LabelComponent label="Branch Name" />
            <DetailsComponent detail={receiverDetails?.BankBranchName} />
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
