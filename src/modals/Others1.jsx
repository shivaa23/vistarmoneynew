import React, { useEffect, useState } from "react";
import { Modal, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import ModalHeader from "./ModalHeader";
import "react-image-crop/dist/ReactCrop.css";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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

const Others1 = ({ endpt, getUserAgain, callbackImage }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  // const [result, setResult] = useState(null);
  const [fileType, setFileType] = useState();
  // const [smallFile, setSmallFile] = useState();
  const [request, setRequest] = useState(false);
  // const [image, setImage] = useState(null);
  // const [crop, setCrop] = useState({
  //   unit: "%",
  //   x: 0,
  //   y: 0,
  //   width: 50,
  //   height: 50,
  //   // aspect: 1 / 1,
  // });

  const {
    register,

    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPreview("");
    setSelectedFile("");
  };

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

  useEffect(() => {
    if (selectedFile) handleOpen();
  }, [selectedFile]);
  //

  // useEffect(() => {
  //   if (selectedFile && preview) {
  //     // show the previw image to the side with the below func
  //     getCroppedImg(image, crop, setResult, fileType);
  //     // convert b64 file to noraml file to send it to api
  //     urltoFile(result, fileType && fileType.name, fileType && fileType.type)
  //       .then((file) => {
  //         setSmallFile(file);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [crop]);
  /////////////////////////////////////////////////////////////////////////
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);
  //
  const handleImageUpload = () => {
    // e.preventDefault();

    if (callbackImage) callbackImage(selectedFile);

    handleClose();

    // postFormData(
    //   endpt,
    //   formData,
    //   setRequest,
    //   (res) => {
    //     okSuccessToast(res.data.message);
    //     setOpen(false);
    //     if (getUserAgain) getUserAgain();
    //     setPreview("");
    //     setSelectedFile("");
    //   },
    //   (err) => {
    //     apiErrorToast("Something went wrong");
    //     setOpen(false);
    //     setPreview("");
    //     setSelectedFile("");
    //   }
    // );
  };
  return (
    <Box
      sx={{
        display: "flex",
        // justifyContent: "end",
      }}
    >
      <Tooltip title="Others1">
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
          <span>Others1 </span>
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
            <ModalHeader title="Others1" handleClose={handleClose} />
            <Box
              component="form"
              id="upload-image"
              validate
              autoComplete="off"
              // onSubmit={handleImageUpload}
              sx={{
                "& .MuiTextField-root": { m: 1 },
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
                      name="signature"
                      type="file"
                      id="formFile"
                      {...register("signature", {
                        required: "Please Upload Image Before Upload",
                        validate: async (value) => {
                          if (value[0]) {
                            const fileTypes = [
                              "jpg",
                              "JPG",
                              "png",
                              "PNG",
                              "JPEG",
                              "jpeg",
                            ];
                            const messageFiles = ["jpg", "png", "jpeg"];
                            const splittedArry = value[0].name.split(".");
                            const actualType =
                              value[0].name.split(".")[splittedArry.length - 1];

                            if (!fileTypes.includes(actualType)) {
                              return `Please upload a valid file format ${messageFiles}`;
                            }

                            const fileSize = Math.round(value[0].size / 1024);
                            if (fileSize > 300) {
                              return `File should be less than 300Kb`;
                            }
                          }

                          // const sizes = await getDimension(value[0]);
                          // if (sizes.width > 1000 && sizes.height > 1000) {
                          //   return "Image width and height must be less than or equal to 1000px";
                          // }
                        },
                      })}
                      onChange={onSelectFile}
                      // accept="image/*"
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
                          {/* <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              height: "100%",
                            }}
                          > */}
                          {/* <ReactCrop
                              keepSelection={true}
                              style={{
                                width: "100%",
                                maxWidth: "48%",
                              }}
                              src={preview}
                              onImageLoaded={setImage}
                              crop={crop}
                              onChange={setCrop}
                            /> */}
                          {/* <div
                              style={{
                                width: "100%",
                                maxWidth: "48%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            > */}
                          <img
                            src={preview}
                            alt="cropped"
                            className="image-full-preview"
                          />
                          {/* </div> */}

                          {/* </div> */}
                          <EditOutlinedIcon
                            fontSize="small"
                            className="reupload-icon"
                          />
                        </>
                      ) : (
                        <AddIcon className="icon-add" />
                      )}
                    </span>
                    {/* <div className="re-upload">
                      <span>
                        {preview && (
                          <EditOutlinedIcon
                            fontSize="small"
                            className="reupload-icon"
                          />
                        )}
                      </span>
                    </div> */}
                  </div>
                </div>
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
                  fontFamily: "Poppins",
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
                request={request}
                btn="save"
                onClick={handleImageUpload}
              />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Others1;
