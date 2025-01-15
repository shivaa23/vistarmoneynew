import * as React from "react";
import Box from "@mui/material/Box";
import { IconButton, Tooltip, Modal } from "@mui/material";
import { Icon } from "@iconify/react";
import ModalHeader from "./ModalHeader";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import { apiErrorToast } from "../utils/ToastUtil";
import ModalFooter from "./ModalFooter";
import { useState } from "react";
import axios from "axios";
import AuthContext from "../store/AuthContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
const ViewModal = ({ row, refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const authCtx = React.useContext(AuthContext);
  const token = authCtx.token;
  console.log("user", token);
  const handleOpen = () => {
    setOpen(true);
    fetchImage();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const requestImage = row?.request_image || "defaultFileName";
  const getImage = async (fileName) => {
    const headers = {
      Authorization: `Bearer ${token}`, // Typically, token is sent as a Bearer token
    };
    console.log("base usrl is ", BASE_URL);

    try {
      const response = await axios.post(
        `${BASE_URL}/${ApiEndpoints.GET_FILES}`,
        { fileName },
        { responseType: "blob", headers: headers }
      );

      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };
  const fetchImage = async () => {
    const fileName = requestImage; // Replace with your actual file name
    const url = await getImage(fileName);
    if (url) setImageUrl(url);
  };
  // const getFile = () => {
  //   const requestImage = row?.request_image || "defaultFileName";

  //   const payload = {
  //     fileName: requestImage,
  //   };

  //   postJsonData(
  //     ApiEndpoints.GET_FILES,
  //     payload,
  //     setRequest,
  //     (res) => {
  //       if (res && res.data) {
  //         setData(res.data);
  //       } else {
  //         console.error("Invalid response data:", res);
  //       }
  //     },
  //     (err) => {
  //       console.error("Network Error:", err);
  //     },
  //     (error) => {
  //       apiErrorToast(error);
  //     }
  //   );
  // };

  console.log("The data of image is ", data);

  return (
    <>
      <Tooltip title="Reciept View">
        <IconButton
          onClick={handleOpen}
          sx={{
            color: "#5234ea",
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>

      <Box>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40%",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
            }}
          >
            <ModalHeader
              // subtitle="Take Action: Quick and Simple Fund Request!"
              title="Reciept View"
              handleClose={handleClose}
            />
            <Box sx={{ textAlign: "center" }}>
              <div>
                {/* <button onClick={fetchImage}>Load Image</button> */}
                {imageUrl && <img style={{ width: "30%" }} src={imageUrl} alt="Fetched Image" />}

              </div>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ViewModal;
