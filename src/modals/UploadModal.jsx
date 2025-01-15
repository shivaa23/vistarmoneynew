import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Modal, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const UploadModal = ({
  callbackImage,
  key,
  title = "Upload File", // Default title
  maxFileSize = 300, // Default max file size in KB
  fileTypes = ["jpg", "jpeg", "png"], // Default allowed file types
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (selectedFile) {
      handleOpen();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClose = () => {
    setOpen(false);
    setPreview("");
    setSelectedFile("");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const {
    register,
    formState: { errors },
  } = useForm();

  const onSelectFile = (e) => {
    if (!e.target.files) {
      setSelectedFile(undefined);
      return;
    } else {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = () => {
    if (callbackImage) {
      // Callback for parent component (optional)
      callbackImage(selectedFile);
    }
    // Set the uploaded image to be displayed
    setUploadedImage(preview);
    handleClose();
  };

  return (
    <Box>
      <Tooltip title={`Upload ${title}`}>
        <Box
          sx={{
            width: "100%",
            height: "40px",
            border: "1px solid #C6C6C6",
            borderRadius: "0.25rem",
            p: "18px",
            mt: "16px",
            display: "flex",
            alignItems: "center",
          }}
          className="d-flex justify-content-start simple-hover"
          onClick={handleOpen}
        >
          <AddCircleOutlineIcon className="me-2" />
          <span>Select {title}</span>
        </Box>
      </Tooltip>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title={title} handleClose={handleClose} />

            <Box
              component="form"
              id="upload-image"
              validate
              autoComplete="off"
              sx={{
                "& .MuiTextFeild": { m: 1 },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: "18px",
                  pt: "0px",
                  pb: "2px",
                  mt: "5px",
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="upload-field-customized">
                    <input
                      name="file"
                      type="file"
                      id="formFile"
                      {...register("file", {
                        required: "Please Upload an Image Before Upload",
                        validate: (value) => {
                          if (value[0]) {
                            const actualType =
                              value[0].name.split(".").pop().toLowerCase();
                            if (!fileTypes.includes(actualType)) {
                              return `Please upload a valid file format: ${fileTypes.join(
                                ", "
                              )}`;
                            }
                            const fileSize = Math.round(value[0].size / 1024); // in KB
                            if (fileSize > maxFileSize) {
                              return `File should be less than ${maxFileSize}KB`;
                            }
                          }
                        },
                      })}
                      onChange={onSelectFile}
                      className={`form-control ${
                        selectedFile || preview ? "sign-form1" : "sign-form"
                      }`}
                    />
                    <span
                      style={{
                        height: "100%",
                        minHeight: "150px",
                        position: "relative",
                      }}
                    >
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt="preview"
                            className="image-full-preview"
                          />
                          <EditOutlinedIcon
                            fontSize="small"
                            className="reupload-icon"
                          />
                        </>
                      ) : (
                        <AddCircleOutlineIcon className="icon-add" />
                      )}
                    </span>
                  </div>
                </div>
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "red",
                fontWeight: "bold",
                marginLeft: "1.2rem",
              }}
            >
              {errors?.file && errors.file.message}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#9092a3",
                fontWeight: "bold",
                marginLeft: "1.2rem",
                marginBottom: "0.4rem",
                marginTop: "0.4rem",
              }}
            >
              Allowed formats: {fileTypes.join(", ")}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Poppins",
                fontSize: "12px",
                color: "#9092a3",
                fontWeight: "bold",
                marginLeft: "1.2rem",
              }}
            >
              Maximum Size: {maxFileSize}KB
            </Typography>

            <ModalFooter
              form="upload-image"
              btn="Save"
              onClick={handleImageUpload}
            />
          </Box>
        </Modal>
      </Box>

      {uploadedImage && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: "Poppins", fontSize: "16px" }}>
            Uploaded Image Preview:
          </Typography>
          <img
            src={uploadedImage}
            alt="uploaded preview"
            style={{
              width: "20%",
              height: "auto",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadModal;
