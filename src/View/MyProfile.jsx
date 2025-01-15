import React, { useContext } from "react";
import {
  Avatar,
  Button,
  Box,
  Grid,
  TextField,
  FormControl,
  Typography,
} from "@mui/material";
import { userAvt } from "../iconsImports";
import ChangePass from "../modals/ChangePass";
import ChangeMpin from "../modals/ChangeMpin";
import AuthContext from "../store/AuthContext";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import ResetMpin from "../modals/ResetMpin";

const MyProfile = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  return (
    <Box
      component="div"
      sx={{
        width: "95%",
        display: "grid",
        justifyContent: "start",
        alignContent: "center",
        marginLeft: "3rem",
      }}
    >
      <Box
        component="div"
        sx={{
          height: "20vh",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src={userAvt}
          sx={{ width: 110, height: 110, border: "solid #d9d9d9" }}
        />
        <div style={{ bottom: "4px" }}>
          <AddAPhotoOutlinedIcon />
        </div>
        <Box
          component="div"
          sx={{
            display: "grid",
            alignItems: "center",
            marginLeft: "28px",
          }}
        >
          <Box
            component="div"
            sx={{
              fontSize: "28px",
              fontWeight: "bolder",
              display: "flex",
              justifyContent: "start",
            }}
          >
            {user.name}
          </Box>
          <Box
            component="div"
            sx={{
              fontSize: "15px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "start",
            }}
          >
            {user.role === "Dd"
              ? "Direct Dealer"
              : user.role === "Ret"
              ? "Retailer"
              : user.role === "Ad"
              ? "Area Distributor"
              : user.role === "Admin"
              ? "Admin"
              : user.role === "Api"
              ? "Api"
              : "Role"}
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <ChangePass />
            <ChangeMpin />
            <ResetMpin />
          </Box>
        </Box>
      </Box>
      
      <Box
        component="div"
        sx={{
          height: "60vh",
          marginTop: "24px",
        }}
      >
        <Box>
          <Box
            component="form"
            id="edit-user"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                pt: 1,
                fontSize: "15px",
                color: "grey",
              }}
            >
              Personal Information
            </Typography>
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Name"
                    id="name"
                    size="small"
                    required
                    defaultValue={user.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Email"
                    id="email"
                    size="small"
                    required
                    defaultValue={user.email}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Mobile"
                    id="username"
                    size="small"
                    required
                    defaultValue={user.username}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Gender"
                    id="gender"
                    size="small"
                    required
                    defaultValue={user.gender}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Address"
                    id="address"
                    size="small"
                    required
                    defaultValue={user.p_address}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="PAN"
                    id="pan"
                    size="small"
                    required
                    defaultValue={user.pan}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mr: 2,
            }}
          >
            <Button variant="contained">Save Personal Info</Button>
          </Box>
        </Box>

        <Box>
          <Box
            component="form"
            id="edit-user"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                pt: 1,
                fontSize: "15px",
                color: "grey",
              }}
            >
              Business Information
            </Typography>
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Business Name"
                    id="bname"
                    size="small"
                    required
                    defaultValue={user.name}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Address"
                    id="address"
                    size="small"
                    required
                    defaultValue={user.address}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="PAN"
                    id="pan"
                    size="small"
                    required
                    defaultValue={user.pan}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="GSTIN"
                    id="gstin"
                    size="small"
                    required
                    defaultValue={user.gstin}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mr: 2,
            }}
          >
            <Button variant="contained">save Business Info</Button>
          </Box>
        </Box>

        <Box>
          <Box
            component="form"
            id="edit-user"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                pt: 1,
                fontSize: "15px",
                color: "grey",
              }}
            >
              Bank Information
            </Typography>
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account holder Name"
                    id="bank_name"
                    size="small"
                    required
                    defaultValue={user.bank}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Bank Name"
                    id="bank_name"
                    size="small"
                    required
                    defaultValue={user.bank}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account number"
                    id="accNo"
                    size="small"
                    required
                    defaultValue={user.acc_number}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="IFSC Code"
                    id="ifsc"
                    size="small"
                    required
                    defaultValue={user.ifsc}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mr: 2,
            }}
          >
            <Button variant="contained">save Bank Info</Button>
          </Box>
        </Box>

        <Box>
          <Box
            component="form"
            id="edit-user"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 2 },
              objectFit: "contain",
              overflowY: "scroll",
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "start",
                pt: 1,
                fontSize: "15px",
                color: "grey",
              }}
            >
              Documents
            </Typography>
            <Grid container sx={{ pt: 1 }}>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account holder Name"
                    id="bank_name"
                    size="small"
                    required
                    defaultValue={user.bank}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Bank Name"
                    id="bank_name"
                    size="small"
                    required
                    defaultValue={user.bank}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="Account number"
                    id="accNo"
                    size="small"
                    required
                    defaultValue={user.acc_number}
                  />
                </FormControl>
              </Grid>
              <Grid item md={4} xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField autoComplete="off"
                    label="IFSC Code"
                    id="ifsc"
                    size="small"
                    required
                    defaultValue={user.ifsc}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mr: 2,
            }}
          >
            <Button variant="contained">save Bank Info</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyProfile;
