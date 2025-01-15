import { Button, Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { certificateIcon } from "../iconsImports";
import AuthContext from "../store/AuthContext";

const AuthorizationLetters = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx && authCtx.user;
  return (
    <>
      {(user?.role === "Ret" || user.role === "Dd") && (
        <Grid
          item
          className="position-relative"
          sx={{
            p: 3,
            mb: { md: 0, xs: 5 },
            display: "flex",
            justifyContent: "center",
            height: "max-content",
          }}
        >
          {/* <Grid
            md={8}
            xs={12}
            sx={{
              boxShadow:
                "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
              textAlign: "left",
              px: 2,
              pt: 2,
              pb: 1,
              borderRadius: "8px",
            }}
          >
            <img src={certificateIcon} alt="certificate" />
            <Typography
              sx={{
                fontSize: "20px",
                my: 1,
                color: "#000",
                fontWeight: "500",
              }}
            >
              BC Authorisation Letter
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#000" }}>
              BC Authorisation and Section 194N TDS exemption on cash withdrawal
              transaction
            </Typography>
            <div className="grey-divider-horizontal"></div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{
                  textTransform: "none",
                  color: "#4045A1",
                }}
                onClick={() => window.open("/bc-certificate", "_blank")}
              >
                Download
              </Button>
            </div>
          </Grid> */}
        </Grid>
      )}
      {/*  */}
      <Grid
        item
        className="position-relative"
        sx={{
          p: 3,
          mt: 2,
          mb: { md: 0, xs: 5 },
          display: "flex",
          justifyContent: "center",
          height: "max-content",
        }}
      >
        <Grid
          md={8}
          xs={12}
          sx={{
            boxShadow:
              "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
            textAlign: "left",
            px: 2,
            pt: 2,
            pb: 1,
            borderRadius: "8px",
          }}
        >
          <img src={certificateIcon} alt="certificate" />
          <Typography
            sx={{
              fontSize: "20px",
              my: 1,
              color: "#000",
              fontWeight: "500",
            }}
          >
            Retailer Certificate
          </Typography>

          <div className="grey-divider-horizontal"></div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{
                textTransform: "none",
                color: "#4045A1",
              }}
              onClick={() => window.open("/retailer-certificate", "_blank")}
            >
              Download
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthorizationLetters;
