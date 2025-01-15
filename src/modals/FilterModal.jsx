import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import FilterCard from "./FilterCard";
import TuneIcon from "@mui/icons-material/Tune";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  boxShadow: 24,
  fontFamily: "Poppins",
  p: 3,
};
let refreshFilter;
const FilterModal = ({
  ifTypeFilter,
  ifdateFilter,
  ifrouteFilter,
  ifoperatorFilter,
  ifstatusFilter,
  iforderidFilter,
  ifestFilter,
  ifUsernameFilter,
  ifInstIdFilter,
  ifnumberFilter,
  ifotherFilter,
  typeList = [],
  statusList = [],
  getTypes,
  operatorList,
  getOperatorVal,
  setQuery,
  ifPartnerPinNoFilter,
  query,
  clearHookCb,
  refresh,
  ifBeneKycStatus,
  ifRoleFilter,
  ifAsmFilter,
  roleList,
  asmList,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  if (clearHookCb) clearHookCb(refreshFilter);
  return (
    <div className="table-container">
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <IconButton onClick={handleOpen} className="otp-hover-purple">
          <Tooltip title="Apply Filter">
            <TuneIcon />
          </Tooltip>
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="sm_modal table-container">
            <ModalHeader title="Filters" handleClose={handleClose} />
            <FilterCard
              ifBeneKycStatus={ifBeneKycStatus}
              ifTypeFilter={ifTypeFilter}
              ifdateFilter={ifdateFilter}
              ifrouteFilter={ifrouteFilter}
              ifoperatorFilter={ifoperatorFilter}
              ifstatusFilter={ifstatusFilter}
              iforderidFilter={iforderidFilter}
              ifestFilter={ifestFilter}
              ifUsernameFilter={ifUsernameFilter}
              ifInstIdFilter={ifInstIdFilter}
              ifnumberFilter={ifnumberFilter}
              ifotherFilter={ifotherFilter}
              typeList={typeList}
              statusList={statusList}
              getTypes={getTypes}
              operatorList={operatorList}
              getOperatorVal={getOperatorVal}
              ifRoleFilter={ifRoleFilter}
              ifAsmFilter={ifAsmFilter}
              roleList={roleList}
              asmList={asmList}
              setQuery={setQuery}
              query={query}
              clearHookCb={(cb) => {
                refreshFilter = cb;
              }}
              refresh={refresh}
              handleClose={handleClose}
            />
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default FilterModal;
