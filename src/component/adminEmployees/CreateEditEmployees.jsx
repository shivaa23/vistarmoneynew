/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Modal,
  Drawer,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Loader from "../loading-screen/Loader"; 
import ModalHeader from "../../modals/ModalHeader";
import ModalFooter from "../../modals/ModalFooter";
import { whiteColor } from "../../theme/setThemeColor";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  handleChangeEmployees,
  resetDataEmployees,
  setEmployeesData,
  updateEmployee,
} from "../../features/allUsers/allUsersSlice";
import { yyyymmdd } from "../../utils/DateUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};

const CreateEditEmployees = ({ refresh, edit = false, row }) => {
  const [open, setOpen] = React.useState(false);
  const { employees, employeesLoading } = useSelector((store) => store.allUsers);
  const { name, role, dob, basic_pay, hra, ta, bank, ifsc, acc_number, target, joining_date } = employees;
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
    if (row) dispatch(setEmployeesData(row));
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(resetDataEmployees());
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChangeEmployees({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) {
      try {
        await dispatch(updateEmployee({ ...employees, user_id: row?.id })).unwrap();
        handleClose();
      } catch (error) {}
    } else {
      try {
        await dispatch(addEmployee(employees)).unwrap();
        if (refresh) refresh();
        handleClose();
      } catch (error) {}
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      {edit ? (
        <Tooltip title="Edit Account">
          <IconButton onClick={handleOpen}>
            <Icon
              icon="basil:edit-solid"
              style={{ fontSize: "24px" }}
              className="refresh-icon-risk"
            />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Account">
          <Button
            variant="outlined"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton sx={{ p: 0, color: whiteColor() }}>
                <AddCircleOutlineIcon />
              </IconButton>
            }
            sx={{ py: 0.3 }}
          >
            Employee
          </Button>
        </Tooltip>
      )}
      <Box>
        <Drawer
          open={open}
          onClose={handleClose}
         anchor="right"
        >
          <Box sx={{width:400}} className="sm_modal">
            <Box
              sx={{
                height: { md: "max-content", sm: "70vh", xs: "70vh" },
                overflowY: "scroll",
              }}
            >
              <Loader loading={employeesLoading} />
              <ModalHeader
                title={edit ? `Edit Employee` : `Create Employee`}
                handleClose={handleClose}
              />
              <Box
                component="form"
                id="employees"
                validate
                autoComplete="off"
                onSubmit={handleSubmit}
                sx={{ "& .MuiTextField-root": { m: 2 } }}
              >
                <Grid container sx={{ pt: 1 }}>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Name"
                        id="name"
                        name="name"
                        size="small"
                        required
                        value={name}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Joining Date"
                        id="joining_date"
                        name="joining_date"
                        size="small"
                        required
                        type="date"
                        value={joining_date}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Role"
                        id="role"
                        name="role"
                        size="small"
                        required
                        value={role}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Date of Birth"
                        id="dob"
                        name="dob"
                        size="small"
                        required
                        type="date"
                        value={dob}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Basic Pay"
                        id="basic_pay"
                        name="basic_pay"
                        size="small"
                        type="number"
                        required
                        value={basic_pay}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="HRA"
                        id="hra"
                        name="hra"
                        type="number"
                        size="small"
                        required
                        value={hra}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="TA"
                        id="ta"
                        name="ta"
                        size="small"
                        type="number"
                        required
                        value={ta}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Target"
                        id="target"
                        name="target"
                        size="small"
                        type="number"
                        required
                        value={target}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Bank"
                        id="bank"
                        name="bank"
                        size="small"
                        required
                        value={bank}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="IFSC"
                        id="ifsc"
                        name="ifsc"
                        size="small"
                        required
                        value={ifsc}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        autoComplete="off"
                        label="Account Number"
                        id="acc_number"
                        name="acc_number"
                        size="small"
                        required
                        value={acc_number}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <ModalFooter handleClose={handleClose} />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default CreateEditEmployees;
