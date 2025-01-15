import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { getStatusColor } from "../../theme/setThemeColor";
import { Icon } from "@iconify/react";
import Mount from "../Mount";
import { datemonthYear } from "../../utils/DateUtils";

export default function Timeline({ data }) {
  const [steps, setSteps] = useState([]);
  const [steps1, setSteps1] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeStep, setActiveStep] = useState(0);
  const [isShow, setIsShow] = useState(false);

  const getDesc = ({ status = "", operator }) => {
    const st = status?.toLowerCase();
    const statusMap = {
      success: `${operator} is processed successfully`,
      failed: `${operator} is failed; if the money has been debited, contact admin`,
      pending: `${operator} is under process and will reflect back shortly.`,
      refund: `${operator}`,
    };
    return statusMap[st] || "ep:platform";
  };
  useEffect(() => {
    if (data) {
      setSteps([
        {
          label: (
            <span style={{ color: getStatusColor(data?.status) }}>
              {data?.status}
            </span>
          ),
          description: getDesc({
            status: data?.status,
            operator: data?.operator,
          }),
          description2: `${datemonthYear(data?.updated_at)}`,
        },
      ]);
      setSteps1([
        {
          label: "Created",
          description: `Created by:`,
          description2: `${datemonthYear(data?.created_at)}`,
        },
        {
          label: "Under Process",
        },
        {
          label: (
            <span style={{ color: getStatusColor(data?.status) }}>
              {data?.status}
            </span>
          ),
          description: getDesc({
            status: data?.status,
            operator: data?.operator,
          }),
          description2: `${datemonthYear(data?.updated_at)}`,
        },
      ]);
    }

    return () => {};
  }, [data]);

  const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: getStatusColor(data?.status),
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: getStatusColor(data?.status),
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: getStatusColor(data?.status),
      borderTopWidth: 3,
      borderRadius: 1,
      marginTop: "-40px",
      height: "88px",
      marginLeft: "-8.2px",
      position: "absolute",
      //   left: "calc(-50% + 16px)",
      //   right: "calc(50% + 16px)",
    },
  }));
  const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    position: "relative",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: getStatusColor(data?.status),
    },
  }));
  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <div className="QontoStepIcon-circle" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Mount visible={!isShow}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<QontoConnector />}
        >
          {steps?.length > 0 &&
            steps.map((step, index) => {
              return (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    optional={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Mount visible={step?.description}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontStyle: "italic",
                              width: "60%",
                            }}
                          >
                            {step?.description}
                          </Typography>
                        </Mount>
                        <Mount visible={step?.description2}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontStyle: "italic",
                            }}
                          >
                            {step.description2}
                          </Typography>
                        </Mount>
                      </Box>
                    }
                  >
                    {/* <span dangerouslySetInnerHTML={{ __html: step.label }} /> */}
                    {step.label}
                  </StepLabel>
                </Step>
              );
            })}
        </Stepper>
        <Paper square elevation={0}>
          <Button
            sx={{
              p: 0,
              px: 1,
              fontSize: "12px",
              textTransform: "capitalize",
            }}
            endIcon={
              <Icon
                icon="guidance:down-arrow"
                style={{
                  width: 15,
                }}
              />
            }
            onClick={() => setIsShow(!isShow)}
          >
            Show Timeline
          </Button>
        </Paper>
      </Mount>
      <Mount visible={isShow}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<QontoConnector />}
        >
          {steps1?.length > 0 &&
            steps1.map((step, index) => {
              return (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    optional={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Mount visible={step?.description}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontStyle: "italic",
                              width: "60%",
                            }}
                          >
                            {step?.description}
                          </Typography>
                        </Mount>
                        <Mount visible={step?.description2}>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontStyle: "italic",
                            }}
                          >
                            {step.description2}
                          </Typography>
                        </Mount>
                      </Box>
                    }
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              );
            })}
        </Stepper>
        <Paper square elevation={0}>
          <Button
            sx={{
              p: 0,
              px: 1,
              fontSize: "14px",
              textTransform: "capitalize",
            }}
            endIcon={<Icon icon="guidance:up-arrow" />}
            onClick={() => setIsShow(!isShow)}
          >
            Hide Timeline
          </Button>
        </Paper>
      </Mount>
    </Box>
  );
}
