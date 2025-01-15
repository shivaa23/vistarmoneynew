import {
  Box,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { createRef, useState } from "react";
import ModalHeader from "./ModalHeader";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModalFooter from "./ModalFooter";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader"; 
import { createFileName, useScreenshot } from "use-react-screenshot";
import { Row } from "@nextui-org/react";
import virtualA from "../assets/VirtualAccount.png"
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  // overflowY: "scroll",
};

const AdminCreateVirtualAcct = ({ row, refresh ,user}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [vaData, setVaData] = useState({ vaRes: {}, vaCreated: false });
  console.log("row data in admin craete",Row)

  const handleOpen = () => {
    get(
      ApiEndpoints.GET_VIRTUAL_ACC,
      `user_id=${row.id}`,
      setLoading,
      (res) => {
        setVaData({ vaRes: res?.data?.data, vaCreated: true });
        setOpen(true);
      },
      (err) => {
        setVaData({ vaRes: {}, vaCreated: false });
        setOpen(true);
      }
    );
  };
  console.log("vadata is",vaData )

  const handleClose = () => setOpen(false);

  const createVirtualAcct = () => {
    postJsonData(
      ApiEndpoints.CREATE_VA,
      { user_id: row?.id },
      setLoading,
      (res) => {
        okSuccessToast("Virtual Account created");
        if (refresh) refresh();
        handleClose();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });

  const download = (
    image,
    { name = "virtual Acct", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  const ref = createRef(null);
  const downloadScreenshot = () => {
    takeScreenshot(ref.current).then(download);
  };

  return (
    <>
      <Tooltip title={vaData.vaCreated ?"Created VA":" Create VA "} placement="bottom">
        <IconButton onClick={handleOpen}>
          {loading ? (
            <Loader loading={loading} size={22} />
          ) : (
            <>
              {/* Conditionally render the first icon's color based on `row.vaCreate` */}
              {/* <Icon
                icon="mdi:card-account-mail-outline"
                style={{
                  fontSize: "25px",
                  color: vaData.vaCreated ? "#63b027" : "#FFAF00", // Blue if `vaCreate` is true, Red if false
                }}
              /> */}
               <img src={virtualA} alt="VirtualAccount" style={{ width: "24px", height: "24px" }} />
            </>
          )}
        </IconButton>
      </Tooltip>

      {/* Modal */}
      <Modal open={open}>
        <Box sx={style} className="sm_modal">
          <ModalHeader title="Virtual Account"subtitle="Step into the Future of Banking with Your Virtual Account!" handleClose={handleClose} />
          <Grid container ref={ref}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
              hidden={!vaData?.vaCreated}
            >
              <Tooltip title="Download">
                <IconButton sx={{ mx: 2 }} onClick={downloadScreenshot}>
                  <Icon
                    icon="lucide:download"
                    style={{ fontSize: "24px", color: "#00693E" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
            <Grid item md={12} sm={12} sx={{ my: 3 }}>
              <Typography sx={{ textAlign: "center", fontSize: "30px" }}>
                {vaData?.vaCreated
                  ? "Virtual Account present"
                  : `Create Virtual Account`}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: "25px",
                  mt: 0,
                  color: "#5E548E",
                }}
              >
                {vaData?.vaCreated ? `${vaData?.vaRes?.va}` : row.name}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  mt: 0.5,
                  fontSize: "18px",
                  color: "#5E548E",
                }}
              >
                {vaData?.vaCreated && "RATN0000500"}
              </Typography>
            </Grid>
          </Grid>
          {!vaData?.vaCreated && (
            <ModalFooter btn="create" onClick={createVirtualAcct} />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AdminCreateVirtualAcct;
