import React, { useState } from "react";
import { Box, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import ModalHeader from "./ModalHeader";
import { useForm } from "react-hook-form";
import ModalFooter from "./ModalFooter";
import { postFormData } from "../network/ApiController";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import { useEffect } from "react";
import { urltoFile, getCroppedImg } from "../utils/cropImageUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  height: "max-content",
  overflowY: "scroll",
  p: 2,
};

const UploadImageModal = ({ endpt, getUserAgain, updateImage }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    aspect: 1 / 1,
  });
  const [result, setResult] = useState(null);

  const [fileType, setFileType] = useState();

  const [smallFile, setSmallFile] = useState();

  const {
    register,
    handleSubmit,
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
      setFileType({
        name: e.target.files[0].name,
        type: e.target.files[0].type,
      });
    }
  };

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

  useEffect(() => {
    if (selectedFile && preview) {
      // show the previw image to the side with the below func
      getCroppedImg(image, crop, setResult, fileType);
      // convert b64 file to noraml file to send it to api
      urltoFile(result, fileType && fileType.name, fileType && fileType.type)
        .then((file) => setSmallFile(file))
        .catch((err) => {
        });
    }
  }, [crop]);

  const handleImageUpload = () => {
    const formData = new FormData();
    // formData.append("profile_image", selectedFile);
    formData.append("profile_image", smallFile);

    postFormData(
      endpt,
      formData,
      setRequest,

      (res) => {
        okSuccessToast(res.data.message);
        setOpen(false);
        if (getUserAgain) getUserAgain();
        setPreview("");
        setSelectedFile("");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 200);
      },
      (err) => {
        apiErrorToast("Something went wrong");
        setOpen(false);
        setPreview("");
        setSelectedFile("");
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
      }}
    >
      <Tooltip title="Upload Image">
        <IconButton aria-label="upload_image" onClick={handleOpen}>
          <AddAPhotoOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="Upload Image" handleClose={handleClose} />
            <Box
              component="form"
              id="upload-image"
              validate
              autoComplete="off"
              onSubmit={handleSubmit(handleImageUpload)}
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
                        required: "Please choose image before uploading",
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
                              return `please upload a valid file format ${messageFiles}`;
                            }

                            const fileSize = Math.round(value[0].size / 1024);
                            if (fileSize > 600) {
                              return `File should be less than 600Kb`;
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              height: "100%",
                            }}
                          >
                            <ReactCrop
                              keepSelection={true}
                              style={{
                                width: "100%",
                                maxWidth: "48%",
                              }}
                              src={preview}
                              onImageLoaded={setImage}
                              crop={crop}
                              onChange={setCrop}
                            />
                            <div
                              style={{
                                width: "100%",
                                maxWidth: "48%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img src={result} alt="cropped" />
                            </div>
                            {/* {result === "data:," ? (
                              <div>Crop your image</div>
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  maxWidth: "48%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <img src={result} alt="cropped" />
                              </div>
                            )} */}
                          </div>
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
              <ModalFooter form="upload-image" request={request} btn="Upload" />
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default UploadImageModal;





{/* <Grid container md={12} xs={12}>
                      {authCtx.ifDocsUploaded &&
                      authCtx.ifDocsUploaded.pan_image === 1 ? (
                        <Grid
                          item
                          md={5.6}
                          sx={{
                            mr: { md: 2, sm: 0, xs: 0 },
                            mt: "16px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: "60px", mb: 1 }}
                            color="success"
                          />
                          <Typography sx={{ textAlign: "center" }}>
                            Pan Card Uploaded
                          </Typography>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          md={5.6}
                          sx={{ mr: { md: 2, sm: 0, xs: 0 } }}
                        >
                          <UploadPanModal
                            callbackImage={(image) => {
                              setPanFile(image);
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "poppins",
                              fontSize: "12px",
                              color: "red",
                              fontWeight: "bold",
                              textAlign: "left",
                              mt: 2,
                            }}
                          >
                            {(panV !== false || panV !== true) && panV}
                          </Typography>
                        </Grid>
                      )}

                      {((authCtx.ifDocsUploaded &&
                        authCtx.ifDocsUploaded.pan_image === 1) ||
                        panFile) && (
                        <ShowDocsModal
                          docsImgApi={docsImgApi}
                          panPreview={panPreview}
                          title="Pan"
                        />
                      )}
                    </Grid> */}
                    
                    // const [panFile, setPanFile] = useState();
                    // const [aadhaarFrontFile, setAadhaarFrontFile] = useState();
                    // const [aadhaarBackFile, setAadhaarBackFile] = useState();
                    // const [gstFile, setGstFile] = useState();
                    // const [bankDocsFile, setBankDocsFile] = useState();
                    // const [others1File, setOthers1File] = useState();
                    // const [others2File, setOthers2File] = useState();
                    // const [shop, setShop] = useState()
                    // const[photo,setPhoto]=useState()