import { Typography } from "@mui/material";
import React from "react";

const DetailsComponent = ({
  detail = "",
  objData = false,
  horizontal = false,
  fontSize = "13px",
}) => {
  return (
    <>
      {/* this typo can handle string and array datsa */}
      {!objData && (
        <Typography
          sx={{
            textAlign: "left",
            fontSize: fontSize,
            // color:"green",
            fontWeight: "600",
            opacity: "0.86",
          }}
        >
          {typeof detail === "string"
            ? detail
            : detail?.length > 0
            ? detail.map(
                (item, index) =>
                  `${item} ${index === detail?.length - 1 ? "" : ","} `
              )
            : ""}
        </Typography>
      )}
      {/* this typo is to handle object data  vertical data rep not used for now*/}
      {objData &&
        !horizontal &&
        Object.keys(detail).map((item) => {
          return (
            <>
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: "0.86",
                  mb: 0.5,
                }}
              >
                <span style={{ marginRight: "5px" }}>{item}:</span> {"  "}
                <span>{detail[item]}</span>
              </Typography>
            </>
          );
        })}
      {/* horizontal data rep */}
      {objData && horizontal && (
        <>
          <Typography
            sx={{
              textAlign: "left",
              fontSize: "13px",
              fontWeight: "600",
              opacity: "0.86",
              mb: 0.5,
            }}
          >
            {Object.keys(detail).map((item) => {
              return (
                <>
                  <span style={{ marginRight: "8px" }}>{item}:</span>
                  <span style={{ marginRight: "8px" }}>{detail[item]}</span>
                </>
              );
            })}
          </Typography>
        </>
      )}
    </>
  );
};

export default DetailsComponent;
