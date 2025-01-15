import { Grid, Typography } from "@mui/material";
import React from "react";

const CustomCard = ({
  icon,
  title = "card title",
  description = "description",
  descriptionSup,
  iconSup,
  xs = 12,
  sm = 3,
  md = 4,
  lg = 4,
  width = "100%",
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <div
        className="card-css"
        style={{
          // background: "#ffff",
          // boxShadow: "0 1px 25px rgba(0, 0, 0, 0.2)",
          padding: "10px 14px",
          width: { width },
          // height: "90px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        {/* <div class="freeShippingRibbon">Free Shipping</div> */}
        <div
          className="card_load"
          style={
            {
              // padding: 10,
            }
          }
        >
          {icon}
          {iconSup && (
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                // right: "-30px",
              }}
            >
              {iconSup}
            </div>
          )}
        </div>
        <div
          className="d-flex flex-column align-items-start card_load_extreme_title"
          style={{
            padding: "10px",
            width: "75%",
            paddingLeft: "14px",
            paddingRight: "14px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              // className="card_load_extreme_title"
              sx={{
                textAlign: "left",
                fontSize: "14px",
                // px: 1,
                py: 1.3,
                color: "#000",
                fontWeight: "500",
              }}
            >
              {title}
            </Typography>
          </div>
          <div
            style={{ position: "absolute", top: "2px", right: "7px" }}
            // className="mt-1"
            //   className="card_load_extreme_descripion"
          >
            {description}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              right: "4px",
            }}
          >
            {descriptionSup}
          </div>
        </div>
      </div>
    </Grid>
  );
};

export default CustomCard;
