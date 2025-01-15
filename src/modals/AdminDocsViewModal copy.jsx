// /* eslint-disable no-unused-vars */
// import { Box, Button, Grid, IconButton, Modal, Tooltip } from "@mui/material";
// import React, { useState } from "react";
// import ModalHeader from "./ModalHeader";
// import MyButton from "../component/MyButton";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import LabelComponent from "../component/LabelComponent";
// import DetailsComponent from "../component/DetailsComponent";
// import { maskFunction } from "../utils/MaskingUtil";
// import {  postJsonData } from "../network/ApiController";
// import ApiEndpoints from "../network/ApiEndPoints";
// import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
// import Loader from "../component/loading-screen/Loader";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import UploadIcon from '@mui/icons-material/Upload';


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '70%',
//   bgcolor: '#ffffff',
//   borderRadius: '12px',
//   boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
//   p: 4,
//   maxHeight: '80vh',
//   overflowY: 'auto',
// };

// const AdminDocsViewModal = ({ row, refresh }) => {
//   // console.log("row,", row);
//   const { aadhaar_image, pan_image, id, is_aadhaar_verified, is_pan_verified } =
//     row;
//   const [open, setOpen] = React.useState(false);
//   const [secondOpen, setSecondOpen] = React.useState(false);
//   const [req, setReq] = useState(false);
//   const [aadhaarFile, setAadhaarFile] = useState();
//   const [panFile, setPanFile] = useState();
//   const [vAadhaarLoader, setVAadhaarLoader] = useState(false);
//   const [rAadhaarLoader, setRAadhaarLoader] = useState(false);
//   const [vPanLoader, setVPanLoader] = useState(false);
//   const [rPanLoader, setRPanLoader] = useState(false);
//   const [kycImages, setKycImages] = useState(JSON.parse(row?.kyc_images))
//   const [imageSrc, setImageSrc] = useState(null);  // State to hold the image source URL

//   const getDocs = (filename) => {
//     if (!kycImages || typeof kycImages !== 'object') {
//         console.error("Invalid kycImages object:", kycImages);
//         return;
//     }
//     if (!kycImages[filename]) {
//         console.error(`File ${filename} does not exist in kycImages.`);
//         return;
//     }

//     postJsonData(
//         ApiEndpoints.GET_FILES,
//         { fileName: kycImages[filename] },
//         setReq,
//         (res) => {
//             console.log("Fetched image data:", res);

//             // Check if response is base64 encoded or binary data
//             if (typeof res.data === 'string') {
//                 console.log("Response data is a string:", res.data);

//                 // If base64, process it accordingly
//                 try {
//                     const byteCharacters = atob(res.data);
//                     const byteArrays = [];
//                     for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
//                         const slice = byteCharacters.slice(offset, offset + 1024);
//                         const byteNumbers = new Array(slice.length);
//                         for (let i = 0; i < slice.length; i++) {
//                             byteNumbers[i] = slice.charCodeAt(i);
//                         }
//                         byteArrays.push(new Uint8Array(byteNumbers));
//                     }

//                     const blob = new Blob(byteArrays, { type: 'image/jpeg' });
//                     const blobUrl = URL.createObjectURL(blob);

//                     // Set the Blob URL to the state
//                     setImageSrc(blobUrl);
//                     console.log("Generated Blob URL:", blobUrl);

//                 } catch (error) {
//                     console.error("Error processing the base64 string:", error);
//                 }
//             } else {
//                 console.error("Response data is not valid image data.");
//             }
//         },
//         (err) => {
//             console.error("API request failed:", err);
//             apiErrorToast(err);
//         }
//     );
// };
  
//   console.log("Fetched Image",imageSrc);

//   // console.log("imageSrc",imageSrc);
  
//   const onSelectFile = (e, type) => {
//     if (!e.target.files) {
//       if (type === "aadhaar") {
//         setAadhaarFile(undefined);
//       } else {
//         setPanFile(undefined);
//       }
//       return;
//     } else {
//       if (type === "aadhaar") {
//         setAadhaarFile(e.target.files[0]);
//       } else {
//         setPanFile(e.target.files[0]);
//       }
//     }
//   };

//   const handleAadhaarPanUpload = () => {

//     const formData = new FormData();

//     if (aadhaarFile) {
//       formData.append("aadhaar_image", aadhaarFile);
//     }
//     if (panFile) {
//       formData.append("pan_image", panFile);
//     }
//     // postFormData()
//   };

//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => setOpen(false);

