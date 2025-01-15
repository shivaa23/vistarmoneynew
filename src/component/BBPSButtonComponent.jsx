import { Grid } from "@mui/material";
import { useState } from "react";
import { randomColors } from "../theme/setThemeColor";

export const CircularButton = ({
  img,
  onClick,
  txt = "Button",
  img2 = img,
  isActive = false,
  hidden = false,
  UnderlineRequired = true,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Grid
      item
      xs={4}
      sm={2}
      md={2}
      lg="auto"
      hidden={hidden}
      className="animate-category"
    >
      <div
        className={
          isActive
            ? "text-center parent-circular-button-div  pt-2 pb-2 m-1 cmbox-width"
            : UnderlineRequired
            ? "text-center parent-circular-button-div  pt-2 pb-2 m-1 cmbox-width"
            : "text-center parent-circular-button-div pt-2 pb-2 m-1 cmbox-width"
        }
        onClick={onClick}
        onMouseOver={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {img ? (
            <span
              className={
                isHover || isActive
                  ? "category-icon-bg-hover"
                  : "category-icon-bg"
              }
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={isHover || isActive ? img2 : img}
                width={txt === "DTH" ? "32" : "24"}
                height={txt === "DTH" ? "32" : "24"}
                alt="img"
              />
            </span>
          ) : (
            <span
              className={
                isHover || isActive
                  ? "category-icon-bg-hover"
                  : "category-icon-bg"
              }
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // background: randomColors(txt && txt.charAt(0).toUpperCase()),
              }}
            >
              <div width="24" height="24">
                {txt && txt.charAt(0).toUpperCase()}
              </div>
            </span>
          )}
          <span
            className={
              isHover || isActive
                ? "mt-2 ps-2 pe-2 cm-text-active service-font"
                : "mt-2 ps-2 pe-2 service-font"
            }
            style={{ fontSize: "12px" }}
          >
            {txt}
          </span>
        </div>
      </div>
    </Grid>
  );
};
