import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CheckCircle,
  CloudUpload,
  Image,
  Description,
  AccountBox,
  CreditCard,
  CameraAlt,
} from "@mui/icons-material";
import ApiEndpoints, { BASE_URL } from "../network/ApiEndPoints";
import { postJsonData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import AuthContext from "../store/AuthContext";
import useCommonContext from "../store/CommonContext";
import axios from "axios";
import MyButton from "../component/MyButton";

const DocumentUploader = ({ view, row }) => {
  const [progress, setProgress] = useState(false);
  const [images, setImages] = useState({
    aadhar1: null,
    aadhaar2: null,
    pan: null,
    shop: null,
    bank: null,
    gst: null,
    photo: null,
    other1: null,
    other2: null,
    other3: null,
    other4: null,
  });
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [kycImages, setKycImages] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const token = authCtx.token;
  const { refreshUser } = useCommonContext();
  const [openModal, setOpenModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Parse kyc_images on component mount
  useEffect(() => {
    if (view === "DocumentView" && row?.kyc_images) {
      setKycImages(JSON.parse(row.kyc_images));
    } else if (view === "UploadData" && user?.kyc_images) {
      setKycImages(JSON.parse(user.kyc_images));
    }
  }, [user, view, row]);

  // Handle file upload
  const handleFileChange = (e, field) => {
    if (row?.kyc_status === 1) return;
    const file = e.target.files[0];
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
      Authorization: `Bearer ${token}`,
    };

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
    const fileName = kycImages[filename];
    const url = await getImage(fileName);
    if (url) {
      setOpenModal(true);
      setImageUrl(url);
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;
    if (!images.aadhar1 && !kycImages.aadhar1) {
      newErrors.aadhar1 = "Aadhar Front is required.";
      isValid = false;
    }
    if (!images.aadhaar2 && !kycImages.aadhaar2) {
      newErrors.aadhaar2 = "Aadhar Back is required.";
      isValid = false;
    }
    if (!images.pan && !kycImages.pan) {
      newErrors.pan = "PAN Card is required.";
      isValid = false;
    }
    if (!images.photo && !kycImages.photo) {
      newErrors.photo = "Photo is required.";
      isValid = false;
    }
    if (!images.shop && !kycImages.shop) {
      newErrors.shop = "Shop is required.";
      isValid = false;
    }
    if (!images.bank && !kycImages.bank) {
      newErrors.bank = "Bank is required.";
      isValid = false;
    }
    if (!images.signature && !kycImages.signature) {
      newErrors.signature = " Signature is required.";
      isValid = false;
    }
    // if (!images.gst && !kycImages.gst) {
    //   newErrors.gst = "GST  is required.";
    //   isValid = false;
    // }
    // if (!images.other1 && !kycImages.other1) {
    //   newErrors.other1 = "other1  is required.";
    //   isValid = false;
    // }
    // if (!images.other2 && !kycImages.other2) {
    //   newErrors.other2 = "other1  is required.";
    //   isValid = false;
    // }
    // if (!images.other3 && !kycImages.other3) {
    //   newErrors.other3 = "other1  is required.";
    //   isValid = false;
    // }
    // if (!images.other4 && !kycImages.other) {
    //   newErrors.other4 = "other1  is required.";
    //   isValid = false;
    // }
    setErrors(newErrors);
    setIsFormValid(isValid);
  };

  const handleSubmit = async () => {
    validate();
    if (!isFormValid) return;

    const formData = new FormData();
    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    });

    postJsonData(
      ApiEndpoints.UPLOAD_USER_KYC,
      formData,
      setProgress,
      (res) => {
        refreshUser();
        okSuccessToast("Documents uploaded Successfully");
        handleReset();
      },
      (err) => {
        apiErrorToast(err);
      }
    );
  };

  const handleReset = () => {
    setImages({
      aadhar1: null,
      aadhaar2: null,
      pan: null,
      shop: null,
      bank: null,
      gst: null,
      photo: null,
      other1: null,
      other2: null,
      other3: null,
      other4: null,
    });
    setPreviews({});
    setErrors({});
  };

  const renderFileIcon = (field) => {
    switch (field) {
      case "aadhar1":
      case "aadhaar2":
        return <AccountBox />;
      case "pan":
        return <CreditCard />;
      case "photo":
        return <CameraAlt />;
      case "shop":
      case "bank":
      case "gst":
        return <Description />;
      default:
        return <Image />;
    }
  };

  return (
    <>
      <Box p={4}>
        <Grid container spacing={3}>
          {[
            { label: "Aadhar Front", field: "aadhar1" },
            { label: "Aadhar Back", field: "aadhaar2" },
            { label: "PAN Card", field: "pan" },
            { label: "Shop Image", field: "shop" },
            { label: "Bank Statement", field: "bank" },
            { label: "Photo", field: "photo" },
            { label: "Sample Signature", field: "signature" },
            { label: "GST Certificate", field: "gst" },
            { label: "Other Document 1", field: "other1" },
            { label: "Other Document 2", field: "other2" },
            { label: "Other Document 3", field: "other3" },
            { label: "Other Document 4", field: "other4" },
       
          ].map(({ label, field }) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              {kycImages[field] ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{ boxShadow: 2 }}
                  gap={1}
                >
                  <CheckCircle color="success" />
                  {view === "DocumentView" ? (
                    <MyButton
                      text={`View ${label}`}
                      onClick={() => fetchImage(field)}
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
                    <Typography variant="body2" align="center">
                      {label} is already uploaded.
                    </Typography>
                  )}
                </Box>
              ) : (view === "DocumentView" && row?.kyc_status === 0) ||
                (view === "UploadData" && !user?.kyc_status) ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{ boxShadow: 4 }}
                >
                  <IconButton
                    component="label"
                    htmlFor={field}
                    sx={{ color: "primary.main", fontSize: 40 }}
                  >
                    {renderFileIcon(field)}
                  </IconButton>
                  <TextField
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    id={field}
                    hidden
                    onChange={(e) => handleFileChange(e, field)}
                  />
                  <Typography variant="caption" mt={1}>
                    {label}
                  </Typography>
                  {errors[field] && (
                    <Typography color="error" variant="body2">
                      {errors[field]}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Viewing only. Upload disabled.
                </Typography>
              )}
              {previews[field] && (
                <Box mt={2}>
                  <img
                    src={previews[field]}
                    alt={label}
                    style={{ width: "100%", borderRadius: 4 }}
                  />
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          mt={3}
          gap={2}
        >
          <Button
            onClick={handleSubmit}
            // disabled={row ? true : progress}
            disabled={!Object.values(images).some((file) => file) || progress}
            variant="contained"
            color="primary"
          >
            {progress ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            color="secondary"
            disabled={progress}
          >
            Reset
          </Button>
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Document View</DialogTitle>
        <DialogContent>
          <img
            src={imageUrl}
            alt="Document"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentUploader;
