import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  Grid,
  IconButton,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import ApiEndpoints from "../network/ApiEndPoints";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { postJsonData } from "../network/ApiController";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import Loader from "../component/loading-screen/Loader";

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

const RaiseIssueModal = ({ row, refresh }) => {
  // console.log("refresh", refresh);
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      id: row.id,
      msg: form.issue.value,
    };
    postJsonData(
      ApiEndpoints.RAISE_ISSUE_USER,
      data,
      setRequest,
      (res) => {
        okSuccessToast(res.data.message);
        handleClose();
        if (refresh) {
          // console.log("we are here in raise issue refreesh");
          refresh();
        }
      },
      (err) => {
        apiErrorToast(err);
        // console.log("we are here in raise issue refreesh");
        if (refresh) {
          refresh();
        }
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
      <IconButton onClick={handleOpen}>
        <Tooltip title="raise issue">
          <PanToolOutlinedIcon />
        </Tooltip>
      </IconButton>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader title="Raise Issue" handleClose={handleClose} />
            <Box
              component="form"
              id="raise_issue"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <Grid item md={12} xs={12} sx={{ p: 2 }}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextareaAutosize
                      id="issue"
                      aria-label="minimum height"
                      minRows={4}
                      maxRows={5}
                      placeholder="Type your issue here"
                      style={{ width: "100%" }}
                      required
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <ModalFooter btn="Submit" form="raise_issue" request={request} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default RaiseIssueModal;
