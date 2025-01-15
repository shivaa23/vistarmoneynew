// import * as React from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import {
//   FormControl,
//   Grid,
//   IconButton,
//   TextareaAutosize,
//   Tooltip,
// } from "@mui/material";
// import ApiEndpoints from "../network/ApiEndPoints";
// import ModalHeader from "./ModalHeader";
// import ModalFooter from "./ModalFooter";
// import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
// import { postJsonData } from "../network/ApiController";
// import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
// import Loader from "../component/loading-screen/Loader";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "40%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   fontFamily: "Poppins",
//   height: "max-content",
//   overflowY: "scroll",
//   p: 2,
// };

// const RatingModal = () => {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "end",
//       }}
//     >
//       <IconButton onClick={handleOpen}>
//         <Tooltip title="raise issue">
//           <PanToolOutlinedIcon />
//         </Tooltip>
//       </IconButton>

//       <Box>
//         <Modal
//           open={open}
//           onClose={handleClose}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style} className="sm_modal">
//             {/* <Loader loading={request} /> */}
//             <ModalHeader title="Give Us Rating" handleClose={handleClose} />
//             hh
//             <ModalFooter btn="Submit" form="rating" />
//           </Box>
//         </Modal>
//       </Box>
//     </Box>
//   );
// };
// export default RatingModal;
