import { IconButton, Modal, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { CustomStyles } from "../component/CustomStyle";
import ApiEndpoints from "../network/ApiEndPoints";
import { datemonthYear } from "../utils/DateUtils";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import ApiPaginate from "../component/ApiPaginate";
import CachedIcon from "@mui/icons-material/Cached";
import AuthContext from "../store/AuthContext";

let refresh;
function refreshFunc(setQueryParams) {
  setQueryParams("");
  if (refresh) refresh();
}

const MoreNotificationModal = ({ open, setOpen, title = "Notifications" }) => {
  const [query, setQuery] = useState();
  const [apiData, setApiData] = useState([]);
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  const handleClose = () => {
    setOpen(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
    fontFamily: "Poppins",
    p: 2,
    height: "max-content",
    overflowY: "scroll",
  };
  const columns = [
    // {
    //   name: "id",
    //   selector: (row) => row.id,
    //   width: "70px",
    // },
    {
      name: "Created At",
      selector: (row) => datemonthYear(row.created_at),
      width: "140px",
    },
    // {
    //   name: "Notification Id",
    //   selector: (row) => row.notification_id,
    // },
    {
      name: "user Id",
      selector: (row) => row.user_id,
      width: "140px",
      omit: user && user.role !== "Admin",
    },
    {
      name: "Message",
      selector: (row) => row.message,
    },
    // {
    //   name: "Is Read",
    //   selector: (row) => row.is_read,
    // },
    {
      name: "Priority",
      selector: (row) =>
        row.priority === "URGENT" ? (
          <span style={{ color: "#d32f2f", fontWeight: "600" }}>
            {row.priority}
          </span>
        ) : (
          <span>{row.priority}</span>
        ),
      width: "140px",
    },
  ];
  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={style} className="sm_modal p-2">
          <ModalHeader title={title} handleClose={handleClose} />
          <Box
            sx={{
              "& .MuiTextField-root": { m: 2 },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <Tooltip title="refresh">
                <IconButton
                  aria-label="refresh"
                  color="success"
                  onClick={() => {
                    refreshFunc(setQuery);
                  }}
                >
                  <CachedIcon className="refresh-purple" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{ height: "50vh", overflowY: "scroll" }}
              className="enable-scroll"
            >
              <ApiPaginate
                apiEnd={ApiEndpoints.GET_NOTIFICATION}
                ExpandedComponent={false}
                expandVisible={false}
                setQuery={setQuery}
                columns={columns}
                tableStyle={CustomStyles}
                apiData={apiData}
                setApiData={setApiData}
                queryParam={query ? query : ""}
                returnRefetch={(ref) => {
                  refresh = ref;
                }}
              />
            </Box>
          </Box>
          <ModalFooter btn="Close" handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};

export default MoreNotificationModal;
