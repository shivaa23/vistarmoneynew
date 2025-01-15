import React from "react";
import "./MyRadioButton.scss";
import { fingerSvg } from "../../iconsImports";
import { FormControlLabel, Radio } from "@mui/material";
import Mount from "../Mount";
import { Icon } from "@iconify/react";

const MyRadioButton = ({
  label = "AePS1",
  img = fingerSvg,
  name = "radio",
  value = "",
  defaultChecked = false,
  checked = false,
}) => {
  return (
    <>
      <label className="custom_radiobtn">
        {/* <input type="radio" className="custom-radio" name="radio" checked /> */}

        <FormControlLabel
          className="custom-radio"
          value={value}
          defaultChecked={defaultChecked}
          checked={checked}
          control={<Radio />}
        />
        <span
          className={`radio-button ${checked ? "radio-button-checked" : ""}`}
        >
          <Mount visible={checked}>
            <i className="bi bi-check"></i>
          </Mount>
          <div className="radio-img">
            <Icon
              className={checked ? "text-white" : ""}
              icon="fluent:fingerprint-24-filled"
            />
            <p className={`text-uppercase ${checked ? "text-white" : ""}`}>
              {label}
            </p>
          </div>
        </span>
      </label>
    </>
  );
};

export default MyRadioButton;