//   const verifyOrRejectPan = (e, type) => {
//     e.preventDefault();
//     if (type === "verify") {
//       postJsonData(
//         `${ApiEndpoints.VERIFY_PAN}?id=${id}`,
//         { is_pan_verified: 1 },
//         setVPanLoader,
//         (res) => {
//           okSuccessToast(res.data.message);
//           if (refresh) refresh();
//         },
//         (err) => {
//           apiErrorToast(err);
//           if (refresh) refresh();
//         }
//       );
//     } else {
//       postJsonData(
//         `${ApiEndpoints.VERIFY_PAN}?id=${id}`,
//         { is_pan_verified: 0 },
//         setRPanLoader,
//         (res) => {
//           okSuccessToast(res.data.message);
//           if (refresh) refresh();
//         },
//         (err) => {
//           apiErrorToast(err);
//           if (refresh) refresh();
//         }
//       );
//     }
//   };
//   const verifyOrRejectAadhaar = (e, type) => {
//     e.preventDefault();
//     if (type === "verify") {
//       postJsonData(
//         `${ApiEndpoints.VERIFY_AADHAAR}?id=${id}`,
//         { is_aadhaar_verified: 1 },
//         setVAadhaarLoader,
//         (res) => {
//           okSuccessToast(res.data.message);
//           if (refresh) refresh();
//         },
//         (err) => {
//           apiErrorToast(err);
//           if (refresh) refresh();
//         }
//       );
//     } else {
//       postJsonData(
//         `${ApiEndpoints.VERIFY_AADHAAR}?id=${id}`,
//         { is_aadhaar_verified: 0 },
//         setRAadhaarLoader,
//         (res) => {
//           okSuccessToast(res.data.message);
//           if (refresh) refresh();
//         },
//         (err) => {
//           apiErrorToast(err);
//           if (refresh) refresh();
//         }
//       );
//     }
//   };

//   return (
//     <>
//     <Tooltip title="Click to View Documents" placement="bottom">
//       <IconButton onClick={handleOpen} className="shadow-effect">
//         <VisibilityIcon
//           sx={{
//             color: aadhaar_image === null && pan_image === null
//               ? "#6A5ACD"
//               : (aadhaar_image || pan_image) &&
//                 (is_aadhaar_verified === 0 ||
//                   is_pan_verified === 0 ||
//                   is_aadhaar_verified === 2 ||
//                   is_pan_verified === 2)
//               ? "#fd792d"
//               : "#388e3c",
//           }}
//         />
//       </IconButton>
//     </Tooltip>

//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style} className="sm_modal">
//         <ModalHeader
//         subtitle="Secure Your Trust: Easily Verify Your Documents with VistarMoney!"
//           title="Verify Documents"
//           handleClose={handleClose}
//           icon={<UploadIcon />} 
//         />
//         <Grid container spacing={2}  sx>
//           <Grid item xs={12} sx={{ p: 2 }}>
//             <LabelComponent label="User Name" />
//             <DetailsComponent detail={row.name ? row.name : row.establishment} />


//             {imageSrc && <img src={imageSrc} alt="Fetched Image" />}
//           </Grid>

//           <Grid item xs={12} md={6} sx={{ p: 2 }}>
//             <LabelComponent label="Aadhaar Number" />
//             <DetailsComponent detail={maskFunction(row.aadhar)} />
//           </Grid>
//           <Grid item xs={12} md={6} sx={{ p: 2 }}>
//             <LabelComponent label="Pan Number" />
//             <DetailsComponent detail={row.pan} />
//           </Grid>

