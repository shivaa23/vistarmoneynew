import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ModalHeader from "../ModalHeader";
import Mount from "../../component/Mount";
import CommonSnackBar from "../../component/CommonSnackBar";
import { Icon } from "@iconify/react";
import ModalFooter from "../ModalFooter";
import { whiteColor } from "../../theme/setThemeColor";

const copyStyle = {
  background: "rgba( 255, 255, 255, 0.25 )",
  boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
  backdropFilter: "blur( 4px )",
  borderRadius: "10px",
  border: "1px solid rgba( 255, 255, 255, 0.18 )",
  // position: "absolute",
  position: "sticky",
  top: "0px",
  "&:hover": {
    cursor: "pointer",
  },
};

const CodeComponent = ({ title = "", data = "", codeStyle }) => {
  return (
    <Mount visible={data && data}>
      <Grid>
        <Typography>{title}</Typography>
        <Box className="enable-scroll" sx={codeStyle}>
          <Box
            sx={{
              width: "90%",
            }}
          >
            <pre>
              {JSON.stringify(
                JSON.parse(JSON.stringify(data && data)),
                null,
                2
              )}
            </pre>
          </Box>
          <CommonSnackBar
            input={JSON.stringify(
              JSON.parse(JSON.stringify(data && data)),
              null,
              2
            )}
            sx={{
              mt: 0,
              mr: 0,
            }}
          >
            <Icon icon="uil:file-copy-alt" width={40} sx={copyStyle} />
          </CommonSnackBar>
        </Box>
      </Grid>
    </Mount>
  );
};
const AdminReqResModal = ({ title = "Request Response", data }) => {
  const [open, setOpen] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    height: "max-content",
    overflowY: "scroll",
    p: 2,
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const codeStyle = {
    borderRadius: "4px",
    width: "100%",
    wordWrap: "break-word",
    color: "#fff",
    backgroundColor: "#000",
    letterSpacing: "1px",
    height: "350px",
    overflowY: "scroll",
    p: 3,
    mt: 1,
    // position: "relative",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  };

  return (
    <>
      <Tooltip title="Add Account">
        <Button
          variant="outlined"
          // className="button-transparent"
          className="refresh-icon-risk"
          onClick={handleOpen}
          sx={{ py: 0.3, fontSize: "13px" }}
        >
          Req & Res
        </Button>
      </Tooltip>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="sm_modal">
          <ModalHeader title={title} handleClose={handleClose} />
          <Mount visible={false}>
            <Typography>No Response Found !!!!!!!!</Typography>
          </Mount>
          <Mount visible={true}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={12}>
                <CodeComponent
                  title="Status Response"
                  data={JSON.parse(data)}
                  codeStyle={codeStyle}
                />
              </Grid>
            </Grid>
          </Mount>
          <ModalFooter handleClose={handleClose} />
        </Box>
      </Modal>
    </>
  );
};

export default AdminReqResModal;
