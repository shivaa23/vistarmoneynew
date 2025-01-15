import React from "react";
import { Box, Divider } from "@mui/material";
import MyButton from "../component/MyButton";
import LogoComponent from "../component/LogoComponent";
import { indoNepal } from "../iconsImports";
import Loader from "../component/loading-screen/Loader";
import Mount from "../component/Mount";

const ModalFooter = ({
  form,
  btn,
  typeWallet,
  twobuttons = false,
  request = false,
  disable = false,
  disableButtontwo = false,
  handleClose,
  type = "submit",
  onClick,
  onClick2,
  icon = false,
  nepalFooter = false,
  loadingInButton = true,
  red1 = false,
  red2 = false,
}) => {
  return (
    <>
      <Divider sx={{ color: "#000", mt: 3, mb: 2 }} />
      <div
        style={{
          width: "100%",
          // mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            borderRadius: "12px",
            paddingLeft: 12,
            paddingRight: 12,
            display: "flex",
            alignItems: "center",
          }}
        >{!typeWallet?
          <LogoComponent width="100px" />:""
        }
        </div>

        {!nepalFooter && (
          <Box sx={{ position: "relative" }}>
            {!handleClose && (
              <div className="d-flex justify-content-between">
                <Mount visible={loadingInButton}>
                <Loader changeloder=" "  loading={request} size="small" />
                </Mount>
                <MyButton
                  text={btn ? btn : "Save"}
                  disabled={request || disable}
                  type={type}
                  form={form ? form : ""}
                  red={red1}
                  onClick={onClick}
                  icon={icon}
                
                />
                {twobuttons && (
                  <Box sx={{ ml: 4 }}>
                    <MyButton
                      text={twobuttons ? twobuttons : "Save"}
                      disabled={request || disableButtontwo}
                      type={type}
                      form={form ? form : ""}
                      red={red2}
                      onClick={onClick2}
                      icon={icon}
                    />
                  </Box>
                )}
              </div>
            )}
            {/* <Loader loading={request} size="small" /> */}
            {handleClose && (
              <MyButton text={btn ? btn : "Cancel"} onClick={handleClose} />
            )}
          </Box>
        )}
        {nepalFooter && (
          <Box sx={{ position: "relative" }}>
            <img src={indoNepal} alt="imgof nepal" style={{ width: "100px" }} />
          </Box>
        )}
      </div>
    </>
  );
};

export default ModalFooter;