//           {/* Aadhaar Image */}
//           <Grid
//             item
//             xs={12} md={6}
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               p: 2,
//               border: '1px solid #e0e0e0',
//               borderRadius: '8px',
//               bgcolor: '#f5f5f5',
//               mb: 2,
//               gap: 2,
             
              
//             }}
//           >
//             {aadhaar_image ? (
//               <>
//                 <img
//                   src={aadhaar_image}
//                   alt="aadhaar"
//                   style={{ width: '100%', maxWidth: '300px', marginBottom: '15px', borderRadius: '4px',}}
//                 />
//                 {is_aadhaar_verified === 0 || is_aadhaar_verified === 2 ? (
//                   <div
//                     style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
//                   >
//                     <MyButton
//                       text="Verify"
//                       red
//                       p={1}
//                       mx={2}
//                       onClick={(e) => verifyOrRejectAadhaar(e, "verify")}
//                       disabled={vAadhaarLoader}
//                       loading={vAadhaarLoader}
//                     />
//                     <Button
//                       variant="contained"
//                       sx={{
//                         fontSize: '14px',
//                         textTransform: 'none',
//                         backgroundColor: '#d32f2f',
//                         '&:hover': {
//                           backgroundColor: '#b71c1c',
//                           color: '#fff',
//                         },
//                       }}
//                       onClick={(e) => verifyOrRejectAadhaar(e, "reject")}
//                       disabled={rAadhaarLoader}
//                     >
//                       <Loader loading={rAadhaarLoader} size="small" />
//                       Reject
//                     </Button>
//                   </div>
//                 ) : (
//                   <div
//                     style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
//                   >
//                     <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
//                       Verified <VerifiedIcon sx={{ ml: 1 }} />
//                     </div>
//                     <Button
//                       variant="contained"
//                       sx={{
//                         fontSize: '14px',
//                         textTransform: 'none',
//                         backgroundColor: '#d32f2f',
//                         '&:hover': {
//                           backgroundColor: '#b71c1c',
//                           color: '#fff',
//                         },
//                       }}
//                       onClick={(e) => verifyOrRejectAadhaar(e, "reject")}
//                       disabled={rAadhaarLoader}
//                     >
//                       <Loader loading={rAadhaarLoader} size="small" />
//                       Reject
//                     </Button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <label
//                   htmlFor="aadhaarFile"
//                   className="form-label"
//                   style={{ textAlign: 'left', fontSize: '14px' }}
//                 >
//                   Upload Aadhaar Image
//                 </label>
//                 <input
//                   type="file"
//                   id="aadhaarFile"
//                   onChange={(e) => onSelectFile(e, "aadhaar")}
//                   className="form-control"
//                   style={{
//                     padding: '8px',
//                     borderRadius: '4px',
//                     border: '1px solid #ddd',
//                     backgroundColor: '#fafafa'
//                   }}
//                 />
//               </>
//             )}
//           <Tooltip title="Click to View Documents" placement="bottom">
//       <IconButton onClick={() => getDocs("aadhar1")} className="shadow-effect">
//         <VisibilityIcon
//           sx={{
//             color: aadhaar_image === null && pan_image === null
//               ? "#6A5ACD"
//               : (aadhaar_image || pan_image) &&
//                 (is_aadhaar_verified === 0 ||
//                   is_pan_verified === 0 ||
//                   is_aadhaar_verified === 2 ||
//                   is_pan_verified === 2)
//               ? "#fd792d"
//               : "#388e3c",
//           }}
//         />
//       </IconButton>
//       </Tooltip>
     
//           </Grid>

//           {/* PAN Image */}
//           <Grid
//             item
//             xs={12} md={6}
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               p: 2,
//               border: '1px solid #e0e0e0',
//               borderRadius: '8px',
//               bgcolor: '#f5f5f5',
//               mb: 2,
//               gap: 2,
//             }}
//           >
//             {pan_image ? (
//               <>
//                 <img
//                   src={pan_image}
//                   alt="pan"
//                   style={{ width: '100%', maxWidth: '300px', marginBottom: '15px', borderRadius: '4px' }}
//                 />
//                 {is_pan_verified === 0 || is_pan_verified === 2 ? (
//                   <div
//                     style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
//                   >
//                     <MyButton
//                       text="Verify"
//                       red
//                       p={1}
//                       mx={2}
//                       onClick={(e) => verifyOrRejectPan(e, "verify")}
//                       disabled={vPanLoader}
//                       loading={vPanLoader}
//                     />
//                     <Button
//                       variant="contained"
//                       sx={{
//                         fontSize: '14px',
//                         textTransform: 'none',
//                         backgroundColor: '#d32f2f',
//                         '&:hover': {
//                           backgroundColor: '#b71c1c',
//                           color: '#fff',
//                         },
//                       }}
//                       onClick={(e) => verifyOrRejectPan(e, "reject")}
//                       disabled={rPanLoader}
//                     >
//                       <Loader loading={rPanLoader} size="small" />
//                       Reject
//                     </Button>
//                   </div>
//                 ) : (
//                   <div
//                     style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
//                   >
//                     <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
//                       Verified <VerifiedIcon sx={{ ml: 1 }} />
//                     </div>
//                     <Button
//                       variant="contained"
//                       sx={{
//                         fontSize: '14px',
//                         textTransform: 'none',
//                         backgroundColor: '#d32f2f',
//                         '&:hover': {
//                           backgroundColor: '#b71c1c',
//                           color: '#fff',
//                         },
//                       }}
//                       onClick={(e) => verifyOrRejectPan(e, "reject")}
//                       disabled={rPanLoader}
//                     >
//                       <Loader loading={rPanLoader} size="small" />
//                       Reject
//                     </Button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <label
//                   htmlFor="panFile"
//                   className="form-label"
//                   style={{ textAlign: 'left', fontSize: '14px' }}
//                 >
//                   Upload PAN Image
//                 </label>
//                 <input
//                   type="file"
//                   id="panFile"
//                   onChange={(e) => onSelectFile(e, "pan")}
//                   className="form-control"
//                 />
//               </>
//             )}
//           </Grid>
//                     {aadhaarFile || panFile ? (
//             <Grid
//               item
//               xs={12}
//               sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
//             >
//               <MyButton
//                 text="Upload"
//                 red
//                 p={1}
//                 mx={2}
//                 onClick={(e) => handleAadhaarPanUpload(e)}
//               />
//             </Grid>
//           ) : null}
//         </Grid>
//       </Box>
//     </Modal>
//   </>
//   );
// };

// export default AdminDocsViewModal;
