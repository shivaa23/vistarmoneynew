import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const FileModal = ({ open, onClose, fileBlob, fileName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{fileName}</DialogTitle>
      <DialogContent>
        <img src={URL.createObjectURL(fileBlob)} alt={fileName} style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }} />
        {/* If it's not an image, you can display a PDF or other file types similarly */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default FileModal;
