import * as React from "react";
import Box from "@mui/material/Box";
import {
  FormControl,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Button,
  Drawer,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import { get, postJsonData } from "../network/ApiController";
import { whiteColor } from "../theme/setThemeColor";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const AddNews = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState(false);
  const [asmList, setAsmList] = useState([]);

  // Define the Yup validation schema
  const schema = Yup.object().shape({
    news: Yup.string()
      .required("news number is required")
 
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpen = () => {
 setOpen(true)
  };

  const handleClose = () => {
    setOpen(false);
    if (refresh) refresh();
  };

  const onSubmit = (data) => {
    setRequest(true);
    postJsonData(
      ApiEndpoints.GET_NEWS,
      data,
      setRequest,
      (res) => {
        okSuccessToast("news added successfully");
        handleClose();
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
      }
    );
  };



  return (
    <Box sx={{ display: "flex", justifyContent: "end" }}>
      <Tooltip title="Add news">
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
          Add News
        </Button>
      </Tooltip>

      <Box>
        <Drawer open={open} anchor="right" onClose={handleClose}>
          <Box sx={{ width: 400 }}>
            <ModalHeader
              title="Add news"
              handleClose={handleClose}
              subtitle="Easily Add New news with VistarMoney"
            />
            <Box
              component="form"
              id="addAcc"
              validate="true"
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ "& .MuiTextField-root": { m: 1 } }}
            >
              <Grid container sx={{ pt: 1 }}>
              <Grid item md={12} xs={12}>
  <FormControl sx={{ width: "100%" }}>
    <Controller
      name="news" // Make sure to specify the correct name for the field
      control={control}
      defaultValue=""
      render={({ field }) => (
        <TextField
          {...field}
          autoComplete="off"
          label="Enter your news"
          id="news"
          size="small"
          required
          error={!!errors.news}
          helperText={errors.news ? errors.news.message : ""}
          inputProps={{
            maxLength: 100, // Adjust maxLength to your needs
          }}
          onInput={(e) => {
            // Allow only specific characters (e.g., letters, spaces, etc.)
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s.,!?]/g, ""); // Allow letters, numbers, and some punctuation
          }}
        />
      )}
    />
  </FormControl>
</Grid>

                
              </Grid>

              <Box sx={{ mr: "5px" }}>
                <ModalFooter form="addAcc" request={request} />
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default AddNews;
