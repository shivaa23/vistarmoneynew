import React from "react";
import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import UploadIcon from "@mui/icons-material/Upload";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  aadharNumber: Yup.string()
    .required("Aadhaar number is required")
    .matches(/^[0-9]{12}$/, "Aadhaar number must be 12 digits"),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  panNumber: Yup.string()
    .required("PAN number is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN number must be valid"),
  gstNumber: Yup.string()
    .required("GST number is required")
    .matches(/^[0-9]{15}$/, "GST number must be 15 digits"),
  address: Yup.string().required("Address is required"),
  shopPic: Yup.mixed().required("Shop picture is required"),
  aadharPic: Yup.mixed().required("Aadhaar picture is required"),
  panPic: Yup.mixed().required("PAN picture is required"),
  gstPic: Yup.mixed().required("GST picture is required"),
});

const Documents = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Upload Documents
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="aadharNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField autoComplete="off"
                  {...field}
                  label="Aadhaar Number"
                  fullWidth
                  error={!!errors.aadharNumber}
                  helperText={errors.aadharNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="mobileNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField autoComplete="off"
                  {...field}
                  label="Mobile Number"
                  fullWidth
                  error={!!errors.mobileNumber}
                  helperText={errors.mobileNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="panNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField autoComplete="off"
                  {...field}
                  label="PAN Card Number"
                  fullWidth
                  error={!!errors.panNumber}
                  helperText={errors.panNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="gstNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField autoComplete="off"
                  {...field}
                  label="GST Number"
                  fullWidth
                  error={!!errors.gstNumber}
                  helperText={errors.gstNumber?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField autoComplete="off"
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* File Upload Inputs */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Aadhaar Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
            {errors.aadharPic && (
              <Typography color="error">{errors.aadharPic?.message}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload PAN Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
            {errors.panPic && (
              <Typography color="error">{errors.panPic?.message}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload GST Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
            {errors.gstPic && (
              <Typography color="error">{errors.gstPic?.message}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Shop Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
            {errors.shopPic && (
              <Typography color="error">{errors.shopPic?.message}</Typography>
            )}
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default Documents;
