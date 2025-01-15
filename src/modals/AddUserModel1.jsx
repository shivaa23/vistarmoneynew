import React, { useState } from "react";
import {
  Box,
  Modal,
  Tooltip,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Validation schema
const schema = yup.object().shape({
  role: yup.string().required("Role is required"),
  name: yup.string().required("Name is required"),
  mobileNumber: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  pan: yup
    .string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN format")
    .required("PAN is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup.string().required("Date of birth is required"),
  parent: yup.string().required("Parent is required"),
  areaOfWorking: yup.string().when("role", {
    is: "Asm",
    then: yup.string().required("Area of working is required"),
  }),
  establishment: yup.string().when("role", {
    is: (role) => ["Md", "Api", "Retailer"].includes(role),
    then: yup.string().required("Establishment is required"),
  }),
  businessAddress: yup.string().when("role", {
    is: (role) => ["Md", "Api", "Retailer"].includes(role),
    then: yup.string().required("Business address is required"),
  }),
  gst: yup.string().when("role", {
    is: (role) => ["Md", "Api", "Retailer"].includes(role),
    then: yup
      .string()
      .matches(/^\d{15}$/, "GST must be 15 characters")
      .required("GST is required"),
  }),
  typeOfEntity: yup.string().when("role", {
    is: (role) => ["Md", "Api", "Retailer"].includes(role),
    then: yup.string().required("Type of entity is required"),
  }),
  scheme: yup.string().when("role", {
    is: "Retailer",
    then: yup.string().required("Scheme is required"),
  }),
  accountantOperation: yup.string().when("role", {
    is: "Direct Dealer",
    then: yup.string().required("Accountant or Operation is required"),
  }),
});

// Modal styling
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AddUserModel = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const roles = [
    "Admin",
    "Zsm",
    "Asm",
    "Md",
    "Api",
    "Ad",
    "Retailer",
    "Direct Dealer",
    "Accountant",
    "Operation",
  ];

  const parentRoles = roles.filter(
    (r) => !["Admin", "Zsm", "Accountant", "Operation"].includes(r)
  );

  const commonFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "mobileNumber", label: "Mobile Number", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "address", label: "Address", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "district", label: "District", type: "text" },
    { name: "pan", label: "PAN", type: "text" },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { name: "dob", label: "Date of Birth", type: "date" },
  ];

  const roleSpecificFields = {
    Asm: [{ name: "areaOfWorking", label: "Area of Working", type: "text" }],
    Md: [
      { name: "areaOfWorking", label: "Area of Working", type: "text" },
      { name: "establishment", label: "Establishment", type: "text" },
      { name: "businessAddress", label: "Business Address", type: "text" },
      { name: "gst", label: "GST", type: "text" },
      { name: "typeOfEntity", label: "Type of Entity", type: "text" },
    ],
    Api: [
      { name: "establishment", label: "Establishment", type: "text" },
      { name: "businessAddress", label: "Business Address", type: "text" },
      { name: "gst", label: "GST", type: "text" },
      { name: "typeOfEntity", label: "Type of Entity", type: "text" },
    ],
    Retailer: [
      { name: "establishment", label: "Establishment", type: "text" },
      { name: "businessAddress", label: "Business Address", type: "text" },
      { name: "gst", label: "GST", type: "text" },
      { name: "typeOfEntity", label: "Type of Entity", type: "text" },
      { name: "scheme", label: "Scheme", type: "select", options: ["Scheme A", "Scheme B"] },
    ],
    DirectDealer: [
      { name: "establishment", label: "Establishment", type: "text" },
      { name: "businessAddress", label: "Business Address", type: "text" },
      { name: "gst", label: "GST", type: "text" },
      { name: "typeOfEntity", label: "Type of Entity", type: "text" },
      {
        name: "accountantOperation",
        label: "Accountant or Operation",
        type: "select",
        options: ["Accountant", "Operation"],
      },
    ],
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const renderField = (field) => (
    <Grid item xs={12} md={6} key={field.name}>
      <Controller
        name={field.name}
        control={control}
        defaultValue=""
        render={({ field: controllerField }) =>
          field.type === "select" ? (
            <FormControl fullWidth error={!!errors[field.name]}>
              <InputLabel>{field.label}</InputLabel>
              <Select {...controllerField}>
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              {...controllerField}
              type={field.type}
              label={field.label}
              fullWidth
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message}
            />
          )
        }
      />
    </Grid>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Tooltip title="Add User">
        <Button
          variant="outlined"
          onClick={handleOpen}
          startIcon={
            <IconButton sx={{ p: 0 }}>
              <AddCircleOutlineIcon />
            </IconButton>
          }
        >
          Add User
        </Button>
      </Tooltip>

      <Modal open={open} onClose={handleClose} aria-labelledby="Add User">
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Select Role</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={role}
                        onChange={(e) => {
                          field.onChange(e);
                          setRole(e.target.value);
                        }}
                      >
                        {roles.map((roleOption) => (
                          <MenuItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.parent}>
                  <InputLabel>Select Parent</InputLabel>
                  <Controller
                    name="parent"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field}>
                        {parentRoles.map((roleOption) => (
                          <MenuItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {commonFields.map((field) => renderField(field))}

              {roleSpecificFields[role]?.map((field) => renderField(field))}

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddUserModel;
