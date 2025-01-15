import { Tab, Box,Button} from "@mui/material";
import React, { useContext, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import MobileRechargeForm from "../component/MobileRechargeForm";
import ElectricityForm from "../component/ElectricityForm";
import CreditcardForm from "../component/CreditcardForm";
import { CircularButton } from "../component/BBPSButtonComponent";
import { getRecAndBillImg, getRecAndBillInvertImg } from "../utils/BbpsIcons";
import { styled } from "@mui/material/styles";
import AuthContext from "../store/AuthContext";
import OutletRegistration from "../component/OutletRegistration";
import recharge_white_svg from "../assets/svg/recharge_white.svg";
import { icon } from "@fortawesome/fontawesome-svg-core";
import SatelliteIcon from '@mui/icons-material/Satellite'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import RouterIcon from '@mui/icons-material/Router';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CustomTabs from "../component/CustomTabs";
const StyledTabs = styled((props) => (
  <TabList
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#0077b6",
  },
});




const RechargeAndBillPay = () => {
  const [value, setValue] = React.useState(0);
  const authCtx = useContext(AuthContext);
  const [operatorIcon, setOperatorIcon] = useState("");
  const [fromImage,setFormImage]=useState("")
  const user = authCtx.user;

  const tabs = [
    { label: 'Mobile',content: <MobileRechargeForm view="mobile" setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon} /> ,icon:<PhoneAndroidIcon/>},
    { label: 'DTH',content:<MobileRechargeForm view="dth"  setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon}/>,icon:<SatelliteIcon /> },
    { label: 'Electricity',content: <ElectricityForm title="Electricity Bill Payment" subType="ELECTRICITY" setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon}/>,icon:< ElectricBoltIcon />},
    { label: 'Credit Card',content: <CreditcardForm setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon} /> ,icon:<CreditCardIcon/> },
    { label: 'BroadBand' ,content:  <ElectricityForm title="Broadband Bill Payment" subType="BROADBAND" setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon}/>,icon:<RouterIcon/>},
    { label: 'Gas' ,content:  <ElectricityForm title="Gas Bill Payment" subType="GAS" setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon} />,icon:< PropaneTankIcon/> },
    { label: 'Water',content:  <ElectricityForm title="Water Bill Payment" subType="WATER" setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon} />,icon:<InvertColorsIcon/> },
    { label: 'Insurance',content:  <ElectricityForm title="Insurance" subType="INSURANCE"  setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon}/>,icon:<MonitorHeartIcon />},
    { label: 'Landline',content:  <ElectricityForm title="Landline Bill Payment" subType="LANDLINE"  setOperatorIcon={setOperatorIcon} operatorIcon={operatorIcon}/>,icon:<LocalPhoneIcon /> },
  ];
  
 
const handleChange = (event, newValue) => {
  setValue(newValue);
};

const OuterIcon = styled(Box)(({ theme, bg = '#08509E' }) => ({
  top: '-12px',
  zIndex: 1,
  right: '-12px',
  width: '100px',
  height: '100px',
  display: 'flex',
  borderRadius: '50%',
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  background: bg,
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px inset',
}));

const InnerIcon = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: '48px',
  height: '48px',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  background: theme.palette.common.white,
}));
console.log("image",operatorIcon);
  return (
   <>
  
    <CustomTabs
    tabs={tabs}
    value={value}
    onChange={handleChange}
  />
</>

      );
};

export default RechargeAndBillPay;
