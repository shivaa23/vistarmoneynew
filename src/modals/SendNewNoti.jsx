import * as React from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AllUserSearch from "../component/AllUserSearch";
import { postJsonData } from "../network/ApiController";
import ApiEndpoints from "../network/ApiEndPoints";
import { apiErrorToast, okSuccessToast } from "../utils/ToastUtil";
import {  whiteColor } from "../theme/setThemeColor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 2,
  height: "max-content",
  overflowY: "scroll",
};
let userObjCallBack;
const SendNewNoti = ({ refresh }) => {
  const [open, setOpen] = React.useState(false);
  const [request, setRequest] = React.useState(false);
  const [notiType, setNotiType] = React.useState("ALL");
  const [priority, setPriority] = React.useState("MEDIUM");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      message: document.getElementById("message").value,
      priority: priority && priority,
    };
    if (notiType === "ALL") {
      data.type = "ALL";
    } else if (notiType === "SINGLE") {
      data.type = "SINGLE";
      data.user_id = userObjCallBack && userObjCallBack.split(",")[1];
    }
    postJsonData(
      ApiEndpoints.ADMIN_NOTIFICATION,
      data,
      setRequest,
      (data) => {
        okSuccessToast(data.data.message);
        setOpen(false);
        if (refresh) refresh();
      },
      (error) => {
        apiErrorToast(error);
        if (refresh) refresh();
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
       <Tooltip title=" Send Notification">
          <Button
            variant="outlined"
            // className="button-transparent"
            className="refresh-icon-risk"
            onClick={handleOpen}
            startIcon={
              <IconButton
                sx={{
                  p: 0,

                  color: whiteColor(),
                }}
              >
                <AddCircleOutlineIcon />
              </IconButton>
            }
            sx={{ py: 0.3 }}
          >
         Notification
          </Button>
        </Tooltip>
  {/* <MyButton
  text="Send Notification"
  onClick={handleOpen}
  icon={<NotificationAddIcon />}
  
/> */}


      <Box>
        <Drawer
          open={open}
          onClose={handleClose}
   anchor="right"
        >
          <Box sx={{width:400}}>
            <ModalHeader title="Send Notification" handleClose={handleClose} />
            <Box
              component="form"
              id="send_notification"
              validate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": { m: 2 },
              }}
            >
              <Grid container sx={{ pt: 1 }}>
                <FormControl sx={{ ml: 2 }}>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Notify
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    row
                    value={notiType}
                    onClick={(e) => setNotiType(e.target.value)}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio />}
                      label="ALL"
                    />
                    <FormControlLabel
                      value="SINGLE"
                      control={<Radio />}
                      label="INDIVIDUAL"
                    />
                  </RadioGroup>
                </FormControl>
                {notiType === "SINGLE" && (
                  <Grid item md={12} xs={12}>
                    <AllUserSearch
                      userObj={(bank) => {
                        userObjCallBack = bank;
                      }}
                      notiType={notiType}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Priority"
                      id="priority"
                      size="small"
                      select
                      required
                      value={priority}
                      onChange={(e) => {
                        setPriority(e.target.value);
                      }}
                    >
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <TextField autoComplete="off"
                      label="Message"
                      id="message"
                      size="small"
                      required
                      multiline
                      rows={3}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{mr:"10px"}}>
            <ModalFooter
              form="send_notification"
              request={request}
              btn="Send"
            />
          </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};
export default SendNewNoti;
