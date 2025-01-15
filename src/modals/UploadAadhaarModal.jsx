import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Modal, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import ReactCrop from "react-image-crop";
// import { getCroppedImg, urltoFile } from "../utils/cropImageUtils";

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
const UploadAadhaarModal = ({ callbackImage }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  // const [result, setResult] = useState(null);
  const [preview, setPreview] = useState();
  // const [smallFile, setSmallFile] = useState();
  // const [image, setImage] = useState(null);
  // const [crop, setCrop] = useState({
  //   unit: "%",
  //   x: 0,
  //   y: 0,
  //   width: 50,
  //   height: 50,
  // });

  // const [fileType, setFileType] = useState();
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
      // setFileType({
      //   name: e.target.files[0].name,
      //   type: e.target.files[0].type,
      // });
    }
  };
  ///
  useEffect(() => {
    if (selectedFile) handleOpen();
  }, [selectedFile]);
  ////
  // useEffect(() => {
  //   if (selectedFile && preview) {
  //     getCroppedImg(image, crop, setResult, fileType);
  //     urltoFile(image, fileType && fileType.name, fileType && fileType.type)
  //       .then((file) => {
  //         setSmallFile(file);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [crop]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleImageUpload = () => {
    // e.preventDefault();
    if (callbackImage) callbackImage(selectedFile);
    handleClose();
  };
  return (
    <Box>
      <Tooltip title="Upload Aadhaar">
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
          <span>Select Aadhaar</span>
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
            <ModalHeader title="Upload Aadhar" handleClose={handleClose} />
            <Box
              component="form"
              id="upload-image"
              validate
              autoComplete="off"
              sx={{
                "& .MuiTextFeild": { m: 1 },
              }}
              // onSubmit={handleImageUpload}
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
                      name="signature"
                      type="file"
                      id="formFile"
                      {...register("signature", {
                        require: "Please Upload Image Before Upload",
                        validate: async (value) => {
                          if (value[0]) {
                            const fileType = [
                              "jpg",
                              "JPG",
                              "png",
                              "PNG",
                              "jpeg",
                              "JPEG",
                            ];
                            const messageFiles = ["jpg", "png", "jpeg"];
                            const splittedArry = value[0].name.split(".");
                            const actualType =
                              value[0].name.split(".")[splittedArry.length - 1];
                            if (!fileType.includes(actualType)) {
                              return `Please upload a  valid file format ${messageFiles}`;
                            }
                            const fileSize = Math.round(value[0].size / 1024);
                            if (fileSize > 300) {
                              return `File should be less than 300Kb`;
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
                          {/* <ReactCrop
                            keepSelection={true}
                            style={{ width: "100%", maxWidth: "48%" }}
                            src={preview}
                            onImageLoaded={setImage}
                            crop={crop}
                            onChange={setCrop}
                          /> */}

                          <img
                            src={preview}
                            alt="cropped"
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
                fontFamily: "poppins",
                fontSize: "12px",
                color: "red",
                fontWeight: "bold",
                marginLeft: "1.2rem",
              }}
            >
              {errors?.signature && errors.signature.message}
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
              Only (jpg, png, jpeg)
            </Typography>
            <Typography
              sx={{
                fontFamily: "poppins",
                fontSize: "12px",
                color: "#9092a3",
                fontWeight: "bold",
                marginLeft: "1.2rem",
              }}
            >
              Maximum Size: 300Kb
            </Typography>
            <ModalFooter
              form="upload-image"
              btn="Save"
              request={request}
              onClick={handleImageUpload}
            />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UploadAadhaarModal;
