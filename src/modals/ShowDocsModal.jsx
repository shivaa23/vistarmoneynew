import { Box, Grid, Modal, Tooltip } from "@mui/material";
import React from "react";
import ModalHeader from "./ModalHeader";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "80%",
};

const ShowDocsModal = ({
  docsImgApi,
  
  aadhaarPreview,
  panPreview,
  accountPreview,
  title = "Document",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  return (
    <>
      <Tooltip title="Click to View Documents" placement="top">
        <Grid
          item
          md={6}
          sx={{
            border: "1px solid #E2E2E4",
            textAlign: "center",
            marginTop: "1.2rem",
            padding: "0.7rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={handleOpen}
        >
          {title === "Aadhaar" && (
            <img
              src={
                docsImgApi && docsImgApi.aadhaar_image
                  ? docsImgApi.aadhaar_image
                  : aadhaarPreview
              }
              alt="sign"
              className="sign-front-preview"
            />
          )}
          {title === "Pan" && (
            <img
              src={
                docsImgApi && docsImgApi.pan_image
                  ? docsImgApi.pan_image
                  : panPreview
              }
              alt="sign"
              className="sign-front-preview"
            />
          )}
          {title === "KYC Document" && (
            <img
              src={
                docsImgApi && docsImgApi.pan_image
                  ? docsImgApi.pan_image
                  : accountPreview
              }
              alt="sign"
              className="sign-front-preview"
            />
          )}
        </Grid>
      </Tooltip>
      {/* modal */}
      <Modal open={open}>
        <Box sx={style} className="sm_modal">
          <ModalHeader title={title} handleClose={handleClose} />
          <Grid
            item
            md={12}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              height: "100%",
            }}
          >
            {title === "Aadhaar" && (
              <img
                src={
                  docsImgApi && docsImgApi.aadhaar_image
                    ? docsImgApi.aadhaar_image
                    : aadhaarPreview
                }
                alt="sign"
                className="docs-front-preview"
              />
            )}

            {title === "Pan" && (
              <img
                src={
                  docsImgApi && docsImgApi.pan_image
                    ? docsImgApi.pan_image
                    : panPreview
                }
                alt="sign"
                className="docs-front-preview"
              />
            )}
            {title === "KYC Document" && (
              <img
                src={
                  docsImgApi && docsImgApi.pan_image
                    ? docsImgApi.pan_image
                    : accountPreview
                }
                alt="sign"
                className="docs-front-preview"
              />
            )}
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ShowDocsModal;
