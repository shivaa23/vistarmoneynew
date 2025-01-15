import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  IconButton,
  MenuItem,
  Tooltip,
  Drawer,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import { Icon } from "@iconify/react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const IssueHandlerModal = ({ row, refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [issueStatus, setIssueStatus] = useState("OPEN");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      remark: form.remark.value,
      status: issueStatus && issueStatus,
      id: row.id,
    };
    postJsonData(
      ApiEndpoints.HANDLE_ISSUE,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        if (refresh) {
          refresh();
        }
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip
        title={row.status == "OPEN" ? "Update Complaint" : "Re-open Complaint"}
      >
        <IconButton
          onClick={handleOpen}
          sx={{ color: row.status == "OPEN" ? "#1ee383" : "#de1212" }}
        >
          <Icon icon="hugeicons:complaint" width={28} height={28} />
        </IconButton>
      </Tooltip>
      <Drawer open={open} onClose={handleClose} anchor="right">
        <Box sx={{ width: 400 }} className="sm_modal">
          <Loader loading={request} />
          <ModalHeader title="Handle Issue" handleClose={handleClose} />
          <Box
            component="form"
            id="issueHandler"
            validate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Grid container sx={{ pt: 1, height: "150px" }}>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    label="Remark"
                    id="remark"
                    size="small"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    autoComplete="off"
                    select
                    label="Status"
                    id="status"
                    size="small"
                    required
                    onChange={(e) => {
                      setIssueStatus(e.target.value);
                    }}
                    defaultValue={issueStatus && issueStatus}
                  >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{mr:"10px"}}>
          <ModalFooter form="issueHandler" request={request} btn="save" />
        </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
export default IssueHandlerModal;
