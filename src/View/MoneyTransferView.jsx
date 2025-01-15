import React, { useState } from "react";
import CustomTabs from "../component/CustomTabs";
import UPITransferView from "./UPITransferView";
import NepalTransfer from "./NepalTransfer";
import VendorPayments from "./VendorPayments";
import { mt_tab_value } from "../utils/constants";
import DmtContainer from "./DMTcontainer";

export default function MoneyTransferView() {
  const [value, setValue] = useState(0);
  const [currentType, setCurrentType] = useState("dmt1");
  const tabs = [
    { label: "DMT 1", content: <DmtContainer type={currentType} /> },
    { label: "DMT 2", content: <DmtContainer type={currentType} /> },
    { label: "VPAY", content: <VendorPayments type={currentType} /> },
    { label: "Super", content: <VendorPayments type={currentType} /> },
    { label: "Nepal", content: <NepalTransfer type={currentType} /> },
    { label: "Upi", content: <UPITransferView type={currentType} /> },
  ];
  const handleChange = (event, newValue) => {
    console.log("newval", newValue);
    setValue(newValue);
    setCurrentType(mt_tab_value[newValue]);
  };
  console.log("type", currentType);
  return <CustomTabs tabs={tabs} value={value} onChange={handleChange} />;
}
