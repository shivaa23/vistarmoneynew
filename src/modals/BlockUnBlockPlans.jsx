import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, Grid, Tooltip, Typography, IconButton } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { info } from "../iconsImports";
import ApiEndpoints from "../network/ApiEndPoints";
import { postFormData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { useState } from "react";
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

const BlockUnBlockPlans = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);

  const blockUnblock = (event) => {
    event.preventDefault();
    postFormData(
      ApiEndpoints.BLOCK_UNBLOCK_PLANS,
      { id: row.id },
      setRequest,
      (res) => {
        handleClose();
        okSuccessToast("data saved");
      },
      (error) => {
        apiErrorToast("error=>", error);
      }
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", mr: 3 }} onClick={handleOpen}>
        {row.status === 1 ? (
          <Tooltip title="Active">
            <IconButton sx={{ color: "#00BF78" }}>
              <Icon
                icon="material-symbols:lock-open-right-outline"
                width={26}
                height={26}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="In-Active">
            <IconButton sx={{ color: "#DC5F5F" }}>
              <Icon icon="rivet-icons:lock-closed" width={25} height={25} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <Loader loading={request} />
            <ModalHeader
              title="Active In-Active User"
              handleClose={handleClose}
            />
            <Box
              component="form"
              id="blockUnblockId"
              noValidate
              autoComplete="off"
              onSubmit={blockUnblock}
              className="text-center"
              sx={{
                "& .MuiTextField-root": { m: 2 },
                objectFit: "contain",
                display: "grid",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={info}
                  sx={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    objectPosition: "100% 0",
                  }}
                  alt="logo"
                />
              </Box>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                {row.status !== 1 ? "Active Plan!!" : "In-Active Plan!!"}
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {row.status !== 1
                  ? "Do you want to Activate plan of " + row.plan
                  : "Do you want to In-Activate plan of " + row.plan}
              </Typography>
              <Grid
                item
                md={12}
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              ></Grid>
            </Box>
            <Box sx={{mr:"10px"}}>
            <ModalFooter
              form="blockUnblockId"
              request={request}
              btn="Proceed"
            />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default BlockUnBlockPlans;
