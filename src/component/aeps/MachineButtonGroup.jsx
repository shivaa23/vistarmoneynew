import React from "react";
import MachineDetectButton from "./MachineDetectButton";
import Mount from "../Mount";
import { Button } from "@mui/material";
import { RDDeviceStatus } from "../../utils/constants";
import useCommonContext from "../../store/CommonContext";

const MachineButtonGroup = ({ onScan, onRdDeviceInfo, ...other }) => {
  const { rdDevice } = useCommonContext();
  return (
    <div
      style={{
        position: "absolute",
        bottom: "8px",
        display: "flex",
        justifyContent: "between",
        alignItems: "center",
      }}
    >
      <Mount visible={rdDevice && rdDevice?.status === RDDeviceStatus.READY}>
        <Button
          size="small"
          onClick={onScan}
          variant="outlined"
          sx={{
            mr: 1,
          }}
          {...other}
        >
          Start Scan
        </Button>
      </Mount>
      <MachineDetectButton onClick={onRdDeviceInfo} />
    </div>
  );
};

export default MachineButtonGroup;
