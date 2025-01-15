/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import { Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { getStatusColor } from "../../theme/setThemeColor";
import LogoComponent from "../LogoComponent";
import { currencySetter } from "../../utils/Currencyutil";
import { capitalize1 } from "../../utils/TextUtil";
import RaiseIssueModal from "../../modals/RaiseIssueModal";
import Timeline from "./Timeline";
import Mount from "../Mount";
import { useContext, createRef, useEffect } from "react";
import AuthContext from "../../store/AuthContext";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { Icon } from "@iconify/react";
import { datemonthYear } from "../../utils/DateUtils";
import Loader from "../loading-screen/Loader";
import { Crisp } from "crisp-sdk-web";
import CommonSnackBar from "../CommonSnackBar";

export default function RightSidePannel({ row }) {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const role = user?.role.toLowerCase();
  // screenshot
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0,
  });

  const download = (
    image,
    { name = "Transaction Details", extension = "png" } = {}
  ) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const LabelComponent = ({ label }) => (
    <span style={{ textAlign: "left", fontSize: "13px", minWidth: "100px" }}>
      {label}
    </span>
  );

  const DetailsComponent = ({ details }) => (
    <CommonSnackBar>
      <span
        style={{ textAlign: "right", fontSize: "13px" }}
        className="fw-bold"
      >
        {details}
      </span>
    </CommonSnackBar>
  );

  const ref = createRef(null);
  const downloadScreenshot = () => {
    takeScreenshot(ref.current).then(download);
  };

  // useEffect(() => {
  //   if ((user && role === "ret") || (user && role === "dd")) {
  //     Crisp.configure(process.env.REACT_APP_CRISP_WEB_KEY, { autoload: false });
  //     Crisp.chat.hide();
  //   } else {
  //     Crisp.configure(process.env.REACT_APP_CRISP_WEB_KEY, { autoload: false });
  //     Crisp.chat.show();
  //   }
  // }, [user, role]);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const openView = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Tooltip title="View">
        <IconButton sx={{ color: "#5234ea" }} onClick={openView}>
          <Icon
            icon="material-symbols:pageview-outline"
            width={26}
            height={26}
          />
        </IconButton>
      </Tooltip>

      <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
        <Box
          className="drawer-bg"
          sx={{
            height: "100vh",
            overflowY: "scroll",
            position: "relative",
            width: { md: 450, sm: "auto", xs: "auto" },
          }}
          ref={ref}
        >
          {row ? (
            <>
              <Box
                sx={{
                  background: `${getStatusColor(row?.status)}40`,
                  px: 2,
                }}
              >
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <IconButton className="simple-hover" onClick={closeDrawer}>
                    <CloseIcon />
                  </IconButton>
                  <LogoComponent width="100px" />
                </Stack>

                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "40px",
                        fontWeight: "600",
                        color: "#001d3d",
                      }}
                    >
                      {currencySetter(row.amount).split(".")[0]}
                    </span>
                    .
                    <span style={{ opacity: "0.7", fontSize: "16px" }}>
                      {currencySetter(row.amount).split(".")[1]}
                    </span>
                  </div>

                  <h4
                    style={{
                      letterSpacing: "1px",
                      color: getStatusColor(row?.status),
                    }}
                  >
                    {capitalize1(row?.status)}
                  </h4>
                </Stack>

                <Grid
                  sx={{
                    textAlign: "right",
                    fontSize: "13px",
                    color: "#566573",
                  }}
                >
                  {datemonthYear(row.created_at)} ,{" "}
                  {datemonthYear(row.updated_at)}
                </Grid>
              </Box>

              <Box sx={{ pt: 0.5, px: 3 }}>
                <Timeline data={row} />
                <div className="separator--primary">
                  <Grid container sx={{ mb: 1,}}>
                    {/* <Box sx={{display: "flex", flexDirection: "row"}}> */}
                    <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Raise Complaint">
                        <RaiseIssueModal row={row}/>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton onClick={downloadScreenshot}>
                          <Icon
                            icon="lucide:download"
                            style={{ fontSize: "20px", color: "#1877F2" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    {/* <Grid
                      item
                      md={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Raise Complaint">
                        <RaiseIssueModal row={row}/>
                      </Tooltip>
                    </Grid> */}
                    {/* </Box> */}
                    <Typography sx={{ fontSize: "16px", display: "flex" }}>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Transaction
                      </Typography>
                      <Typography sx={{ ml: 0.5 }}>details</Typography>
                    </Typography>

                    <Grid item md={12} xs={12} className="details-section">
                      <div>
                        <LabelComponent label="Operator" />
                        <DetailsComponent details={row?.operator} />
                      </div>
                      <div>
                        <LabelComponent label="Operator Id" />
                        <DetailsComponent details={row?.op_id} />
                      </div>
                      <div>
                        <LabelComponent label="Order ID" />
                        <DetailsComponent details={row?.order_id} />
                      </div>
                      <Mount visible={row?.mop}>
                        <div>
                          <LabelComponent label="MOP" />
                          <DetailsComponent details={row?.mop} />
                        </div>
                      </Mount>
                      <Mount visible={row?.number}>
                        <div>
                          <LabelComponent label="Customer number" />
                          <DetailsComponent details={row?.number} />
                        </div>
                      </Mount>
                      <div>
                        <LabelComponent label="Charge" />
                        <DetailsComponent details={row?.ret_charge} />
                      </div>
                      <div>
                        <LabelComponent label="GST" />
                        <DetailsComponent details={row?.gst} />
                      </div>
                      <Mount visible={row?.mop}>
                        <div>
                          <LabelComponent label="Commission" />
                          <DetailsComponent details={row?.ad_comm} />
                        </div>
                      </Mount>
                      <Mount visible={row?.number}>
                        <div>
                          <LabelComponent label="TDS" />
                          <DetailsComponent details={row?.ret_tds} />
                        </div>
                      </Mount>
                    </Grid>
                  </Grid>

                  <Mount visible={role === "asm"}>
                    <Grid container>
                      <div className="grey-divider-horizontal"></div>
                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{
                          display: { md: "flex" },
                          justifyContent: { md: "space-between" },
                          alignItems: "flex-end",
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "12px",
                            width: "90%",
                            paddingRight: { md: "5px" },
                          }}
                          className="details-section"
                        >
                          <Typography className="fw-bold">RET</Typography>
                          <div>
                            <LabelComponent label="Comm" />
                            <DetailsComponent
                              details={currencySetter(row?.ret_comm)}
                            />
                          </div>
                          <div>
                            <LabelComponent label="TDS" />
                            <DetailsComponent
                              details={currencySetter(row?.ret_tds)}
                            />
                          </div>
                          <div>
                            <LabelComponent label="Charge" />
                            <DetailsComponent
                              details={currencySetter(row?.ret_charge)}
                            />
                          </div>
                        </Box>
                        <div className="divider-inright-nav"></div>
                      </Grid>

                      <Grid
                        item
                        md={6}
                        xs={12}
                        sm={12}
                        sx={{
                          display: { md: "flex" },
                          justifyContent: { md: "flex-end" },
                          mt: { md: 0, xs: 1 },
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: "12px",
                            width: "90%",
                            paddingRight: { md: "5px" },
                          }}
                          className="details-section"
                        >
                          <Typography className="fw-bold">AD</Typography>
                          <div>
                            <LabelComponent label="Comm" />
                            <DetailsComponent
                              details={currencySetter(row?.ad_comm)}
                            />
                          </div>
                          <div>
                            <LabelComponent label="TDS" />
                            <DetailsComponent
                              details={currencySetter(row?.ad_tds)}
                            />
                          </div>
                          <div>
                            <LabelComponent label="Charge" />
                            <DetailsComponent
                              details={currencySetter(row?.ad_charge)}
                            />
                          </div>
                        </Box>
                        <div className="divider-inright-nav"></div>
                      </Grid>
                    </Grid>
                  </Mount>
                </div>
              </Box>
            </>
          ) : (
            <Loader />
          )}
        </Box>
      </Drawer>
    </>
  );
}
