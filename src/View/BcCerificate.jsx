import React from "react";
import { PDFViewer, StyleSheet } from "@react-pdf/renderer";
import BcPdf from "../component/BcPdf";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
});

const BcCerificate = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  return (
    <PDFViewer style={styles.viewer}>
      <BcPdf user={user} />
    </PDFViewer>
  );
};

export default BcCerificate;
