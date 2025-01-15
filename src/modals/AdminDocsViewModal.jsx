import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import MyButton from "../component/MyButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LabelComponent from "../component/LabelComponent";
import DetailsComponent from "../component/DetailsComponent";
import { maskFunction } from "../utils/MaskingUtil";
import { get, postJsonData } from "../network/ApiController";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import Loader from "../component/loading-screen/Loader";
import VerifiedIcon from "@mui/icons-material/Verified";
import UploadIcon from "@mui/icons-material/Upload";
import AuthContext from "../store/AuthContext";
import axios from "axios";
import DocumentUploader from "../View/DocumentUploder";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

const AdminDocsViewModal = ({ row, refresh }) => {
  // console.log("row,", row);
  const { aadhaar_image, pan_image, id, is_aadhaar_verified, is_pan_verified } =
    row;
  const [open, setOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  const [req, setReq] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState();
  const [panFile, setPanFile] = useState();
  const [vAadhaarLoader, setVAadhaarLoader] = useState(false);
  const [rAadhaarLoader, setRAadhaarLoader] = useState(false);
  const [vPanLoader, setVPanLoader] = useState(false);
  const [rPanLoader, setRPanLoader] = useState(false);
  const [kycImages, setKycImages] = useState(JSON.parse(row?.kyc_images));
  const [imageSrc, setImageSrc] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const authCtx = React.useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const token = authCtx.token; // State to hold the image source URL

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState({});
  const [previews, setPreviews] = useState({});

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    console.log("image is", file);
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Invalid file type. Only jpg, jpeg, png are allowed.",
        }));
        return;
      }

      if (file.size > 512 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [field]: "File size exceeds 512 KB.",
        }));
        return;
      }

      setImages((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file),
      }));
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

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
  const fetchImage = async (filename) => {
    const fileName = kycImages[filename]; // Replace with your actual file name
    const url = await getImage(fileName);
    if (url) {
      setOpenModal(true);

      setImageUrl(url);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // console.log("imageSrc",imageSrc);

  const onSelectFile = (e, type) => {
    if (!e.target.files) {
      if (type === "aadhaar") {
        setAadhaarFile(undefined);
      } else {
        setPanFile(undefined);
      }
      return;
    } else {
      if (type === "aadhaar") {
        setAadhaarFile(e.target.files[0]);
      } else {
        setPanFile(e.target.files[0]);
      }
    }
  };

  const handleAadhaarPanView = () => {
    const formData = new FormData();

    if (aadhaarFile) {
      formData.append("aadhaar_image", aadhaarFile);
    }
    if (panFile) {
      formData.append("pan_image", panFile);
    }
    // postFormData()
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const verifyOrRejectPan = (e, type) => {
    e.preventDefault();
    if (type === "verify") {
      postJsonData(
        `${ApiEndpoints.VERIFY_PAN}?id=${id}`,
        // { is_pan_verified: 1 },
        setVPanLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    } else {
      postJsonData(
        ` ${ApiEndpoints.VERIFY_PAN}?id=${id}`,
        // { is_pan_verified: 0 },
        setRPanLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    }
  };
  const verifyOrRejectAadhaar = (e, type) => {
    e.preventDefault();
    if (type === "verify") {
      postJsonData(
        `${ApiEndpoints.VERIFY_AADHAAR}?id=${id}`,
        { is_aadhaar_verified: 1 },
        setVAadhaarLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    } else {
      postJsonData(
        `${ApiEndpoints.VERIFY_AADHAAR}?id=${id}`,
        { is_aadhaar_verified: 0 },
        setRAadhaarLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    }
  };
  const verifyOrReject = (e, type) => {
    e.preventDefault();
    if (type === "APPROVE") {
      postJsonData(
        ApiEndpoints.VERIFY_PIC,
        { id: id, type: type },
        setVAadhaarLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    } else {
      postJsonData(
        ApiEndpoints.VERIFY_PIC,
        { id: id, type: type },
        setRAadhaarLoader,
        (res) => {
          okSuccessToast(res.data.message);
          if (refresh) refresh();
        },
        (err) => {
          apiErrorToast(err);
          if (refresh) refresh();
        }
      );
    }
  };

  return (
    <>
      <Tooltip title="Click to View Documents" placement="bottom">
        <IconButton onClick={handleOpen} className="shadow-effect">
          <VisibilityIcon
            sx={{
              color:
                aadhaar_image === null && pan_image === null
                  ? "#6A5ACD"
                  : (aadhaar_image || pan_image) &&
                    (is_aadhaar_verified === 0 ||
                      is_pan_verified === 0 ||
                      is_aadhaar_verified === 2 ||
                      is_pan_verified === 2)
                  ? "#fd792d"
                  : "#388e3c",
            }}
          />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...style,
            display: "flex",
            flexDirection: "column",
            height: "90vh", // Set the modal's height
            maxWidth: "900px", // Optional: restrict width
            margin: "auto",
          }}
          className="sm_modal"
        >
          {/* Header */}
          <Box
            sx={{
              borderBottom: "1px solid #ccc", // Optional: Divider
              padding: "16px",
              backgroundColor: "#f8f8f8", // Optional: Header background
              zIndex: 1,
            }}
          >
            <ModalHeader
              subtitle="Secure Your Trust: Easily Verify Your Documents with DilliPay!"
              title="Verify Documents"
              handleClose={handleClose}
              icon={<UploadIcon />}
            />
          </Box>

          {/* Scrollable Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: "16px", // Content padding
            }}
          >
            <Grid container spacing={2}>
              {/* User Name */}
              <Grid item xs={12} sx={{ p: 2 }}>
                <LabelComponent label="User Name" />
                <DetailsComponent
                  detail={row.name ? row.name : row.establishment}
                />
              </Grid>

              {/* Document Sections */}
              {/* <Grid container spacing={3} sx={{ padding: 3 }}>
                {[
                  { label: "Aadhaar 1", detail: "", fetchKey: "aadhar1" },
                  {
                    label: "Aadhaar 2",
                    detail: row.aadhaar2,
                    fetchKey: "aadhaar2",
                  },
                  { label: "PAN", detail: "", fetchKey: "pan" },
                  { label: "GST", detail: row.gst, fetchKey: "gst" },
                  { label: "Bank Statement", detail: "", fetchKey: "bank" },
                  { label: "Photo", detail: row.photo, fetchKey: "photo" },
                  { label: "Shop Details", detail: row.shop, fetchKey: "shop" },
                  { label: "Other 1", detail: row.other1, fetchKey: "other1" },
                  { label: "Other 2", detail: row.other2, fetchKey: "other2" },
                  { label: "Other 3", detail: row.other3, fetchKey: "other3" },
                  { label: "Other 4", detail: row.other4, fetchKey: "other4" },
                  {
                    label: "Sample Signature",
                    detail: row.other,
                    fetchKey: "signature",
                  },
                ].map((doc, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    display="flex"
                    justifyContent="center"
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 300,
                        background:
                          "linear-gradient(to right, #ece9e6, #ffffff)",
                        borderRadius: 2,
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        padding: 3,
                        textAlign: "center",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <LabelComponent label={doc.label} />
                      <DetailsComponent detail={doc.detail} />

                      {kycImages && kycImages[doc.fetchKey] ? (
                        <MyButton
                          text={`View ${doc.label}`}
                          onClick={() => fetchImage(doc.fetchKey)}
                          sx={{
                            marginTop: 2,
                            background: "#1976d2",
                            color: "#fff",
                            "&:hover": {
                              background: "#115293",
                            },
                          }}
                        />
                      ) : (
                        <>
                          <input
                            type="file"
                            id={`file-input-${doc.fetchKey}`}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, doc.fetchKey)}
                          />
                          <Button
                            onClick={() =>
                              document
                                .getElementById(`file-input-${doc.fetchKey}`)
                                .click()
                            }
                            sx={{
                              marginTop: 1,
                              background: "#1976d2",
                              borderRadius: "4px",
                              cursor: "pointer",
                              color: "#fff",
                              "&:hover": {
                                background: "#115293",
                              },
                            }}
                          >
                            {`Upload ${doc.label}`}
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid> */}
              <DocumentUploader view={"DocumentView"} row={row} />
            </Grid>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              borderTop: "1px solid #ccc", // Optional: Divider
              padding: "16px",
              backgroundColor: "#f8f8f8", // Optional: Footer background
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2, // Spacing between buttons
            }}
          >
            {row?.kyc_status === 0 && (
              <Button
                onClick={(e) => verifyOrReject(e, "APPROVE")}
                variant="contained"
                color="primary"
              >
                Verify
              </Button>
            )}
            <Button
              onClick={(e) => verifyOrReject(e, "reject")}
              variant="contained"
              color="secondary"
            >
              Reject
            </Button>
          </Box>

          {/* Image Viewer Dialog */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Image Viewer</DialogTitle>
            <DialogContent>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Fetched"
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Modal>
    </>
  );
};

export default AdminDocsViewModal;
