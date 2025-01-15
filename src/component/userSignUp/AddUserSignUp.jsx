import React, { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalFooter from "../../modals/ModalFooter";
import ModalHeader from "../../modals/ModalHeader";
import { get } from "../../network/ApiController";
import ApiEndpoints from "../../network/ApiEndPoints";
import { apiErrorToast } from "../../utils/ToastUtil";
import DynamicForm from "../../View/DynamicForm";
import Loader from "../loading-screen/Loader";

const AddUserSignUp = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState();
  const roles = "ROLES"; // Set the roles or pass them dynamically if needed

  const getRoles = () => {
    get(
      `${ApiEndpoints.GET_SIGNUP_ROLES}?type=ROLES`,
      "",
      setRequest,
      (res) => {
        if (res && res.data) {
          const role = res?.data;
          setData(role);
        }
      },
      (err) => {
        console.error("Network Error:", err);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const getFields = (data) => {
    console.log("data is ", data);
    get(
      `${ApiEndpoints.GET_SIGNUP_ROLES}?type=SCHEMA&role=${data.role}`,
      "",
      setRequest,
      (res) => {
        if (res && res.data) {
          setFields(res.data);
        } else {
          setFields([]);
        }
      },
      (err) => {
        console.error("Network Error:", err);
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };

  const handleSubmit = (data) => {
    console.log("data is ", data);
  };
  const handleOpen = () => {
    setOpen(true);
    getRoles();
  };

  const handleClose = () => {
    setOpen(false);
    setFields([]);
    setData([]);

    if (refresh) refresh();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Button
        variant="outlined"
        onClick={handleOpen}
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          fontSize: "12px",
          color: "#ffffff",
          fontWeight: "700",
          borderRadius: "8px",
          transition: "all 0.3s ease",
          justifyContent: "center",
          background: "#00693E",
          "&:hover": {
            backgroundColor: "#122480",
          },
        }}
        aria-label="SignUp New User"
      >
        SignUp New User
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "70%", md: "50%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            overflowY: "auto",
            maxHeight: "95vh",
          }}
        >
          <Loader loading={request} />
          <ModalHeader title="SignUp New User" handleClose={handleClose} />
          <Box
            component="form"
            id="addBankForm"
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <DynamicForm
              options={data}
              roles={true}
              getFields={getFields}
              fields={fields}
              onSubmit={handleSubmit}
              setFormData={setFormData}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              {/* <ModalFooter   btn={"submit"} onClick={handleSubmit}/> */}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddUserSignUp;
