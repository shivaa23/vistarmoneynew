import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Button } from "@mui/material";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import { useState } from "react";
import { primaryColor } from "../theme/setThemeColor";

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
const CheckResponseModal = ({
  row,
  width = "12px",
  height = "15px",
  fontSize = "8px",
}) => {
  // console.log("row", row);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant="text"
        sx={{
          width: width,
          height: height,
          fontSize: fontSize,
          backgroundColor: "#FFE3E3",
          color: primaryColor(),
          // backgroundColor: "#9586EC",
          "&:hover": {
            color: "#fff",
            backgroundColor: primaryColor(),
          },
          borderRadius: "2px",

          mt: 0.5,
        }}
        onClick={handleOpen}
      >
        response
      </Button>

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal">
            <ModalHeader title="API Response" handleClose={handleClose} />
            <Box
              component="form"
              id="response"
              noValidate
              autoComplete="off"
              className="text-center"
              onSubmit={(event) => {
                handleClose();
              }}
              sx={{
                "& .MuiTextField-root": { m: 2 },
                maxHeight: "500px",
                overflowY: "scroll",
              }}
            >
              {/* <div
                style={{
                  whiteSpace: "break-spaces",
                  overflow: "scroll",
                  textOverflow: "clip",
                }}
              >
                {row && row.api_response === ""
                  ? "No Response yet"
                  : row.api_response}
              </div> */}
              <Box
                sx={{
                  borderRadius: "4px",
                  width: "100%",
                  wordWrap: "break-word",
                  color: "#fff",
                  backgroundColor: "#1E2B3E",
                  letterSpacing: "1px",
                  p: 3,
                  textAlign: "left",
                }}
              >
                <pre>
                  {row.api_response
                    ? row.api_response
                        .replace(/,/g, ",\n")
                        .replace(/:/g, ": ")
                        .replace(/\\/g, "")
                    : row.response
                    ? row.response
                        .replace(/,/g, ",\n")
                        .replace(/:/g, ": ")
                        .replace(/\\/g, "")
                    : "Response Not Found..."}
                </pre>
              </Box>
            </Box>
            <ModalFooter form="response" btn="Close" />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};
export default CheckResponseModal;
